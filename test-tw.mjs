import { compile } from '@tailwindcss/node';
import fs from 'fs';
try {
  await compile(fs.readFileSync('src/index.css', 'utf8'), { base: '.' });
  console.log("Success");
} catch(e) {
  console.log(e);
}
