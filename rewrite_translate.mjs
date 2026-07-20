import fs from 'fs';

const code = `
export const translations = {
  fa: {
    // Tools / Palette
    'Activate the hand tool': 'فعال کردن ابزار دست (کشیدن بوم)',
    'Activate the lasso tool': 'فعال کردن ابزار کمند (انتخاب چندتایی)',
    'Activate the create/remove space tool': 'فعال کردن ابزار مدیریت فضا',
    'Activate the global connect tool': 'فعال کردن ابزار اتصال سراسری',
    'Create StartEvent': 'ایجاد رویداد شروع',
    'Create Intermediate/Boundary Event': 'ایجاد رویداد میانی یا مرزی',

    'Task': 'وظیفه',
    'User task': 'وظیفه کاربر (User Task)',
    'Service task': 'وظیفه سرویس سیستمی',
    'Business rule task': 'وظیفه قانون کسب و کار',
    'Send task': 'وظیفه ارسال',
    'Receive task': 'وظیفه دریافت',
    'Manual task': 'وظیفه دستی',
    'Script task': 'وظیفه اسکریپتی',
    'Call activity': 'فعالیت فراخوانی',
    'Sub-process (collapsed)': 'زیر فرآیند (بسته)',
    'Sub-process (expanded)': 'زیر فرآیند (باز)',

    'Create EndEvent': 'ایجاد رویداد پایان',
    'Create Gateway': 'ایجاد درگاه تصمیمی (Gateway)',
    'Create Task': 'ایجاد وظیفه (Task)',
    'Create DataObjectReference': 'ایجاد ارجاع داده',
    'Create DataStoreReference': 'ایجاد مخزن داده',
    'Create ExpansionParticipant': 'ایجاد محدوده مجری (Lane/Pool)',
    'Create Group': 'ایجاد گروه',
    
    // Properties Panel
    'General': 'عمومی',
    'Name': 'عنوان (Name)',
    'Id': 'شناسه فنی (ID)',
    'ID': 'شناسه (ID)',
    'Version tag': 'برچسب نسخه',
    'Executable': 'قابل اجرا در موتور',
    'Executable process': 'فرآیند قابل اجرا',
    'Documentation': 'مستندسازی',
    'Element documentation': 'توضیحات عنصر',
    'Execution listeners': 'شنونده‌های اجرا',
    'Extension properties': 'ویژگی‌های افزونه',
    'Properties': 'ویژگی‌ها',
    'Add property': 'افزودن ویژگی',
    'Value': 'مقدار',
    'Details': 'جزئیات فنی',
    'Type': 'نوع',
    'Initiator': 'شروع کننده',
    'Asynchronous continuations': 'ادامه ناهمگام',
    'Asynchronous before': 'ناهمگام قبل',
    'Asynchronous after': 'ناهمگام بعد',
    'Exclusive': 'انحصاری',
    'Job execution': 'اجرای کار',
    'Job configuration': 'پیکربندی کار',
    'Priority': 'اولویت',
    'Candidate starter': 'شروع کننده نامزد',
    'Candidate starter groups': 'گروه‌های نامزد',
    'Candidate starter users': 'کاربران نامزد',
    'History configuration': 'پیکربندی تاریخچه',
    'History time to live': 'زمان ماندگاری تاریخچه',
    'Tasklist': 'لیست وظایف',
    'Startable': 'قابل شروع',
    'External task': 'وظیفه خارجی',
    'Topic': 'موضوع',
    'Assignee': 'مسئول انجام',
    'Candidate users': 'کاربران کاندید',
    'Candidate groups': 'گروه‌های کاندید',
    'Due date': 'تاریخ سررسید',
    'Follow up date': 'تاریخ پیگیری',
    'Form key': 'کلید فرم',
    'Form fields': 'فیلدهای فرم',
    'Add form field': 'افزودن فیلد فرم',
    'Label': 'برچسب',
    'Default value': 'مقدار پیش‌فرض',
    'Validation': 'اعتبارسنجی',
    'Add constraint': 'افزودن محدودیت',
    'Config': 'پیکربندی',
    'Process ID': 'شناسه فرآیند',
    'Process Name': 'نام فرآیند',
    'Parameters': 'پارامترها',
    'Input parameters': 'پارامترهای ورودی',
    'Output parameters': 'پارامترهای خروجی',
    'Local variable name': 'نام متغیر محلی',
    'Assignment type': 'نوع انتساب',
    'String': 'رشته',
    'Expression': 'عبارت',
    'Script': 'اسکریپت',
    'List': 'لیست',
    'Map': 'نقشه',
    'Script format': 'فرمت اسکریپت',
    'Script type': 'نوع اسکریپت',
    'Inline script': 'اسکریپت درون خطی',
    'External resource': 'منبع خارجی',
    'Resource': 'منبع',
    'Result variable': 'متغیر نتیجه',
    'Condition type': 'نوع شرط',
    'Condition expression': 'عبارت شرطی',
    'Forms': 'فرم‌ها',
    'Listeners': 'شنونده‌ها',
    'Input/Output': 'ورودی/خروجی',
    'Connector': 'اتصال دهنده',
    'Field injections': 'تزریق فیلدها',
    'Decision ref': 'ارجاع تصمیم',
    'Binding': 'اتصال',
    'Version': 'نسخه',
    'Tenant id': 'شناسه مستاجر',
    'Map decision result': 'نگاشت نتیجه تصمیم',

    // Token Simulation
    'Toggle Token Simulation': 'فعال/غیرفعال‌سازی شبیه‌سازی توکن',
    'Play/Pause': 'پخش/توقف',
    'Reset': 'بازنشانی',
    'Log': 'لاگ',
    'Simulation Settings': 'تنظیمات شبیه‌سازی',

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
    'Play': 'اجرا',
    'Pause': 'توقف',
    'Stop': 'پایان',

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
    'Exclusive Gateway': 'درگاه تصمیم انحصاری (XOR)',
    'Exclusive gateway': 'درگاه تصمیم انحصاری (XOR)',
    'Parallel Gateway': 'درگاه تصمیم موازی (AND)',
    'Parallel gateway': 'درگاه تصمیم موازی (AND)',
    'Inclusive Gateway': 'درگاه تصمیم جامع (OR)',
    'Inclusive gateway': 'درگاه تصمیم جامع (OR)',
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
    
    // Missing events
    'Intermediate Throw Event': 'رویداد میانی پرتابی',
    'Intermediate Catch Event': 'رویداد میانی دریافتی',
    'Message Boundary Event': 'رویداد مرزی پیام',
    'Timer Boundary Event': 'رویداد مرزی زمان‌سنج',
    'Escalation Boundary Event': 'رویداد مرزی تشدید',
    'Conditional Boundary Event': 'رویداد مرزی شرطی',
    'Error Boundary Event': 'رویداد مرزی خطا',
    'Cancel Boundary Event': 'رویداد مرزی لغو',
    'Signal Boundary Event': 'رویداد مرزی سیگنال',
    'Compensation Boundary Event': 'رویداد مرزی جبران',
    'Message Intermediate Throw Event': 'رویداد میانی پرتاب پیام',
    'Escalation Intermediate Throw Event': 'رویداد میانی پرتاب تشدید',
    'Link Intermediate Catch Event': 'رویداد میانی دریافت پیوند',
    'Link Intermediate Throw Event': 'رویداد میانی پرتاب پیوند',
    'Compensation Intermediate Throw Event': 'رویداد میانی پرتاب جبران',
    'Signal Intermediate Throw Event': 'رویداد میانی پرتاب سیگنال',

    // Task Options (Morph & Palette)
    'User Task': 'وظیفه کاربر (User Task)',
    'Service Task': 'وظیفه سرویس سیستمی (Service Task)',
    'Send Task': 'وظیفه ارسال پیام',
    'Receive Task': 'وظیفه دریافت پیام',
    'Manual Task': 'وظیفه دستی کاربری',
    'Business Rule Task': 'وظیفه قانون کسب‌وکار',
    'Script Task': 'وظیفه اسکریپت‌نویسی',
    'Call Activity': 'فراخوانی فرآیند دیگر (Call Activity)',
    'Sub Process (collapsed)': 'زیرفرآیند جمع شده',
    'Sub Process (expanded)': 'زیرفرآیند باز شده',

    // Properties Panel General Headers
    'Element Documentation': 'توضیحات عنصر',
    'Process Documentation': 'توضیحات فرآیند',
    'PROCESS': 'فرآیند (PROCESS)',
    'Process': 'فرآیند',
    'bpmn:Process': 'فرآیند',
    'Task priority': 'اولویت وظیفه',

    // Forms & Details
    'Add Field': 'افزودن فیلد فرم جدید',

    // Validation / Lint errors
    'Element is missing label/name': 'عنصر فاقد عنوان یا برچسب مشخص است',
    'Process is missing start event': 'فرآیند فاقد رویداد شروع است',
    'Process is missing end event': 'فرآیند فاقد رویداد پایان است',
    'Sequence flow is missing condition': 'جریان متوالی فاقد شرط است',
    'Duplicate ID': 'شناسه عنصر تکراری است',
    'Start event must have outgoing sequence flow': 'رویداد شروع باید جریان خروجی داشته باشد',
    'End event must have incoming sequence flow': 'رویداد پایان باید جریان ورودی داشته باشد',
    'Incoming flows do not join': 'جریان‌های ورودی متصل نشده‌اند (از درگاه استفاده کنید)',
    'Gateway is superfluous. It only has one source and target.': 'درگاه اضافی است (فقط یک ورودی و یک خروجی دارد)',
    'Gateway forks and joins': 'درگاه هم‌زمان نقش تقسیم‌کننده و ترکیب‌کننده را دارد',
    'Flow splits implicitly': 'جریان بدون درگاه (Gateway) به چند شاخه تقسیم شده است',
    'Element is not connected': 'عنصر به فرآیند متصل نیست',
    'Element overlaps with other element': 'عنصر با عناصر دیگر تداخل دارد (روی هم افتاده‌اند)',

    'Not all paths reach an end event. some flows just stop': 'همه مسیرها به یک رویداد پایان ختم نمی‌شوند. برخی جریان‌ها قطع می‌شوند.',
    'An element is a dead end. the process gets stuck here because there is no outgoing flow': 'عنصر بن‌بست است. فرآیند در اینجا گیر می‌کند زیرا هیچ جریان خروجی وجود ندارد.',
    'An element has no label. add a name to clarify its purpose': 'عنصر بدون عنوان است. یک نام برای شفاف‌سازی هدف آن اضافه کنید.',
    'This process has multiple start events. use only one to avoid confusion': 'این فرآیند چند رویداد شروع دارد. برای جلوگیری از سردرگمی تنها از یکی استفاده کنید.'
  },
  en: {} // Return empty so it falls back to default English in bpmn-js
};

// Global reference for current language
if (typeof window !== "undefined") {
  (window as any).__BPMN_LANG__ = "fa";
}

export default function customTranslate(template: string, replacements?: Record<string, any>) {
  if (!template || typeof template !== 'string') {
    return template;
  }
  const repls = replacements || {};
  const currentLang = typeof window !== "undefined" ? (window as any).__BPMN_LANG__ : "fa";
  
  let translated = template;
  if (currentLang === "fa" && translations.fa[template]) {
    translated = translations.fa[template];
  }

  // Replace {key} placeholders
  return translated.replace(/{([^}]+)}/g, (_, key) => {
    return repls[key] !== undefined ? String(repls[key]) : "{" + key + "}";
  });
}

export const customTranslateModule = {
  translate: ['value', customTranslate]
};
`;

fs.writeFileSync('src/lib/customTranslate.ts', code);
