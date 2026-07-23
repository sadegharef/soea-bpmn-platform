import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/if \(logHeader && lang === 'fa' && logHeader\.textContent === 'Simulation Log'\) \{/, 
  "if (logHeader && lang === 'fa' && logHeader.textContent?.includes('Simulation Log')) {");

code = code.replace(/logHeader\.textContent = 'تاریخچه شبیه‌سازی';/, 
  "logHeader.textContent = logHeader.textContent.replace('Simulation Log', 'تاریخچه شبیه‌سازی');");

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
