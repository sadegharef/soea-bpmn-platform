import fs from 'fs';

// 1. Update customTranslate.ts
let transCode = fs.readFileSync('src/lib/customTranslate.ts', 'utf8');

const additionalTranslations = {
  // Token Simulation
  'Token Simulation': 'شبیه‌سازی فرآیند',
  'Simulation Log': 'تاریخچه شبیه‌سازی',
  'Process finished': 'پایان فرآیند',
  'Process entered': 'شروع فرآیند',
  
  // Implicit end validation error
  'Element is an implicit end': 'این عنصر به‌طور ضمنی فرآیند را پایان می‌دهد (باید به رویداد پایان متصل شود)'
};

// Insert into translations.fa
let insertFa = "";
for (const [k, v] of Object.entries(additionalTranslations)) {
  insertFa += `    '${k}': '${v}',\n`;
}
transCode = transCode.replace(/'This process has multiple start events\. use only one to avoid confusion': 'این فرآیند چند رویداد شروع دارد\. برای جلوگیری از سردرگمی تنها از یکی استفاده کنید\.'/g, 
  `'This process has multiple start events. use only one to avoid confusion': 'این فرآیند چند رویداد شروع دارد. برای جلوگیری از سردرگمی تنها از یکی استفاده کنید.',\n${insertFa}`);

fs.writeFileSync('src/lib/customTranslate.ts', transCode);

// 2. Update BpmnModelerApp.tsx
let appCode = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Ensure import for customTranslate
if (!appCode.includes('import customTranslate from "../lib/customTranslate"')) {
  appCode = appCode.replace(/import \{ customTranslateModule \} from "\.\.\/lib\/customTranslate";/, 
    'import customTranslate, { customTranslateModule } from "../lib/customTranslate";');
}

// Replace logo image with Lucide icon
appCode = appCode.replace(/<div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shrink-0 overflow-hidden">\s*<img src="\/logo\.png"[\s\S]*?<\/div>/, 
  `<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm"><Workflow className="w-5 h-5" /></div>`);

// Make sure we have Workflow imported
if(!appCode.includes('Workflow')) {
    appCode = appCode.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Workflow } from 'lucide-react';");
}

// Translate linter issues message
appCode = appCode.replace(/<span className="text-sm text-slate-700 dark:text-slate-300 flex-1">\{issue\.message\}<\/span>/,
  '<span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{customTranslate(issue.message)}</span>');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', appCode);

