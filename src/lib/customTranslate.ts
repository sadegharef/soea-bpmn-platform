/**
 * Custom BPMN.js translation module for Persian (Farsi)
 */
export const PersianTranslations: Record<string, string> = {
  // Tools / Palette
  'Activate the hand tool': 'فعال کردن ابزار دست (کشیدن بوم)',
  'Activate the lasso tool': 'فعال کردن ابزار کمند (انتخاب چندتایی)',
  'Activate the create/remove space tool': 'فعال کردن ابزار مدیریت فضا',
  'Activate the global connect tool': 'فعال کردن ابزار اتصال سراسری',
  'Create StartEvent': 'ایجاد رویداد شروع',
  'Create Intermediate/Boundary Event': 'ایجاد رویداد میانی یا مرزی',
  'Create EndEvent': 'ایجاد رویداد پایان',
  'Create Gateway': 'ایجاد درگاه تصمیمی (Gateway)',
  'Create Task': 'ایجاد وظیفه (Task)',
  'Create DataObjectReference': 'ایجاد ارجاع داده',
  'Create DataStoreReference': 'ایجاد مخزن داده',
  'Create ExpansionParticipant': 'ایجاد محدوده مجری (Lane/Pool)',
  'Create Group': 'ایجاد گروه',
  
  // Context Pad
  'Append EndEvent': 'افزودن رویداد پایان',
  'Append Gateway': 'افزودن درگاه تصمیمی',
  'Append Task': 'افزودن وظیفه جدید',
  'Append Intermediate/Boundary Event': 'افزودن رویداد میانی یا مرزی',
  
  // Color Picker & Misc
  'Color': 'رنگ',
  'Default': 'پیش‌فرض',
  'Blue': 'آبی',
  'Orange': 'نارنجی',
  'Green': 'سبز',
  'Red': 'قرمز',
  'Purple': 'بنفش',
  'Black': 'مشکی',
  'White': 'سفید',
  
  // Minimap
  'Open minimap': 'باز کردن نقشه کوچک',
  'Close minimap': 'بستن نقشه کوچک',
  
  // Token Simulation
  'Token Simulation': 'شبیه‌سازی توکن',
  'Play': 'اجرا',
  'Pause': 'توقف',
  'Stop': 'پایان',
  'Reset': 'بازنشانی',
  'Log': 'لاگ',
  'Toggle Token Simulation': 'فعال/غیرفعال‌سازی شبیه‌سازی توکن',

  // BPMN Lint
  '{errors} Errors, {warnings} Warnings': '{errors} خطا، {warnings} هشدار',
  '{errors} Errors': '{errors} خطا',
  '{warnings} Warnings': '{warnings} هشدار',
  '1 Error, {warnings} Warnings': '1 خطا، {warnings} هشدار',
  '1 Error, 1 Warning': '1 خطا، 1 هشدار',
  '{errors} Errors, 1 Warning': '{errors} خطا، 1 هشدار',
  '1 Warning': '1 هشدار',
  '1 Error': '1 خطا',
  'No Issues': 'مشکلی یافت نشد',

  // Create / Append Palette
  'Create element': 'ایجاد عنصر',
  'Append element': 'افزودن عنصر',
  'Change element': 'تغییر عنصر',
  'Search': 'جستجو',
  'Start Event': 'رویداد شروع',
  'End Event': 'رویداد پایان',
  'START EVENT': 'رویداد شروع',
  'END EVENT': 'رویداد پایان',
  'TASK': 'وظیفه',
  'Sequence Flow': 'جریان متوالی',
  'SEQUENCE FLOW': 'جریان متوالی',
  'EXCLUSIVE GATEWAY': 'درگاه انحصاری',
  'Gateways': 'درگاه‌ها (Gateways)',
  'Tasks': 'وظایف (Tasks)',
  'Events': 'رویدادها (Events)',
  'Data': 'داده‌ها',
  'Participants': 'مجریان',
  'Sub processes': 'زیرفرآیندها',
  'Sub process': 'زیرفرآیند',

  'Append text annotation': 'افزودن یادداشت متنی',
  'Change type': 'تغییر نوع عنصر',
  'Connect using Association': 'اتصال به وسیله وابستگی داده',
  'Connect using Sequence/MessageFlow or Association': 'اتصال با جریان متوالی یا پیام',
  'Connect using DataInputAssociation': 'اتصال ورودی داده',
  'Remove': 'حذف عنصر',
  'Text Annotation': 'یادداشت متنی',

  // Gateway Options (Morph & Palette)
  'Exclusive Gateway': 'درگاه تصمیم انحصاری (OR)',
  'Exclusive gateway': 'درگاه تصمیم انحصاری (OR)',
  'Parallel Gateway': 'درگاه تصمیم موازی (AND)',
  'Parallel gateway': 'درگاه تصمیم موازی (AND)',
  'Inclusive Gateway': 'درگاه تصمیم جامع (Inclusive)',
  'Inclusive gateway': 'درگاه تصمیم جامع (Inclusive)',
  'Complex Gateway': 'درگاه تصمیم پیچیده',
  'Complex gateway': 'درگاه تصمیم پیچیده',
  'Event based Gateway': 'درگاه تصمیم مبتنی بر رویداد',
  'Event-based gateway': 'درگاه تصمیم مبتنی بر رویداد',

  // Event Options (Morph)
  'Message Start Event': 'رویداد شروع پیام',
  'Timer Start Event': 'رویداد شروع زمان‌سنج',
  'Conditional Start Event': 'رویداد شروع شرطی',
  'Signal Start Event': 'رویداد شروع سیگنال',
  'Message Intermediate Catch Event': 'رویداد میانی دریافت پیام',
  'Timer Intermediate Catch Event': 'رویداد میانی زمان‌سنج',
  'Signal Intermediate Catch Event': 'رویداد میانی دریافت سیگنال',
  'Message End Event': 'رویداد پایان پیام',
  'Signal End Event': 'رویداد پایان سیگنال',
  'Terminate End Event': 'رویداد پایان توقف فرآیند',

  // Task Options (Morph & Palette)
  'Task': 'وظیفه',
  'User Task': 'وظیفه کاربر (User Task)',
  'User task': 'وظیفه کاربر (User Task)',
  'Service Task': 'وظیفه سرویس سیستمی (Service Task)',
  'Service task': 'وظیفه سرویس سیستمی (Service Task)',
  'Send Task': 'وظیفه ارسال پیام',
  'Send task': 'وظیفه ارسال پیام',
  'Receive Task': 'وظیفه دریافت پیام',
  'Receive task': 'وظیفه دریافت پیام',
  'Manual Task': 'وظیفه دستی کاربری',
  'Manual task': 'وظیفه دستی کاربری',
  'Business Rule Task': 'وظیفه قانون کسب‌وکار',
  'Business rule task': 'وظیفه قانون کسب‌وکار',
  'Script Task': 'وظیفه اسکریپت‌نویسی',
  'Script task': 'وظیفه اسکریپت‌نویسی',
  'Call Activity': 'فراخوانی فرآیند دیگر (Call Activity)',
  'Call activity': 'فراخوانی فرآیند دیگر (Call Activity)',
  'Sub Process (collapsed)': 'زیرفرآیند جمع شده',
  'Sub Process (expanded)': 'زیرفرآیند باز شده',

  // Properties Panel General Headers
  'General': 'عمومی',
  'Documentation': 'مستندسازی',
  'Element documentation': 'توضیحات عنصر',
  'Element Documentation': 'توضیحات عنصر',
  'Process Documentation': 'توضیحات فرآیند',
  'Details': 'جزئیات فنی',
  'Inputs': 'ورودی‌ها',
  'Outputs': 'خروجی‌ها',
  'Parameters': 'پارامترها',
  'Extension properties': 'ویژگی‌های افزونه',
  'Properties': 'ویژگی‌ها',
  'PROCESS': 'فرآیند (PROCESS)',
  'Process': 'فرآیند',
  'bpmn:Process': 'فرآیند',
  'ID': 'شناسه (ID)',
  'Id': 'شناسه فنی (ID)',
  'Name': 'عنوان فارسی (Name)',
  'Executable': 'قابل اجرا در موتور',
  'Version tag': 'برچسب نسخه',
  'Task priority': 'اولویت وظیفه',
  
  // Assignees & Users
  'Assignee': 'مسئول انجام',
  'Candidate users': 'کاربران کاندید',
  'Candidate groups': 'گروه‌های کاندید',
  'Due date': 'تاریخ سررسید',
  'Follow up date': 'تاریخ پیگیری',
  'Priority': 'اولویت',

  // Forms & Details
  'Form key': 'کلید فرم',
  'Form fields': 'فیلدهای فرم',
  'Type': 'نوع',
  'Label': 'برچسب',
  'Default value': 'مقدار پیش‌فرض',
  'Validation': 'اعتبارسنجی',
  'Add Field': 'افزودن فیلد فرم جدید',

  // Validation / Lint errors
  'Element is missing label/name': 'عنصر فاقد عنوان یا برچسب مشخص است',
  'Process is missing start event': 'فرآیند فاقد رویداد شروع است',
  'Process is missing end event': 'فرآیند فاقد رویداد پایان است',
  'Sequence flow is missing condition': 'جریان متوالی شرط خروجی ندارد',
  'Duplicate ID': 'شناسه عنصر تکراری است',
  'Start event must have outgoing sequence flow': 'رویداد شروع باید جریان خروجی داشته باشد',
  'End event must have incoming sequence flow': 'رویداد پایان باید جریان ورودی داشته باشد',
  'Incoming flows do not join': 'جریان‌های ورودی متصل نشده‌اند (از درگاه استفاده کنید)',
  'Gateway is superfluous. It only has one source and target.': 'درگاه اضافی است (فقط یک ورودی و یک خروجی دارد)',
  'Gateway forks and joins': 'درگاه هم‌زمان نقش تقسیم‌کننده و ترکیب‌کننده را دارد',
  'Flow splits implicitly': 'جریان بدون درگاه (Gateway) به چند شاخه تقسیم شده است',
  'Element is not connected': 'عنصر به فرآیند متصل نیست',
  'Element overlaps with other element': 'عنصر با عناصر دیگر تداخل دارد (روی هم افتاده‌اند)'
};

export default function customTranslate(template: string, replacements?: Record<string, any>) {
  if (!template || typeof template !== 'string') {
    return template;
  }
  const repls = replacements || {};
  let translated = PersianTranslations[template] || template;

  // Replace {key} placeholders
  return translated.replace(/{([^}]+)}/g, (_, key) => {
    return repls[key] !== undefined ? String(repls[key]) : "{" + key + "}";
  });
}

export const customTranslateModule = {
  translate: ['value', customTranslate]
};
