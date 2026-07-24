import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Remove the later lang state
code = code.replace(/\n\s*const \[lang, setLang\] = useState<"fa" \| "en">\("fa"\);/, '');
code = code.replace(/\n\s*const \[theme, setTheme\] = useState<"light" \| "dark">\("light"\);/, '');

// Move it before editorName
code = code.replace(/const \[diagramName, setDiagramName\] = useState<string>\(""\);/, 
`const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"fa" | "en">("fa");
  $&`);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
