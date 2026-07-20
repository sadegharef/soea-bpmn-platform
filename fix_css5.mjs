import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

const validationCSS = `
/* BPMN Linter Styling for Bottom Panel */
.bjsl-button {
  bottom: 0 !important;
  left: 20px !important;
  transform: none !important;
  border-radius: 6px 6px 0 0 !important;
  padding: 8px 16px !important;
  font-family: inherit !important;
  z-index: 200 !important;
}

.bjsl-dropdown {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 300px !important;
  max-height: 40vh !important;
  background: white !important;
  border-top: 1px solid #e2e8f0 !important;
  box-shadow: 0 -10px 25px rgba(0,0,0,0.05) !important;
  z-index: 150 !important;
  display: none !important; /* handled by .open later */
}

.bjsl-dropdown.open {
  display: block !important;
}

.bjsl-dropdown-content {
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 100% !important;
  padding: 0 !important;
  background: transparent !important;
}

.bjsl-issues {
  background: transparent !important;
  border: none !important;
  padding: 16px 24px !important;
  height: 100% !important;
  width: 100% !important;
  overflow-y: auto !important;
}

.dark-theme .bjsl-dropdown {
  background: #1e293b !important;
  border-color: #334155 !important;
}

.dark-theme .bjsl-issues {
  background: transparent !important;
  color: #f1f5f9 !important;
}

/* Token Simulation Icon only */
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
}
.bts-toggle-mode .bts-toggle {
  margin: 0 !important;
  font-size: 20px !important;
  color: #64748b !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.dark-theme .bts-toggle-mode {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}
.dark-theme .bts-toggle-mode .bts-toggle {
  color: #94a3b8 !important;
}

.bts-palette, .bts-token-simulation-bar {
  position: absolute !important;
  top: 74px !important;
  left: 20px !important;
  right: auto !important;
  z-index: 99 !important;
}
`;

code += validationCSS;
fs.writeFileSync('src/index.css', code);
