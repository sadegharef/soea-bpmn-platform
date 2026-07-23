import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/import \{ customContextPadModule \} from "\.\.\/lib\/CustomContextPadProvider";\nimport CustomContextPadProvider from "\.\.\/lib\/customContextPadProvider";/, 'import CustomContextPadProvider, { customContextPadModule } from "../lib/CustomContextPadProvider";');

code = code.replace(/Globe, Reply, CheckCircle/g, 'Globe, Reply'); // remove CheckCircle from my previous addition, since it was already there.

code = code.replace(/modeler\.get\('eventBus'\)\.on/g, "(modeler.get('eventBus') as any).on");
code = code.replace(/const icon = overlay\.querySelector\('\.bjsl-icon'\);/g, "const icon = overlay.querySelector('.bjsl-icon') as HTMLElement;");

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
