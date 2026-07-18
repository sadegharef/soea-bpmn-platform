import { compile } from '@tailwindcss/node';
import fs from 'fs';
const css = fs.readFileSync('src/index.css', 'utf8');
const lines = css.split('\n');

for (let i = 1; i <= lines.length; i++) {
  const part = lines.slice(0, i).join('\n') + '\n}';
  try {
    await compile(part, { base: '.' });
  } catch(e) {
    if (e.message.includes('Missing opening {')) {
      console.log(`Failed at line ${i}`);
      console.log(lines[i-1]);
      break;
    }
  }
}
