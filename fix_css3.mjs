import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/\/\* Fix token simulation overlap \*\/[\s\S]*?(?=\/\*)/, '');
// just replace those blocks
code = code.replace(/\.bts-toggle-mode \{[\s\S]*?\}/g, '');
code = code.replace(/\.bts-palette \{[\s\S]*?\}/g, '');

const newTokenSim = `
/* Token Simulation placed at top-left */
.bts-toggle-mode {
  position: absolute !important;
  top: 20px !important;
  left: 20px !important;
  right: auto !important;
  bottom: auto !important;
  z-index: 100 !important;
}

.bts-palette, .bts-token-simulation-bar {
  position: absolute !important;
  top: 70px !important;
  left: 20px !important;
  right: auto !important;
  z-index: 99 !important;
}
`;

code += newTokenSim;
fs.writeFileSync('src/index.css', code);
