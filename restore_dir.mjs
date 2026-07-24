import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// The main app container:
code = code.replace(/<div className=\{\`flex flex-col h-screen overflow-hidden text-slate-800 dark:text-slate-200 \$\{theme === "dark" \? "dark dark-theme bg-\\[#0f172a\\]" : "bg-slate-50"\}\`\} dir="ltr" id="bpmn-app-container">/,
  '<div className={`flex flex-col h-screen overflow-hidden text-slate-800 dark:text-slate-200 ${theme === "dark" ? "dark dark-theme bg-[#0f172a]" : "bg-slate-50"}`} dir={lang === "fa" ? "rtl" : "ltr"} id="bpmn-app-container">');

// bpmn canvas
code = code.replace(/<div ref=\{canvasContainerRef\} className=\{\`w-full flex-1 bpmn-container \$\{!showGrid \? 'no-grid' : ''\}\`\} id="bpmn-canvas-element" dir="ltr" \/>/,
  '<div ref={canvasContainerRef} className={`w-full flex-1 bpmn-container ${!showGrid ? \\\'no-grid\\\' : \\\'\\\'}`} id="bpmn-canvas-element" dir="ltr" />');

// lint issue item
code = code.replace(/className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-rose-200 dark:border-rose-900\/50 bg-rose-50\/50 dark:bg-rose-900\/20 mb-1 rounded text-start transition"\n\s*dir="ltr"/g,
  'className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 mb-1 rounded text-start transition"\n                      dir={lang === "fa" ? "rtl" : "ltr"}');

// The others can stay dir="ltr"
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
