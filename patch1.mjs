import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const target1 = `        if (modelerRef.current) {
          modelerRef.current.importXML(xmlToLoad).catch((err) => {
            console.error("Error loading XML into modeler:", err);
            // Fallback to original
            modelerRef.current?.importXML(data.xml);
          });
        }`;

const replace1 = `        if (modelerRef.current) {
          modelerRef.current.importXML(xmlToLoad)
            .then(() => {
              const canvas = modelerRef.current?.get("canvas");
              if (canvas) {
                setTimeout(() => canvas.zoom("fit-viewport", "auto"), 100);
              }
            })
            .catch((err) => {
              console.error("Error loading XML into modeler:", err);
              modelerRef.current?.importXML(data.xml).then(() => {
                const canvas = modelerRef.current?.get("canvas");
                if (canvas) {
                  setTimeout(() => canvas.zoom("fit-viewport", "auto"), 100);
                }
              });
            });
        }`;

code = code.replace(target1, replace1);

const target2 = `      modeler.importXML(draft || currentDiagram.xml).then(() => {
        const canvas = modeler.get("canvas") as any;
        if (canvas) {
          setTimeout(() => canvas.zoom("fit-viewport", "auto"), 100);
        }
        try {
          const minimap = modeler.get("minimap") as any;
          if (minimap) minimap.open();
        } catch (e) { }
      });`;

const replace2 = `      modeler.importXML(draft || currentDiagram.xml).then(() => {
        const canvas = modeler.get("canvas") as any;
        if (canvas) {
          setTimeout(() => canvas.zoom("fit-viewport", "auto"), 250);
        }
        try {
          const minimap = modeler.get("minimap") as any;
          if (minimap) minimap.open();
        } catch (e) { }
      });`;

code = code.replace(target2, replace2);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
