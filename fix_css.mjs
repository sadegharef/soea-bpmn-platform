import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// Remove all custom bjsl styling starting from:
// /* BPMN Linter (bpmn-js-bpmnlint) styling overrides */
const linterRegex = /\/\* BPMN Linter \(bpmn-js-bpmnlint\) styling overrides \*\/[\s\S]*?(?=\/\*)/;
code = code.replace(linterRegex, '');

// Also remove the dark mode for bpmnlint if it exists
const darkLinterRegex = /\/\* Dark mode and spacing overrides for bpmnlint \*\/[\s\S]*?(?=\/\*|$)/;
code = code.replace(darkLinterRegex, '');

// Adjust Token Simulation Styling to be an icon on top left
const tokenSimRegex = /\/\* Simulation styling changes \*\/[\s\S]*?(?=\/\*)/;
const newTokenSimCSS = `/* Simulation styling changes */
.bts-toggle-mode {
  position: absolute !important;
  top: 20px !important;
  left: 20px !important;
  right: auto !important;
  bottom: auto !important;
  z-index: 100 !important;
}

/* Ensure the simulation bar (play, pause, etc) is placed near the toggle */
.bts-token-simulation-bar {
  top: 70px !important;
  left: 20px !important;
  right: auto !important;
}

`;
code = code.replace(tokenSimRegex, newTokenSimCSS);

fs.writeFileSync('src/index.css', code);
