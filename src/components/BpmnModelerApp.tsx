import React, { useEffect, useRef, useState } from "react";
import { t, formatDateTime } from "../lib/i18n";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { Diagram, DiagramListItem, DiagramVersion } from "../types";
import packedBpmnlintConfig from "../lib/packedBpmnlintConfig";
import DiffModal from "./DiffModal";

// Core bpmn-js modules & extensions
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from "bpmn-js-properties-panel";
import minimapModule from "diagram-js-minimap";
import colorPickerModule from "bpmn-js-color-picker";
import tokenSimulationModule from "bpmn-js-token-simulation";
import lintModule from "bpmn-js-bpmnlint";
import { CreateAppendAnythingModule } from "bpmn-js-create-append-anything";
import customTranslate, { customTranslateModule } from "../lib/customTranslate";

import { BpmnModdle } from "bpmn-moddle";
import { diff } from "bpmn-js-differ";
import CustomContextPadProvider, { customContextPadModule } from "../lib/CustomContextPadProvider";

import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";

// Export and PDF engines
import { jsPDF } from "jspdf";
import { svg2pdf } from "svg2pdf.js";

// Lucide icons
import {
  Plus,
  Save,
  Download,
  Undo2,
  Redo2,
  History,
  FileCode,
  FileSpreadsheet,
  FileDown,
  User,
  Settings,
  X,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Menu,
  ChevronRight,
  ChevronLeft,
  Moon,
  Sun,
  Trash2,
  Loader2,
  Share2,
  ZoomIn,
  ZoomOut,
  Focus,
  GitCompare,
  MoreVertical,
  MessageSquare
, FilePlus, Upload, Link2, Image, ChevronDown, Globe, Reply, Workflow } from "lucide-react";

