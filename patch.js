import fs from 'fs';
let code = fs.readFileSync('src/components/DiffModal.tsx', 'utf8');

const target = `changeDescriptions.map((desc, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-sm border border-slate-200 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">{desc.name}</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      {desc.type === 'added' && <><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-emerald-600 dark:text-emerald-400 font-medium">جدید (Added)</span></>}
                      {desc.type === 'removed' && <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-600 dark:text-red-400 font-medium">حذف شده (Removed)</span></>}
                      {desc.type === 'changed' && <><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-amber-600 dark:text-amber-400 font-medium">تغییر ویژگی‌ها (Changed)</span></>}
                      {desc.type === 'layout' && <><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-blue-600 dark:text-blue-400 font-medium">جابجایی (Layout)</span></>}
                    </div>
                  </div>
                ))`;

const replacement = `changeDescriptions.map((desc, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleFocusChange(desc.id, desc.type)}
                    className="flex flex-col gap-1 text-sm border border-slate-200 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition relative group"
                  >
                    <MousePointerClick className="w-4 h-4 absolute top-2 left-2 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 break-all pl-6">{desc.name}</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      {desc.type === 'added' && <><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-emerald-600 dark:text-emerald-400 font-medium">جدید (Added)</span></>}
                      {desc.type === 'removed' && <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-600 dark:text-red-400 font-medium">حذف شده (Removed)</span></>}
                      {desc.type === 'changed' && <><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-amber-600 dark:text-amber-400 font-medium">تغییر ویژگی‌ها (Changed)</span></>}
                      {desc.type === 'layout' && <><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-blue-600 dark:text-blue-400 font-medium">جابجایی (Layout)</span></>}
                    </div>
                  </div>
                ))`;

code = code.replace(target, replacement);

const handlerCode = `
  const handleFocusChange = (id: string, type: string) => {
    try {
      const viewer = (type === 'removed') ? leftViewerRef.current : rightViewerRef.current;
      if (!viewer) return;
      
      const elementRegistry = viewer.get('elementRegistry');
      const element = elementRegistry.get(id);
      
      if (element) {
        const canvas = viewer.get('canvas');
        
        // Use smooth animation to zoom to element bounding box
        const viewbox = { x: element.x - 100, y: element.y - 100, width: element.width + 200, height: element.height + 200 };
        canvas.viewbox(viewbox);
        
        // Add highlight marker
        canvas.addMarker(id, 'highlight');
        setTimeout(() => {
          try { canvas.removeMarker(id, 'highlight'); } catch(e){}
        }, 1500);
      }
    } catch(e) {}
  };

  return (
`;

code = code.replace("  return (", handlerCode);

fs.writeFileSync('src/components/DiffModal.tsx', code);
