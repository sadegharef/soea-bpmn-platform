import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// Replace the first occurrence
code = code.replace(
  /\/\* Token Simulation placed at top-left \*\/[\s\S]*?\.bts-toggle-mode \{[\s\S]*?left: 20px !important;\s*right: auto !important;/m,
  `/* Token Simulation placed based on language direction */
html[dir="rtl"] .bts-toggle-mode {
  left: auto !important;
  right: 20px !important;
}
html[dir="ltr"] .bts-toggle-mode {
  right: auto !important;
  left: 20px !important;
}
.bts-toggle-mode {
  position: absolute !important;
  top: 20px !important;`
);

code = code.replace(
  /\.bts-palette, \.bts-token-simulation-bar \{\s*position: absolute !important;\s*top: 74px !important;\s*left: 20px !important;\s*right: auto !important;/g,
  `html[dir="rtl"] .bts-palette, html[dir="rtl"] .bts-token-simulation-bar {
  left: auto !important;
  right: 20px !important;
}
html[dir="ltr"] .bts-palette, html[dir="ltr"] .bts-token-simulation-bar {
  right: auto !important;
  left: 20px !important;
}
.bts-palette, .bts-token-simulation-bar {
  position: absolute !important;
  top: 74px !important;`
);

code = code.replace(
  /\.dark-theme\s*\/\* Token Simulation Icon only \*\/[\s\S]*?\.bts-toggle-mode \{[\s\S]*?left: 20px !important;\s*right: auto !important;/m,
  `.dark-theme /* Token Simulation Icon only */\n.bts-toggle-mode {\n`
);

fs.writeFileSync('src/index.css', code);
