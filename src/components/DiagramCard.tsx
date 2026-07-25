/**
 * @file DiagramCard.tsx
 * @description کارت نمایش خلاصه اطلاعات فرآیند در شبکه یا لیست داشبورد همراه با کنترل‌های عملیاتی
 * @architecture
 * - Single Responsibility Principle (SRP): نمایش کامپوننت کارت فرآیند و فراخوانی اکشن‌های مرتبط با آن
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Diagram, DiagramStatus } from '../types';
import { 
  Workflow, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Folder as FolderIcon, 
  Tag, 
  MoreVertical, 
  ExternalLink, 
  MoveRight, 
  Trash2, 
  UserCheck, 
  ShieldAlert 
} from 'lucide-react';

interface DiagramCardProps {
  diagram: Diagram;
  viewMode: 'grid' | 'list';
  onMoveClick: (diagram: Diagram) => void;
}

export const DiagramCard: React.FC<DiagramCardProps> = ({ diagram, viewMode, onMoveClick }) => {
  const { 
    folders, 
    users, 
    openModelerForDiagram, 
    updateDiagram, 
    deleteDiagram, 
    currentRole 
  } = useWorkspace();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isManagerOrEditor = currentRole === 'manager' || currentRole === 'editor';

  // Find parent folder path
  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return 'پوشه اصلی ریشه';
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return 'پوشه اصلی ریشه';
    if (folder.parentId) {
      return `${getFolderPath(folder.parentId)} / ${folder.name}`;
    }
    return folder.name;
  };

  const folderPathStr = getFolderPath(diagram.folderId);

  // Status Badge UI
  const getStatusBadge = (status: DiagramStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تایید شده
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            در حال بازبینی
          </span>
        );
      case 'needs_revision':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            نیازمند اصلاح
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            پیش‌نویس
          </span>
        );
    }
  };

  const reviewerUser = users.find(u => u.id === diagram.reviewerId);

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Workflow className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 
                onClick={() => openModelerForDiagram(diagram.id)}
                className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition truncate"
              >
                {diagram.title}
              </h4>
              {diagram.titleEn && <span className="text-xs text-slate-400 dir-ltr font-mono">({diagram.titleEn})</span>}
              {getStatusBadge(diagram.status)}
              <span className="text-[11px] bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg font-mono">
                نسخه {diagram.latestVersion}.0
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{diagram.description || 'بدون توضیحات'}</p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 flex-wrap pt-1">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <FolderIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>{folderPathStr}</span>
              </span>

              {/* Reviewer */}
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-300 font-medium bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                <UserCheck className="w-3.5 h-3.5" />
                <span>مسئول بازبینی: {diagram.reviewerName || 'تعیین‌نشده'}</span>
              </span>

              {/* Tags */}
              {diagram.tags && diagram.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {diagram.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Contributors & Actions */}
        <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800 justify-between md:justify-end">
          {/* Contributors */}
          <div className="flex items-center gap-1.5" title="مشارکت‌کنندگان">
            <span className="text-[10px] text-slate-400 ml-1">مشارکت:</span>
            <div className="flex -space-x-1.5 space-x-reverse">
              {diagram.contributors?.map((c, i) => (
                <img
                  key={i}
                  src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                  alt={c.name}
                  title={`${c.name} - ${c.action || 'مشارکت'}`}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                />
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModelerForDiagram(diagram.id)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ویرایش‌گر</span>
            </button>

            {isManagerOrEditor && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-20 text-xs">
                    <button
                      onClick={() => { setIsMenuOpen(false); onMoveClick(diagram); }}
                      className="w-full text-right px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                      <span>انتقال به پوشه</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        deleteDiagram(diagram.id);
                      }}
                      className="w-full text-right px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف دیاگرام</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group">
      
      {/* Top Banner & Folder Breadcrumb */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <FolderIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{folderPathStr}</span>
        </div>
        {getStatusBadge(diagram.status)}
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3 flex-1">
        <div>
          <h4 
            onClick={() => openModelerForDiagram(diagram.id)}
            className="font-bold text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition line-clamp-1"
          >
            {diagram.title}
          </h4>
          {diagram.titleEn && <p className="text-xs text-slate-400 dir-ltr font-mono mt-0.5">{diagram.titleEn}</p>}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[32px]">
          {diagram.description || 'بدون توضیحات اضافی برای این فرآیند.'}
        </p>

        {/* Assigned Reviewer */}
        <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">مسئول بازبینی:</span>
          <div className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
            {reviewerUser && (
              <img src={reviewerUser.avatar} alt={reviewerUser.name} className="w-5 h-5 rounded-full object-cover" />
            )}
            <span>{diagram.reviewerName || 'تعیین‌نشده'}</span>
          </div>
        </div>

        {/* Tags */}
        {diagram.tags && diagram.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {diagram.tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        {/* Contributors Avatars */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2 space-x-reverse">
            {diagram.contributors?.map((c, i) => (
              <img
                key={i}
                src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                alt={c.name}
                title={`${c.name} - ${c.action || 'مشارکت'}`}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-2xs"
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400">مشارکت‌کنندگان</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModelerForDiagram(diagram.id)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>ورود به مدلساز</span>
          </button>

          {isManagerOrEditor && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-20 text-xs">
                  <button
                    onClick={() => { setIsMenuOpen(false); onMoveClick(diagram); }}
                    className="w-full text-right px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <MoveRight className="w-3.5 h-3.5" />
                    <span>انتقال به پوشه</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      deleteDiagram(diagram.id);
                    }}
                    className="w-full text-right px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف دیاگرام</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
