import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const fixBlock = `
  // Fix hardcoded Token Simulation titles
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const toggleBtn = document.querySelector('.bts-toggle-mode');
      if (toggleBtn) {
        toggleBtn.setAttribute('title', lang === 'fa' ? 'شبیه‌سازی فرآیند' : 'Token Simulation');
      }
      const logHeader = document.querySelector('.bts-log .header');
      if (logHeader && lang === 'fa' && logHeader.textContent === 'Simulation Log') {
        logHeader.textContent = 'تاریخچه شبیه‌سازی';
      }
    });
    if (canvasContainerRef.current) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [lang]);
`;

code = code.replace(/useEffect\(\(\) => \{\n\s*\(window as any\)\.__BPMN_LANG__ = lang;/, fixBlock + '\n  useEffect(() => {\n    (window as any).__BPMN_LANG__ = lang;');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
