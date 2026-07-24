import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(
  /const originalText = el\.getAttribute\('data-original-text'\) \|\| el\.textContent \|\| "";/,
  `const originalText = (el.getAttribute('data-original-text') || el.textContent || "").trim();`
);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
