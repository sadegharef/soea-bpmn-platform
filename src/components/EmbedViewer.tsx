import React, { useEffect, useRef, useState } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";


import { Diagram } from "../types";
import { Eye, RotateCcw, ZoomIn, ZoomOut, AlertCircle, Loader2, X } from "lucide-react";

interface EmbedViewerProps {
  processId: string;
}

export default function EmbedViewer({ processId }: EmbedViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<BpmnModeler | null>(null);
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme preference from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("bpmn-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [theme]);

  // Fetch diagram XML
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/diagrams/${processId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("نمودار مورد نظر یافت نشد.");
        }
        return res.json();
      })
      .then((data: Diagram) => {
        setDiagram(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading diagram for embedding:", err);
        setError(err.message || "خطا در برقراری ارتباط با سرور");
        setLoading(false);
      });
  }, [processId]);

  // Initialize NavigatedViewer
  useEffect(() => {
    if (loading || error || !diagram || !containerRef.current) return;

    // Clean up existing viewer if any
    if (viewerRef.current) {
      viewerRef.current.destroy();
    }

    const viewer = new BpmnModeler({
        
      container: containerRef.current
    });

    viewerRef.current = viewer;


    viewer.get('eventBus').on('selection.changed', (e: any) => {
      if (e.newSelection && e.newSelection.length > 0) {
        setSelectedElementId(e.newSelection[0].id);
        setIsCommentsOpen(true);
      } else {
        setSelectedElementId(null);
        setIsCommentsOpen(false);
      }
    });


    viewer.importXML(diagram.xml)
      .then(() => {
        const canvas = viewer.get("canvas") as any;
        if (canvas) {
          canvas.zoom("fit-viewport");
        }
      })
      .catch((err) => {
        console.error("Error importing XML into viewer:", err);
        setError("قالب XML نمودار نامعتبر است.");
      });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [diagram, loading, error]);

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
            div.innerHTML = `
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${comment.author}</span>
                <span class="text-[10px] text-slate-400">${new Date(comment.date).toLocaleDateString('fa-IR')}</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">${comment.text}</p>
            `;
            listContainer.insertBefore(div, noCommentsMsg);
          });
        } else {
          if (noCommentsMsg) noCommentsMsg.style.display = 'block';
        }
      }
    };
    
    renderComments();
  }, [selectedElementId, isCommentsOpen]);

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get("canvas") as any;
      canvas.zoom(canvas.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get("canvas") as any;
      canvas.zoom(canvas.zoom() * 0.8);
    }
  };

  const handleZoomReset = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get("canvas") as any;
      canvas.zoom("fit-viewport");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("bpmn-theme", nextTheme);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100" id="loading-view">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <span className="text-lg font-medium">در حال بارگذاری فرآیند...</span>
      </div>
    );
  }

  if (error || !diagram) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 text-center" id="error-view">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold mb-2">خطا در بارگذاری فرآیند</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`} id="embed-viewer">
      {/* Tiny overlay header */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-800/95 shadow-md px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 pointer-events-auto">
          <Eye className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{diagram.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            نسخه {diagram.latestVersion}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom controls */}
          <div className="flex items-center bg-white/95 dark:bg-slate-800/95 shadow-md rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              title="بزرگنمایی"
              id="zoom-in-btn"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              title="کوچک‌نمایی"
              id="zoom-out-btn"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
              title="تناسب با صفحه"
              id="zoom-fit-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Theme control */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2.5 bg-white/95 dark:bg-slate-800/95 shadow-md rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="تغییر تم"
            id="theme-btn"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* BPMN Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bpmn-container" 
        id="bpmn-canvas-embed"
      />
    </div>
  );
}
