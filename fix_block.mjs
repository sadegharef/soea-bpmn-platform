import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /    return \(\) => \{\n      modeler\.off\("commandStack\.changed", onCommandStackChanged\);\n      modeler\.off\("element\.changed", onElementChanged\);\n      observer\.disconnect\(\);\n      modeler\.destroy\(\);\n      modelerRef\.current = null;\n    \};\n  \}, \[selectedId\]\); \/\/ Recreate if selected ID changes to ensure clean registers/m;

const replacement = `    return () => observer.disconnect();
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
    const list = JSON.parse(localStorage.getItem("bpmn-diagrams") || "[]") as DiagramListItem[];
    if (list.length === 0) {
      const initial: DiagramListItem = { id: "demo-process", name: "فرآیند نمونه خرید سازمانی", nameEn: "Demo Procurement Process", updatedAt: new Date().toISOString() };
      localStorage.setItem("bpmn-diagrams", JSON.stringify([initial]));
      setDiagrams([initial]);
      if (!localStorage.getItem(\`bpmn-diagram-demo-process\`)) {
         localStorage.setItem(\`bpmn-diagram-demo-process\`, JSON.stringify({
            id: "demo-process",
            name: "فرآیند نمونه خرید سازمانی",
            nameEn: "Demo Procurement Process",
            xml: \`<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="152" y="102" width="36" height="36" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>\`,
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

    const data = localStorage.getItem(\`bpmn-diagram-\${selectedId}\`);
    if (data) {
       const diagram = JSON.parse(data) as Diagram;
       setCurrentDiagram(diagram);
       setDiagramName(diagram.name);
       setDiagramNameEn(diagram.nameEn || "");
       modeler.importXML(diagram.xml).then(() => {
          const canvas = modeler.get('canvas') as any;
          canvas.zoom('fit-viewport');
          const linting = modeler.get('linting') as any;
          linting.activateLinting();
       }).catch(console.error);
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

    const observer = new MutationObserver((mutations) => {
      const overlays = document.querySelectorAll('.bjsl-overlay');
      overlays.forEach(overlay => {
        const issuesList = overlay.querySelectorAll('.bjsl-issues li');
        issuesList.forEach(li => {
          const textNode = li.childNodes[0];
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            const originalText = textNode.nodeValue || "";
            if (!li.hasAttribute('data-original-text')) {
              li.setAttribute('data-original-text', originalText);
            }
            if (lang === 'fa') {
              const translated = customTranslate(originalText);
              textNode.nodeValue = translated;
            } else {
              textNode.nodeValue = li.getAttribute('data-original-text') || "";
            }
          }
        });
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
  }, [selectedId]); // Recreate if selected ID changes to ensure clean registers`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
