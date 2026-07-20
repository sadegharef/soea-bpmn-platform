import fs from 'fs';
let code = fs.readFileSync('src/components/EmbedViewer.tsx', 'utf8');

code = code.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
  if (!p1.includes('X')) {
    return \`import {\${p1}, X} from "lucide-react";\`;
  }
  return match;
});

code = code.replace(/<AlertCircle className="w-5 h-5 opacity-0" \/>/, '<X className="w-5 h-5" />');

fs.writeFileSync('src/components/EmbedViewer.tsx', code);
