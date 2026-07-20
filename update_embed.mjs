import fs from 'fs';
let code = fs.readFileSync('src/components/EmbedViewer.tsx', 'utf8');

// Replace NavigatedViewer with Modeler if it isn't already, but hide palette via CSS.
code = code.replace(/import embeddedCommentsModule from "bpmn-js-embedded-comments";/, '');
code = code.replace(/import "bpmn-js-embedded-comments\/assets\/comments\.css";/, '');
code = code.replace(/additionalModules: \[embeddedCommentsModule\],/, '');

// We need to add selection and the comments panel
if (!code.includes('selectedElementId')) {
  code = code.replace(/const \[theme, setTheme\] = useState<"light" \| "dark">("light");/, 
    'const [theme, setTheme] = useState<"light" | "dark">("light");\n  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);\n  const [isCommentsOpen, setIsCommentsOpen] = useState(false);'
  );
}

let eventListenerCode = `
    viewer.get('eventBus').on('selection.changed', (e: any) => {
      if (e.newSelection && e.newSelection.length > 0) {
        setSelectedElementId(e.newSelection[0].id);
        setIsCommentsOpen(true);
      } else {
        setSelectedElementId(null);
        setIsCommentsOpen(false);
      }
    });
`;

if (!code.includes('selection.changed')) {
  code = code.replace(/viewerRef\.current = viewer;/, 'viewerRef.current = viewer;\n' + eventListenerCode);
}

const commentsSidebar = `
      {/* Comments Sidebar */}
      <div className={\`absolute top-0 right-0 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 z-40 \${isCommentsOpen ? "w-80" : "w-0 overflow-hidden"}\`}>
        <div className="flex flex-col h-full p-4 w-80">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">نظرات</h3>
            <button onClick={() => setIsCommentsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <AlertCircle className="w-5 h-5 opacity-0" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto" id="embed-comments-list">
             {!selectedElementId ? (
                <div className="text-center text-slate-500 text-sm mt-10">عنصری انتخاب نشده است</div>
             ) : (
                <div className="text-center text-slate-500 text-sm mt-10" id="embed-no-comments">نظری برای این عنصر ثبت نشده است</div>
             )}
          </div>
        </div>
      </div>
`;

if (!code.includes('Comments Sidebar')) {
  code = code.replace(/<\/div>\s*<\/div>\s*$/s, '</div>\n' + commentsSidebar + '\n    </div>');
}

let renderCommentsEffect = `
  useEffect(() => {
    if (!viewerRef.current || !selectedElementId || !isCommentsOpen) return;
    
    const renderComments = () => {
      const elementRegistry = viewerRef.current.get('elementRegistry');
      const element = elementRegistry.get(selectedElementId);
      if (!element) return;
      
      const docs = element.businessObject.documentation || [];
      const commentsDoc = docs.find((d:any) => d.textFormat === 'text/x-comments');
      let commentsList = [];
      if (commentsDoc) {
        try { commentsList = JSON.parse(commentsDoc.text); } catch(e){}
      }
      
      const listContainer = document.getElementById('embed-comments-list');
      const noCommentsMsg = document.getElementById('embed-no-comments');
      
      if (listContainer) {
        Array.from(listContainer.children).forEach(child => {
          if (child.id !== 'embed-no-comments') child.remove();
        });
        
        if (commentsList.length > 0) {
          if (noCommentsMsg) noCommentsMsg.style.display = 'none';
          
          commentsList.forEach((comment: any) => {
            const div = document.createElement('div');
            div.className = 'bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-3';
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
  }, [selectedElementId, isCommentsOpen]);
`;

if (!code.includes("renderComments()")) {
  code = code.replace(/viewerRef\.current = viewer;/, 'viewerRef.current = viewer;\n' + renderCommentsEffect);
}

fs.writeFileSync('src/components/EmbedViewer.tsx', code);
