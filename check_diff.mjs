import fs from 'fs';
const code = fs.readFileSync('src/components/DiffModal.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, i) => {
  if (/[\u0600-\u06FF]/.test(line)) {
    console.log(`${i + 1}: ${line}`);
  }
});
