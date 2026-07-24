import fs from 'fs';

let appStr = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. isPropertiesOpen = false
appStr = appStr.replace(/const \[isPropertiesOpen, setIsPropertiesOpen\] = useState\(true\);/, 'const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);');

// 2. EditorNameEn
appStr = appStr.replace(
  /const \[editorName, setEditorName\] = useState<string>\(\(\) => \{[\s\S]*?\}\);/,
  `$&
  const [editorNameEn, setEditorNameEn] = useState<string>(() => {
    return localStorage.getItem("bpmn_editor_name_en") || "Co-Pilot";
  });`
);
// In header input
appStr = appStr.replace(
  /<input\n\s*value=\{editorName\}\n\s*onChange=\{\(e\) => \{\n\s*setEditorName\(e\.target\.value\);\n\s*localStorage\.setItem\("bpmn_editor_name", e\.target\.value\);\n\s*\}\}\n\s*className="bg-transparent border-none text-xs text-blue-600 dark:text-blue-400 font-bold focus:outline-none w-24"\n\s*title=\{t\("yourName", lang\)\}\n\s*placeholder=\{t\("editorNamePlaceholder", lang\)\}\n\s*\/>/,
  `<input
                value={lang === 'fa' ? editorName : editorNameEn}
                onChange={(e) => {
                  if (lang === 'fa') {
                    setEditorName(e.target.value);
                    localStorage.setItem("bpmn_editor_name", e.target.value);
                  } else {
                    setEditorNameEn(e.target.value);
                    localStorage.setItem("bpmn_editor_name_en", e.target.value);
                  }
                }}
                className={"bg-transparent border-none text-xs text-blue-600 dark:text-blue-400 font-bold focus:outline-none w-24 " + (lang === "en" ? "text-left" : "")}
                title={t("yourName", lang)}
                placeholder={t("editorNamePlaceholder", lang)}
              />`
);

// 3. NewProcessNameEn state
appStr = appStr.replace(
  /const \[newProcessName, setNewProcessName\] = useState\(""\);/,
  `$&
  const [newProcessNameEn, setNewProcessNameEn] = useState("");`
);

// 4. Update POST body
appStr = appStr.replace(
  /body: JSON\.stringify\(\{\n\s*name: newProcessName,\n\s*editorName: editorName\n\s*\}\)/,
  `body: JSON.stringify({
        name: newProcessName || "بدون عنوان",
        nameEn: newProcessNameEn || "Untitled Process",
        editorName: editorName || "کاربر ناشناس",
        editorNameEn: editorNameEn || "Unknown Editor",
      })`
);

// 5. Update PUT body
appStr = appStr.replace(
  /editorName,\n\s*name: currentDiagram\.name/,
  `editorName,
          editorNameEn,
          name: currentDiagram.name,
          nameEn: currentDiagram.nameEn`
);

// 6. Display Name (in dropdown)
appStr = appStr.replace(
  /\{d\.name\} \(\{t\("latestVersion", lang\)\} \{d\.latestVersion\}\)/g,
  `{lang === 'fa' ? d.name : (d.nameEn || d.name)} ({t("latestVersion", lang)} {d.latestVersion})`
);

// 7. Display Editor Name in history
appStr = appStr.replace(
  /<span>\{t\("byEditor", lang, \{editorName: v\.editorName\}\)\}<\/span>/g,
  `<span>{t("byEditor", lang, {editorName: lang === 'fa' ? v.editorName : (v.editorNameEn || v.editorName)})}</span>`
);

// 8. New Process modal inputs
appStr = appStr.replace(
  /<div>\n\s*<label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1\.5">\{t\("businessProcessTitle", lang\)\}<\/label>\n\s*<input\n\s*type="text"\n\s*required\n\s*value=\{newProcessName\}\n\s*onChange=\{\(e\) => setNewProcessName\(e\.target\.value\)\}\n\s*placeholder=\{t\("processNameExample", lang\)\}\n\s*className="w-full px-3\.5 py-2\.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"\n\s*id="modal-new-name-input"\n\s*\/>\n\s*<\/div>/,
  `<div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{t("businessProcessTitle", lang)} (فارسی)</label>
                <input
                  type="text"
                  required
                  value={newProcessName}
                  onChange={(e) => setNewProcessName(e.target.value)}
                  placeholder={lang === 'fa' ? t("processNameExample", lang) : "فارسی..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  id="modal-new-name-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{t("businessProcessTitle", lang)} (English)</label>
                <input
                  type="text"
                  value={newProcessNameEn}
                  onChange={(e) => setNewProcessNameEn(e.target.value)}
                  placeholder="e.g. Procurement Process"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-left"
                  dir="ltr"
                />
              </div>`
);

// 9. Linter Issues Panel RTL
appStr = appStr.replace(
  /className=\{`absolute bottom-0 left-0 right-0 bg-red-50 dark:bg-red-900\/20 border-t border-red-200 dark:border-red-800\/50 max-h-48 overflow-y-auto transition-all \$\{isPropertiesOpen \? 'mr-80' : ''\} \$\{lang === 'fa' \? 'text-right' : 'text-left'\}`\}/,
  'className={`absolute bottom-0 left-0 right-0 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800/50 max-h-48 overflow-y-auto transition-all ${isPropertiesOpen ? (lang === \\\'fa\\\' ? \\\'mr-80\\\' : \\\'ml-80\\\') : \\\'\\\'}`} dir={lang === "fa" ? "rtl" : "ltr"}'
);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', appStr);
