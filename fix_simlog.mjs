import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(
  /const logTexts = document\.querySelectorAll\('\.bts-log-entry \.text'\);/g,
  `const logTexts = document.querySelectorAll('.bts-log-entry .text, .bts-log .entry .text, .bts-log .text');`
);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
