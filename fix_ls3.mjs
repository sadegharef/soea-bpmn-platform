import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /const data = localStorage\.getItem\(\`bpmn-diagram-\\\$\{selectedId\}\`\);\n\s*if \(data\) \{\n\s*const diagram = JSON\.parse\(data\) as Diagram;\n\s*setCurrentDiagram\(diagram\);\n\s*setDiagramName\(diagram\.name\);\n\s*setDiagramNameEn\(diagram\.nameEn || ""\);/m;

const replacement = `const data = localStorage.getItem(\`bpmn-diagram-\${selectedId}\`);
    if (data) {
       try {
         const diagram = JSON.parse(data) as Diagram;
         if (diagram) {
           setCurrentDiagram(diagram);
           setDiagramName(diagram.name || "");
           setDiagramNameEn(diagram.nameEn || "");
           if (diagram.xml) {
             modeler.importXML(diagram.xml).then(() => {
                const canvas = modeler.get('canvas') as any;
                canvas.zoom('fit-viewport');
                const linting = modeler.get('linting') as any;
                linting.activateLinting();
             }).catch(console.error);
           }
         }
       } catch(e) {
         console.error("Corrupted diagram data", e);
       }`;

code = code.replace(regex, replacement);

const regexDelete = /modeler\.importXML\(diagram\.xml\)\.then\(\(\) => \{\n\s*const canvas = modeler\.get\('canvas'\) as any;\n\s*canvas\.zoom\('fit-viewport'\);\n\s*const linting = modeler\.get\('linting'\) as any;\n\s*linting\.activateLinting\(\);\n\s*\}\)\.catch\(console\.error\);/;

code = code.replace(regexDelete, "");

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
