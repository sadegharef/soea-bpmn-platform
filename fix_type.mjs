import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /const initial: DiagramListItem = \{ id: "demo-process", name: "فرآیند نمونه خرید سازمانی", nameEn: "Demo Procurement Process", updatedAt: new Date\(\)\.toISOString\(\) \};/;

const replacement = `const initial: DiagramListItem = { id: "demo-process", name: "فرآیند نمونه خرید سازمانی", nameEn: "Demo Procurement Process", updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), latestVersion: 1 };`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
