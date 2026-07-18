const fs = require('fs');
const css = fs.readFileSync('src/index.css', 'utf8');
let depth = 0;
const lines = css.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') depth++;
    if (line[j] === '}') depth--;
    if (depth < 0) {
      console.log(`Extra closing brace at line ${i+1}`);
      depth = 0; // reset
    }
  }
}
console.log("Final depth:", depth);
