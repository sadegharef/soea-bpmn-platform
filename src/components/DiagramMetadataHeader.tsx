/**
 * @file DiagramMetadataHeader.tsx
 * @description هدر یکپارچه و جامع سامانه هم‌نگار با ادغام کامل اکشن‌های بوم (Undo/Redo)، خروجی‌گیری، کنترل نسخه‌ها، نظرات و مدیریت
 * @architecture
 * - Single Responsibility Principle (SRP): ارائه یکپارچه تمام کنترل‌های فوقانی بوم و مدیریت همنگار
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DiagramStatus } from '../types';
import { 
  ArrowRight, 
  Workflow, 
  Folder as FolderIcon, 
  UserCheck, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Save, 
  History, 
  MessageSquare, 
  LogOut,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Share2,
  Download,
  Link2,
  Globe,
  ChevronDown
} from 'lucide-react';

interface DiagramMetadataHeaderProps {
  onSaveVersion: (changeSummary: string) => void;
  onToggleHistoryDrawer: () => void;
  onToggleCommentsDrawer: () => void;
  unresolvedCommentsCount: number;
  theme?: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExportBpmn?: () => void;
  onExportPng?: () => void;
  onExportSvg?: () => void;
  lang?: 'fa' | 'en';
  setLang?: (lang: 'fa' | 'en') => void;
}

export const DiagramMetadataHeader: React.FC<DiagramMetadataHeaderProps> = ({
  onSaveVersion,
  onToggleHistoryDrawer,
  onToggleCommentsDrawer,
  unresolvedCommentsCount,
  theme,
  setTheme,
  onUndo,
  onRedo,
  onExportBpmn,
  onExportPng,
  onExportSvg,
  lang = 'fa',
  setLang
}) => {
  const { 
    activeDiagram, 
    closeModelerToDashboard, 
    updateDiagram, 
    folders, 
    users, 
    currentUser, 
    logoutUser,
    currentRole,
    teams,
    activeTeamId,
    switchTeam
  } = useWorkspace();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeDiagram?.title || '');

  // Save Version Dialog
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');

  // Share & Export Dropdown
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeDiagram) return null;

  const isManager = currentRole === 'manager';
  const isEditor = currentRole === 'editor';
  const isReviewer = currentRole === 'reviewer';
  const canEditModel = isManager || isEditor;
  const canReview = isManager || isReviewer;

  // Folder path string
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return 'پوشه اصلی ریشه';
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return 'پوشه اصلی ریشه';
    if (folder.parentId) {
      return `${getFolderPath(folder.parentId)} / ${folder.name}`;
    }
    return folder.name;
  };

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== activeDiagram.title) {
      updateDiagram(activeDiagram.id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleStatusChange = (newStatus: DiagramStatus) => {
    updateDiagram(activeDiagram.id, { status: newStatus });
  };

  const handleReviewerChange = (reviewerId: string) => {
    const selectedUser = users.find(u => u.id === reviewerId);
    updateDiagram(activeDiagram.id, {
      reviewerId: reviewerId || null,
      reviewerName: selectedUser ? selectedUser.name : undefined
    });
  };

  const handleConfirmSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVersion(changeSummary.trim() || 'ویرایش و بروزرسانی دیاگرام');
    setChangeSummary('');
    setIsSaveModalOpen(false);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#embed-${activeDiagram.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getStatusBadge = (status: DiagramStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تایید شده
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            در حال بازبینی
          </span>
        );
      case 'needs_revision':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            نیازمند اصلاح
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500/20 text-slate-300 border border-slate-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            پیش‌نویس
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-slate-950 border-b border-slate-800 text-white px-4 py-2.5 shadow-xl select-none z-40 relative" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        <div className="max-w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* بخش راست: لوگو برند هم‌نگار، دکمه بازگشت و اطلاعات کامل فرآیند */}
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            
            {/* برند هم‌نگار */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Workflow className="w-5 h-5" />
              </div>
              <div className="hidden xl:block">
                <span className="font-extrabold text-sm text-white tracking-tight block">هم‌نگار</span>
                <span className="text-[10px] text-indigo-300 block">مدلساز فرآیندها</span>
              </div>
            </div>

            {/* دکمه بازگشت به داشبورد سامانه */}
            <button
              onClick={closeModelerToDashboard}
              className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              title="بازگشت به پنل مدیریت فرآیندهای هم‌نگار"
            >
              <ArrowRight className="w-4 h-4 text-indigo-400" />
              <span>داشبورد هم‌نگار</span>
            </button>

            {/* اطلاعات فرآیند: عنوان، وضعیت، نسخه، پوشه و ممیز */}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* عنوان فرآیند */}
                {isEditingTitle && canEditModel ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                    autoFocus
                    className="bg-slate-800 border border-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-md focus:outline-none"
                  />
                ) : (
                  <h2 
                    onClick={() => canEditModel && setIsEditingTitle(true)}
                    className={`font-bold text-sm text-white truncate max-w-xs ${canEditModel ? 'hover:text-indigo-300 cursor-pointer' : ''}`}
                    title={canEditModel ? 'برای تغییر عنوان فرآیند کلیک کنید' : ''}
                  >
                    {activeDiagram.title}
                  </h2>
                )}

                {/* وضعیت فرآیند */}
                {canReview ? (
                  <select
                    value={activeDiagram.status}
                    onChange={(e) => handleStatusChange(e.target.value as DiagramStatus)}
                    className="bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-2 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="in_review">در حال بازبینی</option>
                    <option value="approved">تایید شده</option>
                    <option value="needs_revision">نیازمند اصلاح</option>
                  </select>
                ) : (
                  getStatusBadge(activeDiagram.status)
                )}

                {/* شماره نسخه */}
                <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  نسخه {activeDiagram.latestVersion}.0
                </span>
              </div>

              {/* مسیر پوشه و ممیز تعیین‌شده */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <FolderIcon className="w-3 h-3 text-amber-400" />
                  <span>{getFolderPath(activeDiagram.folderId)}</span>
                </span>

                {/* تعیین و نمایش ممیز */}
                {isManager ? (
                  <div className="flex items-center gap-1 text-indigo-300">
                    <UserCheck className="w-3 h-3 text-indigo-400" />
                    <span>ممیز:</span>
                    <select
                      value={activeDiagram.reviewerId || ''}
                      onChange={(e) => handleReviewerChange(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded px-1.5 py-0.2 focus:outline-none"
                    >
                      <option value="">تعیین‌نشده</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.jobTitle})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-300">
                    <UserCheck className="w-3 h-3" />
                    <span>ممیز: {activeDiagram.reviewerName || 'تعیین‌نشده'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* بخش چپ: اکشن‌های ادغام‌شده بوم و مدیریت */}
          <div className="flex items-center gap-2 justify-end flex-wrap">
            
            {/* کلیدهای Undo / Redo بسیار مهم */}
            {onUndo && onRedo && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={onUndo}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="بازگردانی تغییر (Undo)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onRedo}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="اعمال مجدد تغییر (Redo)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* انتخاب تیم */}
            {teams.length > 0 && (
              <div className="hidden md:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <select
                  value={activeTeamId}
                  onChange={(e) => switchTeam(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* کشوی نظرات یکپارچه */}
            <button
              onClick={onToggleCommentsDrawer}
              className="relative px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="نظرات و ارزیابی فرآیند"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">نظرات</span>
              {unresolvedCommentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                  {unresolvedCommentsCount}
                </span>
              )}
            </button>

            {/* کشوی تاریخچه نسخ یکپارچه */}
            <button
              onClick={onToggleHistoryDrawer}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="تاریخچه نسخه‌های ذخیره‌شده"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">تاریخچه نسخ</span>
            </button>

            {/* منوی خروجی‌گیری و اشتراک */}
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="دانلود و اشتراک فرآیند"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">اشتراک و خروجی</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isExportOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-1">
                  <button
                    onClick={() => { handleCopyLink(); setIsExportOpen(false); }}
                    className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2"
                  >
                    <Link2 className="w-4 h-4 text-indigo-400" />
                    <span>{copiedLink ? 'لینک کپی شد!' : 'کپی لینک اشتراک'}</span>
                  </button>
                  {onExportBpmn && (
                    <button
                      onClick={() => { onExportBpmn(); setIsExportOpen(false); }}
                      className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>دانلود فایل BPMN XML</span>
                    </button>
                  )}
                  {onExportSvg && (
                    <button
                      onClick={() => { onExportSvg(); setIsExportOpen(false); }}
                      className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>دانلود تصویر SVG</span>
                    </button>
                  )}
                  {onExportPng && (
                    <button
                      onClick={() => { onExportPng(); setIsExportOpen(false); }}
                      className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>دانلود تصویر PNG</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ثبت نسخه جدید */}
            {canEditModel && (
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ثبت نسخه جدید</span>
              </button>
            )}

            {/* سوئیچ زبان */}
            {setLang && (
              <button
                onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                title="تغییر زبان"
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'fa' ? 'EN' : 'FA'}</span>
              </button>
            )}

            {/* سوئیچ تم (تنها مرجع تم در سامانه) */}
            {setTheme && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                title="تغییر پوسته (روز / شب)"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              </button>
            )}

            {/* اطلاعات کاربر و خروج */}
            {currentUser && (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
                  title={`${currentUser.name} (${currentUser.jobTitle})`}
                />
                <button
                  onClick={logoutUser}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="خروج از حساب کاربری"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* مدال ثبت نسخه جدید */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4" dir="rtl">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">ثبت و انتشار نسخه جدید (v{activeDiagram.latestVersion + 1}.0)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">تغییرات انجام‌شده در این نوبت را شرح دهید</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSaveVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  خلاصه تغییرات:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="مانند: اصلاح گیت‌وی تصمیم‌گیری، تغییر مسیر فرآیند مرخصی و افزودن وضعیت تایید ممیز..."
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  ثبت نسخه جدید
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
