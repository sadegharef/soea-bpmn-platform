import fs from 'fs';
let code = fs.readFileSync('src/components/DiffModal.tsx', 'utf8');

// Remove everything from the end of loadAndDiff() up to the start of return (
code = code.replace(/    loadAndDiff\(\);[\s\S]*?return \(/, `    loadAndDiff();
    return () => {
      if (leftViewerRef.current) leftViewerRef.current.destroy();
      if (rightViewerRef.current) rightViewerRef.current.destroy();
    };
  }, [oldXml, newXml]);

  const handleFocusChange = (id: string, type: string) => {
    try {
      const viewer = (type === 'removed') ? leftViewerRef.current : rightViewerRef.current;
      if (!viewer) return;
      
      const elementRegistry = viewer.get('elementRegistry');
      const element = elementRegistry.get(id);
      
      if (element) {
        const canvas = viewer.get('canvas');
        const viewbox = { x: element.x - 100, y: element.y - 100, width: element.width + 200, height: element.height + 200 };
        canvas.viewbox(viewbox);
        
        canvas.addMarker(id, 'highlight');
        setTimeout(() => {
          try { canvas.removeMarker(id, 'highlight'); } catch(e){}
        }, 1500);
      }
    } catch(e) {}
  };

  return (`);

fs.writeFileSync('src/components/DiffModal.tsx', code);
