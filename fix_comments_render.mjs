import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const insertCode = `
  // Render Comments when selected element changes or a new comment is added
  useEffect(() => {
    if (!modelerRef.current || !selectedElementId || activeRightTab !== 'comments') return;
    
    const renderComments = () => {
      const elementRegistry = modelerRef.current?.get('elementRegistry');
      if (!elementRegistry) return;
      const element = elementRegistry.get(selectedElementId);
      if (!element) return;
      
      const docs = element.businessObject.documentation || [];
      const commentsDoc = docs.find((d:any) => d.textFormat === 'text/x-comments');
      let commentsList = [];
      if (commentsDoc) {
        try { commentsList = JSON.parse(commentsDoc.text); } catch(e){}
      }
      
      const listContainer = document.getElementById('comments-list');
      const noCommentsMsg = document.getElementById('no-comments-msg');
      
      if (listContainer) {
        // Clear all previous comments
        Array.from(listContainer.children).forEach(child => {
          if (child.id !== 'no-comments-msg') child.remove();
        });
        
        if (commentsList.length > 0) {
          if (noCommentsMsg) noCommentsMsg.style.display = 'none';
          
          commentsList.forEach((comment: any) => {
            const div = document.createElement('div');
            div.className = 'bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-3 relative group';
            div.innerHTML = \`
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">\${comment.author}</span>
                <span class="text-[10px] text-slate-400">\${new Date(comment.date).toLocaleDateString('fa-IR')}</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">\${comment.text}</p>
            \`;
            listContainer.insertBefore(div, noCommentsMsg);
          });
        } else {
          if (noCommentsMsg) noCommentsMsg.style.display = 'block';
        }
      }
    };
    
    renderComments();
    
    // Listen for changes on this specific element's documentation
    const eventBus = modelerRef.current.get('eventBus');
    const changeListener = (e: any) => {
       if (e.element && e.element.id === selectedElementId) {
         renderComments();
       }
    };
    eventBus.on('element.changed', changeListener);
    
    return () => {
      eventBus.off('element.changed', changeListener);
    };
  }, [selectedElementId, activeRightTab, currentDiagram]); // Re-run if diagram changes
`;

// Insert after useEffect(() => { if (!modelerRef.current || !diagramName) return; ... }, [diagramName]);
const regex = /  \}, \[diagramName\]\);/;
code = code.replace(regex, '  }, [diagramName]);\n' + insertCode);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
