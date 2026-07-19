import fs from 'fs';
let code = fs.readFileSync('src/components/DiffModal.tsx', 'utf8');

const target = `        // Changed - in both
        Object.keys(diffChanges._changed).forEach(id => {
          try {
            const html = '<div class="diff-badge diff-changed">~ تغییر یافته (Changed)</div>';
            leftOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            rightOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            const element = rightRegistry.get(id) || leftRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'changed', name, id });
          } catch(e) {}
        });
        
        // Layout Changed - in both
        Object.keys(diffChanges._layoutChanged).forEach(id => {
          try {
            const element = rightRegistry.get(id) || leftRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'layout', name, id });
          } catch(e) {}
        });`;

const replace = `        // Changed - in both
        Object.keys(diffChanges._changed).forEach(id => {
          try {
            const html = '<div class="diff-badge diff-changed">~ تغییر یافته (Changed)</div>';
            leftOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            rightOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            
            const gfxLeft = leftRegistry.getGraphics(id);
            if (gfxLeft) gfxLeft.style.stroke = '#f59e0b';
            const gfxRight = rightRegistry.getGraphics(id);
            if (gfxRight) gfxRight.style.stroke = '#f59e0b';
            
            const element = rightRegistry.get(id) || leftRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'changed', name, id });
          } catch(e) {}
        });
        
        // Layout Changed - in both
        Object.keys(diffChanges._layoutChanged).forEach(id => {
          try {
            const html = '<div class="diff-badge diff-layout">✥ جابجا شده (Layout)</div>';
            leftOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            rightOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });

            const gfxLeft = leftRegistry.getGraphics(id);
            if (gfxLeft) gfxLeft.style.stroke = '#3b82f6';
            const gfxRight = rightRegistry.getGraphics(id);
            if (gfxRight) gfxRight.style.stroke = '#3b82f6';
            
            const element = rightRegistry.get(id) || leftRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'layout', name, id });
          } catch(e) {}
        });`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/DiffModal.tsx', code);
