import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

// Fix token simulation text hiding
code = code.replace(/\.dark-theme \/\* Token Simulation Icon only \*\/\n\.bts-toggle-mode \{/g, '/* Token Simulation Icon only */\n.bts-toggle-mode {\n');
// Actually, earlier we added .dark-theme .bts-toggle-mode
// Let's just find and replace the whole token simulation block
code = code.replace(/\/\* Token Simulation placed at top-left \*\/[\s\S]*?\/\* Global BPMN Linter Styling for Bottom Panel \*\//, `/* Token Simulation placed at top-left */
.bts-toggle-mode {
  position: absolute !important;
  top: 20px !important;
  left: 20px !important;
  right: auto !important;
  bottom: auto !important;
  z-index: 100 !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 8px !important;
  background-color: white !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
  font-size: 0 !important;
  color: transparent !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

.bts-toggle-mode::before, .bts-toggle-mode .bts-toggle {
  display: none !important;
}

.dark-theme .bts-toggle-mode {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
}

.bjs-container.simulation .bts-toggle-mode, .bts-toggle-mode:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
  background-color: #10D070 !important;
}

.bts-palette, .bts-token-simulation-bar {
  position: absolute !important;
  top: 74px !important;
  left: 20px !important;
  right: auto !important;
  z-index: 99 !important;
}

/* Hide Simulation Log Badges */
.bts-log .scope {
  display: none !important;
}

/* Global BPMN Linter Styling for Bottom Panel */
`);

code = code.replace(/\.dark-theme \/\* Token Simulation Icon only \*\/[\s\S]*?\.bjs-container\.simulation \.bts-toggle-mode, \.bts-toggle-mode:hover \{[\s\S]*?#10D070 !important;\n\}/, '');

fs.writeFileSync('src/index.css', code);
