import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.bts-toggle-mode::before \{[\s\S]*?\}\n/, '');
css = css.replace(/\.bts-toggle-mode \.bts-toggle \{[\s\S]*?\}\n/g, '');

css += `
.bts-toggle-mode {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
.dark-theme .bts-toggle-mode {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
}
.bjs-container.simulation .bts-toggle-mode, .bts-toggle-mode:hover {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>') !important;
  background-color: #10D070 !important;
}
.bts-toggle-mode::before, .bts-toggle-mode .bts-toggle {
  display: none !important;
}
`;

fs.writeFileSync('src/index.css', css);
