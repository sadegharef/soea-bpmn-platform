/**
 * @file MoveModal.tsx
 * @description پنجره انتقال پوشه یا فرآیند به پوشه هدف دیگر در ساختار درختی
 * @architecture
 * - Single Responsibility Principle (SRP): انتخاب پوشه مقصد و به‌روزرسانی موقعیت آیتم
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Folder } from '../types';
import { MoveRight, Folder as FolderIcon, Layers, Check } from 'lucide-react';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'diagram' | 'folder';
  itemId: string;
  itemTitle: string;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemTitle,
}) => {
  const { folders, moveFolder, moveDiagram } = useWorkspace();
  const [selectedTargetFolderId, setSelectedTargetFolderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMove = () => {
    if (itemType === 'folder') {
      moveFolder(itemId, selectedTargetFolderId);
    } else {
      moveDiagram(itemId, selectedTargetFolderId);
    }
    onClose();
  };

  // Helper to render tree options
  const renderFolderOption = (folder: Folder, level: number = 0) => {
    // Avoid moving folder into itself
    if (itemType === 'folder' && folder.id === itemId) return null;

    const childFolders = folders.filter(f => f.parentId === folder.id);

    return (
      <React.Fragment key={folder.id}>
        <button
          type="button"
          onClick={() => setSelectedTargetFolderId(folder.id)}
          style={{ paddingRight: `${level * 16 + 12}px` }}
          className={`w-full text-right py-2 px-3 text-xs rounded-xl flex items-center justify-between border transition ${
            selectedTargetFolderId === folder.id
              ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderIcon className={`w-4 h-4 ${selectedTargetFolderId === folder.id ? 'text-white' : 'text-amber-500'}`} />
            <span>{folder.name}</span>
          </div>
          {selectedTargetFolderId === folder.id && <Check className="w-4 h-4" />}
        </button>

        {childFolders.map(child => renderFolderOption(child, level + 1))}
      </React.Fragment>
    );
  };

  const rootFolders = folders.filter(f => f.parentId === null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MoveRight className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm">انتقال {itemType === 'folder' ? 'پوشه' : 'دیاگرام'}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            مقصد جدید برای <strong>«{itemTitle}»</strong> را انتخاب کنید:
          </p>

          <div className="max-h-60 overflow-y-auto space-y-1.5 p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
            {/* Root Option */}
            <button
              type="button"
              onClick={() => setSelectedTargetFolderId(null)}
              className={`w-full text-right py-2 px-3 text-xs rounded-xl flex items-center justify-between border transition ${
                selectedTargetFolderId === null
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className={`w-4 h-4 ${selectedTargetFolderId === null ? 'text-white' : 'text-indigo-500'}`} />
                <span>پوشه اصلی تیم (ریشه)</span>
              </div>
              {selectedTargetFolderId === null && <Check className="w-4 h-4" />}
            </button>

            {/* Folder Tree Options */}
            {rootFolders.map(f => renderFolderOption(f, 0))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleMove}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              تایید انتقال
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-300 transition"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
