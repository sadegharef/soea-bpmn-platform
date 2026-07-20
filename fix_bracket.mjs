import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');
code = code.replace(/\{\/\* 3\.5 Bottom Status Footer \*\/\}/g, '      </div>\n\n      {/* 3.5 Bottom Status Footer */}');
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
