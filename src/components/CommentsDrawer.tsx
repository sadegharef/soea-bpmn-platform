/**
 * @file CommentsDrawer.tsx
 * @description کشوی جانبی ثبت و ارزیابی نظرات کلی و فرآیندی (Process-Level General Comments)
 * @architecture
 * - Single Responsibility Principle (SRP): تفکیک نظرات کلی فرآیندی از کامنت‌های روی عناصر بوم
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { MessageSquare, Send, CheckCircle2, X, Info } from 'lucide-react';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({ isOpen, onClose }) => {
  const { activeDiagram, addCommentToDiagram, resolveComment, currentRole } = useWorkspace();
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !activeDiagram) return null;

  const comments = activeDiagram.comments || [];
  const canComment = currentRole === 'manager' || currentRole === 'editor' || currentRole === 'reviewer';

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToDiagram(activeDiagram.id, commentText.trim());
    setCommentText('');
  };

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
        id="comments-drawer-panel"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">نظرات و ارزیابی کلی فرآیند</h3>
              <p className="text-[11px] text-slate-400 font-mono">{comments.length} نظر ثبت شده</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="بستن پنل نظرات"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner for Reviewers */}
        <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-[11px] text-indigo-900 dark:text-indigo-200">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>راهنمای بازبینان:</strong> نظرات ثبت‌شده در این پنل مربوط به <strong>ارزیابی کلی فرآیند</strong> است. برای یادداشت‌های نقطه به نقطه روی المان‌های خاص، می‌توانید مستقیم روی عناصر بوم کامنت بگذارید.
          </p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          {comments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-bold text-xs text-slate-700 dark:text-slate-300">هنوز نظر کلی ثبت نشده است</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                بازبینی‌کنندگان و اعضای تیم می‌توانند ملاحظات، استثنائات فرآیندی و پیشنهادات ارزیابی کلی خود را در این بخش ارسال کنند.
              </p>
            </div>
          ) : (
            comments.map(c => (
              <div 
                key={c.id} 
                className={`p-3.5 rounded-2xl border transition shadow-xs ${
                  c.status === 'resolved' 
                    ? 'bg-slate-100/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70' 
                    : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-indigo-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{c.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3 pr-1">
                  {c.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  {c.status === 'resolved' ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> برطرف شده
                    </span>
                  ) : (
                    canComment && (
                      <button
                        onClick={() => resolveComment(activeDiagram.id, c.id)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>علامت‌گذاری به عنوان برطرف شده</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        {canComment ? (
          <form onSubmit={handleSendComment} className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="ثبت نظر کلی، استثنای فرآیندی یا ملاحظه ارزیابی..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shrink-0 shadow-md shadow-indigo-600/20 cursor-pointer"
                title="ارسال نظر کلی"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            شما با دسترسی فقط مشاهده وارد شده‌اید و امکان ثبت نظر ندارید.
          </div>
        )}
      </div>
    </>
  );
};
