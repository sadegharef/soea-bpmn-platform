/**
 * @file types.ts
 * @description تعاریف تایپ‌ها و اینترفیس‌های اصلی سیستم مدلسازی و مدیریت فرآیندهای کسب و کار (BpmnCraft/هم‌نگار)
 * @architecture Single Responsibility Principle (SRP) - متمرکزیابی کلیه مدل‌های داده‌ای
 */

/**
 * سطح دسترسی و نقش کاربر در تیم (RBAC)
 */
export type TeamRole = 'manager' | 'editor' | 'reviewer' | 'viewer';

/**
 * وضعیت چرخه حیات فرآیند در سازمان
 */
export type DiagramStatus = 'draft' | 'in_review' | 'approved' | 'needs_revision';

/**
 * اینترفیس کاربر سیستم
 */
export interface User {
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  username?: string;
  password?: string;
  avatar: string;
  jobTitle?: string;
}

/**
 * عضوی از تیم به همراه نقش اختصاص‌یافته
 */
export interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: string;
}

/**
 * تعریف تیم کاری یا واحد سازمانی
 */
export interface Team {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

/**
 * پوشه ساختاری جهت دسته‌بندی فرآیندها
 */
export interface Folder {
  id: string;
  name: string;
  teamId: string;
  parentId: string | null;
  createdAt: string;
}

/**
 * مشارکت‌کننده یا ویرایش‌کننده فرآیند
 */
export interface Contributor {
  userId: string;
  name: string;
  avatar?: string;
  action?: string;
  timestamp: string;
}

/**
 * تاریخچه نسخه ذخیره‌شده فرآیند
 */
export interface DiagramVersion {
  version: number;
  xml: string;
  timestamp: string;
  editorId?: string;
  editorName: string;
  changeSummary?: string;
}

/**
 * نظر و ارزیابی ثبت‌شده روی فرآیند
 */
export interface ReviewComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  elementId?: string;
  timestamp: string;
  status?: 'open' | 'resolved';
}

/**
 * مدل کامل فرآیند (BPMN Diagram)
 */
export interface Diagram {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  teamId: string;
  folderId: string | null;
  status: DiagramStatus;
  tags: string[];
  reviewerId?: string;
  reviewerName?: string;
  contributorIds: string[];
  contributors: Contributor[];
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
  xml: string;
  versions: DiagramVersion[];
  comments?: ReviewComment[];
}

/**
 * آیتم خلاصه فرآیند جهت نمایش در لیست‌ها و کارت‌های داشبورد
 */
export interface DiagramListItem {
  id: string;
  title: string;
  titleEn?: string;
  teamId: string;
  folderId: string | null;
  status: DiagramStatus;
  tags: string[];
  reviewerId?: string;
  reviewerName?: string;
  contributors: Contributor[];
  createdAt: string;
  updatedAt: string;
  latestVersion: number;
}
