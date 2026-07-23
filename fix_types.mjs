import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/latestVersion: number;/g, 'latestVersion: number;\n  tags?: string[];');

fs.writeFileSync('src/types.ts', code);
