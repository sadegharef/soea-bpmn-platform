import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

let fixPopupCss = `
.djs-popup {
  background: white !important;
  color: #333 !important;
}
.djs-popup .entry {
  color: #333 !important;
}
.dark-theme .djs-popup {
  background: #1e293b !important;
  color: #f8fafc !important;
}
.dark-theme .djs-popup .entry {
  color: #f8fafc !important;
}

/* Fix token simulation overlap */
.bts-toggle-mode {
  right: 20px !important;
  left: auto !important;
  top: 80px !important;
}
.bts-palette {
  right: 20px !important;
  left: auto !important;
  top: 130px !important;
}
`;

fs.writeFileSync('src/index.css', code + '\n' + fixPopupCss);
