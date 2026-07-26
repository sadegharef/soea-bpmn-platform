/**
 * @file VersionHistoryDrawer.tsx
 * @description کشوی جانبی مرور تاریخچه نسخه‌های ذخیره‌شده، مقایسه بصری نسخه‌ها (Diff Diagram) و بازگردانی نسخه‌های قبلی فرآیند
 * @architecture
 * - Single Responsibility Principle (SRP): نمایش لیست نسخ، کنترل مقایسه (Diff) و بازیابی نسخه دلخواه
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { History, RotateCcw, Clock, User, X, SplitSquareHorizontal, CheckCircle2 } from 'lucide-react';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersionXml: (xml: string, versionNumber: number) => void;
  onCompareVersions?: (oldXml: string, newXml: string) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onRestoreVersionXml,
  onCompareVersions
}) => {
  const { activeDiagram, currentRole } = useWorkspace();
  const [selectedForCompare, setSelectedForCompare] = useState<string | null>(null);

  if (!isOpen || !activeDiagram) return null;

  const isEditorOrManager = currentRole === 'manager' || currentRole === 'editor';
  const latestVersionObj = activeDiagram.versions.find(v => v.version === activeDiagram.latestVersion) || activeDiagram.versions[0];

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[9998] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel on Top (z-[9999]) */}
      <div 
        className="fixed inset-y-0 left-0 z-[9999] w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300"
        dir="rtl"
        id="version-history-drawer-panel"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">تاریخچه نسخه‌ها و مقایسه (Diff)</h3>
              <p className="text-[11px] text-slate-400 font-mono">آخرین نسخه فعال: v{activeDiagram.latestVersion}.0</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="بستن تاریخچه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
            نسخه‌های ثبت‌شده برای فرآیند <strong>{activeDiagram.title}</strong>:
          </p>

          {activeDiagram.versions.map((v) => {
            const isLatest = v.version === activeDiagram.latestVersion;

            return (
              <div
                key={v.version}
                className={`p-3.5 rounded-2xl border transition shadow-xs space-y-3 ${
                  isLatest
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg font-mono ${
                      isLatest ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      نسخه {v.version}.0
                    </span>
                    {isLatest && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        نسخه فعال
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Diff button */}
                    {onCompareVersions && !isLatest && latestVersionObj && (
                      <button
                        type="button"
                        onClick={() => {
                          onCompareVersions(v.xml, activeDiagram.xml || latestVersionObj.xml);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/60 px-2 py-1 rounded-lg transition cursor-pointer"
                        title="مقایسه بصری تغییرات این نسخه با نسخه فعلی"
                      >
                        <SplitSquareHorizontal className="w-3.5 h-3.5" />
                        <span>مقایسه (Diff)</span>
                      </button>
                    )}

                    {/* Restore / Load button */}
                    {!isLatest && (
                      <button
                        type="button"
                        onClick={() => {
                          onRestoreVersionXml(v.xml, v.version);
                          onClose();
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-800/40 transition cursor-pointer"
                        title={`بارگذاری نسخه ${v.version}.0 روی بوم جهت مشاهده و ویرایش (بدون ایجاد نسخه جدید)`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>بارگذاری روی بوم</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {v.changeSummary || 'ویرایش و به‌روزرسانی دیاگرام'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.editorName}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.timestamp}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
