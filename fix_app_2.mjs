import fs from 'fs';

let appStr = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. Add diagramNameEn state
appStr = appStr.replace(
  /const \[diagramName, setDiagramName\] = useState<string>\(""\);/,
  `$&
  const [diagramNameEn, setDiagramNameEn] = useState<string>("");`
);

// 2. Load diagramNameEn
appStr = appStr.replace(
  /setDiagramName\(data\.name\);/,
  `$&
          setDiagramNameEn(data.nameEn || data.name);`
);

// 3. Header Process Name Input
appStr = appStr.replace(
  /<input\n\s*type="text"\n\s*value=\{diagramName\}\n\s*onChange=\{\(e\) => setDiagramName\(e\.target\.value\)\}/,
  `<input
            type="text"
            value={lang === 'fa' ? diagramName : diagramNameEn}
            onChange={(e) => {
              if (lang === 'fa') setDiagramName(e.target.value);
              else setDiagramNameEn(e.target.value);
            }}`
);
// Make the class text-left if English
appStr = appStr.replace(
  /className="px-3 py-1\.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold w-48 sm:w-64 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"\n\s*placeholder=\{t\("processNamePlaceholder", lang\)\}/,
  `className={"px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold w-48 sm:w-64 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 " + (lang === "en" ? "text-left" : "")}
            placeholder={t("processNamePlaceholder", lang)}
            dir={lang === "fa" ? "rtl" : "ltr"}`
);

// 4. PUT Request payload
appStr = appStr.replace(
  /name: diagramName\n\s*\}/,
  `name: diagramName,
          nameEn: diagramNameEn
        }`
);

// 5. Diagram initialization
appStr = appStr.replace(
  /setDiagramName\(t\("newProcess", lang\)\);/,
  `$&
          setDiagramNameEn("New Process");`
);

// 6. BPMN XML properties mapping
// The canvas process element's name currently maps to diagramName. We don't have to change XML sync for English.

fs.writeFileSync('src/components/BpmnModelerApp.tsx', appStr);
