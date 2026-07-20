import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/const \[theme, setTheme\] = useState<"light"\\s*const \[lang, setLang\] = useState<"fa" \| "en">\\("fa"\\);/, 
'const [theme, setTheme] = useState<"light" | "dark">("light");\n  const [lang, setLang] = useState<"fa" | "en">("fa");');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
