import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// Hide palette and context pad in embed mode
const embedCss = `
.embed-mode .djs-palette,
.embed-mode .bjs-powered-by,
.embed-mode .djs-context-pad {
  display: none !important;
}
`;
if (!code.includes('.embed-mode .djs-context-pad')) {
  fs.writeFileSync('src/index.css', code + '\n' + embedCss);
}
