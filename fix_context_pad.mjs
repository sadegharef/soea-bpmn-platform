import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Remove import
code = code.replace(/import \{ CreateAppendAnythingModule \} from "bpmn-js-create-append-anything";\n/, '');

// Remove from additionalModules
code = code.replace(/CreateAppendAnythingModule,\n/, '');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
