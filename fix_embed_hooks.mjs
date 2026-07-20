import fs from 'fs';
let code = fs.readFileSync('src/components/EmbedViewer.tsx', 'utf8');

const regex = /viewerRef\.current = viewer;\s*useEffect\(\(\) => \{[\s\S]*?renderComments\(\);\s*\}, \[selectedElementId, isCommentsOpen\]\);/m;

const match = code.match(regex);
if (match) {
  // we remove the nested useEffect
  code = code.replace(regex, 'viewerRef.current = viewer;');
  
  // and we insert the useEffect just before the closing of the component or before the zoom handlers
  const insertIndex = code.indexOf('const handleZoomIn = () => {');
  if (insertIndex > -1) {
    const useEffectCode = match[0].replace('viewerRef.current = viewer;', '').trim() + '\n\n  ';
    code = code.slice(0, insertIndex) + useEffectCode + code.slice(insertIndex);
  }
}

fs.writeFileSync('src/components/EmbedViewer.tsx', code);
