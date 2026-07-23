import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Display tags in header
const headerTags = `
              <div className="flex flex-wrap gap-1 mt-1">
                {(currentDiagram?.tags || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
`;
code = code.replace(/<div className="flex items-center gap-1.5">/, headerTags + '\n              <div className="flex items-center gap-1.5 mt-1">');

// Lint panel at the bottom of the canvas
const lintPanel = `
          {/* Custom Lint Panel */}
          {lintIssues.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-20" style={{ maxHeight: '200px' }}>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lintIssues.length} issues found
              </div>
              <div className="overflow-y-auto p-2">
                {lintIssues.map((issue, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (modelerRef.current) {
                        const elementRegistry = modelerRef.current.get('elementRegistry') as any;
                        const element = elementRegistry.get(issue.elementId);
                        if (element) {
                          const selection = modelerRef.current.get('selection') as any;
                          selection.select(element);
                          const canvas = modelerRef.current.get('canvas') as any;
                          canvas.zoom('fit-viewport');
                        }
                      }
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 mb-1 rounded"
                  >
                    <span className="text-red-500 flex-shrink-0 text-xs">⚠️</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
`;

code = code.replace(/<div className="bpmn-container w-full h-full absolute inset-0"\s*ref=\{canvasContainerRef\}\s*id="bpmn-canvas"\s*\/>\s*<\/div>/, `<div className="bpmn-container flex-1 w-full relative" ref={canvasContainerRef} id="bpmn-canvas" />\n` + lintPanel);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
