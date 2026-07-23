import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// replace physical with logical where it makes sense
code = code.replace(/border-r border-slate-200 dark:border-slate-700 pr-3 ml-2/g, 'border-s border-slate-200 dark:border-slate-700 ps-3 ms-2');
code = code.replace(/pl-2/g, 'ps-2');
code = code.replace(/pr-4/g, 'pe-4');
code = code.replace(/mr-2/g, 'me-2');
code = code.replace(/ml-2/g, 'ms-2');
code = code.replace(/ml-1/g, 'ms-1');
code = code.replace(/mr-1/g, 'me-1');
code = code.replace(/text-right/g, 'text-start');
code = code.replace(/text-left/g, 'text-start');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
