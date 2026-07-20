import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /modeler\.on\("element\.changed", onElementChanged\);/;
const insertCode = `modeler.on("element.changed", onElementChanged);

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

code = code.replace(regex, insertCode);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
