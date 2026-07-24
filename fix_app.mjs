import fs from 'fs';

// 1. types.ts
let typesStr = fs.readFileSync('src/types.ts', 'utf8');
typesStr = typesStr.replace(/editorName: string;/g, 'editorName: string;\n  editorNameEn?: string;');
typesStr = typesStr.replace(/name: string;/g, 'name: string;\n  nameEn?: string;');
fs.writeFileSync('src/types.ts', typesStr);

// 2. server.ts
let serverStr = fs.readFileSync('server.ts', 'utf8');
serverStr = serverStr.replace(/editorName: string;/g, 'editorName: string;\n  editorNameEn?: string;');
serverStr = serverStr.replace(/name: string;/g, 'name: string;\n  nameEn?: string;');
serverStr = serverStr.replace(/const list = Object\.values\(db\.diagrams\)\.map\(\(\{ id, name, createdAt, updatedAt, latestVersion, tags \}\) => \(\{/g, 'const list = Object.values(db.diagrams).map(({ id, name, nameEn, createdAt, updatedAt, latestVersion, tags }) => ({');
serverStr = serverStr.replace(/id,\n    name,/g, 'id,\n    name,\n    nameEn,');
serverStr = serverStr.replace(/const \{ name, editorName, tags \} = req\.body;/g, 'const { name, nameEn, editorName, editorNameEn, tags } = req.body;');
serverStr = serverStr.replace(/name,\n    tags: tags \|\| \[\],/g, 'name,\n    nameEn,\n    tags: tags || [],');
serverStr = serverStr.replace(/editorName: editorName \|\| "کاربر ناشناس"/g, 'editorName: editorName || "کاربر ناشناس",\n        editorNameEn: editorNameEn || "Unknown Editor"');
serverStr = serverStr.replace(/const \{ xml, editorName, name \} = req\.body;/g, 'const { xml, editorName, editorNameEn, name, nameEn } = req.body;');
serverStr = serverStr.replace(/editorName: editorName \|\| "ویرایشگر ناشناس"/g, 'editorName: editorName || "ویرایشگر ناشناس",\n    editorNameEn: editorNameEn || "Unknown Editor"');
serverStr = serverStr.replace(/if \(name\) \{\n    diagram\.name = name;\n  \}/g, 'if (name) {\n    diagram.name = name;\n  }\n  if (nameEn !== undefined) {\n    diagram.nameEn = nameEn;\n  }');
fs.writeFileSync('server.ts', serverStr);

// 3. customTranslate.ts
let transStr = fs.readFileSync('src/lib/customTranslate.ts', 'utf8');
transStr = transStr.replace(/fa: \{/g, `fa: {\n    'Create start event': 'ایجاد رویداد شروع',\n    'Create end event': 'ایجاد رویداد پایان',\n    'Create gateway': 'ایجاد درگاه (Gateway)',\n    'Create task': 'ایجاد وظیفه (Task)',\n    'Create intermediate/boundary event': 'ایجاد رویداد میانی/مرزی',\n    'Create expanded sub-process': 'ایجاد زیرفرآیند باز شده',\n    'Create pool/participant': 'ایجاد استخر/مشارکت‌کننده',\n    'Create data object reference': 'ایجاد شیء داده',\n    'Create data store reference': 'ایجاد پایگاه داده',\n    'Create group': 'ایجاد گروه',\n    'Process started': 'شروع فرآیند',`);
fs.writeFileSync('src/lib/customTranslate.ts', transStr);

// 4. index.css
let cssStr = fs.readFileSync('src/index.css', 'utf8');
cssStr += `\n/* Hide token simulation id badges */\n.bts-log .scope,\n.bts-log .id,\n.bts-log .badge,\n.bts-log .identifier,\n.bts-log-entry .scope,\n.bts-log-entry .id {\n  display: none !important;\n}\n`;
fs.writeFileSync('src/index.css', cssStr);

