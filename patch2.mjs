import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `/* Grid toggle */
.bpmn-container.no-grid, .bjs-container.no-grid {
  background-image: none !important;
}
.dark-theme .bpmn-container.no-grid, .dark-theme .bjs-container.no-grid {
  background-image: none !important;
}`;

const replace = `/* Grid toggle */
.bpmn-container.no-grid .bjs-container, .bjs-container.no-grid {
  background-image: none !important;
}
.dark-theme .bpmn-container.no-grid .bjs-container, .dark-theme .bjs-container.no-grid {
  background-image: none !important;
}`;

code = code.replace(target, replace);
fs.writeFileSync('src/index.css', code);
