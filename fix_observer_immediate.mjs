import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\n    const observer = new MutationObserver\(\(\) => \{([\s\S]*?)\}\);\n    if \(canvasContainerRef\.current\)/;

const replacement = `useEffect(() => {
    const updateTitles = () => {$1};
    updateTitles();
    const observer = new MutationObserver(() => {
      updateTitles();
    });
    if (canvasContainerRef.current)`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
