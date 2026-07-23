import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Vazirmatn:wght@300;400;500;600;700&family=JetBrains\+Mono:wght@400;500&display=swap'\);/, "@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');");

code = code.replace(/--font-sans: "Vazirmatn", "Inter", ui-sans-serif, system-ui, sans-serif;/, '--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;');

if (!code.includes('html[dir="rtl"]')) {
  code = code.replace(/@theme \{/, `@theme {
  --font-sans-rtl: "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
`);
  code += `\nhtml[dir="rtl"] { --font-sans: var(--font-sans-rtl); }\nhtml[dir="ltr"] { --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif; }\n`;
}

fs.writeFileSync('src/index.css', code);
