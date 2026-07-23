import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. Add lintIssues state
code = code.replace(/const \[currentDiagram, setCurrentDiagram\] = useState<Diagram \| null>\(null\);/, 'const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);\n  const [lintIssues, setLintIssues] = useState<any[]>([]);');

// 2. Add tags to newProcessForm
code = code.replace(/const \[newProcessName, setNewProcessName\] = useState\(""\);/, 'const [newProcessName, setNewProcessName] = useState("");\n  const [newProcessTags, setNewProcessTags] = useState("");');

// 3. Include tags in handleCreateProcess
code = code.replace(/body: JSON\.stringify\(\{\n        name: newProcessName,\n        editorName: lang === 'fa' \? "کاربر سیستم" : "System User"\n      \}\)/, 'body: JSON.stringify({\n        name: newProcessName,\n        tags: newProcessTags.split(",").map(t => t.trim()).filter(Boolean),\n        editorName: lang === \'fa\' ? "کاربر سیستم" : "System User"\n      })');

// 4. Update modeler initialization to listen for linting.completed
code = code.replace(/modelerRef\.current = modeler;/, `modelerRef.current = modeler;
    modeler.on("linting.completed", (event: any) => {
      const issuesObj = event.issues || {};
      const newIssues: any[] = [];
      for (const elementId in issuesObj) {
        issuesObj[elementId].forEach((issue: any) => {
          newIssues.push({
            elementId,
            message: issue.message,
            category: issue.category
          });
        });
      }
      setLintIssues(newIssues);
    });
`);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
