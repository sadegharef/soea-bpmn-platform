import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /\/\/ Fix hardcoded titles \(Token Simulation and Palette\)[\s\S]*?return \(\) => observer\.disconnect\(\);\n  \}, \[lang\]\);/;

const replacement = `// Fix hardcoded titles (Token Simulation and Palette)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Token Simulation Toggle
      const toggleBtn = document.querySelector('.bts-toggle-mode');
      if (toggleBtn) {
        toggleBtn.setAttribute('title', lang === 'fa' ? 'شبیه‌سازی فرآیند' : 'Token Simulation');
      }
      
      // Token Simulation Log header
      const logHeader = document.querySelector('.bts-log .header');
      if (logHeader) {
        if (lang === 'fa' && logHeader.textContent?.includes('Simulation Log')) {
          logHeader.textContent = logHeader.textContent.replace('Simulation Log', 'تاریخچه شبیه‌سازی');
        } else if (lang === 'en' && logHeader.textContent?.includes('تاریخچه شبیه‌سازی')) {
          logHeader.textContent = logHeader.textContent.replace('تاریخچه شبیه‌سازی', 'Simulation Log');
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
        
        if (faTitle && enTitle) {
          entry.setAttribute('title', lang === 'fa' ? faTitle : enTitle);
        }
      });
      
      // Context Pad titles
      const padEntries = document.querySelectorAll('.djs-context-pad .entry');
      padEntries.forEach(entry => {
        const action = entry.getAttribute('data-action');
        if (!action) return;
        
        let faTitle = "";
        let enTitle = "";
        
        if (action === 'append.text-annotation') { faTitle = 'افزودن یادداشت متنی'; enTitle = 'Append text annotation'; }
        else if (action === 'append.end-event') { faTitle = 'افزودن رویداد پایان'; enTitle = 'Append EndEvent'; }
        else if (action === 'append.gateway') { faTitle = 'افزودن درگاه'; enTitle = 'Append Gateway'; }
        else if (action === 'append.task') { faTitle = 'افزودن وظیفه'; enTitle = 'Append Task'; }
        else if (action === 'append.intermediate-event') { faTitle = 'افزودن رویداد میانی یا مرزی'; enTitle = 'Append Intermediate/Boundary Event'; }
        else if (action === 'delete') { faTitle = 'حذف عنصر'; enTitle = 'Remove'; }
        else if (action === 'replace') { faTitle = 'تغییر نوع عنصر'; enTitle = 'Change type'; }
        else if (action === 'connect') { faTitle = 'اتصال با جریان متوالی یا پیام'; enTitle = 'Connect using Sequence/MessageFlow or Association'; }
        
        if (faTitle && enTitle) {
          entry.setAttribute('title', lang === 'fa' ? faTitle : enTitle);
        }
      });
      
      // Simulation Log Entries
      const logTexts = document.querySelectorAll('.bts-log-entry .text');
      logTexts.forEach(el => {
        const originalText = el.getAttribute('data-original-text') || el.textContent || "";
        if (!el.hasAttribute('data-original-text')) {
          el.setAttribute('data-original-text', originalText);
        }
        
        if (lang === 'fa') {
          if (originalText === "Process started") el.textContent = "شروع فرآیند";
          else if (originalText === "Process finished") el.textContent = "پایان فرآیند";
          else if (originalText === "Process entered") el.textContent = "ورود به فرآیند";
          else if (originalText === "Start Event") el.textContent = "رویداد شروع";
          else if (originalText === "End Event") el.textContent = "رویداد پایان";
          else if (originalText === "Task") el.textContent = "وظیفه";
          else if (originalText === "User Task") el.textContent = "وظیفه کاربر";
          else if (originalText === "Service Task") el.textContent = "وظیفه سرویس";
          else if (originalText === "Exclusive Gateway") el.textContent = "درگاه انحصاری (XOR)";
          else if (originalText === "Parallel Gateway") el.textContent = "درگاه موازی (AND)";
          else if (originalText === "Inclusive Gateway") el.textContent = "درگاه جامع (OR)";
          else el.textContent = originalText;
        } else {
          el.textContent = originalText;
        }
      });
    });
    if (canvasContainerRef.current) {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
    return () => observer.disconnect();
  }, [lang]);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
