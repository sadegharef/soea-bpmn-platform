import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  /\/\* Align Palette to right\/left for Persian layout \*\/[\s\S]*?\.bjs-container \.djs-palette \{[\s\S]*?box-shadow: 0 4px 12px rgba\(0,0,0,0\.08\) !important;/m,
  `/* Align Palette to right/left based on language direction */
html[dir="rtl"] .bjs-container .djs-palette {
  left: auto !important;
  right: 20px !important;
}
html[dir="ltr"] .bjs-container .djs-palette {
  right: auto !important;
  left: 20px !important;
}
.bjs-container .djs-palette {
  top: 20px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;`
);

fs.writeFileSync('src/index.css', code);
