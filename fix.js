import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace(/@custom-variant.*?;/, "@custom-variant dark (&:is(.dark-theme *));");
fs.writeFileSync('src/index.css', code);
