import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /const list = JSON\.parse\(localStorage\.getItem\("bpmn-diagrams"\) || "\[\]"\) as DiagramListItem\[\];\n\s*if \(list\.length === 0\) \{/;

const replacement = `let list = [] as DiagramListItem[];
    try {
      list = JSON.parse(localStorage.getItem("bpmn-diagrams") || "[]") as DiagramListItem[];
      if (!Array.isArray(list)) list = [];
    } catch(e) {
      list = [];
    }
    if (list.length === 0) {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
