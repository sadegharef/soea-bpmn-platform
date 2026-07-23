import React, { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { BpmnModdle } from 'bpmn-moddle';
import { diff } from 'bpmn-js-differ';
import { X, SplitSquareHorizontal, FileText, MousePointerClick } from 'lucide-react';

interface DiffModalProps {
  oldXml: string;
  newXml: string;
  onClose: () => void;
  theme: 'light' | 'dark';
  lang: 'fa' | 'en';
}

export default function DiffModal({ oldXml, newXml, onClose, theme, lang }: DiffModalProps) {
  const leftCanvasRef = useRef<HTMLDivElement>(null);
  const rightCanvasRef = useRef<HTMLDivElement>(null);
  const leftViewerRef = useRef<any>(null);
  const rightViewerRef = useRef<any>(null);
  const [changes, setChanges] = useState<any>(null);
  const [changeDescriptions, setChangeDescriptions] = useState<{type: string, name: string, id: string}[]>([]);

  useEffect(() => {
    leftViewerRef.current = new BpmnViewer({
      container: leftCanvasRef.current,
      additionalModules: []
    });
    rightViewerRef.current = new BpmnViewer({
      container: rightCanvasRef.current,
      additionalModules: []
    });
    const loadAndDiff = async () => {
      try {
        await leftViewerRef.current.importXML(oldXml);
        await rightViewerRef.current.importXML(newXml);
        
        const leftCanvas = leftViewerRef.current.get('canvas');
        const rightCanvas = rightViewerRef.current.get('canvas');
        leftCanvas.zoom('fit-viewport');
        rightCanvas.zoom('fit-viewport');

        const moddle = new BpmnModdle();
        const { rootElement: oldDef } = await moddle.fromXML(oldXml);
        const { rootElement: newDef } = await moddle.fromXML(newXml);
        
        const diffChanges = diff(oldDef, newDef);
        setChanges(diffChanges);
        
        const leftOverlays = leftViewerRef.current.get('overlays');
        const rightOverlays = rightViewerRef.current.get('overlays');
        const leftRegistry = leftViewerRef.current.get('elementRegistry');
        const rightRegistry = rightViewerRef.current.get('elementRegistry');

        const descriptions: {type: string, name: string, id: string}[] = [];

        // Added - only in new
        Object.keys(diffChanges._added).forEach(id => {
          try {
            rightOverlays.add(id, 'diff', {
              position: { bottom: 0, left: 0 },
              html: '<div class="diff-badge diff-added">+ جدید (Added)</div>'
            });
            const gfx = rightRegistry.getGraphics(id);
            if (gfx) {
              gfx.style.stroke = '#10b981';
            }
            const element = rightRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'added', name, id });
          } catch(e) {}
        });

        // Removed - only in old
        Object.keys(diffChanges._removed).forEach(id => {
          try {
            leftOverlays.add(id, 'diff', {
              position: { bottom: 0, left: 0 },
              html: '<div class="diff-badge diff-removed">- حذف شده (Removed)</div>'
            });
            const gfx = leftRegistry.getGraphics(id);
            if (gfx) {
              gfx.style.stroke = '#ef4444';
            }
            const element = leftRegistry.get(id);
            const name = element?.businessObject?.name || element?.type.replace('bpmn:', '') || id;
            descriptions.push({ type: 'removed', name, id });
          } catch(e) {}
        });

        // Changed - in both
        Object.keys(diffChanges._changed).forEach(id => {
          try {
            const html = `<div class="diff-badge diff-changed">${t("diffBadgeChanged", lang)}</div>`;
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
            const html = `<div class="diff-badge diff-layout">${t("diffBadgeLayout", lang)}</div>`;
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
        });

        setChangeDescriptions(descriptions);

        // Sync viewboxes (scroll/pan sync)
        const leftEventBus = leftViewerRef.current.get('eventBus');
        const rightEventBus = rightViewerRef.current.get('eventBus');
        let isSyncing = false;
        
        leftEventBus.on('canvas.viewbox.changed', (e: any) => {
          if (isSyncing) return;
          isSyncing = true;
          rightCanvas.viewbox(e.viewbox);
          isSyncing = false;
        });
        
        rightEventBus.on('canvas.viewbox.changed', (e: any) => {
          if (isSyncing) return;
          isSyncing = true;
          leftCanvas.viewbox(e.viewbox);
          isSyncing = false;
        });

      } catch (err) {
        console.error('Error in diff viewer:', err);
      }
    };
    
    loadAndDiff();
    
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

  return (
    <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200 ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
            <SplitSquareHorizontal className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-lg">{t("diffModalTitle", lang)}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for descriptions */}
          <div className="w-72 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-slate-50 dark:bg-slate-950 z-10 flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
              <FileText className="w-4 h-4" />
              تغییرات یافت شده
            </div>
            <div className="p-4 space-y-3">
              {changeDescriptions.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">{t("noChangesFound", lang)}</div>
              ) : (
                changeDescriptions.map((desc, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleFocusChange(desc.id, desc.type)}
                    className="flex flex-col gap-1 text-sm border border-slate-200 dark:border-slate-700 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition relative group"
                  >
                    <MousePointerClick className="w-4 h-4 absolute top-2 left-2 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 break-all pl-6">{desc.name}</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      {desc.type === 'added' && <><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-emerald-600 dark:text-emerald-400 font-medium">{t("diffAdded", lang)}</span></>}
                      {desc.type === 'removed' && <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-600 dark:text-red-400 font-medium">{t("diffRemoved", lang)}</span></>}
                      {desc.type === 'changed' && <><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-amber-600 dark:text-amber-400 font-medium">{t("diffChanged", lang)}</span></>}
                      {desc.type === 'layout' && <><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-blue-600 dark:text-blue-400 font-medium">{t("diffLayout", lang)}</span></>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Diff Canvas Area */}
          <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
            <div className="flex-1 border-l border-slate-200 dark:border-slate-700 flex flex-col relative">
              <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur text-slate-800 dark:text-slate-200">
                نسخه قبلی
              </div>
              <div ref={leftCanvasRef} className="w-full h-full bpmn-container" dir="ltr"></div>
            </div>

            <div className="flex-1 flex flex-col relative">
               <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur text-slate-800 dark:text-slate-200">
                نسخه فعلی
              </div>
              <div ref={rightCanvasRef} className="w-full h-full bpmn-container" dir="ltr"></div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur" dir="ltr">
               <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span>Added ({changes?._added ? Object.keys(changes._added).length : 0})</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-red-500"></span>
                  <span>Removed ({changes?._removed ? Object.keys(changes._removed).length : 0})</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-amber-500"></span>
                  <span>Changed ({changes?._changed ? Object.keys(changes._changed).length : 0})</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-blue-500"></span>
                  <span>Layout ({changes?._layoutChanged ? Object.keys(changes._layoutChanged).length : 0})</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
