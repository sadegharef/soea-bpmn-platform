import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /const handleDeleteProcess = async \(\) => \{[\s\S]*?\} catch \(error\) \{[\s\S]*?alert\(".*?"\);\s*\}\s*\};/m;

const newDeleteFn = `const handleDeleteProcess = async () => {
    if (!currentDiagram) return;
    if (!window.confirm(lang === 'fa' ? \`آیا از حذف فرآیند "\${currentDiagram.name}" اطمینان دارید؟\` : \`Are you sure you want to delete "\${currentDiagram.name}"?\`)) return;
    
    try {
      const res = await fetch(\`/api/diagrams/\${currentDiagram.id}\`, {
        method: "DELETE"
      });
      if (res.ok) {
        localStorage.removeItem(\`bpmn-draft-\${currentDiagram.id}\`);
        const response = await fetch("/api/diagrams");
        const list = await response.json();
        setDiagrams(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
          const diagramRes = await fetch(\`/api/diagrams/\${list[0].id}\`);
          const diag = await diagramRes.json();
          setCurrentDiagram(diag);
          setDiagramName(diag.name);
          setIsHistoryOpen(false);
          
          if (viewerRef.current) {
            await viewerRef.current.importXML(diag.xml);
            const canvas = viewerRef.current.get("canvas") as any;
            canvas.zoom("fit-viewport");
          }
        } else {
          setCurrentDiagram(null);
          setDiagramName(lang === 'fa' ? "فرآیند جدید" : "New Process");
          setSelectedId(null);
          if (viewerRef.current) {
             viewerRef.current.clear();
          }
        }
      }
    } catch (error) {
      console.error("Error deleting diagram:", error);
      alert(lang === 'fa' ? "خطا در حذف فرآیند" : "Error deleting process");
    }
  };`;

code = code.replace(regex, newDeleteFn);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
