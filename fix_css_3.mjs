import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.djs-context-pad \.entry \{ background-color: #ffffff !important; color: #334155 !important; \} \.djs-context-pad \.entry:hover \{ background-color: #f1f5f9 !important; color: #0f172a !important; \} \.djs-context-pad \{[\s\S]*?\}\n/g, '');
css = css.replace(/\.dark-theme \.djs-context-pad \.entry \{ background-color: #ffffff !important; color: #334155 !important; \} \.djs-context-pad \.entry:hover \{ background-color: #f1f5f9 !important; color: #0f172a !important; \} \.djs-context-pad \{[\s\S]*?\}\n/g, '');

fs.writeFileSync('src/index.css', css);
