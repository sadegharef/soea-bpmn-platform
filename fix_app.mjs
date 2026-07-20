import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. Minimap open: false
code = code.replace(/minimap: {[\s\S]*?}/, 'minimap: {\n        open: false\n      }');
if (!code.includes('minimap: {')) {
    code = code.replace(/container: canvasContainerRef\.current,/, 'container: canvasContainerRef.current,\n      minimap: { open: false },');
}

// 5. Listen to comments.open
const eventBusRegex = /modelerRef\.current = modeler;\s*modeler\.get\('eventBus'\)\.on\('selection\.changed', \(e: any\) => \{[\s\S]*?\}\);/m;
const newEventBusCode = `modelerRef.current = modeler;

    modeler.get('eventBus').on('selection.changed', (e: any) => {
      if (e.newSelection && e.newSelection.length > 0) {
        setSelectedElementId(e.newSelection[0].id);
      } else {
        setSelectedElementId(null);
      }
    });

    modeler.get('eventBus').on('comments.open', (e: any) => {
      setIsPropertiesOpen(true);
      setActiveRightTab("comments");
      setSelectedElementId(e.element.id);
      setTimeout(() => {
        document.getElementById('new-comment-input')?.focus();
      }, 100);
    });`;
code = code.replace(eventBusRegex, newEventBusCode);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
