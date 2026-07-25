import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /  useEffect\(\(\) => \{\n    if \(theme === "dark"\) \{/;

const replacement = `  useEffect(() => {
    (window as any).__BPMN_LANG__ = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (theme === "dark") {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
