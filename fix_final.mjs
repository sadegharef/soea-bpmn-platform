import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/alt="هم‌نگار"/g, 'alt={t("app.title", lang)}');
code = code.replace(/انصراف/g, '{t("cancel", lang)}');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
