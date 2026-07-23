import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/dir="rtl" id="bpmn-app-container"/, 'dir={lang === "fa" ? "rtl" : "ltr"} id="bpmn-app-container"');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
