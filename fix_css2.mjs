import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// Replace the stray }
code = code.replace(/\/\* pull it closer \*\/\s*\}/g, '/* pull it closer */');

fs.writeFileSync('src/index.css', code);
