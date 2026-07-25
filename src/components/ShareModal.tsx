/**
 * @file ShareModal.tsx
 * @description پنجره اشتراک‌گذاری فرآیند مشابه گوگل ورک‌اسپیس (Google Workspace Share Modal) با تعیین سطح دسترسی (Viewer, Commenter, Editor)
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Diagram } from '../types';
import { 
  Share2, 
  Globe, 
  Copy, 
  Check, 
  Eye, 
  MessageSquare, 
  Edit3, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  X,
  Users
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagram: Diagram | null;
}

export type ShareAccessLevel = 'viewer' | 'commenter' | 'editor';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, diagram }) => {
  const { activeTeam, users, currentRole } = useWorkspace();
  const [accessLevel, setAccessLevel] = useState<ShareAccessLevel>('viewer');
  const [copied, setCopied] = useState(false);
  const [isGeneralAccessPublic, setIsGeneralAccessPublic] = useState(true);

  if (!isOpen || !diagram) return null;

  const shareUrl = `${window.location.origin}/#share-${diagram.id}?access=${accessLevel}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getAccessLabel = (level: ShareAccessLevel) => {
    switch (level) {
      case 'viewer':
        return 'فقط مشاهده (Viewer)';
      case 'commenter':
        return 'مشاهده و ثبت نظر (Commenter / Reviewer)';
      case 'editor':
        return 'دسترسی ویرایش کامل (Editor)';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">اشتراک‌گذاری فرآیند</h3>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[280px]">
                {diagram.title}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto max-h-[80vh]">

          {/* Section 1: Team Members & Access */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>اعضای تیم ({activeTeam.name})</span>
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-md border border-indigo-500/20">
                تیم فعال
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
              {activeTeam.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={member.user.avatar} 
                      alt={member.user.name} 
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{member.user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{member.user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {member.role === 'manager' && 'مدیر تیم'}
                    {member.role === 'editor' && 'ویرایشگر'}
                    {member.role === 'reviewer' && 'بازبین'}
                    {member.role === 'viewer' && 'مشاهده‌کننده'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section 2: General Access (Google Workspace Style) */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>دسترسی عمومی از طریق لینک (General Access)</span>
            </span>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">هر کسی با داشتن لینک</p>
                    <p className="text-[11px] text-slate-400">امکان دسترسی به این فرآیند بر اساس سطح انتخاب شده را دارد</p>
                  </div>
                </div>

                {/* Access Selector Dropdown */}
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as ShareAccessLevel)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="viewer">👁️ فقط مشاهده (Viewer)</option>
                  <option value="commenter">💬 مشاهده و ثبت نظر (Commenter)</option>
                  <option value="editor">✏️ دسترسی ویرایش کامل (Editor)</option>
                </select>
              </div>

              {/* Description Box according to chosen level */}
              <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                {accessLevel === 'viewer' && (
                  <>
                    <Eye className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>کاربران دارای لینک فقط می‌توانند فرآیند را مشاهده و روی عناصر زوم/پیمایش کنند. امکان ویرایش یا ثبت نظر وجود ندارد.</span>
                  </>
                )}
                {accessLevel === 'commenter' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>کاربران می‌توانند فرآیند را مشاهده کرده و در پنل ارزیابی، نظرات و بازخوردهای خود را ثبت کنند. بوم غیرقابل ویرایش است.</span>
                  </>
                )}
                {accessLevel === 'editor' && (
                  <>
                    <Edit3 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>کاربران دارای لینک می‌توانند عناصر بوم BPMN را ویرایش کرده، تغییرات را ذخیره و نسخه‌های جدید منتشر نمایند.</span>
                  </>
                )}
              </div>
            </div>

            {/* Generated Link Input & Copy Button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 dir-ltr select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>کپی لینک اشتراک</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            تایید و بستن
          </button>
        </div>

      </div>
    </div>
  );
};
