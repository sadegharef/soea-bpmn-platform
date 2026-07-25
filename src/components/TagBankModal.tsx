/**
 * @file TagBankModal.tsx
 * @description دیالوگ مدیریت بانک برچسب‌ها (تگ‌ها)، تعریف تگ جدید با رنگ دلخواه، ویرایش رنگ تگ‌ها و حذف تگ
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TagBadge, TAG_COLOR_PRESETS } from '../utils/tagUtils';
import { Tag, Plus, Trash2, Edit2, Check, X, Palette, Search } from 'lucide-react';

interface TagBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTag?: (tagName: string) => void;
}

export const TagBankModal: React.FC<TagBankModalProps> = ({ isOpen, onClose, onSelectTag }) => {
  const { tagBank, addTagToBank, updateTagInBank, deleteTagFromBank } = useWorkspace();

  // Form states
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  if (!isOpen) return null;

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    addTagToBank(newTagName, selectedColor);
    if (onSelectTag) {
      onSelectTag(newTagName.trim());
    }
    setNewTagName('');
  };

  const handleStartEdit = (id: string, currentName: string, currentColor: string) => {
    setEditingTagId(id);
    setEditName(currentName);
    setEditColor(currentColor);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateTagInBank(id, editName, editColor);
    setEditingTagId(null);
  };

  const filteredTags = tagBank.filter(t => 
    t.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">بانک تگ‌ها و برچسب‌های فرآیند</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ایجاد تگ‌های اختصاصی، تنظیم رنگ‌بندی دلخواه و دسته‌بندی هوشمند</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Create New Tag Section */}
          <form onSubmit={handleCreateTag} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>افزودن برچسب جدید به بانک</span>
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="عنوان برچسب (مثلاً: مالی، اولویت بالا، ایزو ۹۰۰۱)"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت تگ جدید</span>
              </button>
            </div>

            {/* Color Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" />
                  انتخاب رنگ اختصاصی برچسب:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">کد هگز:</span>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 cursor-pointer p-0 bg-transparent"
                    title="انتخاب رنگ سفارشی"
                  />
                  <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {selectedColor}
                  </span>
                </div>
              </div>

              {/* Preset Color Palette Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {TAG_COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 flex items-center justify-center cursor-pointer shadow-sm relative ${
                      selectedColor.toLowerCase() === preset.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900 scale-105'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    {selectedColor.toLowerCase() === preset.hex.toLowerCase() && (
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* List of Existing Tags */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                برچسب‌های موجود در بانک ({filteredTags.length})
              </h4>

              {/* Search Bar */}
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی تگ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-8 pl-3 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {filteredTags.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                برچسبی یافت نشد. می‌توانید با فرم بالا برچسب جدید بسازید.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredTags.map((item) => {
                  const isEditing = editingTagId === item.id;

                  if (isEditing) {
                    return (
                      <div
                        key={item.id}
                        className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-300 dark:border-indigo-800 rounded-xl space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                          <input
                            type="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingTagId(null)}
                            className="px-2 py-1 text-[10px] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                          >
                            انصراف
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            className="px-2.5 py-1 text-[10px] bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            ذخیره
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-xl flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-600 transition"
                    >
                      <div className="flex items-center gap-2">
                        <TagBadge
                          tag={item.name}
                          color={item.color}
                          size="md"
                          onClick={() => {
                            if (onSelectTag) {
                              onSelectTag(item.name);
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item.id, item.name, item.color)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                          title="ویرایش نام یا رنگ تگ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTagFromBank(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                          title="حذف تگ از بانک"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            با کلیک روی هر برچسب، آن برچسب به فرآیند انتخاب‌شده اضافه خواهد شد.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
