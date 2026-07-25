/**
 * @file EditDiagramModal.tsx
 * @description پنجره ویرایش و بروزرسانی اطلاعات کامل فرآیند (عنوان، توضیحات، تگ‌ها، وضعیت، ممیز و پوشه)
 */

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Diagram, DiagramStatus, Folder } from '../types';
import { Edit3, Tag, UserCheck, Folder as FolderIcon, Save, Settings2 } from 'lucide-react';
import { TagBadge } from '../utils/tagUtils';
import { TagBankModal } from './TagBankModal';

interface EditDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: Diagram | null;
}

export const EditDiagramModal: React.FC<EditDiagramModalProps> = ({ isOpen, onClose, diagram }) => {
  const { folders, users, updateDiagram, tagBank } = useWorkspace();

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<DiagramStatus>('draft');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [reviewerId, setReviewerId] = useState<string>('');
  const [isTagBankOpen, setIsTagBankOpen] = useState(false);

  useEffect(() => {
    if (diagram) {
      setTitle(diagram.title || '');
      setTitleEn(diagram.titleEn || '');
      setDescription(diagram.description || '');
      setStatus(diagram.status || 'draft');
      setFolderId(diagram.folderId || null);
      setTagsInput(diagram.tags ? diagram.tags.join(', ') : '');
      setReviewerId(diagram.reviewerId || '');
    }
  }, [diagram, isOpen]);

  if (!isOpen || !diagram) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const selectedUser = users.find(u => u.id === reviewerId);

    updateDiagram(diagram.id, {
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      description: description.trim() || undefined,
      status,
      folderId,
      tags: tagsArr,
      reviewerId: reviewerId || null,
      reviewerName: selectedUser ? selectedUser.name : undefined,
    });

    onClose();
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ویرایش مشخصات فرآیند</h3>
              <p className="text-xs text-slate-400">بروزرسانی عنوان، تگ‌ها، وضعیت و مسئول بازبینی</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان فارسی فرآیند <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان انگلیسی (English Title)
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                وضعیت فرآیند
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DiagramStatus)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">پیش‌نویس</option>
                <option value="in_review">در حال بازبینی</option>
                <option value="approved">تایید شده</option>
                <option value="needs_revision">نیازمند اصلاح</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                پوشه قرارگیری
              </label>
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value ? e.target.value : null)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">پوشه اصلی (ریشه)</option>
                {rootFolders.map(f => renderFolderOption(f, 0))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              مسئول ارزیابی و بازبینی
            </label>
            <select
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">تعیین‌نشده</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.jobTitle || u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                برچسب‌ها و تگ‌ها (از بانک تگ‌ها)
              </label>
              <button
                type="button"
                onClick={() => setIsTagBankOpen(true)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>مدیریت بانک تگ‌ها</span>
              </button>
            </div>

            <input
              type="text"
              placeholder="تگ‌ها را با کاما جدا کنید..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Quick add tag chips with colors from Tag Bank */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2 max-h-24 overflow-y-auto">
              <span className="text-[10px] text-slate-400 shrink-0">انتخاب از بانک تگ‌ها:</span>
              {tagBank.map((item) => {
                const currentList = tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
                const isSelected = currentList.some(t => t.toLowerCase() === item.name.toLowerCase());

                return (
                  <TagBadge
                    key={item.id}
                    tag={item.name}
                    color={item.color}
                    size="sm"
                    onClick={() => {
                      if (isSelected) {
                        const updated = currentList.filter(t => t.toLowerCase() !== item.name.toLowerCase());
                        setTagsInput(updated.join(', '));
                      } else {
                        setTagsInput([...currentList, item.name].join(', '));
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              توضیحات و شرح فرآیند
            </label>
            <textarea
              rows={3}
              placeholder="هدف فرآیند، ذینفعان و ورودی/خروجی‌ها..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              ذخیره تغییرات فرآیند
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>

        <TagBankModal
          isOpen={isTagBankOpen}
          onClose={() => setIsTagBankOpen(false)}
          onSelectTag={(tagName) => {
            const currentList = tagsInput.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
            if (!currentList.some(t => t.toLowerCase() === tagName.toLowerCase())) {
              setTagsInput([...currentList, tagName].join(', '));
            }
          }}
        />
      </div>
    </div>
  );
};
