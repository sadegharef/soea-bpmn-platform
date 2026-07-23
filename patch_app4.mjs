import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const lintPanel = `
          {/* Custom Lint Panel */}
          {lintIssues.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-20 shrink-0" style={{ maxHeight: '200px', minHeight: '150px' }}>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {lintIssues.length} issues found
              </div>
              <div className="overflow-y-auto p-2 flex-1">
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
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 mb-1 rounded text-right"
                    dir="ltr"
                  >
                    <span className="text-red-500 flex-shrink-0 text-xs">⚠️</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{issue.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
`;

code = code.replace(/<div ref=\{canvasContainerRef\} className=\{`w-full h-full bpmn-container \$\{!showGrid \? 'no-grid' : ''\}`\} id="bpmn-canvas-element" dir="ltr" \/>\n\s*<\/div>/, `<div ref={canvasContainerRef} className={\`w-full flex-1 bpmn-container \${!showGrid ? 'no-grid' : ''}\`} id="bpmn-canvas-element" dir="ltr" />\n` + lintPanel + '\n        </div>');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
