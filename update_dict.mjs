import fs from 'fs';
let code = fs.readFileSync('src/lib/customTranslate.ts', 'utf8');

// The translate function in customTranslate.ts
const moreTranslations = `
    'Create StartEvent': 'ایجاد رویداد شروع',
    'Create EndEvent': 'ایجاد رویداد پایان',
    'Create Intermediate/Boundary Event': 'ایجاد رویداد میانی/مرزی',
    'Append EndEvent': 'افزودن رویداد پایان',
    'Append Intermediate/Boundary Event': 'افزودن رویداد میانی/مرزی',
    'Change type': 'تغییر نوع',
    'Connect using Association': 'اتصال با استفاده از پیوند',
    'Connect using Sequence/MessageFlow or Association': 'اتصال با جریان توالی/پیام یا پیوند',
    'Connect using DataInputAssociation': 'اتصال به عنوان ورودی داده',
    
    // Events
    'Start Event': 'رویداد شروع',
    'End Event': 'رویداد پایان',
    'Intermediate Throw Event': 'رویداد پرتابی میانی',
    'Intermediate Catch Event': 'رویداد دریافتی میانی',
    'Message Start Event': 'رویداد شروع پیام',
    'Timer Start Event': 'رویداد شروع زمان‌سنج',
    'Conditional Start Event': 'رویداد شروع شرطی',
    'Signal Start Event': 'رویداد شروع سیگنال',
    'Error Start Event': 'رویداد شروع خطا',
    'Escalation Start Event': 'رویداد شروع تشدید',
    'Compensation Start Event': 'رویداد شروع جبران',
    'Message Start Event (non-interrupting)': 'رویداد شروع پیام (بدون وقفه)',
    'Timer Start Event (non-interrupting)': 'رویداد شروع زمان‌سنج (بدون وقفه)',
    'Conditional Start Event (non-interrupting)': 'رویداد شروع شرطی (بدون وقفه)',
    'Signal Start Event (non-interrupting)': 'رویداد شروع سیگنال (بدون وقفه)',
    'Escalation Start Event (non-interrupting)': 'رویداد شروع تشدید (بدون وقفه)',
    
    'Message Intermediate Catch Event': 'رویداد دریافتی میانی پیام',
    'Message Intermediate Throw Event': 'رویداد پرتابی میانی پیام',
    'Timer Intermediate Catch Event': 'رویداد دریافتی میانی زمان‌سنج',
    'Escalation Intermediate Throw Event': 'رویداد پرتابی میانی تشدید',
    'Conditional Intermediate Catch Event': 'رویداد دریافتی میانی شرطی',
    'Link Intermediate Catch Event': 'رویداد دریافتی میانی پیوند',
    'Link Intermediate Throw Event': 'رویداد پرتابی میانی پیوند',
    'Compensation Intermediate Throw Event': 'رویداد پرتابی میانی جبران',
    'Signal Intermediate Catch Event': 'رویداد دریافتی میانی سیگنال',
    'Signal Intermediate Throw Event': 'رویداد پرتابی میانی سیگنال',
    
    'Message End Event': 'رویداد پایان پیام',
    'Escalation End Event': 'رویداد پایان تشدید',
    'Error End Event': 'رویداد پایان خطا',
    'Cancel End Event': 'رویداد پایان لغو',
    'Compensation End Event': 'رویداد پایان جبران',
    'Signal End Event': 'رویداد پایان سیگنال',
    'Terminate End Event': 'رویداد پایان خاتمه',
    
    'Transaction': 'تراکنش',
    'Sub Process': 'زیرفرآیند',
    'Sub Process (collapsed)': 'زیرفرآیند (بسته)',
    'Sub Process (expanded)': 'زیرفرآیند (باز)',
    'Event Sub Process': 'زیرفرآیند رویداد',
    'Call Activity': 'فعالیت فراخوانی',
    
    'Remove': 'حذف',
    'Comments': 'نظرات',
`;

// Insert moreTranslations into FA_DICT
code = code.replace(/const FA_DICT: Record<string, string> = \{/, 'const FA_DICT: Record<string, string> = {\n' + moreTranslations);

fs.writeFileSync('src/lib/customTranslate.ts', code);
