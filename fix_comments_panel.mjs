import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const commentsPanelCode = `
            <div className={\`flex-1 h-full overflow-y-auto p-4 flex flex-col \${activeRightTab === 'comments' ? 'block' : 'hidden'}\`}>
              {!selectedElementId ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{lang === 'fa' ? 'همکاری با تیم' : 'Team Collaboration'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[250px]">
                    {lang === 'fa' 
                      ? 'برای ثبت نظر روی یک عنصر، روی آن کلیک کرده و آیکون کامنت 💬 را از منوی شناور انتخاب کنید.' 
                      : 'To add a comment, click on an element and select the comment icon 💬 from the context pad.'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {lang === 'fa' ? 'نظرات عنصر' : 'Element Comments'}
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4" id="comments-list">
                    {/* Comments will be rendered here by a separate component or effect */}
                    <div className="text-xs text-slate-500 text-center italic mt-10" id="no-comments-msg">
                       {lang === 'fa' ? 'اولین نظر را شما ثبت کنید...' : 'Be the first to comment...'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <textarea 
                      id="new-comment-input"
                      className="w-full h-20 text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder={lang === 'fa' ? "نظر خود را بنویسید..." : "Write your comment..."}
                    ></textarea>
                    <button 
                      onClick={() => {
                        const input = document.getElementById('new-comment-input') as HTMLTextAreaElement;
                        if (!input || !input.value.trim() || !viewerRef.current || !selectedElementId) return;
                        
                        const elementRegistry = viewerRef.current.get('elementRegistry');
                        const element = elementRegistry.get(selectedElementId);
                        const modeling = viewerRef.current.get('modeling');
                        const moddle = viewerRef.current.get('moddle');
                        
                        if (!element) return;
                        
                        const docs = element.businessObject.documentation || [];
                        const commentsDoc = docs.find((d:any) => d.textFormat === 'text/x-comments');
                        let commentsList = [];
                        if (commentsDoc) {
                          try { commentsList = JSON.parse(commentsDoc.text); } catch(e){}
                        }
                        
                        commentsList.push({
                          id: Date.now().toString(),
                          text: input.value.trim(),
                          date: new Date().toISOString(),
                          author: 'User'
                        });
                        
                        const newDoc = moddle.create('bpmn:Documentation', {
                          text: JSON.stringify(commentsList),
                          textFormat: 'text/x-comments'
                        });
                        
                        modeling.updateProperties(element, {
                          documentation: [newDoc, ...docs.filter((d:any) => d.textFormat !== 'text/x-comments')]
                        });
                        
                        input.value = '';
                        // Trigger re-render of comments list
                        const eventBus = viewerRef.current.get('eventBus');
                        eventBus.fire('comments.updated', { element: element });
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      {lang === 'fa' ? 'ثبت نظر' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
`;

code = code.replace(/<div className=\{\`flex-1 h-full overflow-y-auto p-6 flex flex-col items-center justify-center text-center \$\{activeRightTab === 'comments' \? 'block' : 'hidden'\}\`\}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, commentsPanelCode + '\n          </div>\n        </div>');

// Add effect to render comments
let renderCommentsEffect = `
  useEffect(() => {
    if (!viewerRef.current || !selectedElementId || activeRightTab !== 'comments') return;
    
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
      
      const listContainer = document.getElementById('comments-list');
      const noCommentsMsg = document.getElementById('no-comments-msg');
      
      if (listContainer) {
        // Clear existing except no comments msg
        Array.from(listContainer.children).forEach(child => {
          if (child.id !== 'no-comments-msg') child.remove();
        });
        
        if (commentsList.length > 0) {
          if (noCommentsMsg) noCommentsMsg.style.display = 'none';
          
          commentsList.forEach((comment: any) => {
            const div = document.createElement('div');
            div.className = 'bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-100 dark:border-slate-700';
            div.innerHTML = \`
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">\${comment.author}</span>
                <span class="text-[10px] text-slate-400">\${new Date(comment.date).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</span>
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
    
    const eventBus = viewerRef.current.get('eventBus');
    eventBus.on('comments.updated', renderComments);
    
    return () => {
      eventBus.off('comments.updated', renderComments);
    };
  }, [selectedElementId, activeRightTab, lang]);
`;

if (!code.includes("comments.updated")) {
  code = code.replace(/viewerRef\.current = modeler;/, 'viewerRef.current = modeler;\n' + renderCommentsEffect);
}

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
