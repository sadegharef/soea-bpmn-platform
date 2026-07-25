/**
 * @file CreateDiagramModal.tsx
 * @description دیالوگ ساخت فرآیند جدید همراه با عنوان، برچسب‌ها، تعیین پوشه مقصد و تخصیص ممیز
 * @architecture
 * - Single Responsibility Principle (SRP): دریافت اطلاعات اولیه دیاگرام و فراخوانی متد ایجاد در فضای کاری
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Folder } from '../types';
import { PlusCircle, Tag, UserCheck, Folder as FolderIcon, Sparkles } from 'lucide-react';

interface CreateDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDiagramModal: React.FC<CreateDiagramModalProps> = ({ isOpen, onClose }) => {
  const { 
    folders, 
    users, 
    selectedFolderId, 
    createDiagram, 
    openModelerForDiagram 
  } = useWorkspace();

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<string | null>(selectedFolderId);
  const [tagsInput, setTagsInput] = useState('');
  const [reviewerId, setReviewerId] = useState<string>(users[1]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const created = createDiagram({
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      description: description.trim() || undefined,
      folderId,
      tags: tagsArr.length > 0 ? tagsArr : ['فرآیند جدید'],
      reviewerId: reviewerId || undefined,
    });

    setTitle('');
    setTitleEn('');
    setDescription('');
    setTagsInput('');
    onClose();

    // Directly navigate into the modeler with the new diagram
    openModelerForDiagram(created.id);
  };

  // Helper for folder select options
  const renderFolderOption = (folder: Folder, level: number = 0) => {
    const childFolders = folders.filter(f => f.parentId === folder.id);
    return (
      <React.Fragment key={folder.id}>
        <option value={folder.id}>
          {'—'.repeat(level)} {folder.name}
        </option>
        {childFolders.map(child => renderFolderOption(child, level + 1))}
      </React.Fragment>
    );
  };

  const rootFolders = folders.filter(f => f.parentId === null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">ایجاد مدل فرآیندی جدید (BPMN 2.0)</h3>
              <p className="text-xs text-slate-400">ثبت عنوان، تعیین مسئول بازبینی و پوشه‌بندی</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان دیاگرام فرآیندی <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مانند: فرآیند ارزیابی و تایید اعتبارات اسنادی"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان انگلیسی (English Title)
            </label>
            <input
              type="text"
              placeholder="e.g., Letter of Credit Evaluation Process"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                محل قرارگیری در ساختار پوشه‌ها
              </label>
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value ? e.target.value : null)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">پوشه اصلی (ریشه)</option>
                {rootFolders.map(f => renderFolderOption(f, 0))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                مسئول ارزیابی و بازبینی
              </label>
              <select
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.jobTitle || u.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              تگ‌ها و برچسب‌های کلیدی (جداشده با کاما)
            </label>
            <input
              type="text"
              placeholder="As-Is, مالی, اولویت بالا"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              توضیحات و هدف فرآیند
            </label>
            <textarea
              rows={3}
              placeholder="تشریح فرآیند، ذینفعان اصلی، خروجی‌های انتظار می‌رود..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ایجاد و ورود به محیط مدلسازی
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-xl hover:bg-slate-300 transition"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
