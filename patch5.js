const fs = require('fs');
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const target = `    const onElementChanged = (e: any) => {
      // Keep name synchronized
    };

    modeler.on("element.changed", onElementChanged);`;

const replace = `    const onElementChanged = (e: any) => {
      // Keep name synchronized
    };

    modeler.on("element.changed", onElementChanged);

    modeler.on("import.done", ({ error }) => {
      if (!error) {
        const canvas = modeler.get("canvas") as any;
        if (canvas) {
          setTimeout(() => canvas.zoom("fit-viewport", "auto"), 100);
        }
      }
    });`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
