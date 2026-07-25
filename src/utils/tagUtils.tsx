import React from 'react';
import { TagItem } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';

export interface TagStyle {
  bgStyle?: React.CSSProperties;
  borderStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  dotStyle?: React.CSSProperties;
  className?: string;
  dotClassName?: string;
}

export const TAG_COLOR_PRESETS = [
  { label: 'قرمز (ضروری/بحرانی)', hex: '#ef4444' },
  { label: 'رز (ارغوانی/فوری)', hex: '#f43f5e' },
  { label: 'نارنجی (اولویت متوسط)', hex: '#f97316' },
  { label: 'زرد (هشدار/بازبینی)', hex: '#f59e0b' },
  { label: 'سبز (عادی/تایید)', hex: '#10b981' },
  { label: 'فیروزه‌ای (To-Be)', hex: '#06b6d4' },
  { label: 'آبی آسمانی (خزانه)', hex: '#0284c7' },
  { label: 'آبی (مالی و فروش)', hex: '#3b82f6' },
  { label: 'نیلی (فرآیند اصلی)', hex: '#6366f1' },
  { label: 'بنفش (منابع انسانی)', hex: '#a855f7' },
  { label: 'صورتی (جذب و پرسنلی)', hex: '#ec4899' },
  { label: 'خاکستری (As-Is/عمومی)', hex: '#64748b' },
];

/**
 * دریافت رنگ برچسب از بانک تگ‌ها یا رنگ‌های پیش‌فرض
 */
export function getTagHexColor(tag: string, tagBank?: TagItem[]): string {
  const cleanTag = tag.trim().toLowerCase();
  
  if (tagBank && tagBank.length > 0) {
    const match = tagBank.find(t => t.name.trim().toLowerCase() === cleanTag);
    if (match) return match.color;
  }

  // الگوهای هوشمند پیش‌فرض در صورت عدم یافتن در بانک
  if (cleanTag.includes('اولویت بالا') || cleanTag.includes('ضروری') || cleanTag.includes('بحرانی') || cleanTag.includes('قرمز') || cleanTag.includes('high')) {
    return '#ef4444';
  }
  if (cleanTag.includes('متوسط') || cleanTag.includes('زرد') || cleanTag.includes('نارنجی') || cleanTag.includes('medium')) {
    return '#f59e0b';
  }
  if (cleanTag.includes('پایین') || cleanTag.includes('سبز') || cleanTag.includes('عادی') || cleanTag.includes('low')) {
    return '#10b981';
  }
  if (cleanTag.includes('مالی') || cleanTag.includes('حسابداری') || cleanTag.includes('آبی') || cleanTag.includes('finance')) {
    return '#3b82f6';
  }
  if (cleanTag.includes('منابع انسانی') || cleanTag.includes('بنفش') || cleanTag.includes('hr')) {
    return '#a855f7';
  }

  // تولید یک کد رنگ یکنواخت بر اساس هش رشته برای تگ‌های ناشناخته
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % TAG_COLOR_PRESETS.length;
  return TAG_COLOR_PRESETS[colorIndex].hex;
}

interface TagBadgeProps {
  tag: string;
  color?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  onRemove?: () => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, color, size = 'sm', onClick, onRemove }) => {
  let tagBank: TagItem[] = [];
  try {
    const context = useWorkspace();
    tagBank = context.tagBank || [];
  } catch (e) {
    // خارج از Provider استفاده شده باشد
  }

  const hexColor = color || getTagHexColor(tag, tagBank);

  return (
    <span
      onClick={onClick}
      style={{
        backgroundColor: `${hexColor}18`, // 10% opacity
        color: hexColor,
        borderColor: `${hexColor}40`, // 25% opacity
      }}
      className={`inline-flex items-center gap-1.5 border rounded-lg transition font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${onClick ? 'cursor-pointer hover:opacity-85' : ''}`}
    >
      <span
        style={{ backgroundColor: hexColor }}
        className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm"
      />
      <span>#{tag}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 opacity-60 hover:opacity-100 transition cursor-pointer text-xs font-bold"
          title="حذف برچسب"
        >
          ×
        </button>
      )}
    </span>
  );
};

