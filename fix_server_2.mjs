import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/const \{ name, editorName \} = req\.body;/, 'const { name, editorName, tags } = req.body;');
code = code.replace(/name,\n    createdAt:/, 'name,\n    tags: tags || [],\n    createdAt:');

code = code.replace(/const \{ xml, name, editorName \} = req\.body;/, 'const { xml, name, editorName, tags } = req.body;');
code = code.replace(/if \(name\) diagram\.name = name;/, 'if (name) diagram.name = name;\n  if (tags) diagram.tags = tags;');

fs.writeFileSync('server.ts', code);
