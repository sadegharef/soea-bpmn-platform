/**
 * @file DiagramMetadataHeader.tsx
 * @description هدر یکپارچه و جامع سامانه هم‌نگار با ادغام کامل اکشن‌های بوم (Undo/Redo)، خروجی‌گیری، کنترل نسخه‌ها، نظرات و مدیریت
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { DiagramStatus } from '../types';
import { EditDiagramModal } from './EditDiagramModal';
import { ShareModal } from './ShareModal';
import { 
  ArrowRight, 
  Workflow, 
  Folder as FolderIcon, 
  UserCheck, 
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
  ChevronDown,
  Edit3,
  Eye,
  Shield
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
    currentRole
  } = useWorkspace();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activeDiagram?.title || '');

  // Modal States
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');

  // Share & Export Dropdown
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeDiagram) return null;

  const isEn = lang === 'en';

  const t = {
    brandTitle: isEn ? 'Hamnegar' : 'هم‌نگار',
    brandSubtitle: isEn ? 'Process Modeler' : 'مدلساز فرآیندها',
    dashboardBtn: isEn ? 'Dashboard' : 'داشبورد هم‌نگار',
    dashboardTooltip: isEn ? 'Back to Hamnegar Management Panel' : 'بازگشت به پنل مدیریت فرآیندهای هم‌نگار',
    editInfoBtn: isEn ? 'Edit Metadata' : 'ویرایش مشخصات',
    editInfoTooltip: isEn ? 'Edit process title, tags & reviewer' : 'ویرایش مشخصات، برچسب‌ها و مسئول بازبینی فرآیند',
    version: isEn ? 'Version' : 'نسخه',
    folderRoot: isEn ? 'Root Directory' : 'پوشه اصلی ریشه',
    reviewer: isEn ? 'Reviewer:' : 'مسئول بازبینی:',
    unassigned: isEn ? 'Unassigned' : 'تعیین‌نشده',
    undoTooltip: isEn ? 'Undo Action' : 'بازگردانی تغییر (Undo)',
    redoTooltip: isEn ? 'Redo Action' : 'اعمال مجدد تغییر (Redo)',
    commentsBtn: isEn ? 'Comments' : 'نظرات',
    commentsTooltip: isEn ? 'Process Comments & Review' : 'نظرات و ارزیابی فرآیند',
    historyBtn: isEn ? 'History' : 'تاریخچه نسخ',
    historyTooltip: isEn ? 'Saved Version History' : 'تاریخچه نسخه‌های ذخیره‌شده',
    exportBtn: isEn ? 'Share & Export' : 'اشتراک و خروجی',
    shareSettings: isEn ? 'Workspace Sharing Settings' : 'تنظیمات اشتراک‌گذاری',
    exportTooltip: isEn ? 'Download & Share Process' : 'دانلود و اشتراک فرآیند',
    copyLink: isEn ? 'Copy Share Link' : 'کپی لینک اشتراک',
    copiedLink: isEn ? 'Link Copied!' : 'لینک کپی شد!',
    exportBpmn: isEn ? 'Download BPMN XML' : 'دانلود فایل BPMN XML',
    exportSvg: isEn ? 'Download SVG Image' : 'دانلود تصویر SVG',
    exportPng: isEn ? 'Download PNG Image' : 'دانلود تصویر PNG',
    saveVersionBtn: isEn ? 'Publish Version' : 'ثبت نسخه جدید',
    saveVersionTitle: isEn ? 'Publish New Version' : 'ثبت و انتشار نسخه جدید',
    saveVersionDesc: isEn ? 'Describe the changes made in this release' : 'تغییرات انجام‌شده در این نوبت را شرح دهید',
    changeSummaryLabel: isEn ? 'Change Summary:' : 'خلاصه تغییرات:',
    changeSummaryPlaceholder: isEn ? 'e.g., Updated decision gateway and approval flow...' : 'مانند: اصلاح گیت‌وی تصمیم‌گیری، تغییر مسیر فرآیند...',
    confirmSave: isEn ? 'Publish Version' : 'ثبت نسخه جدید',
    cancel: isEn ? 'Cancel' : 'انصراف',
    statusDraft: isEn ? 'Draft' : 'پیش‌نویس',
    statusInReview: isEn ? 'In Review' : 'در حال بازبینی',
    statusApproved: isEn ? 'Approved' : 'تایید شده',
    statusNeedsRevision: isEn ? 'Needs Revision' : 'نیازمند اصلاح',
    logoutTooltip: isEn ? 'Logout' : 'خروج از حساب کاربری'
  };

  const isManager = currentRole === 'manager';
  const isEditor = currentRole === 'editor';
  const isReviewer = currentRole === 'reviewer';
  const canEditModel = isManager || isEditor;
  const canReview = isManager || isReviewer;

  // Folder path string
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return t.folderRoot;
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return t.folderRoot;
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
    onSaveVersion(changeSummary.trim() || (isEn ? 'Updated process diagram' : 'ویرایش و بروزرسانی دیاگرام'));
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
            {t.statusApproved}
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {t.statusInReview}
          </span>
        );
      case 'needs_revision':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            {t.statusNeedsRevision}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500/20 text-slate-300 border border-slate-500/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            {t.statusDraft}
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-slate-950 border-b border-slate-800 text-white px-4 py-2.5 shadow-xl select-none z-40 relative" dir={isEn ? 'ltr' : 'rtl'}>
        <div className="max-w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* بخش اصلی: برند، بازگشت، و مشخصات فرآیند */}
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            
            {/* برند هم‌نگار */}
            <div className={`flex items-center gap-2 shrink-0 ${isEn ? 'pr-3 border-r' : 'pl-3 border-l'} border-slate-800`}>
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Workflow className="w-5 h-5" />
              </div>
              <div className="hidden xl:block">
                <span className="font-extrabold text-sm text-white tracking-tight block">{t.brandTitle}</span>
                <span className="text-[10px] text-indigo-300 block">{t.brandSubtitle}</span>
              </div>
            </div>

            {/* دکمه بازگشت به داشبورد سامانه */}
            <button
              onClick={closeModelerToDashboard}
              className="px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              title={t.dashboardTooltip}
            >
              <ArrowRight className={`w-4 h-4 text-indigo-400 ${isEn ? 'rotate-180' : ''}`} />
              <span>{t.dashboardBtn}</span>
            </button>

            {/* اطلاعات فرآیند */}
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
                    title={canEditModel ? (isEn ? 'Click to edit title' : 'برای تغییر سریع عنوان کلیک کنید') : ''}
                  >
                    {isEn && activeDiagram.titleEn ? activeDiagram.titleEn : activeDiagram.title}
                  </h2>
                )}

                {/* دکمه ویرایش کامل مشخصات فرآیند */}
                {canEditModel && (
                  <button
                    onClick={() => setIsEditInfoOpen(true)}
                    className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    title={t.editInfoTooltip}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* وضعیت فرآیند */}
                {canReview ? (
                  <select
                    value={activeDiagram.status}
                    onChange={(e) => handleStatusChange(e.target.value as DiagramStatus)}
                    className="bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 rounded-lg px-2 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="draft">{t.statusDraft}</option>
                    <option value="in_review">{t.statusInReview}</option>
                    <option value="approved">{t.statusApproved}</option>
                    <option value="needs_revision">{t.statusNeedsRevision}</option>
                  </select>
                ) : (
                  getStatusBadge(activeDiagram.status)
                )}

                {/* شماره نسخه */}
                <span className="text-[11px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-md font-mono font-bold">
                  {t.version} {activeDiagram.latestVersion}.0
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
                    <span>{t.reviewer}</span>
                    <select
                      value={activeDiagram.reviewerId || ''}
                      onChange={(e) => handleReviewerChange(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-[11px] text-slate-200 rounded px-1.5 py-0.2 focus:outline-none"
                    >
                      <option value="">{t.unassigned}</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.jobTitle})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-indigo-300">
                    <UserCheck className="w-3 h-3" />
                    <span>{t.reviewer} {activeDiagram.reviewerName || t.unassigned}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* بخش اکشن‌های بوم و ابزارها */}
          <div className="flex items-center gap-2 justify-end flex-wrap">
            
            {/* کلیدهای Undo / Redo */}
            {onUndo && onRedo && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={onUndo}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  title={t.undoTooltip}
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onRedo}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                  title={t.redoTooltip}
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* کشوی نظرات */}
            <button
              onClick={onToggleCommentsDrawer}
              className="relative px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={t.commentsTooltip}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{t.commentsBtn}</span>
              {unresolvedCommentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                  {unresolvedCommentsCount}
                </span>
              )}
            </button>

            {/* کشوی تاریخچه نسخ */}
            <button
              onClick={onToggleHistoryDrawer}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title={t.historyTooltip}
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">{t.historyBtn}</span>
            </button>

            {/* منوی خروجی‌گیری و اشتراک */}
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title={t.exportTooltip}
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">{t.exportBtn}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isExportOpen && (
                <div className={`absolute ${isEn ? 'right-0' : 'left-0'} mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-1`}>
                  <button
                    onClick={() => { setIsShareModalOpen(true); setIsExportOpen(false); }}
                    className={`w-full ${isEn ? 'text-left' : 'text-right'} px-3 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-950/50 rounded-xl transition flex items-center gap-2 cursor-pointer border border-indigo-800/40`}
                  >
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span>{t.shareSettings}</span>
                  </button>
                  <button
                    onClick={() => { handleCopyLink(); setIsExportOpen(false); }}
                    className={`w-full ${isEn ? 'text-left' : 'text-right'} px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2 cursor-pointer`}
                  >
                    <Link2 className="w-4 h-4 text-indigo-400" />
                    <span>{copiedLink ? t.copiedLink : t.copyLink}</span>
                  </button>
                  {onExportBpmn && (
                    <button
                      onClick={() => { onExportBpmn(); setIsExportOpen(false); }}
                      className={`w-full ${isEn ? 'text-left' : 'text-right'} px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2 cursor-pointer`}
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>{t.exportBpmn}</span>
                    </button>
                  )}
                  {onExportSvg && (
                    <button
                      onClick={() => { onExportSvg(); setIsExportOpen(false); }}
                      className={`w-full ${isEn ? 'text-left' : 'text-right'} px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2 cursor-pointer`}
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>{t.exportSvg}</span>
                    </button>
                  )}
                  {onExportPng && (
                    <button
                      onClick={() => { onExportPng(); setIsExportOpen(false); }}
                      className={`w-full ${isEn ? 'text-left' : 'text-right'} px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-xl transition flex items-center gap-2 cursor-pointer`}
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>{t.exportPng}</span>
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
                <span>{t.saveVersionBtn}</span>
              </button>
            )}

            {/* سوئیچ زبان */}
            {setLang && (
              <button
                onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                title={isEn ? 'Switch Language' : 'تغییر زبان'}
              >
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'fa' ? 'EN' : 'FA'}</span>
              </button>
            )}

            {/* سوئیچ تم */}
            {setTheme && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                title={isEn ? 'Toggle Dark/Light Mode' : 'تغییر پوسته (روز / شب)'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
              </button>
            )}

            {/* اطلاعات کاربر */}
            {currentUser && (
              <div className={`flex items-center gap-2 ${isEn ? 'pl-2 border-l' : 'pr-2 border-r'} border-slate-800`}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
                  title={`${currentUser.name} (${currentUser.jobTitle || ''})`}
                />
              </div>
            )}

          </div>

        </div>
      </div>

      {/* مدال ویرایش کامل مشخصات فرآیند */}
      <EditDiagramModal
        isOpen={isEditInfoOpen}
        onClose={() => setIsEditInfoOpen(false)}
        diagram={activeDiagram}
      />

      {/* مدال ثبت نسخه جدید */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4" dir={isEn ? 'ltr' : 'rtl'}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {t.saveVersionTitle} (v{activeDiagram.latestVersion + 1}.0)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.saveVersionDesc}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSaveVersion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.changeSummaryLabel}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={t.changeSummaryPlaceholder}
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
                  {t.confirmSave}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* مدال اشتراک‌گذاری فرآیند */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        diagram={activeDiagram}
      />
    </>
  );
};
