/**
 * @file TeamManagementModal.tsx
 * @description دیالوگ مدیریت تیم‌های کاری، افزودن اعضا، تخصیص نقش‌ها (مدیر، ویرایش‌گر، بازبین، مشاهده‌کننده) و ایجاد تیم جدید
 * @architecture
 * - Single Responsibility Principle (SRP): مدیریت سطوح دسترسی RBAC اعضای تیم و سوییچ بین تیم‌ها
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TeamRole, Team } from '../types';
import { Users, UserPlus, Shield, Trash2, PlusCircle, Check, AlertCircle, Building2, LogOut } from 'lucide-react';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeTeam, 
    teams, 
    switchTeam, 
    createTeam, 
    deleteTeam,
    leaveTeam,
    addTeamMember, 
    updateMemberRole, 
    removeTeamMember, 
    getUserRoleInTeam,
    currentRole, 
    currentUser,
    users 
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'members' | 'add' | 'newTeam' | 'allTeams'>('members');
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Member invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamNameEn, setNewTeamNameEn] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');

  if (!isOpen) return null;

  const isManager = currentRole === 'manager';

  const confirmDeleteTeam = (t: Team) => {
    if (teams.length <= 1) {
      setActionNotice("امکان حذف تنها تیم موجود وجود ندارد. حداقل باید یک تیم در سیستم فعال باشد.");
      setTimeout(() => setActionNotice(null), 4000);
      return;
    }
    const success = deleteTeam(t.id);
    if (success) {
      setActionNotice(`تیم "${t.name}" با موفقیت حذف شد.`);
      setTeamToDelete(null);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus(null);
    if (!inviteEmail.trim()) return;

    const success = addTeamMember(activeTeam.id, inviteEmail, inviteRole);
    if (success) {
      setInviteStatus({ type: 'success', msg: `کاربر با ایمیل ${inviteEmail} با موفقیت با نقش ${getRoleTitle(inviteRole)} به تیم اضافه شد.` });
      setInviteEmail('');
    } else {
      setInviteStatus({ type: 'error', msg: `کاربری با ایمیل ${inviteEmail} در سیستم یافت نشد. ابتدا کاربر باید در سیستم ثبت‌نام کند.` });
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const team = createTeam({ name: newTeamName, nameEn: newTeamNameEn, description: newTeamDesc });
    setNewTeamName('');
    setNewTeamNameEn('');
    setNewTeamDesc('');
    setActiveTab('members');
  };

  const getRoleTitle = (role: TeamRole) => {
    switch (role) {
      case 'manager': return 'مدیر تیم (Manager)';
      case 'editor': return 'ویرایش‌گر (Editor)';
      case 'reviewer': return 'بازبینی‌کننده (Reviewer)';
      case 'viewer': return 'مشاهده‌کننده (Viewer)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">مدیریت تیم و سطوح دسترسی اعضا</h3>
              <p className="text-xs text-slate-400">{activeTeam.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            اعضای تیم ({activeTeam.members.length})
          </button>

          <button
            onClick={() => setActiveTab('allTeams')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'allTeams'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            لیست تیم‌ها ({teams.length})
          </button>
          
          {isManager && (
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === 'add'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              افزودن عضو
            </button>
          )}

          <button
            onClick={() => setActiveTab('newTeam')}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'newTeam'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            ساخت تیم جدید
          </button>
        </div>

        {/* Action Notice Alert Banner */}
        {actionNotice && (
          <div className="mx-5 mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs flex items-center justify-between font-medium animate-fade-in">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-indigo-400 hover:text-indigo-600 font-bold mr-2">✕</button>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'members' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 gap-3">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">تیم فعلی:</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{activeTeam.name}</h4>
                  {activeTeam.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeTeam.description}</p>}
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-left">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">نقش شما:</span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{getRoleTitle(currentRole)}</span>
                  </div>
                  {isManager && (
                    <button
                      type="button"
                      onClick={() => {
                        if (teams.length <= 1) {
                          alert("امکان حذف تنها تیم موجود وجود ندارد. برای حذف، ابتدا یک تیم دیگر بسازید.");
                          return;
                        }
                        if (window.confirm(`آیا از حذف تیم "${activeTeam.name}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) {
                          deleteTeam(activeTeam.id);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="حذف این تیم توسط مدیر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف تیم</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400">لیست اعضا و سطح دسترسی‌ها:</h5>
                {activeTeam.members.map((member) => (
                  <div 
                    key={member.userId}
                    className="p-3 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.user.avatar} 
                        alt={member.user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{member.user.name}</span>
                          {member.userId === activeTeam.ownerId && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">مالک تیم</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {member.user.email} {member.user.jobTitle ? `• ${member.user.jobTitle}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isManager && member.userId !== activeTeam.ownerId ? (
                        <select
                          value={member.role}
                          onChange={(e) => updateMemberRole(activeTeam.id, member.userId, e.target.value as TeamRole)}
                          className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="manager">مدیر تیم</option>
                          <option value="editor">ویرایش‌گر</option>
                          <option value="reviewer">بازبینی‌کننده</option>
                          <option value="viewer">مشاهده‌کننده</option>
                        </select>
                      ) : (
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          {getRoleTitle(member.role)}
                        </span>
                      )}

                      {isManager && member.userId !== activeTeam.ownerId && (
                        <button
                          onClick={() => removeTeamMember(activeTeam.id, member.userId)}
                          title="حذف از تیم"
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'add' && isManager && (
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  آدرس ایمیل کاربر جدید <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ایمیل کاربر ثبت‌نام شده (مانند: m.ahmadi@enterprise.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  کاربرانی که در سیستم ثبت‌نام کرده‌اند: {users.map(u => u.email).join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  سطح دسترسی در تیم <span className="text-rose-500">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="manager">مدیر تیم (Manager) - کل امور تیم و دسترسی‌ها</option>
                  <option value="editor">ویرایش‌گر (Editor) - ایجاد و تغییر مدل‌های BPMN</option>
                  <option value="reviewer">بازبینی‌کننده (Reviewer) - ارزیابی، تایید و ثبت نظرات</option>
                  <option value="viewer">مشاهده‌کننده (Viewer) - فقط مشاهده دیاگرام‌ها</option>
                </select>
              </div>

              {inviteStatus && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  inviteStatus.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                }`}>
                  {inviteStatus.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{inviteStatus.msg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                افزودن به اعضای تیم
              </button>
            </form>
          )}

          {activeTab === 'newTeam' && (
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  نام تیم / واحد سازمانی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مانند: تیم فرآیندهای مالی و خزانه‌داری"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  نام انگلیسی تیم
                </label>
                <input
                  type="text"
                  placeholder="Finance & Treasury BPM Team"
                  value={newTeamNameEn}
                  onChange={(e) => setNewTeamNameEn(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات و ماموریت تیم
                </label>
                <textarea
                  rows={3}
                  placeholder="مدل‌سازی و پایش کامل فرآیندهای مالی سازمانی..."
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                ایجاد تیم جدید و انتقال به آن
              </button>
            </form>
          )}

          {activeTab === 'allTeams' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">تمام تیم‌های تعریف‌شده در سازمان:</h5>
                <span className="text-xs text-slate-500">مجموع: {teams.length} تیم</span>
              </div>

              {teams.map((teamItem) => {
                const isCurrentActive = teamItem.id === activeTeam.id;
                return (
                  <div 
                    key={teamItem.id} 
                    className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrentActive 
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800' 
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{teamItem.name}</span>
                        {isCurrentActive && (
                          <span className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white font-bold rounded-full">
                            تیم فعال فعلی
                          </span>
                        )}
                      </div>
                      {teamItem.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{teamItem.description}</p>
                      )}
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-0.5">
                        <span>تعداد اعضا: {teamItem.members.length} نفر</span>
                        <span>•</span>
                        <span>تاریخ ایجاد: {teamItem.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {!isCurrentActive && (
                        <button
                          type="button"
                          onClick={() => {
                            switchTeam(teamItem.id);
                            setActionNotice(`به تیم "${teamItem.name}" سوئیچ کردید.`);
                            setTimeout(() => setActionNotice(null), 3000);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          انتخاب تیم
                        </button>
                      )}

                      {(() => {
                        const userRoleInTeam = currentUser ? getUserRoleInTeam(teamItem.id, currentUser.id) : 'editor';
                        const canDelete = userRoleInTeam === 'manager';

                        if (canDelete) {
                          return (
                            <button
                              type="button"
                              onClick={() => setTeamToDelete(teamItem)}
                              disabled={teams.length <= 1}
                              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                teams.length <= 1
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50'
                                  : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60'
                              }`}
                              title={teams.length <= 1 ? "امکان حذف تنها تیم باقی‌مانده وجود ندارد" : "حذف این تیم (مخصوص مدیر)"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            type="button"
                            onClick={() => {
                              const success = leaveTeam(teamItem.id);
                              if (success) {
                                setActionNotice(`از تیم "${teamItem.name}" خارج شدید. این تیم برای سایر اعضا باقی ماند.`);
                                setTimeout(() => setActionNotice(null), 4000);
                              } else {
                                setActionNotice("امکان خروج از تنها تیم موجود وجود ندارد.");
                                setTimeout(() => setActionNotice(null), 4000);
                              }
                            }}
                            disabled={teams.length <= 1}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              teams.length <= 1
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-50'
                                : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
                            }`}
                            title={teams.length <= 1 ? "امکان خروج از تنها تیم موجود وجود ندارد" : "خروج از این تیم"}
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>ترک تیم</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {teamToDelete && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-[10000] animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">تایید حذف تیم "{teamToDelete.name}"</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">آیا از حذف این تیم اطمینان کامل دارید؟</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold">نکات مهم قبل از حذف:</p>
                <p>• تمام دیاگرام‌ها و پوشه‌های این تیم به اولین تیم فعال باقی‌مانده منتقل می‌شوند تا داده‌ای از دست نرود.</p>
                <p>• این عمل غیرقابل بازگشت است.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTeamToDelete(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={() => confirmDeleteTeam(teamToDelete)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  بله، تیم حذف شود
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
