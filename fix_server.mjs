import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/latestVersion: number;\n  xml: string;/, 'latestVersion: number;\n  tags?: string[];\n  xml: string;');

code = code.replace(/name: "فرآیند نمونه خرید سازمانی",\n        createdAt:/, 'name: "فرآیند نمونه خرید سازمانی",\n        tags: ["نمونه", "AS-IS", "فرآیند خرید"],\n        createdAt:');

code = code.replace(/const list = Object\.values\(db\.diagrams\)\.map\(\(\{ id, name, createdAt, updatedAt, latestVersion \}\) => \(\{/, 'const list = Object.values(db.diagrams).map(({ id, name, createdAt, updatedAt, latestVersion, tags }) => ({');

code = code.replace(/id,\n    name,\n    createdAt,\n    updatedAt,\n    latestVersion,\n  \}\)\);/, 'id,\n    name,\n    createdAt,\n    updatedAt,\n    latestVersion,\n    tags: tags || [],\n  }));');

// Also update the POST /api/diagrams endpoint to handle tags
// Wait, I should just do this with regex or string replacement.
fs.writeFileSync('server.ts', code);
