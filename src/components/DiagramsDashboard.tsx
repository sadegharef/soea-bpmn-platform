/**
 * @file DiagramsDashboard.tsx
 * @description داشبورد مدیریت و مرور فرآیندهای سازمانی، ساختار پوشه‌بندی و فیلترهای پیشرفته
 * @architecture
 * - Single Responsibility Principle (SRP): نمایش لیست فرآیندها، جستجو، فیلتر و مدیریت مدال‌ها
 * - Separation of Concerns: تفکیک ساختار پوشه (FolderTree) و کارت‌های فرآیند (DiagramCard)
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DiagramCard } from './DiagramCard';
import { FolderTree } from './FolderTree';
import { AuthModal } from './AuthModal';
import { TeamManagementModal } from './TeamManagementModal';
import { CreateDiagramModal } from './CreateDiagramModal';
import { EditDiagramModal } from './EditDiagramModal';
import { MoveModal } from './MoveModal';
import { TagBankModal } from './TagBankModal';
import { Diagram } from '../types';
import { 
  Workflow, 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List as ListIcon, 
  Users, 
  Folder as FolderIcon, 
  Layers, 
  UserCheck, 
  ChevronDown, 
  Sun, 
  Moon, 
  LogOut,
  Tag
} from 'lucide-react';

interface DiagramsDashboardProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const DiagramsDashboard: React.FC<DiagramsDashboardProps> = ({ theme, setTheme }) => {
  const { 
    currentUser, 
    activeTeam, 
    teams, 
    switchTeam, 
    logoutUser,
    currentRole, 
    folders, 
    selectedFolderId, 
    setSelectedFolderId, 
    diagrams, 
    users 
  } = useWorkspace();

  // کنترل وضعیت مدال‌های عملیاتی
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTagBankModalOpen, setIsTagBankModalOpen] = useState(false);
  
  const [editDiagramState, setEditDiagramState] = useState<{
    isOpen: boolean;
    diagram: Diagram | null;
  }>({
    isOpen: false,
    diagram: null
  });

  const [moveModalState, setMoveModalState] = useState<{
    isOpen: boolean;
    itemType: 'diagram' | 'folder';
    itemId: string;
    itemTitle: string;
  }>({
    isOpen: false,
    itemType: 'diagram',
    itemId: '',
    itemTitle: ''
  });

  // وضعیت‌های جستجو و فیلترسازی
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reviewerFilter, setReviewerFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isEditorOrManager = currentRole === 'manager' || currentRole === 'editor';

  // دریافت مسیر نان‌سوخاری (Breadcrumb) برای پوشه انتخاب‌شده
  const getBreadcrumbPath = (folderId: string | null): { id: string | null; name: string }[] => {
    if (!folderId) return [{ id: null, name: 'ریشه فرآیندها' }];
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [{ id: null, name: 'ریشه فرآیندها' }];
    
    if (folder.parentId) {
      return [...getBreadcrumbPath(folder.parentId), { id: folder.id, name: folder.name }];
    }
    return [{ id: null, name: 'ریشه فرآیندها' }, { id: folder.id, name: folder.name }];
  };

  const breadcrumbs = getBreadcrumbPath(selectedFolderId);

  // منطق فیلتر کردن هوشمند دیاگرام‌ها بر اساس پوشه، جستجو، وضعیت و مسئول بازبینی
  const filteredDiagrams = diagrams.filter(d => {
    // ۱. تطابق پوشه: نمایش فرآیندهای پوشه انتخاب‌شده و زیرپوشه‌های آن
    if (selectedFolderId !== null) {
      const getSubfolderIds = (id: string): string[] => {
        const children = folders.filter(f => f.parentId === id);
        return [id, ...children.flatMap(c => getSubfolderIds(c.id))];
      };
      const validFolderIds = getSubfolderIds(selectedFolderId);
      if (!d.folderId || !validFolderIds.includes(d.folderId)) return false;
    }

    // ۲. تطابق واژه جستجو
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchTitleEn = d.titleEn ? d.titleEn.toLowerCase().includes(q) : false;
      const matchDesc = d.description ? d.description.toLowerCase().includes(q) : false;
      const matchTags = d.tags ? d.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!matchTitle && !matchTitleEn && !matchDesc && !matchTags) return false;
    }

    // ۳. فیلتر وضعیت چرخه حیات
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;

    // ۴. فیلتر مسئول بازبینی
    if (reviewerFilter !== 'ALL' && d.reviewerId !== reviewerFilter) return false;

    return true;
  });

  // محاسبه شاخص‌های فضای کاری (Metrics)
  const totalDiagramsCount = diagrams.length;
  const inReviewCount = diagrams.filter(d => d.status === 'in_review').length;
  const approvedCount = diagrams.filter(d => d.status === 'approved').length;

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'مدیر تیم';
      case 'editor': return 'ویرایش‌گر';
      case 'reviewer': return 'بازبینی‌کننده';
      default: return 'مشاهده‌کننده';
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans" dir="rtl">
      
      {/* هدر و نوار ابزار بالای صفحه */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* عنوان برند هم‌نگار */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                سامانه هم‌نگار - پنل مدیریت فرآیندها
              </h1>
            </div>
          </div>

          {/* انتخاب‌گر تیم، مدیریت حساب و پوسته */}
          <div className="flex items-center gap-3">
            
            {/* انتخاب‌گر تیم کاری */}
            <div className="relative">
              <select
                value={activeTeam.id}
                onChange={(e) => switchTeam(e.target.value)}
                className="bg-slate-800 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* دکمه مدیریت اعضا و دسترسی‌های تیم */}
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="مدیریت اعضا و دسترسی‌های تیم"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">اعضای تیم</span>
            </button>

            {/* پروفایل کاربر و دکمه خروج مستقیم */}
            {currentUser ? (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700/80 rounded-xl p-1">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-700/80 transition cursor-pointer"
                  title="مشاهده مشخصات حساب کاربری"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover border border-slate-600"
                  />
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-xs text-white block">{currentUser.name}</span>
                    <span className="text-[10px] text-indigo-300 block">{getRoleBadgeLabel(currentRole)}</span>
                  </div>
                </button>
                <button
                  onClick={() => logoutUser()}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="خروج از حساب کاربری"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                ورود / ثبت‌نام
              </button>
            )}

            {/* سوییچ تغییر پوسته (دارک/لایت) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              title="تغییر حالت شب/روز"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* بخش اصلی محتوای داشبورد */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* کارت‌های شاخص و آماری (Metrics Banner) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">کل فرآیندها</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{totalDiagramsCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">در حال بازبینی</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{inReviewCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">تایید و منتشرشده</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{approvedCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FolderIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">پوشه‌های فعال</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{folders.length}</span>
            </div>
          </div>
        </div>

        {/* بدنه اصلی با چیدمان ۲ ستونه (درخت پوشه + لیست دیاگرام‌ها) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* ستون راست: درخت پوشه‌بندی پیشرفته هم‌نگار */}
          <div className="lg:col-span-1">
            <FolderTree 
              onOpenMoveModal={(type, id, title) => {
                setMoveModalState({ isOpen: true, itemType: type, itemId: id, itemTitle: title });
              }}
            />
          </div>

          {/* ستون چپ: جستجو، فیلتر و لیست کارت‌های فرآیند */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* نوار جستجو، فیلترها و دکمه‌های اکشن */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* فیلد جستجو */}
                <div className="relative w-full sm:w-auto sm:flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجو در عنوان، توضیحات یا تگ‌های فرآیندها..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* دکمه‌های دکمه ساخت فرآیند جدید و تغییر حالت نمایش */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  
                  {isEditorOrManager && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>فرآیند جدید</span>
                    </button>
                  )}

                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                        viewMode === 'grid' 
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="نمایش شبکه‌ای"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                        viewMode === 'list' 
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="نمایش لیستی"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

              {/* نوار فیلترهای پیشرفته (چرخه حیات و ممیز) */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto pb-1">
                <span className="flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-indigo-500" />
                  <span>فیلتر فرآیندها:</span>
                </span>

                {/* فیلتر وضعیت */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">همه وضعیت‌ها</option>
                  <option value="draft">پیش‌نویس</option>
                  <option value="in_review">در حال بازبینی</option>
                  <option value="approved">تایید شده</option>
                  <option value="needs_revision">نیازمند اصلاح</option>
                </select>

                {/* فیلتر مسئول بازبینی */}
                <select
                  value={reviewerFilter}
                  onChange={(e) => setReviewerFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="ALL">همه بازبین‌ها</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* مسیر Breadcrumb پوشه انتخاب‌شده */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <FolderIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  <button
                    onClick={() => setSelectedFolderId(b.id)}
                    className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer ${
                      b.id === selectedFolderId ? 'font-extrabold text-slate-900 dark:text-white' : ''
                    }`}
                  >
                    {b.name}
                  </button>
                </React.Fragment>
              ))}
              <span className="text-slate-400 font-mono text-[11px] mr-auto">({filteredDiagrams.length} فرآیند)</span>
            </div>

            {/* لیست کارت‌های فرآیندها */}
            {filteredDiagrams.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
                <Workflow className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">هیچ فرآیندی یافت نشد</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  با معیارهای انتخاب‌شده فرآیندی پیدا نشد. فرآیند جدید ایجاد کنید یا فیلترها را بازنشانی کنید.
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                {filteredDiagrams.map(diagram => (
                  <DiagramCard
                    key={diagram.id}
                    diagram={diagram}
                    viewMode={viewMode}
                    onMoveClick={(d) => {
                      setMoveModalState({ isOpen: true, itemType: 'diagram', itemId: d.id, itemTitle: d.title });
                    }}
                    onEditClick={(d) => {
                      setEditDiagramState({ isOpen: true, diagram: d });
                    }}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* فوتر سامانه هم‌نگار */}
      <footer className="mt-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">سامانه مدیریت فرآیندهای هم‌نگار</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-mono text-[11px]">نسخه ۲.۳.۰</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>کلیه حقوق مادی و معنوی متعلق به سامانه هم‌نگار است.</span>
          </div>
        </div>
      </footer>

      {/* مدال‌های عملیاتی */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <TeamManagementModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      <CreateDiagramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditDiagramModal
        isOpen={editDiagramState.isOpen}
        onClose={() => setEditDiagramState(prev => ({ ...prev, isOpen: false }))}
        diagram={editDiagramState.diagram}
      />

      <MoveModal
        isOpen={moveModalState.isOpen}
        onClose={() => setMoveModalState(prev => ({ ...prev, isOpen: false }))}
        itemType={moveModalState.itemType}
        itemId={moveModalState.itemId}
        itemTitle={moveModalState.itemTitle}
      />

      <TagBankModal
        isOpen={isTagBankModalOpen}
        onClose={() => setIsTagBankModalOpen(false)}
      />

    </div>
  );
};
