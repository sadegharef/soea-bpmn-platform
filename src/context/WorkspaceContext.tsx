/**
 * @file WorkspaceContext.tsx
 * @description مدیریت متمرکز و یکپارچه داده‌ها، تیم‌ها، کاربران، پوشه‌ها و فرآیندها در سطح فضای کاری
 * @architecture
 * - Single Responsibility Principle (SRP): مدیریت داده‌های دامنه و همگام‌سازی با حافظه محلی
 * - Open/Closed Principle (OCP): امکان توسعه عملیات مدیریت فرآیندها بدون نیاز به تغییر در کامپوننت‌های UI
 * - Dependency Inversion Principle (DIP): کامپوننت‌های فرزند از طریق هوک useWorkspace به متدها و stateهای فضای کاری دسترسی می‌یابند
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Team, TeamRole, Folder, Diagram, DiagramStatus, ReviewComment, TagItem } from '../types';
import { INITIAL_USERS, INITIAL_TEAMS, INITIAL_FOLDERS, INITIAL_DIAGRAMS, INITIAL_TAG_BANK } from '../data/initialData';

interface WorkspaceContextType {
  // بانک تگ‌ها
  tagBank: TagItem[];
  addTagToBank: (name: string, color: string) => TagItem;
  updateTagInBank: (id: string, name: string, color: string) => void;
  deleteTagFromBank: (id: string) => void;

  // مدیریت کاربران و احراز هویت
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  loginUser: (usernameOrEmail: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  registerUser: (userData: { name: string; nameEn?: string; email: string; username?: string; password?: string; jobTitle?: string }) => User;
  updateUserProfile: (data: { avatar?: string; name?: string; nameEn?: string; jobTitle?: string }) => void;
  
  // مدیریت تیم‌ها و سطوح دسترسی (RBAC)
  activeTeam: Team;
  teams: Team[];
  switchTeam: (teamId: string) => void;
  createTeam: (data: { name: string; nameEn?: string; description?: string }) => Team;
  addTeamMember: (teamId: string, email: string, role: TeamRole) => boolean;
  updateMemberRole: (teamId: string, userId: string, newRole: TeamRole) => void;
  removeTeamMember: (teamId: string, userId: string) => void;
  getUserRoleInTeam: (teamId: string, userId: string) => TeamRole;
  currentRole: TeamRole;

  // مدیریت پوشه‌بندی درختی
  folders: Folder[];
  selectedFolderId: string | null;
  setSelectedFolderId: (folderId: string | null) => void;
  createFolder: (name: string, parentId: string | null) => Folder;
  renameFolder: (folderId: string, newName: string) => void;
  deleteFolder: (folderId: string) => void;
  moveFolder: (folderId: string, targetParentId: string | null) => void;

  // مدیریت فرآیندها و نسخه‌گذاری
  diagrams: Diagram[];
  activeDiagram: Diagram | null;
  setActiveDiagram: (diagram: Diagram | null) => void;
  createDiagram: (data: { title: string; titleEn?: string; description?: string; folderId: string | null; tags: string[]; reviewerId?: string }) => Diagram;
  updateDiagram: (diagramId: string, updates: Partial<Diagram>) => void;
  saveDiagramXmlVersion: (diagramId: string, xml: string, changeSummary?: string) => void;
  deleteDiagram: (diagramId: string) => void;
  moveDiagram: (diagramId: string, targetFolderId: string | null) => void;

  // مدیریت نظرات و بازبینی‌ها
  addCommentToDiagram: (diagramId: string, content: string, elementId?: string) => void;
  resolveComment: (diagramId: string, commentId: string) => void;

  // مسیریابی و کنترل نماها
  activeView: 'dashboard' | 'modeler';
  openModelerForDiagram: (diagramId: string) => void;
  closeModelerToDashboard: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bpmn_v2_workspace_data';

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // بارگذاری داده‌های اولیه کاربران با پشتیبانی از بروزرسانی فیلدهای نام کاربری و رمز عبور
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        // اگر داده‌های قبلی در localStorage فیلد username یا password نداشتند، آن‌ها را با داده‌های اولیه ترمیم می‌کنیم
        const patched: User[] = parsed.map(u => {
          const initMatch = INITIAL_USERS.find(iu => iu.id === u.id || iu.email === u.email);
          return {
            ...u,
            username: u.username || initMatch?.username || u.email?.split('@')[0] || u.id,
            password: u.password || initMatch?.password || '123',
          };
        });

        // اضافه کردن کاربران اولیه که در localStorage وجود ندارند
        INITIAL_USERS.forEach(iu => {
          if (!patched.some(u => u.id === iu.id || u.email === iu.email || u.username === iu.username)) {
            patched.push(iu);
          }
        });

        return patched;
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // بانک تگ‌ها
  const [tagBank, setTagBank] = useState<TagItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tag_bank`);
    return saved ? JSON.parse(saved) : INITIAL_TAG_BANK;
  });

  // کاربر فعال ورودی (در صورت عدم وجود در localStorage کاربر ورود نکرده و ابتدا صفحه ورود نشان داده می‌شود)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const isAuthenticated = currentUser !== null;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
    }
  }, [currentUser]);

  // تیم‌های سازمانی
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_teams`);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [activeTeamId, setActiveTeamId] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_team_id`);
    return saved && teams.some(t => t.id === saved) ? saved : (teams[0]?.id || 't1');
  });

  // پوشه‌ها
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_folders`);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // فرآیندها
  const [diagrams, setDiagrams] = useState<Diagram[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_diagrams`);
    return saved ? JSON.parse(saved) : INITIAL_DIAGRAMS;
  });

  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);

  // حالت نمای فعلی (داشبورد یا بوم طراح)
  const [activeView, setActiveView] = useState<'dashboard' | 'modeler'>('dashboard');

  // ذخیره‌سازی داده‌ها در localStorage با هر تغییر
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_team_id`, activeTeamId);
  }, [activeTeamId]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_folders`, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_diagrams`, JSON.stringify(diagrams));
  }, [diagrams]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tag_bank`, JSON.stringify(tagBank));
  }, [tagBank]);

  // توابع مدیریت بانک تگ‌ها
  const addTagToBank = (name: string, color: string): TagItem => {
    const trimmedName = name.trim();
    const existing = tagBank.find(t => t.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      // اگر تگ وجود دارد اما رنگ جدیدی ثبت شده، ویرایشش می‌کنیم
      if (existing.color !== color) {
        updateTagInBank(existing.id, existing.name, color);
      }
      return existing;
    }

    const newTag: TagItem = {
      id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      color: color || '#3b82f6',
    };

    setTagBank(prev => [...prev, newTag]);
    return newTag;
  };

  const updateTagInBank = (id: string, name: string, color: string) => {
    setTagBank(prev => prev.map(t => t.id === id ? { ...t, name: name.trim(), color } : t));
  };

  const deleteTagFromBank = (id: string) => {
    setTagBank(prev => prev.filter(t => t.id !== id));
  };

  // محاسبه تیم و فرآیند فعال
  const activeTeam = teams.find(t => t.id === activeTeamId) || teams[0] || INITIAL_TEAMS[0];
  const activeDiagram = diagrams.find(d => d.id === activeDiagramId) || null;

  // محاسبه نقش کاربر در تیم فعال بر اساس RBAC
  const getUserRoleInTeam = (teamId: string, userId: string): TeamRole => {
    if (!userId) return 'viewer';
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'viewer';
    const member = team.members.find(m => m.userId === userId);
    return member ? member.role : 'viewer';
  };

  const currentRole = currentUser ? getUserRoleInTeam(activeTeam.id, currentUser.id) : 'viewer';

  // توابع احراز هویت
  const loginUser = (usernameOrEmail: string, password: string): { success: boolean; error?: string } => {
    const query = usernameOrEmail.trim().toLowerCase();
    
    let foundUser = users.find(u => 
      (u.username && u.username.toLowerCase() === query) ||
      (u.email && u.email.toLowerCase() === query) ||
      (u.name && u.name.toLowerCase() === query)
    );

    // پشتیبانی پشتیبان در صورت عدم وجود کاربر در آرایه فعلی
    if (!foundUser) {
      const initMatch = INITIAL_USERS.find(iu => 
        (iu.username && iu.username.toLowerCase() === query) ||
        (iu.email && iu.email.toLowerCase() === query) ||
        (iu.name && iu.name.toLowerCase() === query)
      );

      if (initMatch) {
        foundUser = initMatch;
        setUsers(prev => {
          if (!prev.some(p => p.id === initMatch.id)) {
            return [...prev, initMatch];
          }
          return prev;
        });
      }
    }

    if (!foundUser) {
      return { success: false, error: 'کاربری با این نام کاربری یا ایمیل یافت نشد.' };
    }

    // مقایسه کلمه عبور (اگر کلمه عبور پیش‌فرض باشد یا دقیقاً تطابق داشته باشد)
    if (foundUser.password && foundUser.password !== password && password !== '123') {
      return { success: false, error: 'کلمه عبور وارد شده اشتباه است.' };
    }

    setCurrentUser(foundUser);
    return { success: true };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const registerUser = (userData: { name: string; nameEn?: string; email: string; username?: string; password?: string; jobTitle?: string }): User => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: userData.name,
      nameEn: userData.nameEn || userData.name,
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      password: userData.password || '123',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      jobTitle: userData.jobTitle || 'عضو تیم',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // خودکار اضافه کردن به تیم فعال به عنوان ویرایشگر
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === activeTeam.id) {
        return {
          ...t,
          members: [
            ...t.members,
            {
              userId: newUser.id,
              user: newUser,
              role: 'editor' as TeamRole,
              joinedAt: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return t;
    }));

    return newUser;
  };

  const updateUserProfile = (data: { avatar?: string; name?: string; nameEn?: string; jobTitle?: string }) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.nameEn !== undefined && { nameEn: data.nameEn }),
      ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
    };

    setCurrentUser(updatedUser);

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Update in teams as well
    setTeams(prevTeams => prevTeams.map(t => ({
      ...t,
      members: t.members.map(m => m.userId === updatedUser.id ? { ...m, user: updatedUser } : m)
    })));
  };

  // مدیریت تیم
  const switchTeam = (teamId: string) => {
    if (teams.some(t => t.id === teamId)) {
      setActiveTeamId(teamId);
      setSelectedFolderId(null);
    }
  };

  const createTeam = (data: { name: string; nameEn?: string; description?: string }): Team => {
    if (!currentUser) throw new Error("کاربر ثبت نشده است");
    const newTeam: Team = {
      id: `t_${Date.now()}`,
      name: data.name,
      nameEn: data.nameEn || data.name,
      description: data.description || '',
      ownerId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        {
          userId: currentUser.id,
          user: currentUser,
          role: 'manager',
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setTeams(prev => [...prev, newTeam]);
    setActiveTeamId(newTeam.id);
    return newTeam;
  };

  const addTeamMember = (teamId: string, email: string, role: TeamRole): boolean => {
    const targetUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) return false;

    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === teamId) {
        if (t.members.some(m => m.userId === targetUser.id)) return t;
        return {
          ...t,
          members: [
            ...t.members,
            {
              userId: targetUser.id,
              user: targetUser,
              role,
              joinedAt: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return t;
    }));
    return true;
  };

  const updateMemberRole = (teamId: string, userId: string, newRole: TeamRole) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: t.members.map(m => m.userId === userId ? { ...m, role: newRole } : m)
        };
      }
      return t;
    }));
  };

  const removeTeamMember = (teamId: string, userId: string) => {
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: t.members.filter(m => m.userId !== userId)
        };
      }
      return t;
    }));
  };

  // مدیریت پوشه‌ها
  const createFolder = (name: string, parentId: string | null): Folder => {
    const newFolder: Folder = {
      id: `f_${Date.now()}`,
      name,
      teamId: activeTeam.id,
      parentId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const renameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const deleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId && f.parentId !== folderId));
    setDiagrams(prev => prev.map(d => d.folderId === folderId ? { ...d, folderId: null } : d));
    if (selectedFolderId === folderId) setSelectedFolderId(null);
  };

  const moveFolder = (folderId: string, targetParentId: string | null) => {
    if (folderId === targetParentId) return;
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, parentId: targetParentId } : f));
  };

  // مدیریت فرآیندها
  const createDiagram = (data: {
    title: string;
    titleEn?: string;
    description?: string;
    folderId: string | null;
    tags: string[];
    reviewerId?: string;
  }): Diagram => {
    if (!currentUser) throw new Error("کاربر نامشخص است");
    const reviewer = users.find(u => u.id === data.reviewerId);
    
    const initialXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="شروع فرآیند" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    const newDiagram: Diagram = {
      id: `d_${Date.now()}`,
      title: data.title,
      titleEn: data.titleEn || data.title,
      description: data.description || '',
      teamId: activeTeam.id,
      folderId: data.folderId,
      status: 'draft',
      tags: data.tags,
      reviewerId: data.reviewerId,
      reviewerName: reviewer ? reviewer.name : undefined,
      contributorIds: [currentUser.id],
      contributors: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          action: 'ایجاد دیاگرام اولیه',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      latestVersion: 1,
      xml: initialXml,
      versions: [
        {
          version: 1,
          xml: initialXml,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          editorId: currentUser.id,
          editorName: currentUser.name,
          changeSummary: 'ایجاد اولیه فرآیند'
        }
      ],
      comments: []
    };

    setDiagrams(prev => [newDiagram, ...prev]);
    return newDiagram;
  };

  const updateDiagram = (diagramId: string, updates: Partial<Diagram>) => {
    setDiagrams(prev => prev.map(d => {
      if (d.id === diagramId) {
        return {
          ...d,
          ...updates,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return d;
    }));
  };

  const saveDiagramXmlVersion = (diagramId: string, xml: string, changeSummary?: string) => {
    if (!currentUser) return;
    setDiagrams(prev => prev.map(d => {
      if (d.id === diagramId) {
        const nextVer = d.latestVersion + 1;
        const newVersionObj = {
          version: nextVer,
          xml,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          editorId: currentUser.id,
          editorName: currentUser.name,
          changeSummary: changeSummary || `ویرایش و ذخیره نسخه ${nextVer}.0`
        };

        const existingContrib = d.contributors.find(c => c.userId === currentUser.id);
        const updatedContribs = existingContrib 
          ? d.contributors.map(c => c.userId === currentUser.id ? { ...c, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), action: `ذخیره نسخه ${nextVer}.0` } : c)
          : [...d.contributors, { userId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, action: `ذخیره نسخه ${nextVer}.0`, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) }];

        return {
          ...d,
          xml,
          latestVersion: nextVer,
          versions: [newVersionObj, ...d.versions],
          contributors: updatedContribs,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return d;
    }));
  };

  const deleteDiagram = (diagramId: string) => {
    setDiagrams(prev => prev.filter(d => d.id !== diagramId));
    if (activeDiagramId === diagramId) setActiveDiagramId(null);
  };

  const moveDiagram = (diagramId: string, targetFolderId: string | null) => {
    setDiagrams(prev => prev.map(d => d.id === diagramId ? { ...d, folderId: targetFolderId } : d));
  };

  // نظرات
  const addCommentToDiagram = (diagramId: string, content: string, elementId?: string) => {
    if (!currentUser) return;
    const newComment: ReviewComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      elementId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'open'
    };

    setDiagrams(prev => prev.map(d => {
      if (d.id === diagramId) {
        return {
          ...d,
          comments: [...(d.comments || []), newComment]
        };
      }
      return d;
    }));
  };

  const resolveComment = (diagramId: string, commentId: string) => {
    setDiagrams(prev => prev.map(d => {
      if (d.id === diagramId) {
        return {
          ...d,
          comments: (d.comments || []).map(c => c.id === commentId ? { ...c, status: 'resolved' as const } : c)
        };
      }
      return d;
    }));
  };

  // کنترل نماها
  const openModelerForDiagram = (diagramId: string) => {
    setActiveDiagramId(diagramId);
    setActiveView('modeler');
  };

  const closeModelerToDashboard = () => {
    setActiveView('dashboard');
  };

  return (
    <WorkspaceContext.Provider value={{
      tagBank,
      addTagToBank,
      updateTagInBank,
      deleteTagFromBank,
      currentUser,
      users,
      isAuthenticated,
      setCurrentUser,
      loginUser,
      logoutUser,
      registerUser,
      updateUserProfile,
      activeTeam,
      teams,
      switchTeam,
      createTeam,
      addTeamMember,
      updateMemberRole,
      removeTeamMember,
      getUserRoleInTeam,
      currentRole,
      folders: folders.filter(f => f.teamId === activeTeam.id),
      selectedFolderId,
      setSelectedFolderId,
      createFolder,
      renameFolder,
      deleteFolder,
      moveFolder,
      diagrams: diagrams.filter(d => d.teamId === activeTeam.id),
      activeDiagram,
      setActiveDiagram: (diagram) => setActiveDiagramId(diagram ? diagram.id : null),
      createDiagram,
      updateDiagram,
      saveDiagramXmlVersion,
      deleteDiagram,
      moveDiagram,
      addCommentToDiagram,
      resolveComment,
      activeView,
      openModelerForDiagram,
      closeModelerToDashboard
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
