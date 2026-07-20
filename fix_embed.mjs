import fs from 'fs';
let code = fs.readFileSync('src/components/EmbedViewer.tsx', 'utf8');

// Replace NavigatedViewer with Modeler or Viewer + Selection
// Add activeRightTab and selectedElementId states
// Add Right sidebar
