import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/\/\* pull it closer \*\/\s*\.dark-theme/g, '/* pull it closer */\n}\n.dark-theme');
fs.writeFileSync('src/index.css', code);