export default function BpmnModelerApp() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);

  // Lists & metadata
  const [diagrams, setDiagrams] = useState<DiagramListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("demo-process");
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [lintIssues, setLintIssues] = useState<any[]>([]);
  const [isLintPanelOpen, setIsLintPanelOpen] = useState(true);

  // Form states
  const [diagramName, setDiagramName] = useState<string>("");
  const [editorName, setEditorName] = useState<string>(() => {
    return localStorage.getItem("bpmn-editor-name") || t("defaultEditorName", lang);
  });

  // UI toggles
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<"details" | "comments">("details");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light"); 
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [isSaving, setIsSaving] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [diffingXmls, setDiffingXmls] = useState<{ oldXml: string, newXml: string } | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [newProcessTags, setNewProcessTags] = useState("");
  const [isTagsMenuOpen, setIsTagsMenuOpen] = useState(false);
  const [addTagInput, setAddTagInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("bpmn-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Sync theme class with document root
  
  
  // Fix hardcoded Token Simulation titles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const toggleBtn = document.querySelector('.bts-toggle-mode');
      if (toggleBtn) {
        toggleBtn.setAttribute('title', lang === 'fa' ? 'شبیه‌سازی فرآیند' : 'Token Simulation');
      }
      const logHeader = document.querySelector('.bts-log .header');
      if (logHeader && lang === 'fa' && logHeader.textContent?.includes('Simulation Log')) {
        logHeader.textContent = logHeader.textContent.replace('Simulation Log', 'تاریخچه شبیه‌سازی');
      }
    });
    if (canvasContainerRef.current) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [lang]);

  useEffect(() => {
    (window as any).__BPMN_LANG__ = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    if (modelerRef.current) {
      // Force re-render of canvas by recreating it or we can just trigger a save and re-import
      // but it's simpler to just let the user know, or re-instantiate.
      // Re-instantiating the modeler is safest for complete translation change.
    }
  }, [lang]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [theme]);

  // Fetch all diagrams on mount
  const loadDiagramList = (selectIdAfterLoad?: string) => {
    fetch("/api/diagrams")
      .then((res) => res.json())
      .then((data: DiagramListItem[]) => {
        setDiagrams(data);
        if (data.length > 0) {
          const nextId = selectIdAfterLoad || data[0].id;
          setSelectedId(nextId);
        }
      })
      .catch((err) => console.error("Error loading diagrams:", err));
  };

  useEffect(() => {
    loadDiagramList();
  }, []);

  // Fetch and load selected diagram
  useEffect(() => {
    if (!selectedId) return;

    fetch(`/api/diagrams/${selectedId}`)
      .then((res) => res.json())
      .then((data: Diagram) => {
        setCurrentDiagram(data);
        setDiagramName(data.name);

        // Check for local storage drafts first!
        const localDraft = localStorage.getItem(`bpmn-draft-${selectedId}`);
        const xmlToLoad = localDraft || data.xml;

        if (modelerRef.current) {
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
        }
      })
      .catch((err) => console.error("Error fetching diagram:", err));
  }, [selectedId]);

  // Initialize Modeler
  useEffect(() => {
    if (!canvasContainerRef.current || !propertiesPanelRef.current) return;

    // Destroy existing modeler
    if (modelerRef.current) {
      modelerRef.current.destroy();
    }

    const modeler = new BpmnModeler({
      container: canvasContainerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      minimap: {
        open: false
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        minimapModule,
        colorPickerModule,
        tokenSimulationModule,
        CreateAppendAnythingModule,
        lintModule,
        customTranslateModule,
        customContextPadModule,
        { __init__: ["customContextPad"], customContextPad: ["type", CustomContextPadProvider] }
      ],
      linting: {
        bpmnlint: packedBpmnlintConfig,
        active: true
      }
    });

    modelerRef.current = modeler;
    modeler.on("linting.completed", (event: any) => {
      const issuesObj = event.issues || {};
      const newIssues: any[] = [];
      for (const elementId in issuesObj) {
        issuesObj[elementId].forEach((issue: any) => {
          newIssues.push({
            elementId,
            message: issue.message,
            category: issue.category
          });
        });
      }
      setLintIssues(newIssues);
    });


    // Open first default diagram if not yet done
    if (currentDiagram) {
      const draft = localStorage.getItem(`bpmn-draft-${currentDiagram.id}`);
      modeler.importXML(draft || currentDiagram.xml).then(() => {
        const canvas = modeler.get("canvas") as any;
        if (canvas) {
          setTimeout(() => canvas.zoom("fit-viewport", "auto"), 250);
        }
        try {
          const minimap = modeler.get("minimap") as any;
          if (minimap) minimap.close();
        } catch (e) { }
      });
    }

    // CommandStack changes (Undo/Redo, Autosave)
    const onCommandStackChanged = () => {
      if (!modelerRef.current || !currentDiagram) return;

      setIsSavingDraft(true);
      modelerRef.current.saveXML({ format: true }).then(({ xml }) => {
        if (xml) {
          localStorage.setItem(`bpmn-draft-${currentDiagram.id}`, xml);
          setTimeout(() => setIsSavingDraft(false), 800);
        }
      });
    };

    modeler.on("commandStack.changed", onCommandStackChanged);
    
    // Sync Process name changes from canvas/properties panel to our input
    const onElementChanged = (e: any) => {
      if (e.element && e.element.type === "bpmn:Process") {
        const newName = e.element.businessObject?.name;
        if (newName) {
          setDiagramName(prev => prev !== newName ? newName : prev);
        }
      }
    };
    modeler.on("element.changed", onElementChanged);

    (modeler.get('eventBus') as any).on('selection.changed', (e: any) => {
      if (e.newSelection && e.newSelection.length > 0) {
        setSelectedElementId(e.newSelection[0].id);
      } else {
        setSelectedElementId(null);
      }
    });

    (modeler.get('eventBus') as any).on('comments.open', (e: any) => {
      setIsPropertiesOpen(true);
      setActiveRightTab("comments");
      setSelectedElementId(e.element.id);
      setTimeout(() => {
        document.getElementById('new-comment-input')?.focus();
      }, 100);
    });

    (modeler.get('eventBus') as any).on('details.open', (e: any) => {
      setIsPropertiesOpen(true);
      setActiveRightTab("details");
      setSelectedElementId(e.element.id);
    });

    // Custom BPMNLint overlay modifier using MutationObserver for bulletproof updates
    const observer = new MutationObserver((mutations) => {
      const overlays = document.querySelectorAll('.bjsl-overlay');
      overlays.forEach(overlay => {
        const issuesList = overlay.querySelectorAll('.bjsl-issues li');
        if (issuesList.length > 0) {
          const icon = overlay.querySelector('.bjsl-icon') as HTMLElement;
          if (icon && !icon.dataset.modified) {
            icon.dataset.modified = "true";
            const isError = overlay.querySelector('.bjsl-icon-error');
            const color = isError ? "var(--color-red-360-100-40)" : "#f7c71a";
            icon.innerHTML = `<span style="font-size:12px; font-weight:bold; font-family:sans-serif;">${issuesList.length}</span>`;
          }
        }
      });
    });
    
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current, { childList: true, subtree: true });
    }


    return () => {
      modeler.off("commandStack.changed", onCommandStackChanged);
      modeler.off("element.changed", onElementChanged);
      observer.disconnect();
      modeler.destroy();
      modelerRef.current = null;
    };
  }, [selectedId]); // Recreate if selected ID changes to ensure clean registers

  // Update diagram name in BPMN Process element when diagramName state changes
  useEffect(() => {
    if (!modelerRef.current || !diagramName) return;
    try {
      const elementRegistry = modelerRef.current.get("elementRegistry") as any;
      if (!elementRegistry) return;
      const processElement = elementRegistry.filter((e: any) => e.type === "bpmn:Process")[0];
      if (processElement && processElement.businessObject.name !== diagramName) {
        const modeling = modelerRef.current.get("modeling") as any;
        if (modeling) {
          modeling.updateProperties(processElement, { name: diagramName });
        }
      }
    } catch(err) {
      // Ignored: Modeler might not be ready yet
    }
  }, [diagramName]);


  // Render Comments when selected element changes or a new comment is added
  useEffect(() => {
    if (!modelerRef.current || !selectedElementId || activeRightTab !== 'comments') return;
    
    const loadComments = () => {
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
      setComments(Array.isArray(commentsList) ? commentsList : []);
    };
    
    loadComments();
    
    // Listen for changes on this specific element's documentation
    const eventBus = modelerRef.current.get('eventBus');
    const changeListener = (e: any) => {
       if (e.element && e.element.id === selectedElementId) {
         loadComments();
       }
    };
    eventBus.on('element.changed', changeListener);
    
    return () => {
      eventBus.off('element.changed', changeListener);
    };
  }, [selectedElementId, activeRightTab, currentDiagram]); // Re-run if diagram changes

  const saveComments = (newComments: any[]) => {
    if (!modelerRef.current || !selectedElementId) return;
    const elementRegistry = modelerRef.current.get('elementRegistry');
    const element = elementRegistry.get(selectedElementId);
    const modeling = modelerRef.current.get('modeling');
    const moddle = modelerRef.current.get('moddle');
    
    if (!element) return;
    const docs = element.businessObject.documentation || [];
    
    const newDoc = moddle.create('bpmn:Documentation', {
      text: JSON.stringify(newComments),
      textFormat: 'text/x-comments'
    });
    
    modeling.updateProperties(element, {
      documentation: [newDoc, ...docs.filter((d:any) => d.textFormat !== 'text/x-comments')]
    });
    setComments(newComments);
  };

  const handlePostComment = () => {
    if (!commentInput.trim() || !selectedElementId) return;
    
    let newComments = [...comments];
    
    if (replyingTo) {
      newComments = newComments.map(c => {
        if (c.id === replyingTo) {
          return {
            ...c,
            replies: [...(c.replies || []), {
              id: Date.now().toString(),
              text: commentInput.trim(),
              date: new Date().toISOString(),
              author: editorName
            }]
          };
        }
        return c;
      });
      setReplyingTo(null);
    } else {
      newComments.push({
        id: Date.now().toString(),
        text: commentInput.trim(),
        date: new Date().toISOString(),
        author: editorName,
        resolved: false,
        replies: []
      });
    }
    
    saveComments(newComments);
    setCommentInput('');
  };

  const handleResolveComment = (id: string) => {
    const newComments = (comments || []).map(c => c.id === id ? { ...c, resolved: !c.resolved } : c);
    saveComments(newComments);
  };
  
  const handleDeleteComment = (id: string) => {
    if(confirm(t("deleteCommentConfirm", lang))) {
      const newComments = comments.filter(c => c.id !== id);
      saveComments(newComments);
    }
  };



  // Toggle Theme
  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("bpmn-theme", nextTheme);
  };

  // Create Process
  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcessName.trim()) return;

    setIsSaving(true);
    fetch("/api/diagrams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProcessName,
        editorName: editorName
      })
    })
      .then((res) => res.json())
      .then((data: Diagram) => {
        setNewProcessName("");
        setShowNewModal(false);
        setIsSaving(false);
        // Load this process next
        loadDiagramList(data.id);
      })
      .catch((err) => {
        console.error("Error creating diagram:", err);
        setIsSaving(false);
      });
  };

  // Save/Commit New Version to DB
  const handleSaveVersion = async () => {
    if (!modelerRef.current || !currentDiagram) return;

    setIsSaving(true);
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      if (!xml) throw new Error("No XML found");

      const response = await fetch(`/api/diagrams/${currentDiagram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xml,
          editorName,
          name: diagramName
        })
      });

      if (!response.ok) {
        throw new Error(t("saveVersionError", lang));
      }

      const updated: Diagram = await response.json();
      setCurrentDiagram(updated);
      
      // Clear draft since it is saved
      localStorage.removeItem(`bpmn-draft-${currentDiagram.id}`);
      
      // Reload diagram lists
      loadDiagramList(updated.id);
      setIsSaving(false);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      alert(t("saveDbError", lang));
    }
  };

  // Delete Current Process
  const handleDeleteProcess = async () => {
    if (!currentDiagram) return;
    if (!window.confirm(t("deleteProcessConfirm", lang, { name: currentDiagram.name }))) return;
    try {
      const res = await fetch(`/api/diagrams/${currentDiagram.id}`, { method: "DELETE" });
      if (res.ok) {
        localStorage.removeItem(`bpmn-draft-${currentDiagram.id}`);
        const response = await fetch("/api/diagrams");
        const list = await response.json();
        setDiagrams(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
          const diagramRes = await fetch(`/api/diagrams/${list[0].id}`);
          const diag = await diagramRes.json();
          setCurrentDiagram(diag);
          setDiagramName(diag.name);
          setIsHistoryOpen(false);
          if (modelerRef.current) {
            await modelerRef.current.importXML(diag.xml);
            const canvas = modelerRef.current.get("canvas") as any;
            canvas.zoom("fit-viewport");
          }
        } else {
          setCurrentDiagram(null);
          setDiagramName(t("newProcess", lang));
          setSelectedId(null);
          if (modelerRef.current) {
             modelerRef.current.clear();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load a historic version into modeler
  const handleLoadVersion = async (v: DiagramVersion) => {
    if (!modelerRef.current) return;
    try {
      setViewingVersion(v.version === currentDiagram.latestVersion ? null : v.version);
      await modelerRef.current.importXML(v.xml);
      // Set draft so edits of this restored version will auto-persist
      if (currentDiagram) {
        localStorage.setItem(`bpmn-draft-${currentDiagram.id}`, v.xml);
      }
      setIsHistoryOpen(false);
    } catch (err) {
      console.error(err);
      alert(t("loadXmlError", lang));
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    try {
      modelerRef.current?.get("commandStack").undo();
    } catch (e) {}
  };

  const handleRedo = () => {
    try {
      modelerRef.current?.get("commandStack").redo();
    } catch (e) {}
  };

  // EXPORT 1: Raw SVG file download
  const handleExportSVG = async () => {
    if (!modelerRef.current) return;
    try {
      const { svg } = await modelerRef.current.saveSVG();
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${diagramName || "process"}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export SVG Error:", err);
    }
  };

  const exportToCanvas = async (scale = 3): Promise<HTMLCanvasElement> => {
    return new Promise(async (resolve, reject) => {
      if (!modelerRef.current) return reject("No modeler");
      try {
        const { svg } = await modelerRef.current.saveSVG();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const svgEl = doc.documentElement;
        
        const style = doc.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `text { font-family: Tahoma, Arial, sans-serif !important; }`;
        svgEl.insertBefore(style, svgEl.firstChild);
        
        const viewBox = svgEl.getAttribute("viewBox");
        let minX = 0, minY = 0, width = 1200, height = 800;
        if (viewBox) {
          const parts = viewBox.split(" ").map(Number);
          if (parts.length === 4) {
            minX = parts[0]; minY = parts[1]; width = parts[2]; height = parts[3];
          }
        } else {
          width = Number(svgEl.getAttribute("width")) || 1200;
          height = Number(svgEl.getAttribute("height")) || 800;
        }
        
        const paddingX = Math.max(width * 0.1, 100);
        const paddingY = Math.max(height * 0.1, 100);
        const paddedWidth = width + paddingX * 2;
        const paddedHeight = height + paddingY * 2;
        
        svgEl.setAttribute("viewBox", `${minX - paddingX} ${minY - paddingY} ${paddedWidth} ${paddedHeight}`);
        svgEl.setAttribute("width", String(paddedWidth));
        svgEl.setAttribute("height", String(paddedHeight));
        
        const serializer = new XMLSerializer();
        const newSvgStr = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([newSvgStr], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = paddedWidth * scale;
          canvas.height = paddedHeight * scale;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = theme === "dark" ? "#0f172a" : "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          URL.revokeObjectURL(url);
          resolve(canvas);
        };
        img.onerror = reject;
        img.src = url;
      } catch (err) {
        reject(err);
      }
    });
  };

  // EXPORT 2: High Resolution PNG with scale factor
  const handleExportPNG = async (scale = 3) => {
    try {
      const canvas = await exportToCanvas(scale);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${diagramName || "process"}.png`;
      link.click();
    } catch (err) {
      console.error("Export PNG Error:", err);
    }
  };

  // EXPORT 3: Centered PDF Document
  const handleExportPDF = async () => {
    try {
      const canvas = await exportToCanvas(4);
      const isLandscape = canvas.width > canvas.height;
      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = Math.min((pdfWidth - 20) / canvas.width, (pdfHeight - 20) / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", x, y, imgWidth, imgHeight);
      pdf.save(`${diagramName || "process"}.pdf`);
    } catch (err) {
      console.error("Export PDF Error:", err);
      alert(t("pdfExportError", lang));
    }
  };

  const handleCopyEmbedLink = () => {
    if (!currentDiagram) return;
    const viewUrl = `${window.location.origin}/view/${currentDiagram.id}`;
    navigator.clipboard.writeText(viewUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleZoom = (step: number) => {
    if (modelerRef.current) {
      const canvas = modelerRef.current.get("canvas") as any;
      if (canvas) {
        canvas.zoom(canvas.zoom() + step);
      }
    }
  };

  const handleFitViewport = () => {
    if (modelerRef.current) {
      const canvas = modelerRef.current.get("canvas") as any;
      if (canvas) {
        canvas.zoom("fit-viewport", "auto");
      }
    }
  };

  const handleCompareWithPrevious = async () => {
    if (!currentDiagram || currentDiagram.versions.length < 2) {
      alert(t("diffRequiresTwoVersions", lang));
      return;
    }
    
    try {
      const currentXml = await modelerRef.current!.saveXML({ format: true });
      const previousVersion = currentDiagram.versions[1]; 
      
      setDiffingXmls({
        oldXml: previousVersion.xml,
        newXml: currentXml.xml!
      });
    } catch(err) {
      console.error("Error generating diff:", err);
      alert(t("diffError", lang));
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden text-slate-800 dark:text-slate-200 ${theme === "dark" ? "dark dark-theme bg-[#0f172a]" : "bg-slate-50"}`} dir={lang === "fa" ? "rtl" : "ltr"} id="bpmn-app-container">
      {/* 1. Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-5 py-2.5 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 shadow-sm z-50 relative" id="app-header">
        <div className="flex items-center gap-4">
          {/* Main Logo & Title */}
          <div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm"><Workflow className="w-5 h-5" /></div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{t("app.title", lang)}</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium leading-none mt-0.5">{t("app.subtitle", lang)}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Process Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-400 hidden md:block">{t("activeProcess", lang)}</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              id="process-select-dropdown"
            >
              {diagrams.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({t("latestVersion", lang)} {d.latestVersion})
                </option>
              ))}
            </select>
          </div>

          {/* Create Process Trigger */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition shadow-sm cursor-pointer"
            id="create-new-process-btn"
          >
            <Plus className="w-4 h-4" />
            <span>{t("newProcess", lang)}</span>
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Current Process Name Input */}
          <input
            type="text"
            value={diagramName}
            onChange={(e) => setDiagramName(e.target.value)}
            placeholder={t("processNamePlaceholder", lang)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 w-44 lg:w-56 font-semibold"
            id="diagram-name-input"
          />

          {/* Active Editor Name */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={editorName}
              onChange={(e) => {
                setEditorName(e.target.value);
                localStorage.setItem("bpmn-editor-name", e.target.value);
              }}
              placeholder={t("editorNamePlaceholder", lang)}
              className="text-xs bg-transparent border-none focus:outline-none w-24 text-slate-700 dark:text-slate-300 font-medium text-start"
              id="editor-name-input"
            />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Undo/Redo tools */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={handleUndo}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title={t("undo", lang)}
              id="undo-btn"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title={t("redo", lang)}
              id="redo-btn"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* History dropdown trigger */}
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`p-2 rounded-lg border transition relative cursor-pointer ${isHistoryOpen ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            title={t("versionHistoryTitle", lang)}
            id="history-toggle-btn"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          {currentDiagram && currentDiagram.versions.length >= 2 && (
            <button
              onClick={handleCompareWithPrevious}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition relative cursor-pointer text-xs font-semibold ${diffingXmls ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-400" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
              title={t("diffTooltip", lang)}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden md:inline">Diff</span>
            </button>
          )}

                    {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium text-sm"
              title={t("switchLanguage", lang)}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{t("switchLanguage", lang)}</span>
            </button>

            <button
              onClick={handleThemeToggle}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={theme === "dark" ? (t("lightMode", lang)) : (t("darkMode", lang))}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t("shareAndExport", lang)}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
                
                <button
                  onClick={handleCopyEmbedLink}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-start"
                >
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  {copiedLink ? (t("linkCopied", lang)) : (t("copyShareLink", lang))}
                </button>

                <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-1"></div>

                <button
                  onClick={handleExportSVG}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-start border-t border-slate-100 dark:border-slate-700"
                >
                  <FileCode className="w-4 h-4 text-orange-500" />
                  {t("exportSVG", lang)}
                </button>

                <button
                  onClick={() => handleExportPNG(3)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-start border-t border-slate-100 dark:border-slate-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  {t("exportPNG", lang)}
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-start border-t border-slate-100 dark:border-slate-700"
                >
                  <FileDown className="w-4 h-4 text-rose-500" />
                  {t("exportPDF", lang)}
                </button>

              </div>
            </div>
          </div>
        </div>
      </header>

      
      {/* 2. Main Modeler Body Workspace */}
      {viewingVersion !== null && (
        <div className="bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-between z-10">
          <div className="text-amber-800 dark:text-amber-200 text-sm font-semibold flex items-center gap-2">
            <span>{t("viewingOldVersion", lang, {version: String(viewingVersion)})}</span>
          </div>
          <button 
            onClick={async () => {
              if (!modelerRef.current || !currentDiagram) return;
              await modelerRef.current.importXML(currentDiagram.xml);
              setViewingVersion(null);
            }}
            className="text-xs bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-3 py-1 rounded hover:bg-amber-300 dark:hover:bg-amber-700 transition"
          >
            {t("backToLatest", lang)}
          </button>
        </div>
      )}
      <div className="flex flex-1 relative overflow-hidden" id="main-workspace">

        {/* Dynamic History Overlay Drawer / Popover */}
        {isHistoryOpen && currentDiagram && (
          <div className="absolute top-0 right-0 w-80 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[9999] flex flex-col p-4 animate-in slide-in-from-right duration-200" id="history-drawer">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <History className="w-5 h-5" />
                <span>{t("historyPanelTitle", lang)}</span>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 font-medium leading-relaxed">
              {t("historyPanelDesc", lang)}
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="versions-list">
              {currentDiagram.versions.slice().reverse().map((v) => (
                <div
                  key={v.version}
                  onClick={() => handleLoadVersion(v)}
                  className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-100 dark:border-slate-700/50 rounded-xl cursor-pointer transition flex flex-col"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("versionLabel", lang, {version: String(v.version)})}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded-full font-semibold">
                      {v.version === currentDiagram.latestVersion ? t("finalVersion", lang) : t("historyLabel", lang)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{t("byEditor", lang, {editorName: v.editorName})}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(v.timestamp).toLocaleString("fa-IR")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <button
                onClick={handleDeleteProcess}
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition"
                id="delete-process-btn"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t("deleteProcessBtn", lang)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Core Canvas stage container */}
        <div className="flex-1 relative h-full flex flex-col overflow-hidden" id="canvas-wrapper">
          {/* Zoom Controls */}
          <div className={`absolute bottom-24 left-6 flex flex-col gap-1 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-1 z-10 ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}>
            <button onClick={handleFitViewport} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" title={t("fitViewport", lang)}>
              <Focus className="w-5 h-5" />
            </button>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-0.5"></div>
            <button onClick={() => handleZoom(0.2)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" title={t("zoomIn", lang)}>
              <ZoomIn className="w-5 h-5" />
            </button>
            <button onClick={() => handleZoom(-0.2)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md" title={t("zoomOut", lang)}>
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>

          <div ref={canvasContainerRef} className={`w-full flex-1 bpmn-container ${!showGrid ? 'no-grid' : ''}`} id="bpmn-canvas-element" dir="ltr" />

          
          
          {/* Custom Lint Panel */}
          {lintIssues.length > 0 && (
            <div className={`border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex flex-col z-20 shrink-0 transition-all duration-300 ${isLintPanelOpen ? 'h-[200px]' : 'h-8'}`}>
              <div 
                className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                onClick={() => setIsLintPanelOpen(!isLintPanelOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  {lintIssues.length} {t("issuesFound", lang)}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${!isLintPanelOpen ? 'rotate-180' : ''}`} />
              </div>
              {isLintPanelOpen && (
                <div className="overflow-y-auto p-2 flex-1">
                  {lintIssues.map((issue, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (modelerRef.current) {
                          const elementRegistry = modelerRef.current.get('elementRegistry') as any;
                          const element = elementRegistry.get(issue.elementId);
                          if (element) {
                            const selection = modelerRef.current.get('selection') as any;
                            selection.select(element);
                            const canvas = modelerRef.current.get('canvas') as any;
                            canvas.zoom('fit-viewport');
                          }
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 mb-1 rounded text-start transition"
                      dir="ltr"
                    >
                      <span className="text-rose-500 flex-shrink-0 text-xs">⚠️</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{customTranslate(issue.message)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Right Sidebar Properties Panel (Collapsible) */}
        
        <div
          className={`h-full border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 relative ${isPropertiesOpen ? "w-80 lg:w-96" : "w-0"}`}
          id="properties-panel-container"
        >
          {/* Toggle Tab */}
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className="absolute top-1/2 -left-3.5 transform -translate-y-1/2 w-7 h-10 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-300 hover:text-slate-800 rounded-l-md shadow-md z-10 flex items-center justify-center cursor-pointer transition"
            title={isPropertiesOpen ? t("closePanel", lang) : t("openPanel", lang)}
            id="properties-toggle-btn"
          >
            {isPropertiesOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className="flex-1 h-full overflow-hidden flex flex-col bg-white dark:bg-[#1e293b]">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setActiveRightTab("details")}
                className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${activeRightTab === 'details' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t("elementDetails", lang)}
              </button>
              <button 
                onClick={() => setActiveRightTab("comments")}
                className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${activeRightTab === 'comments' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t("commentsAndDiscussions", lang)}
              </button>
            </div>
            
            <div className={`flex-1 h-full overflow-y-auto properties-panel-parent ${activeRightTab === 'details' ? 'block' : 'hidden'}`}>
              <div ref={propertiesPanelRef} className="w-full" id="bpmn-properties-element" />
            </div>
            
            
            <div className={`flex-1 h-full overflow-y-auto p-4 flex flex-col ${activeRightTab === 'comments' ? 'block' : 'hidden'}`}>
              {!selectedElementId ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{t("teamCollaboration", lang)}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[250px]">
                    {t("teamCollaborationDesc", lang)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    {t("elementComments", lang)}
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4" id="comments-list">
                    {(comments || []).length === 0 ? (
                      <div className="text-xs text-slate-500 text-center italic mt-10">
                         {t("firstComment", lang)}
                      </div>
                    ) : (
                      (comments || []).map(comment => (
                        <div key={comment.id} className={`bg-white dark:bg-slate-900 p-3 rounded-lg border ${comment.resolved ? 'border-emerald-200 dark:border-emerald-800 opacity-60' : 'border-slate-100 dark:border-slate-800'} mb-3`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              {comment.author} 
                              {comment.resolved && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm ms-1">{t("resolved", lang)}</span>}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">{formatDateTime(comment.date, lang)}</span>
                              <button onClick={() => handleResolveComment(comment.id)} className="text-slate-400 hover:text-emerald-500 transition" title={t("toggleResolve", lang)}>
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setReplyingTo(comment.id)} className="text-slate-400 hover:text-blue-500 transition" title={t("reply", lang)}>
                                <Reply className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-400 hover:text-red-500 transition" title={t("delete", lang)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap mb-2">{comment.text}</p>
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-2">
                              {comment.replies.map((reply: any) => (
                                <div key={reply.id} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{reply.author}</span>
                                    <span className="text-[9px] text-slate-400">{formatDateTime(reply.date, lang)}</span>
                                  </div>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-auto relative">
                    {replyingTo && (
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md mb-1">
                        <span className="text-xs text-blue-600 dark:text-blue-400">{t("replying", lang)}</span>
                        <button onClick={() => setReplyingTo(null)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <textarea 
                      id="new-comment-input"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full h-20 text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      placeholder={t("writeComment", lang)}
                    ></textarea>
                    <button 
                      onClick={handlePostComment}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      {t("postComment", lang)}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
      {/* 3.5 Bottom Status Footer */}
      <footer className="h-8 bg-slate-50 dark:bg-[#1e293b] border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span>{t("statusReady", lang)}</span>
          <span className="hidden sm:inline border-r border-slate-300 dark:border-slate-700 pe-4">
            {t("copyrightText", lang)}
          </span>
        </div>
        <div className="flex gap-4 font-sans font-medium text-xs">
          <span>{t("versionNumber", lang)}</span>
        </div>
      </footer>

      {/* 4. Modals */}
      
      {diffingXmls && (
        <DiffModal lang={lang}
          oldXml={diffingXmls.oldXml}
          newXml={diffingXmls.newXml}
          onClose={() => setDiffingXmls(null)}
          theme={theme}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t("platformSettings", lang)}</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-200">{t("showGrid", lang)}</span>
                  <span className="block text-xs text-slate-500 mt-1">{t("showGridDesc", lang)}</span>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition">{t("confirm", lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t("helpAndShortcuts", lang)}</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 h-64 overflow-y-auto ps-2 text-sm text-slate-600 dark:text-slate-300" dir="ltr">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("openFile", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + O</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("undoText", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + Z</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("redoText", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + Y</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("copy", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + C</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("paste", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + V</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("selectAll", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">Ctrl + A</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("directEdit", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">E</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("handTool", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">H</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("lassoTool", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">L</kbd></div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/50"><span className="text-start w-full pe-4">{t("spaceTool", lang)}</span><kbd className="whitespace-nowrap font-mono bg-slate-100 dark:bg-slate-800 px-2 rounded">S</kbd></div>
            </div>
          </div>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200" id="create-modal-overlay">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t("createBpmnProcess", lang)}</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProcess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{t("businessProcessTitle", lang)}</label>
                <input
                  type="text"
                  required
                  value={newProcessName}
                  onChange={(e) => setNewProcessName(e.target.value)}
                  placeholder={t("processNameExample", lang)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  id="modal-new-name-input"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
                >
                  {t("cancel", lang)}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition flex items-center gap-1"
                  id="modal-submit-btn"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{t("createAndLoad", lang)}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
