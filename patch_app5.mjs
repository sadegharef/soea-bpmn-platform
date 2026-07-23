import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. Add missing import
code = code.replace(/import \{ customTranslateModule \} from "\.\.\/lib\/customTranslate";/, 'import { CreateAppendAnythingModule } from "bpmn-js-create-append-anything";\nimport { customTranslateModule } from "../lib/customTranslate";');

code = code.replace(/tokenSimulationModule,\n\s*lintModule,/, 'tokenSimulationModule,\n        CreateAppendAnythingModule,\n        lintModule,');

// 2. Add isLintPanelOpen state
code = code.replace(/const \[lintIssues, setLintIssues\] = useState<any\[\]>\(\[\]\);/, 'const [lintIssues, setLintIssues] = useState<any[]>([]);\n  const [isLintPanelOpen, setIsLintPanelOpen] = useState(true);');

// 3. Add tags state
code = code.replace(/const \[newProcessTags, setNewProcessTags\] = useState\(""\);/, 'const [newProcessTags, setNewProcessTags] = useState("");\n  const [isTagsMenuOpen, setIsTagsMenuOpen] = useState(false);\n  const [addTagInput, setAddTagInput] = useState("");');

// 4. Update the tag UI in header
const newTagUI = `
              <div className="flex flex-wrap items-center gap-1 mt-1">
                {(currentDiagram?.tags || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {t}
                  </span>
                ))}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsTagsMenuOpen(!isTagsMenuOpen)}
                    className="flex items-center gap-1 text-[10px] bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                  >
                    <Plus className="w-3 h-3" />
                    {lang === 'fa' ? 'افزودن برچسب' : 'Add tag'}
                  </button>
                  {isTagsMenuOpen && (
                    <div className="absolute top-full mt-1 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg p-2 z-50 w-48">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={addTagInput}
                          onChange={e => setAddTagInput(e.target.value)}
                          placeholder={lang === 'fa' ? 'عنوان برچسب...' : 'Tag name...'}
                          className="w-full text-xs px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none text-slate-800 dark:text-slate-200"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && addTagInput.trim()) {
                               const newTags = [...(currentDiagram?.tags || []), addTagInput.trim()];
                               const updatedDiag = { ...currentDiagram!, tags: newTags };
                               setCurrentDiagram(updatedDiag);
                               fetch(\`/api/diagrams/\${currentDiagram!.id}\`, {
                                 method: "PUT",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ tags: newTags })
                               });
                               setAddTagInput("");
                               setIsTagsMenuOpen(false);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
`;

code = code.replace(/<div className="flex flex-wrap gap-1 mt-1">[\s\S]*?<\/div>/, newTagUI);

// 5. Replace Lint Panel
const newLintPanel = `
          {/* Custom Lint Panel */}
          {lintIssues.length > 0 && (
            <div className={\`border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-20 shrink-0 transition-all duration-300 \${isLintPanelOpen ? 'h-[200px]' : 'h-8'}\`}>
              <div 
                className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                onClick={() => setIsLintPanelOpen(!isLintPanelOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {lintIssues.length} {lang === 'fa' ? 'خطای اعتبارسنجی فرآیند یافت شد' : 'issues found'}
                </div>
                <ChevronDown className={\`w-4 h-4 transition-transform \${!isLintPanelOpen ? 'rotate-180' : ''}\`} />
              </div>
              {isLintPanelOpen && (
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
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 mb-1 rounded text-right transition"
                      dir="ltr"
                    >
                      <span className="text-rose-500 flex-shrink-0 text-xs">⚠️</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
`;

code = code.replace(/\{\/\* Custom Lint Panel \*\/\}[\s\S]*?\{lintIssues\.length > 0 && \([\s\S]*?<\/div>\n\s*\)\}/, newLintPanel);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
