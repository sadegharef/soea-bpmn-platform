/**
 * @file BpmnModelerApp.tsx
 * @description کامپوننت بوم اصلی مدلسازی BPMN 2.0، ابزارهای طراحی، شبیه‌سازی توکن، بازبینی هوشمند، خروجی‌های چندگانه و همکاری گروهی
 * @architecture
 * - Single Responsibility Principle (SRP): مدیریت چرخه حیات بوم bpmn-js، تعامل با ابزارها و خروجی‌های استاندارد
 * - Dependency Inversion Principle (DIP): اتکا به WorkspaceContext جهت همگام‌سازی نسخه‌ها، نظرات و وضعیت‌های فرآیند
 */

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

import { useWorkspace } from "../context/WorkspaceContext";
import { DiagramMetadataHeader } from "./DiagramMetadataHeader";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import { CommentsDrawer } from "./CommentsDrawer";

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

export default function BpmnModelerApp({ theme: propsTheme, setTheme: propsSetTheme }: { theme?: "light" | "dark"; setTheme?: (theme: "light" | "dark") => void }) {
  const workspace = useWorkspace();
  const activeDiagram = workspace?.activeDiagram;
  const currentRole = workspace?.currentRole || 'manager';
  const currentUser = workspace?.currentUser;

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const propertiesPanelRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);

  // Lists & metadata
  const [diagrams, setDiagrams] = useState<DiagramListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("demo-process");
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [lintIssues, setLintIssues] = useState<any[]>([]);
  const [isLintPanelOpen, setIsLintPanelOpen] = useState(false);

  // Form states
  const [localTheme, setLocalTheme] = useState<"light" | "dark">("light");
  const theme = propsTheme || localTheme;
  const setTheme = propsSetTheme || setLocalTheme;
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [diagramName, setDiagramName] = useState<string>("");
  const [diagramNameEn, setDiagramNameEn] = useState<string>("");
  const [editorName, setEditorName] = useState<string>(() => {
    return currentUser?.name || localStorage.getItem("bpmn-editor-name") || t("defaultEditorName", lang);
  });
  const [editorNameEn, setEditorNameEn] = useState<string>(() => {
    return currentUser?.nameEn || localStorage.getItem("bpmn_editor_name_en") || "Co-Pilot";
  });

  useEffect(() => {
    if (currentUser?.name) {
      setEditorName(currentUser.name);
      if (currentUser.nameEn) setEditorNameEn(currentUser.nameEn);
    }
  }, [currentUser]);

  // UI toggles
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const isReadOnlyRole = currentRole === 'viewer' || currentRole === 'reviewer';

  useEffect(() => {
    (window as any).__CURRENT_USER_ROLE__ = currentRole;
  }, [currentRole]);

  useEffect(() => {
    if (modelerRef.current) {
      const linting = modelerRef.current.get('linting') as any;
      if (linting && typeof linting.toggle === 'function') {
        linting.toggle(isLintPanelOpen);
      }
    }
  }, [isLintPanelOpen]);
  const [activeRightTab, setActiveRightTab] = useState<"details" | "comments">("details");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<number | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [diffingXmls, setDiffingXmls] = useState<{ oldXml: string, newXml: string } | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProcessName, setNewProcessName] = useState("");
  const [newProcessNameEn, setNewProcessNameEn] = useState("");
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
  
  
  
  // Fix hardcoded titles (Token Simulation and Palette)
  useEffect(() => {
    let isUpdating = false;

    const updateTitles = () => {
      if (isUpdating) return;
      isUpdating = true;
      try {
        // Token Simulation Toggle
        const toggleBtn = document.querySelector('.bts-toggle-mode');
        if (toggleBtn) {
          const targetTitle = lang === 'fa' ? 'شبیه‌سازی فرآیند' : 'Token Simulation';
          if (toggleBtn.getAttribute('title') !== targetTitle) {
            toggleBtn.setAttribute('title', targetTitle);
          }
        }
        
        // Token Simulation Log header
        const logHeader = document.querySelector('.bts-log .bts-header');
        if (logHeader) {
          // Find text node inside bts-header
          for (const node of logHeader.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
               const originalText = logHeader.getAttribute('data-original-text') || node.nodeValue.trim();
               if (!logHeader.hasAttribute('data-original-text')) {
                 logHeader.setAttribute('data-original-text', originalText);
               }
               const targetVal = lang === 'fa'
                 ? (originalText === 'Simulation Log' ? ' تاریخچه شبیه‌سازی ' : node.nodeValue)
                 : ' ' + originalText + ' ';
               if (node.nodeValue !== targetVal) {
                 node.nodeValue = targetVal;
               }
            }
          }
        }
        
        // Palette item titles
        const paletteEntries = document.querySelectorAll('.djs-palette .entry');
        paletteEntries.forEach(entry => {
          const action = entry.getAttribute('data-action');
          if (!action) return;
          
          let faTitle = "";
          let enTitle = "";
          
          if (action === 'hand-tool') { faTitle = 'فعال کردن ابزار دست (کشیدن بوم)'; enTitle = 'Activate hand tool'; }
          else if (action === 'lasso-tool') { faTitle = 'فعال کردن ابزار کمند (انتخاب چندتایی)'; enTitle = 'Activate lasso tool'; }
          else if (action === 'space-tool') { faTitle = 'فعال کردن ابزار مدیریت فضا'; enTitle = 'Activate create/remove space tool'; }
          else if (action === 'global-connect-tool') { faTitle = 'فعال کردن ابزار اتصال سراسری'; enTitle = 'Activate global connect tool'; }
          else if (action === 'create.start-event') { faTitle = 'ایجاد رویداد شروع'; enTitle = 'Create StartEvent'; }
          else if (action === 'create.end-event') { faTitle = 'ایجاد رویداد پایان'; enTitle = 'Create EndEvent'; }
          else if (action === 'create.exclusive-gateway') { faTitle = 'ایجاد درگاه (Gateway)'; enTitle = 'Create Gateway'; }
          else if (action === 'create.task') { faTitle = 'ایجاد وظیفه (Task)'; enTitle = 'Create Task'; }
          else if (action === 'create.intermediate-event') { faTitle = 'ایجاد رویداد میانی یا مرزی'; enTitle = 'Create Intermediate/Boundary Event'; }
          else if (action === 'create.data-object') { faTitle = 'ایجاد شیء داده'; enTitle = 'Create DataObjectReference'; }
          else if (action === 'create.data-store') { faTitle = 'ایجاد پایگاه داده'; enTitle = 'Create DataStoreReference'; }
          else if (action === 'create.participant-expanded') { faTitle = 'ایجاد استخر/مشارکت‌کننده'; enTitle = 'Create Pool/Participant'; }
          else if (action === 'create.group') { faTitle = 'ایجاد گروه'; enTitle = 'Create Group'; }
          else if (action === 'create.subprocess-expanded') { faTitle = 'ایجاد زیرفرآیند باز شده'; enTitle = 'Create expanded SubProcess'; }
          else if (action === 'create') { faTitle = 'ایجاد عنصر'; enTitle = 'Create element'; }
          
          if (faTitle && enTitle) {
            const targetTitle = lang === 'fa' ? faTitle : enTitle;
            if (entry.getAttribute('title') !== targetTitle) {
              entry.setAttribute('title', targetTitle);
            }
          }
        });

        // Ensure "Create element" tooltips match language
        const allTitledEls = document.querySelectorAll('.djs-palette [title], .djs-popup [title], .djs-palette .entry');
        allTitledEls.forEach(el => {
          const t = el.getAttribute('title');
          if (t === 'ایجاد عنصر' && lang === 'en') {
            el.setAttribute('title', 'Create element');
          } else if (t === 'Create element' && lang === 'fa') {
            el.setAttribute('title', 'ایجاد عنصر');
          }
        });
        
        // Context Pad titles & Tooltips
        const padEntries = document.querySelectorAll('.djs-context-pad .entry, .djs-context-pad [title]');
        padEntries.forEach(entry => {
          const action = entry.getAttribute('data-action');
          const currentTitle = entry.getAttribute('title') || "";
          
          let faTitle = "";
          let enTitle = "";
          
          if (action === 'append.text-annotation') { faTitle = 'افزودن یادداشت متنی'; enTitle = 'Append text annotation'; }
          else if (action === 'append.end-event') { faTitle = 'افزودن رویداد پایان'; enTitle = 'Append EndEvent'; }
          else if (action === 'append.gateway') { faTitle = 'افزودن درگاه'; enTitle = 'Append Gateway'; }
          else if (action === 'append.task' || action === 'append-task') { faTitle = 'افزودن فعالیت'; enTitle = 'Append task'; }
          else if (action === 'append.intermediate-event') { faTitle = 'افزودن رویداد میانی یا مرزی'; enTitle = 'Append Intermediate/Boundary Event'; }
          else if (action === 'delete') { faTitle = 'حذف عنصر'; enTitle = 'Remove'; }
          else if (action === 'replace') { faTitle = 'تغییر نوع عنصر'; enTitle = 'Change type'; }
          else if (action === 'connect') { faTitle = 'اتصال با جریان متوالی یا پیام'; enTitle = 'Connect using Sequence/MessageFlow or Association'; }
          else if (action === 'set-color') { faTitle = 'تنظیم رنگ'; enTitle = 'Set color'; }
          else if (action === 'comments' || currentTitle === 'Comments') { faTitle = 'نظرات'; enTitle = 'Comments'; }
          else if (currentTitle === 'Set color' || currentTitle === 'Set Color') { faTitle = 'تنظیم رنگ'; enTitle = 'Set color'; }
          else if (currentTitle === 'Append task' || currentTitle === 'Append Task') { faTitle = 'افزودن فعالیت'; enTitle = 'Append task'; }
          
          if (faTitle && enTitle) {
            const targetTitle = lang === 'fa' ? faTitle : enTitle;
            if (entry.getAttribute('title') !== targetTitle) {
              entry.setAttribute('title', targetTitle);
            }
          }
        });

        // Popup menu entries, headers, descriptions translation
        const popupEls = document.querySelectorAll('.djs-popup .entry-header, .djs-popup .entry-title, .djs-popup .label, .djs-popup .group-title, .djs-popup-header-title, .djs-popup-title, .djs-popup .entry, .djs-popup .description');
        popupEls.forEach(el => {
          const orig = el.getAttribute('data-original-text') || el.textContent || "";
          if (!el.hasAttribute('data-original-text') && orig.trim()) {
            el.setAttribute('data-original-text', orig.trim());
          }
          const rawText = (el.getAttribute('data-original-text') || orig).trim();
          if (!rawText) return;

          if (lang === 'fa') {
            const translated = customTranslate(rawText);
            if (translated && translated !== rawText) {
              if (el.hasAttribute('title') && el.getAttribute('title') !== translated) {
                el.setAttribute('title', translated);
              }
              const firstSpan = el.querySelector('.entry-title, .entry-header, .label');
              if (firstSpan && firstSpan.textContent !== translated) {
                firstSpan.textContent = translated;
              } else if (!firstSpan && el.children.length === 0 && el.textContent !== translated) {
                el.textContent = translated;
              }
            }
          } else {
            if (el.hasAttribute('title') && el.getAttribute('title') !== rawText) {
              el.setAttribute('title', rawText);
            }
            const firstSpan = el.querySelector('.entry-title, .entry-header, .label');
            if (firstSpan && firstSpan.textContent !== rawText) {
              firstSpan.textContent = rawText;
            } else if (!firstSpan && el.children.length === 0 && el.textContent !== rawText) {
              el.textContent = rawText;
            }
          }
        });

        // Properties Panel labels, titles, headers translation
        const propEls = document.querySelectorAll('.bio-properties-panel .bio-properties-panel-group-header-title, .bio-properties-panel .bio-properties-panel-label, .bio-properties-panel .bio-properties-panel-header-title, .bio-properties-panel .bio-properties-panel-header-type, .bio-properties-panel-checkbox-label, .bio-properties-panel .bio-properties-panel-description');
        propEls.forEach(el => {
          const orig = el.getAttribute('data-original-text') || el.textContent || "";
          if (!el.hasAttribute('data-original-text') && orig.trim()) {
            el.setAttribute('data-original-text', orig.trim());
          }
          const rawText = (el.getAttribute('data-original-text') || orig).trim();
          if (!rawText) return;

          if (lang === 'fa') {
            const translated = customTranslate(rawText);
            if (translated && translated !== rawText) {
              if (el.textContent !== translated) {
                el.textContent = translated;
              }
            }
          } else {
            if (el.textContent !== rawText) {
              el.textContent = rawText;
            }
          }
        });
        
        // Simulation Log & Floating Notifications & Badges
        const logTexts = document.querySelectorAll('.bts-log .bts-entry .bts-text, .bts-notifications .bts-text, .bts-notifications .bts-notification, .bts-entry .bts-text, .bts-element-notification, .bts-status-badge');
        logTexts.forEach(el => {
          // If the element contains child nodes with bts-text, process children individually
          if (el.querySelector('.bts-text')) return;

          const originalText = (el.getAttribute('data-original-text') || el.textContent || "").trim();
          if (!el.hasAttribute('data-original-text')) {
            el.setAttribute('data-original-text', originalText);
          }
          
          let newText = originalText;
          if (lang === 'fa') {
            if (originalText === "Process started") newText = "شروع فرآیند";
            else if (originalText === "Process finished") newText = "پایان فرآیند";
            else if (originalText === "Process entered") newText = "ورود به فرآیند";
            else if (originalText === "Finished") newText = "پایان یافت";
            else if (originalText === "Running") newText = "در حال اجرا";
            else if (originalText === "Paused") newText = "متوقف شده";
            else if (originalText === "Start Event") newText = "رویداد شروع";
            else if (originalText === "End Event") newText = "رویداد پایان";
            else if (originalText === "Task") newText = "وظیفه";
            else if (originalText === "User Task") newText = "وظیفه کاربر";
            else if (originalText === "Service Task") newText = "وظیفه سرویس";
            else if (originalText === "Exclusive Gateway") newText = "درگاه انحصاری (XOR)";
            else if (originalText === "Parallel Gateway") newText = "درگاه موازی (AND)";
            else if (originalText === "Inclusive Gateway") newText = "درگاه جامع (OR)";
          }
          
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            if (el.textContent !== newText) {
              el.textContent = newText;
            }
          } else if (el.classList.contains('bts-text')) {
            if (el.textContent !== newText) {
              el.textContent = newText;
            }
          }
          if (el.getAttribute('title') !== newText) {
            el.setAttribute('title', newText);
          }
        });
        
        const noEntries = document.querySelector('.bts-log .bts-entry.placeholder');
        if (noEntries) {
          const targetText = lang === 'fa' ? "هیچ موردی ثبت نشده است" : "No Entries";
          if (noEntries.textContent !== targetText) {
            noEntries.textContent = targetText;
          }
        }
      } finally {
        isUpdating = false;
      }
    };
    
    updateTitles();
    
    let observer: MutationObserver | null = null;
    const safeObserve = () => {
      if (observer && canvasContainerRef.current) {
        observer.observe(canvasContainerRef.current, { childList: true, subtree: true });
      }
    };

    observer = new MutationObserver(() => {
      if (observer) observer.disconnect();
      updateTitles();
      safeObserve();
    });
    
    safeObserve();

    return () => {
      if (observer) observer.disconnect();
    };
  }, [lang]);

  useEffect(() => {
    (window as any).__BPMN_LANG__ = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
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
    let list: DiagramListItem[] = [];
    try {
      list = JSON.parse(localStorage.getItem("bpmn-diagrams") || "[]");
      if (!Array.isArray(list)) list = [];
    } catch(e) {
      list = [];
    }
    
    if (list.length === 0) {
      const initial: any = { id: "demo-process", title: "فرآیند نمونه خرید سازمانی", titleEn: "Demo Procurement Process", updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), latestVersion: 1 };
      localStorage.setItem("bpmn-diagrams", JSON.stringify([initial]));
      setDiagrams([initial]);
      if (!localStorage.getItem(`bpmn-diagram-demo-process`)) {
         localStorage.setItem(`bpmn-diagram-demo-process`, JSON.stringify({
            id: "demo-process",
            title: "فرآیند نمونه خرید سازمانی",
            titleEn: "Demo Procurement Process",
            xml: `<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="152" y="102" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`,
            updatedAt: new Date().toISOString()
         }));
      }
    } else {
      setDiagrams(list);
    }
    if (selectIdAfterLoad) setSelectedId(selectIdAfterLoad);
  };

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    loadDiagramList();

    if (modelerRef.current) {
      modelerRef.current.destroy();
    }

    const modeler = new BpmnModeler({
      container: canvasContainerRef.current,
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        minimapModule,
        colorPickerModule,
        tokenSimulationModule,
        lintModule,
        CreateAppendAnythingModule,
        customTranslateModule,
        customContextPadModule
      ],
      linting: {
        bpmnlint: packedBpmnlintConfig
      }
    });

    modelerRef.current = modeler;

    const targetXml = activeDiagram ? activeDiagram.xml : null;
    const targetTitle = activeDiagram ? activeDiagram.title : null;
    const targetTitleEn = activeDiagram ? activeDiagram.titleEn : null;

    if (activeDiagram && targetXml) {
      setDiagramName(targetTitle || "");
      setDiagramNameEn(targetTitleEn || "");
      modeler.importXML(targetXml).then(() => {
        const canvas = modeler.get('canvas') as any;
        canvas?.zoom?.('fit-viewport');
      }).catch(console.error);
    } else {
      const data = localStorage.getItem(`bpmn-diagram-${selectedId}`);
      if (data) {
         try {
           const diagram = JSON.parse(data) as any;
           if (diagram) {
             if (!Array.isArray(diagram.versions)) {
               diagram.versions = diagram.xml ? [{
                 version: diagram.latestVersion || 1,
                 xml: diagram.xml,
                 timestamp: diagram.updatedAt || new Date().toISOString(),
                 editorName: "سیستم"
               }] : [];
             }
             setCurrentDiagram(diagram);
             setDiagramName(diagram.title || diagram.name || "");
             setDiagramNameEn(diagram.titleEn || diagram.nameEn || "");
             if (diagram.xml) {
               modeler.importXML(diagram.xml).then(() => {
                  const canvas = modeler.get('canvas') as any;
                  canvas?.zoom?.('fit-viewport');
               }).catch(console.error);
             }
           }
         } catch (e) {
           console.error("Corrupted diagram data", e);
         }
      }
    }

    const onCommandStackChanged = () => {
      setIsSavingDraft(true);
      setTimeout(() => setIsSavingDraft(false), 500);
    };

    const onElementChanged = (e: any) => {
      // noop
    };

    modeler.on("commandStack.changed", onCommandStackChanged);
    modeler.on("element.changed", onElementChanged);
    
    const eventBus = modeler.get('eventBus') as any;

    const handleLintingCompleted = (event: any) => {
      const issuesMap = event.issues || {};
      const flatIssues: any[] = [];
      
      Object.keys(issuesMap).forEach((elementId) => {
        const list = issuesMap[elementId];
        if (Array.isArray(list)) {
          list.forEach((issue: any) => {
            flatIssues.push({
              elementId,
              id: issue.id || elementId,
              message: issue.message || issue.rule || '',
              rule: issue.rule,
              category: issue.category || 'error'
            });
          });
        }
      });
      
      setLintIssues(flatIssues);
    };

    eventBus.on('linting.completed', handleLintingCompleted);

    setTimeout(() => {
      const linting = modeler.get('linting') as any;
      if (linting && typeof linting.toggle === 'function') {
        linting.toggle(false);
      }
    }, 300);
    
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

    const handleSelectionChanged = (e: any) => {
      const newSelection = e.newSelection || [];
      if (newSelection.length > 0) {
        setSelectedElementId(newSelection[0].id);
      } else {
        setSelectedElementId(null);
      }
    };

    (modeler.get('eventBus') as any).on('selection.changed', handleSelectionChanged);

    // Block modeling operations for Viewer and Reviewer roles
    const currentEvtBus = modeler.get('eventBus') as any;
    if (currentEvtBus) {
      const blockIfReadOnly = (e: any) => {
        const role = (window as any).__CURRENT_USER_ROLE__ || 'manager';
        if (role === 'viewer' || role === 'reviewer') {
          if (e && typeof e.preventDefault === 'function') e.preventDefault();
          return false;
        }
      };

      currentEvtBus.on('directEditing.activate', blockIfReadOnly);
      currentEvtBus.on('shape.move.start', blockIfReadOnly);
      currentEvtBus.on('create.start', blockIfReadOnly);
      currentEvtBus.on('connect.start', blockIfReadOnly);
      currentEvtBus.on('resize.start', blockIfReadOnly);
    }

    let lintObserver: MutationObserver | null = null;

    const safeObserveLint = () => {
      if (lintObserver && canvasContainerRef.current) {
        lintObserver.observe(canvasContainerRef.current, { childList: true, subtree: true });
      }
    };

    const updateLintOverlays = () => {
      const issueElements = document.querySelectorAll('.bjsl-issues li, .bjsl-dropdown li, .bjsl-issues .message, .bjsl-issue');
      issueElements.forEach(el => {
        const textNode = el.childNodes[0];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          const originalText = el.getAttribute('data-original-text') || textNode.nodeValue || "";
          if (!el.hasAttribute('data-original-text')) {
            el.setAttribute('data-original-text', originalText);
          }
          const targetVal = lang === 'fa' ? customTranslate(originalText) : originalText;
          if (textNode.nodeValue !== targetVal) {
            textNode.nodeValue = targetVal;
          }
        }
      });

      const headings = document.querySelectorAll('.bjsl-issue-heading, .bjsl-header');
      headings.forEach(el => {
        const orig = el.getAttribute('data-original-text') || el.textContent || "";
        if (!el.hasAttribute('data-original-text')) {
          el.setAttribute('data-original-text', orig);
        }
        const targetVal = lang === 'fa' ? 'خطاها و آراستگی فرآیند' : orig;
        if (el.textContent !== targetVal) {
          el.textContent = targetVal;
        }
      });
    };

    lintObserver = new MutationObserver(() => {
      if (lintObserver) lintObserver.disconnect();
      updateLintOverlays();
      safeObserveLint();
    });

    safeObserveLint();

    return () => {
      modeler.off("commandStack.changed", onCommandStackChanged);
      modeler.off("element.changed", onElementChanged);
      eventBus.off('linting.completed', handleLintingCompleted);
      eventBus.off('selection.changed', handleSelectionChanged);
      if (lintObserver) lintObserver.disconnect();
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
    if (!modelerRef.current || activeRightTab !== 'comments') return;
    
    if (!selectedElementId) {
      setComments([]);
      return;
    }
    
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
    
    const activeAuthorName = currentUser?.name || editorName || (lang === 'fa' ? 'علی رضایی' : 'Co-Pilot');
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
              author: activeAuthorName
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
        author: activeAuthorName,
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
    const newComments = comments.filter(c => c.id !== id);
    saveComments(newComments);
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
        name: newProcessName || "بدون عنوان",
        nameEn: newProcessNameEn || "Untitled Process",
        editorName: editorName || "کاربر ناشناس",
        editorNameEn: editorNameEn || "Unknown Editor",
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
          name: diagramName,
          nameEn: diagramNameEn
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
          setDiagramNameEn("New Process");
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
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgEl = doc.documentElement;
      
      // Inject explicit Light Mode styles so exported SVG is always light mode
      const style = doc.createElementNS("http://www.w3.org/2000/svg", "style");
      style.textContent = `
        svg { background-color: #ffffff; }
        text, tspan { font-family: Tahoma, Arial, sans-serif !important; fill: #0f172a !important; color: #0f172a !important; }
        .djs-element:not(.djs-connection) .djs-visual > rect,
        .djs-element:not(.djs-connection) .djs-visual > circle,
        .djs-element:not(.djs-connection) .djs-visual > polygon,
        .djs-element:not(.djs-connection) .djs-visual > path {
          stroke: #1e293b !important;
        }
        .djs-connection .djs-visual path,
        .djs-connection .djs-visual polyline,
        .djs-connection .djs-visual line {
          stroke: #1e293b !important;
        }
        marker path, marker circle, marker polygon {
          fill: #1e293b !important;
          stroke: #1e293b !important;
        }
      `;
      svgEl.insertBefore(style, svgEl.firstChild);

      const serializer = new XMLSerializer();
      const lightSvgStr = serializer.serializeToString(svgEl);

      const blob = new Blob([lightSvgStr], { type: "image/svg+xml;charset=utf-8" });
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
        
        // Ensure Light Mode rendering style for exported canvas image
        const style = doc.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `
          text, tspan { font-family: Tahoma, Arial, sans-serif !important; fill: #0f172a !important; color: #0f172a !important; }
          .djs-element:not(.djs-connection) .djs-visual > rect,
          .djs-element:not(.djs-connection) .djs-visual > circle,
          .djs-element:not(.djs-connection) .djs-visual > polygon,
          .djs-element:not(.djs-connection) .djs-visual > path {
            stroke: #1e293b !important;
          }
          .djs-connection .djs-visual path,
          .djs-connection .djs-visual polyline,
          .djs-connection .djs-visual line {
            stroke: #1e293b !important;
          }
          marker path, marker circle, marker polygon {
            fill: #1e293b !important;
            stroke: #1e293b !important;
          }
        `;
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
            // Always export on crisp light background (#ffffff) regardless of active dark mode theme
            ctx.fillStyle = "#ffffff";
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
        canvas.zoom(1.0, 'auto');
      }
    }
  };

  const handleCompareWithPrevious = async () => {
    const versions = currentDiagram?.versions || [];
    if (!currentDiagram || versions.length < 2) {
      alert(t("diffRequiresTwoVersions", lang));
      return;
    }
    
    try {
      const currentXml = await modelerRef.current!.saveXML({ format: true });
      const previousVersion = versions[1]; 
      
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
    <div className={`flex flex-col h-screen overflow-hidden text-slate-800 dark:text-slate-200 ${theme === "dark" ? "dark dark-theme bg-[#0f172a]" : "bg-slate-50"} ${isReadOnlyRole ? 'read-only-role' : ''}`} dir={lang === "fa" ? "rtl" : "ltr"} id="bpmn-app-container">
      {/* Collaboration Metadata Header */}
      {activeDiagram && (
        <DiagramMetadataHeader
          onSaveVersion={async (changeSummary) => {
            if (!modelerRef.current) return;
            const { xml } = await modelerRef.current.saveXML({ format: true });
            if (xml) {
              workspace.saveDiagramXmlVersion(activeDiagram.id, xml, changeSummary);
            }
          }}
          onToggleHistoryDrawer={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
          onToggleCommentsDrawer={() => setIsCommentsDrawerOpen(!isCommentsDrawerOpen)}
          unresolvedCommentsCount={(activeDiagram.comments || []).filter(c => c.status === 'open').length}
          theme={theme}
          setTheme={setTheme}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onExportBpmn={async () => {
            if (!modelerRef.current) return;
            const { xml } = await modelerRef.current.saveXML({ format: true });
            if (xml) {
              const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${activeDiagram.title || "process"}.bpmn`;
              link.click();
              URL.revokeObjectURL(url);
            }
          }}
          onExportPng={() => handleExportPNG(3)}
          onExportSvg={handleExportSVG}
          lang={lang}
          setLang={setLang}
        />
      )}

      
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
              {(currentDiagram?.versions || []).slice().reverse().map((v) => (
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
                      <span>{t("byEditor", lang, {editorName: lang === 'fa' ? v.editorName : (v.editorNameEn || v.editorName)})}</span>
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
          {/* Zoom Controls placed on OPPOSITE side of element palette */}
          <div className={`absolute bottom-24 ${lang === 'fa' ? 'left-6' : 'right-6'} flex flex-col gap-1 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-1 z-10 ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}>
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

          <div ref={canvasContainerRef} className={`w-full flex-1 bpmn-container ${!showGrid ? "no-grid" : ""}`} id="bpmn-canvas-element" dir="ltr" />

          
          
          {/* Custom Lint Panel Bar */}
          <div className={`border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] flex flex-col z-20 shrink-0 transition-all duration-300 ${isLintPanelOpen && lintIssues.length > 0 ? 'h-[200px]' : 'h-8'}`}>
            <div 
              className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition select-none"
              onClick={() => setIsLintPanelOpen(!isLintPanelOpen)}
              dir={lang === "fa" ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-2">
                {lintIssues.length > 0 ? (
                  <>
                    <span className="text-amber-500 font-bold">⚠️</span>
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">
                      {lintIssues.length} {t("issuesFound", lang)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                      {lang === 'fa' ? 'وضعیت اعتبارسنجی: نمودار بدون خطا است' : 'Diagram Validation: No issues found'}
                    </span>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${!isLintPanelOpen ? 'rotate-180' : ''}`} />
            </div>
            {isLintPanelOpen && lintIssues.length > 0 && (
              <div className="overflow-y-auto p-2 flex-1 space-y-1">
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
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/20 rounded text-start transition"
                    dir={lang === "fa" ? "rtl" : "ltr"}
                  >
                    <span className="text-rose-500 flex-shrink-0 text-xs">⚠️</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 font-medium">{customTranslate(issue.message)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Right Sidebar Properties Panel (Collapsible) */}
        
        <div
          className={`h-full border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 relative ${isPropertiesOpen ? "w-80 lg:w-96" : "w-0"}`}
          id="properties-panel-container"
        >
          {/* Toggle Tab */}
          <button
            onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            className={`absolute top-1/2 transform -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-l-xl border shadow-xl ${
              isPropertiesOpen
                ? "-left-8 w-8 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300"
                : "-left-10 w-10 h-16 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-indigo-500/30 ring-2 ring-indigo-400/40"
            }`}
            title={isPropertiesOpen ? t("closePanel", lang) : t("openPanel", lang)}
            id="properties-toggle-btn"
          >
            {isPropertiesOpen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-white animate-pulse" />
              </div>
            )}
          </button>

          <div className="flex-1 h-full overflow-hidden flex flex-col bg-white dark:bg-[#1e293b]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pr-2">
              <div className="flex items-center flex-1">
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
              <button
                onClick={() => setIsPropertiesOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer ml-1"
                title={t("closePanel", lang)}
                id="properties-close-header-btn"
              >
                <X className="w-4 h-4" />
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
                              {currentRole !== 'viewer' && (
                                <>
                                  <button onClick={() => handleResolveComment(comment.id)} className="text-slate-400 hover:text-emerald-500 transition" title={t("toggleResolve", lang)}>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setReplyingTo(comment.id)} className="text-slate-400 hover:text-blue-500 transition" title={t("reply", lang)}>
                                    <Reply className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteComment(comment.id)} className="text-slate-400 hover:text-red-500 transition" title={t("delete", lang)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
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
                  {currentRole === 'viewer' ? (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-center">
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        سطح دسترسی شما «مشاهده‌گر (Viewer)» است.
                      </p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-1">
                        امکان مشاهده نظرات وجود دارد اما ثبت نظر جدید غیرفعال است.
                      </p>
                    </div>
                  ) : (
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
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                      >
                        {t("postComment", lang)}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
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
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{t("businessProcessTitle", lang)} (فارسی)</label>
                <input
                  type="text"
                  required
                  value={newProcessName}
                  onChange={(e) => setNewProcessName(e.target.value)}
                  placeholder={lang === 'fa' ? t("processNameExample", lang) : "فارسی..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  id="modal-new-name-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{t("businessProcessTitle", lang)} (English)</label>
                <input
                  type="text"
                  value={newProcessNameEn}
                  onChange={(e) => setNewProcessNameEn(e.target.value)}
                  placeholder="e.g. Procurement Process"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-left"
                  dir="ltr"
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

      {/* Drawers */}
      <VersionHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onRestoreVersionXml={(restoredXml, versionNum) => {
          if (modelerRef.current) {
            modelerRef.current.importXML(restoredXml).then(() => {
              try {
                const canvas = modelerRef.current?.get('canvas') as any;
                canvas?.zoom?.('fit-viewport');
              } catch(e) {}
            });
          }
          if (activeDiagram) {
            workspace.updateDiagram(activeDiagram.id, { xml: restoredXml });
          }
        }}
        onCompareVersions={(oldXml, newXml) => {
          setDiffingXmls({ oldXml, newXml });
        }}
      />

      <CommentsDrawer
        isOpen={isCommentsDrawerOpen}
        onClose={() => setIsCommentsDrawerOpen(false)}
      />
    </div>
  );
}
