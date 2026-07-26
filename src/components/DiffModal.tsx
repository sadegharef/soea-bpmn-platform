/**
 * @file DiffModal.tsx
 * @description پنجره مقایسه بصری و تفاوتی دو نسخه مختلف فرآیند (Diagram Visual Diff شبیه bpmn.io/diff)
 */

import React, { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { diff } from 'bpmn-js-differ';
import { X, SplitSquareHorizontal, FileText, MousePointerClick, ChevronRight, Layers } from 'lucide-react';

interface DiffModalProps {
  oldXml: string;
  newXml: string;
  onClose: () => void;
  theme: 'light' | 'dark';
  lang: 'fa' | 'en';
}

interface ChangeItem {
  id: string;
  name: string;
  type: string; // BPMN element type (Task, Gateway, etc.)
  changeType: 'added' | 'removed' | 'changed' | 'layout';
}

export default function DiffModal({ oldXml, newXml, onClose, theme, lang }: DiffModalProps) {
  const leftCanvasRef = useRef<HTMLDivElement>(null);
  const rightCanvasRef = useRef<HTMLDivElement>(null);
  const leftViewerRef = useRef<any>(null);
  const rightViewerRef = useRef<any>(null);
  
  const [changesCount, setChangesCount] = useState({ added: 0, removed: 0, changed: 0, layout: 0 });
  const [changeList, setChangeList] = useState<ChangeItem[]>([]);
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(null);

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

        const leftOverlays = leftViewerRef.current.get('overlays');
        const rightOverlays = rightViewerRef.current.get('overlays');
        const leftRegistry = leftViewerRef.current.get('elementRegistry');
        const rightRegistry = rightViewerRef.current.get('elementRegistry');

        let diffChanges: any = null;
        try {
          const oldDef = leftViewerRef.current.get('definitions');
          const newDef = rightViewerRef.current.get('definitions');
          if (oldDef && newDef) {
            diffChanges = diff(oldDef, newDef);
          }
        } catch (e) {
          console.warn("bpmn-js-differ error:", e);
        }

        // ElementRegistry visual analysis
        const leftElements = leftRegistry.getAll().filter((e: any) => e.type !== 'bpmn:Process' && e.type !== 'bpmn:Collaboration' && e.id !== 'Process_1');
        const rightElements = rightRegistry.getAll().filter((e: any) => e.type !== 'bpmn:Process' && e.type !== 'bpmn:Collaboration' && e.id !== 'Process_1');

        const leftMap = new Map<string, any>(leftElements.map((e: any) => [e.id, e]));
        const rightMap = new Map<string, any>(rightElements.map((e: any) => [e.id, e]));

        const addedMap = new Map<string, any>();
        const removedMap = new Map<string, any>();
        const changedMap = new Map<string, any>();
        const layoutMap = new Map<string, any>();

        // 1. Added elements in Version B
        rightElements.forEach((rightElem: any) => {
          if (!leftMap.has(rightElem.id)) {
            addedMap.set(rightElem.id, rightElem);
          }
        });
        if (diffChanges && diffChanges._added) {
          Object.keys(diffChanges._added).forEach(id => {
            if (!addedMap.has(id)) {
              const elem = rightRegistry.get(id);
              if (elem) addedMap.set(id, elem);
            }
          });
        }

        // 2. Removed elements in Version A
        leftElements.forEach((leftElem: any) => {
          if (!rightMap.has(leftElem.id)) {
            removedMap.set(leftElem.id, leftElem);
          }
        });
        if (diffChanges && diffChanges._removed) {
          Object.keys(diffChanges._removed).forEach(id => {
            if (!removedMap.has(id)) {
              const elem = leftRegistry.get(id);
              if (elem) removedMap.set(id, elem);
            }
          });
        }

        // 3. Changed & Layout elements
        rightElements.forEach((rightElem: any) => {
          const leftElem: any = leftMap.get(rightElem.id);
          if (leftElem) {
            const leftName = (leftElem.businessObject?.name || '').trim();
            const rightName = (rightElem.businessObject?.name || '').trim();
            if (leftName !== rightName) {
              changedMap.set(rightElem.id, rightElem);
            } else if (
              Math.abs((leftElem.x || 0) - (rightElem.x || 0)) > 3 ||
              Math.abs((leftElem.y || 0) - (rightElem.y || 0)) > 3 ||
              Math.abs((leftElem.width || 0) - (rightElem.width || 0)) > 3 ||
              Math.abs((leftElem.height || 0) - (rightElem.height || 0)) > 3
            ) {
              layoutMap.set(rightElem.id, rightElem);
            }
          }
        });

        if (diffChanges && diffChanges._changed) {
          Object.keys(diffChanges._changed).forEach(id => {
            if (!changedMap.has(id)) {
              const elem = rightRegistry.get(id) || leftRegistry.get(id);
              if (elem) changedMap.set(id, elem);
            }
          });
        }
        if (diffChanges && diffChanges._layoutChanged) {
          Object.keys(diffChanges._layoutChanged).forEach(id => {
            if (!layoutMap.has(id)) {
              const elem = rightRegistry.get(id) || leftRegistry.get(id);
              if (elem) layoutMap.set(id, elem);
            }
          });
        }

        const list: ChangeItem[] = [];

        // Apply highlights & badges
        addedMap.forEach((elem, id) => {
          try {
            rightOverlays.add(id, 'diff', {
              position: { bottom: 0, left: 0 },
              html: '<div class="diff-badge diff-added">+ افزوده‌شده (Added)</div>'
            });
            const gfx = rightRegistry.getGraphics(id);
            if (gfx) gfx.style.stroke = '#10b981';
            const name = elem?.businessObject?.name || id;
            const type = elem?.type ? elem.type.replace('bpmn:', '') : 'Element';
            list.push({ id, name, type, changeType: 'added' });
          } catch(e) {}
        });

        removedMap.forEach((elem, id) => {
          try {
            leftOverlays.add(id, 'diff', {
              position: { bottom: 0, left: 0 },
              html: '<div class="diff-badge diff-removed">- حذف‌شده (Removed)</div>'
            });
            const gfx = leftRegistry.getGraphics(id);
            if (gfx) gfx.style.stroke = '#ef4444';
            const name = elem?.businessObject?.name || id;
            const type = elem?.type ? elem.type.replace('bpmn:', '') : 'Element';
            list.push({ id, name, type, changeType: 'removed' });
          } catch(e) {}
        });

        changedMap.forEach((elem, id) => {
          try {
            const html = '<div class="diff-badge diff-changed">✎ تغییریافته (Changed)</div>';
            leftOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            rightOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            
            const gfxLeft = leftRegistry.getGraphics(id);
            if (gfxLeft) gfxLeft.style.stroke = '#f59e0b';
            const gfxRight = rightRegistry.getGraphics(id);
            if (gfxRight) gfxRight.style.stroke = '#f59e0b';
            
            const name = elem?.businessObject?.name || id;
            const type = elem?.type ? elem.type.replace('bpmn:', '') : 'Element';
            list.push({ id, name, type, changeType: 'changed' });
          } catch(e) {}
        });

        layoutMap.forEach((elem, id) => {
          try {
            const html = '<div class="diff-badge diff-layout">⤢ جابجایی (Layout)</div>';
            leftOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });
            rightOverlays.add(id, 'diff', { position: { bottom: 0, left: 0 }, html });

            const gfxLeft = leftRegistry.getGraphics(id);
            if (gfxLeft) gfxLeft.style.stroke = '#3b82f6';
            const gfxRight = rightRegistry.getGraphics(id);
            if (gfxRight) gfxRight.style.stroke = '#3b82f6';
            
            const name = elem?.businessObject?.name || id;
            const type = elem?.type ? elem.type.replace('bpmn:', '') : 'Element';
            list.push({ id, name, type, changeType: 'layout' });
          } catch(e) {}
        });

        setChangesCount({
          added: addedMap.size,
          removed: removedMap.size,
          changed: changedMap.size,
          layout: layoutMap.size
        });
        setChangeList(list);

        // Synchronize viewboxes between left and right viewers
        const leftEventBus = leftViewerRef.current.get('eventBus');
        const rightEventBus = rightViewerRef.current.get('eventBus');
        let isSyncing = false;
        
        leftEventBus.on('canvas.viewbox.changed', (e: any) => {
          if (isSyncing) return;
          isSyncing = true;
          try { rightCanvas.viewbox(e.viewbox); } catch(err){}
          isSyncing = false;
        });
        
        rightEventBus.on('canvas.viewbox.changed', (e: any) => {
          if (isSyncing) return;
          isSyncing = true;
          try { leftCanvas.viewbox(e.viewbox); } catch(err){}
          isSyncing = false;
        });

      } catch (err) {
        console.error('Error rendering diff viewer:', err);
      }
    };
    
    loadAndDiff();
    
    return () => {
      if (leftViewerRef.current) leftViewerRef.current.destroy();
      if (rightViewerRef.current) rightViewerRef.current.destroy();
    };
  }, [oldXml, newXml]);

  const handleSelectChangeItem = (item: ChangeItem) => {
    setSelectedChangeId(item.id);
    const centerElement = (viewer: any) => {
      if (!viewer) return;
      try {
        const registry = viewer.get('elementRegistry');
        const canvas = viewer.get('canvas');
        const element = registry.get(item.id);
        if (element) {
          const bbox = element.x !== undefined ? {
            x: element.x - 120,
            y: element.y - 120,
            width: (element.width || 100) + 240,
            height: (element.height || 80) + 240
          } : null;
          if (bbox) canvas.viewbox(bbox);
          canvas.addMarker(item.id, 'highlight');
          setTimeout(() => {
            try { canvas.removeMarker(item.id, 'highlight'); } catch(e){}
          }, 2000);
        }
      } catch(e){}
    };

    if (item.changeType === 'removed') {
      centerElement(leftViewerRef.current);
    } else if (item.changeType === 'added') {
      centerElement(rightViewerRef.current);
    } else {
      centerElement(leftViewerRef.current);
      centerElement(rightViewerRef.current);
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[999999] animate-in fade-in duration-200 ${theme === 'dark' ? 'dark-theme dark' : ''}`} dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full h-full max-w-[96vw] max-h-[94vh] flex flex-col font-sans overflow-hidden">
        
        {/* Top Navigation Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 bg-slate-900 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <SplitSquareHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>مقایسه بصری نسخه‌ها (Visual BPMN Diff)</span>
              </h2>
              <p className="text-[11px] text-slate-400">تشخیص اتوماتیک افزوده‌ها، حذفیات، تغییرات ویژگی و جابجایی المان‌ها</p>
            </div>
          </div>

          {/* Quick Counter Summary */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              +{changesCount.added} افزوده‌شده
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
              -{changesCount.removed} حذف‌شده
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              {changesCount.changed} تغییر‌یافته
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
              {changesCount.layout} چیدمان
            </span>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white transition rounded-xl hover:bg-slate-800 cursor-pointer"
            title="بستن پنجره مقایسه"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Side Table panel: List of Changes */}
          <div className="w-80 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 shadow-inner">
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>لیست تغییرات (List of Changes)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                {changeList.length} مورد
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {changeList.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="font-bold text-xs text-slate-700 dark:text-slate-300">هیچ تفاوتی ساختاری یافت نشد</p>
                  <p className="text-[11px] text-slate-400">هر دو نسخه کاملاً همسان هستند.</p>
                </div>
              ) : (
                changeList.map((item, idx) => {
                  const isSelected = selectedChangeId === item.id;
                  return (
                    <div
                      key={`${item.id}-${idx}`}
                      onClick={() => handleSelectChangeItem(item)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 text-xs ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/30'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-slate-400">#{idx + 1}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded inline-block">
                          {item.type}
                        </span>
                      </div>

                      {/* Change Badge */}
                      <div className="shrink-0">
                        {item.changeType === 'added' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white">
                            Added
                          </span>
                        )}
                        {item.changeType === 'removed' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white">
                            Removed
                          </span>
                        )}
                        {item.changeType === 'changed' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                            Changed
                          </span>
                        )}
                        {item.changeType === 'layout' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500 text-white">
                            Layout
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Side-by-side Viewports Area */}
          <div className="flex-1 flex overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
            
            {/* Left Viewer Container: Version A (Old Version) */}
            <div className="flex-1 border-l border-slate-300 dark:border-slate-800 flex flex-col relative">
              <div className="absolute top-3 right-3 z-20 bg-slate-900/90 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md border border-slate-700 backdrop-blur flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>نسخه مبدأ (Version A - Old)</span>
              </div>
              <div ref={leftCanvasRef} className="w-full h-full bpmn-container" dir="ltr"></div>
            </div>

            {/* Right Viewer Container: Version B (New Version) */}
            <div className="flex-1 flex flex-col relative">
              <div className="absolute top-3 right-3 z-20 bg-indigo-900/90 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-md border border-indigo-700 backdrop-blur flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>نسخه جدید (Version B - New)</span>
              </div>
              <div ref={rightCanvasRef} className="w-full h-full bpmn-container" dir="ltr"></div>
            </div>

            {/* Bottom Floating Legend */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-slate-900/95 text-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-700 text-xs backdrop-blur" dir="rtl">
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span>افزوده (+{changesCount.added})</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span>حذف‌شده (-{changesCount.removed})</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span>تغییریافته ({changesCount.changed})</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span>جابجایی ({changesCount.layout})</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
