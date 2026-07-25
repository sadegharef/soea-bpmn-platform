/**
 * @file FolderTree.tsx
 * @description کامپوننت نمایش درختی پوشه‌های چندسطحی همراه با امکان ایجاد، تغییر نام، حذف و انتقال پوشه‌ها
 * @architecture
 * - Single Responsibility Principle (SRP): ارائه درخت ساختار پوشه‌ها و ارسال اکشن‌ها به WorkspaceContext
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Folder } from '../types';
import { 
  Folder as FolderIcon, 
  FolderOpen, 
  FolderPlus, 
  ChevronDown, 
  ChevronLeft, 
  Edit2, 
  Trash2, 
  MoveRight, 
  Layers, 
  Plus, 
  Check, 
  X 
} from 'lucide-react';

interface FolderTreeProps {
  onOpenMoveModal?: (type: 'diagram' | 'folder', id: string, title: string) => void;
}

export const FolderTree: React.FC<FolderTreeProps> = ({ onOpenMoveModal }) => {
  const { 
    folders, 
    diagrams, 
    selectedFolderId, 
    setSelectedFolderId, 
    createFolder, 
    renameFolder, 
    deleteFolder, 
    currentRole 
  } = useWorkspace();

  const [expandedFolderIds, setExpandedFolderIds] = useState<Record<string, boolean>>({
    'f1': true,
    'f1_1': true,
    'f2': true
  });

  // State for creating new inline subfolder
  const [creatingSubfolderParentId, setCreatingSubfolderParentId] = useState<string | null | 'ROOT_NEW'>(null);
  const [newFolderName, setNewFolderName] = useState('');

  // State for inline folder renaming
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const isEditorOrManager = currentRole === 'manager' || currentRole === 'editor';

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleStartCreateSubfolder = (parentId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingSubfolderParentId(parentId === null ? 'ROOT_NEW' : parentId);
    setNewFolderName('');
    if (parentId) {
      setExpandedFolderIds(prev => ({ ...prev, [parentId]: true }));
    }
  };

  const handleSaveNewSubfolder = (parentId: string | null) => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), parentId);
    }
    setCreatingSubfolderParentId(null);
    setNewFolderName('');
  };

  const handleStartRename = (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleSaveRename = (folderId: string) => {
    if (editingFolderName.trim()) {
      renameFolder(folderId, editingFolderName.trim());
    }
    setEditingFolderId(null);
  };

  const getDiagramCountForFolder = (folderId: string): number => {
    return diagrams.filter(d => d.folderId === folderId).length;
  };

  // Helper to render tree nodes recursively
  const renderFolderNode = (folder: Folder, level: number = 0) => {
    const isExpanded = !!expandedFolderIds[folder.id];
    const isSelected = selectedFolderId === folder.id;
    const childFolders = folders.filter(f => f.parentId === folder.id);
    const hasChildren = childFolders.length > 0;
    const diagramCount = getDiagramCountForFolder(folder.id);

    return (
      <div key={folder.id} className="select-none">
        <div
          onClick={() => setSelectedFolderId(folder.id)}
          style={{ paddingRight: `${level * 16 + 8}px` }}
          className={`group flex items-center justify-between py-1.5 px-2 rounded-xl text-xs cursor-pointer transition ${
            isSelected
              ? 'bg-indigo-600 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className={`p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 inline-block"></span>
            )}

            {isExpanded ? (
              <FolderOpen className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
            ) : (
              <FolderIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
            )}

            {editingFolderId === folder.id ? (
              <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(folder.id)}
                  autoFocus
                  className="w-full px-1.5 py-0.5 text-xs rounded border border-indigo-400 bg-white text-slate-900 focus:outline-none"
                />
                <button onClick={() => handleSaveRename(folder.id)} className="p-0.5 hover:text-emerald-500">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingFolderId(null)} className="p-0.5 hover:text-rose-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="truncate flex-1">{folder.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
              isSelected ? 'bg-indigo-700/60 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {diagramCount}
            </span>

            {isEditorOrManager && editingFolderId !== folder.id && (
              <div className="hidden group-hover:flex items-center gap-0.5">
                <button
                  onClick={(e) => handleStartCreateSubfolder(folder.id, e)}
                  title="افزودن زیرفولدر"
                  className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                
                <button
                  onClick={(e) => handleStartRename(folder, e)}
                  title="تغییر نام"
                  className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <Edit2 className="w-3 h-3" />
                </button>

                {onOpenMoveModal && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenMoveModal('folder', folder.id, folder.name); }}
                    title="انتقال پوشه"
                    className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    <MoveRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                  title="حذف پوشه"
                  className={`p-1 rounded hover:bg-rose-500 hover:text-white ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input form when creating subfolder under this node */}
        {creatingSubfolderParentId === folder.id && (
          <div 
            style={{ paddingRight: `${(level + 1) * 16 + 8}px` }}
            className="flex items-center gap-1.5 py-1 px-2 my-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <FolderPlus className="w-4 h-4 text-indigo-500 shrink-0" />
            <input
              type="text"
              placeholder="نام پوشه جدید..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNewSubfolder(folder.id)}
              autoFocus
              className="w-full px-2 py-0.5 text-xs rounded border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => handleSaveNewSubfolder(folder.id)}
              className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setCreatingSubfolderParentId(null)}
              className="p-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Render child folders */}
        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {childFolders.map(child => renderFolderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(f => f.parentId === null);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
      {/* Tree Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">ساختار درختی پروژه و پوشه‌ها</span>
        </div>
        {isEditorOrManager && (
          <button
            onClick={(e) => handleStartCreateSubfolder(null, e)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-2 py-1 rounded-lg transition"
            title="ایجاد پروژه / پوشه اصلی"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>پوشه اصلی</span>
          </button>
        )}
      </div>

      {/* Root node: All Diagrams */}
      <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <div
          onClick={() => setSelectedFolderId(null)}
          className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-xs cursor-pointer transition ${
            selectedFolderId === null
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className={`w-4 h-4 ${selectedFolderId === null ? 'text-white' : 'text-indigo-500'}`} />
            <span>همه دیاگرام‌ها (ریشه)</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
            selectedFolderId === null ? 'bg-indigo-700/60 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            {diagrams.length}
          </span>
        </div>

        {/* Form to add root folder */}
        {creatingSubfolderParentId === 'ROOT_NEW' && (
          <div className="flex items-center gap-1.5 py-1 px-2 my-1" onClick={(e) => e.stopPropagation()}>
            <FolderPlus className="w-4 h-4 text-indigo-500 shrink-0" />
            <input
              type="text"
              placeholder="نام پروژه / پوشه اصلی جدید..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNewSubfolder(null)}
              autoFocus
              className="w-full px-2 py-0.5 text-xs rounded border border-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={() => handleSaveNewSubfolder(null)}
              className="p-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setCreatingSubfolderParentId(null)}
              className="p-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Tree Nodes */}
        <div className="mt-1 space-y-0.5">
          {rootFolders.map(folder => renderFolderNode(folder, 0))}
        </div>
      </div>
    </div>
  );
};
