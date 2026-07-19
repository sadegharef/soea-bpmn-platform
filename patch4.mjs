import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `.diff-added { background-color: #10b981; }
.diff-changed { background-color: #f59e0b; }
.diff-removed { background-color: #ef4444; }`;

const replace = `.diff-added { background-color: #10b981; }
.diff-changed { background-color: #f59e0b; }
.diff-removed { background-color: #ef4444; }
.diff-layout { background-color: #3b82f6; }`;

code = code.replace(target, replace);
fs.writeFileSync('src/index.css', code);
