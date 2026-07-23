import fs from 'fs';
let code = fs.readFileSync('src/lib/customTranslate.ts', 'utf8');

const moreTranslations = {
  'Create StartEvent': 'ایجاد رویداد شروع',
  'Create EndEvent': 'ایجاد رویداد پایان',
  'Create Gateway': 'ایجاد درگاه (Gateway)',
  'Create Task': 'ایجاد وظیفه (Task)',
  'Create Intermediate/Boundary Event': 'ایجاد رویداد میانی/مرزی',
  'Create DataObjectReference': 'ایجاد شیء داده',
  'Create DataStoreReference': 'ایجاد پایگاه داده',
  'Create Pool/Participant': 'ایجاد استخر/مشارکت‌کننده',
  'Create Group': 'ایجاد گروه',
  'Create expanded SubProcess': 'ایجاد زیرفرآیند باز شده',
  
  'Append EndEvent': 'افزودن رویداد پایان',
  'Append Gateway': 'افزودن درگاه (Gateway)',
  'Append Task': 'افزودن وظیفه (Task)',
  'Append Intermediate/Boundary Event': 'افزودن رویداد میانی/مرزی',
  
  'Add Lane above': 'افزودن لاین در بالا',
  'Divide into two Lanes': 'تقسیم به دو لاین',
  'Divide into three Lanes': 'تقسیم به سه لاین',
  'Add Lane below': 'افزودن لاین در پایین',
  
  'Connect using MessageFlow': 'اتصال با پیام',
  'Connect using SequenceFlow': 'اتصال با جریان متوالی'
};

let insertFa = "";
for (const [k, v] of Object.entries(moreTranslations)) {
  insertFa += `    '${k}': '${v}',\n`;
}

code = code.replace(/    'Create element': 'ایجاد عنصر',/g, 
  `    'Create element': 'ایجاد عنصر',\n${insertFa}`);

fs.writeFileSync('src/lib/customTranslate.ts', code);
