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
      if (logHeader && lang === 'fa' && logHeader.textContent?.includes('Simulation Log')) {
        logHeader.textContent = logHeader.textContent.replace('Simulation Log', 'تاریخچه شبیه‌سازی');
      }
      // Palette item titles
      const paletteEntries = document.querySelectorAll('.djs-palette .entry');
      paletteEntries.forEach(entry => {
        const title = entry.getAttribute('title');
        if (title && lang === 'fa') {
          // Normal translations
          if (title.toLowerCase() === 'create start event' || title === 'Create StartEvent') {
            entry.setAttribute('title', 'ایجاد رویداد شروع');
          } else if (title.toLowerCase() === 'create end event' || title === 'Create EndEvent') {
            entry.setAttribute('title', 'ایجاد رویداد پایان');
          } else if (title.toLowerCase() === 'create gateway') {
            entry.setAttribute('title', 'ایجاد درگاه (Gateway)');
          } else if (title.toLowerCase() === 'create task') {
            entry.setAttribute('title', 'ایجاد وظیفه (Task)');
          } else if (title.toLowerCase() === 'create intermediate/boundary event' || title === 'Create Intermediate/Boundary Event') {
            entry.setAttribute('title', 'ایجاد رویداد میانی یا مرزی');
          } else if (title.toLowerCase() === 'create data object reference' || title === 'Create DataObjectReference') {
            entry.setAttribute('title', 'ایجاد شیء داده');
          } else if (title.toLowerCase() === 'create data store reference' || title === 'Create DataStoreReference') {
            entry.setAttribute('title', 'ایجاد پایگاه داده');
          } else if (title.toLowerCase() === 'create pool/participant' || title === 'Create Pool/Participant') {
            entry.setAttribute('title', 'ایجاد استخر/مشارکت‌کننده');
          } else if (title.toLowerCase() === 'create group') {
            entry.setAttribute('title', 'ایجاد گروه');
          } else if (title.toLowerCase() === 'create expanded sub-process' || title === 'Create expanded SubProcess') {
            entry.setAttribute('title', 'ایجاد زیرفرآیند باز شده');
          } else if (title.toLowerCase() === 'activate the hand tool') {
             entry.setAttribute('title', 'فعال کردن ابزار دست (کشیدن بوم)');
          } else if (title.toLowerCase() === 'activate the lasso tool') {
             entry.setAttribute('title', 'فعال کردن ابزار کمند (انتخاب چندتایی)');
          } else if (title.toLowerCase() === 'activate the create/remove space tool') {
             entry.setAttribute('title', 'فعال کردن ابزار مدیریت فضا');
          } else if (title.toLowerCase() === 'activate the global connect tool') {
             entry.setAttribute('title', 'فعال کردن ابزار اتصال سراسری');
          }
        }
      });
      // Context Pad titles
      const padEntries = document.querySelectorAll('.djs-context-pad .entry');
      padEntries.forEach(entry => {
        const title = entry.getAttribute('title');
        if (title && lang === 'fa') {
          if (title.toLowerCase() === 'append text annotation') {
            entry.setAttribute('title', 'افزودن یادداشت متنی');
          } else if (title.toLowerCase() === 'append end event' || title === 'Append EndEvent') {
            entry.setAttribute('title', 'افزودن رویداد پایان');
          } else if (title.toLowerCase() === 'append gateway') {
            entry.setAttribute('title', 'افزودن درگاه');
          } else if (title.toLowerCase() === 'append task') {
            entry.setAttribute('title', 'افزودن وظیفه');
          } else if (title.toLowerCase() === 'append intermediate/boundary event' || title === 'Append Intermediate/Boundary Event') {
            entry.setAttribute('title', 'افزودن رویداد میانی یا مرزی');
          } else if (title.toLowerCase() === 'remove') {
            entry.setAttribute('title', 'حذف عنصر');
          } else if (title.toLowerCase() === 'change type') {
            entry.setAttribute('title', 'تغییر نوع عنصر');
          } else if (title.toLowerCase() === 'connect using sequence/messageflow or association') {
            entry.setAttribute('title', 'اتصال با جریان متوالی یا پیام');
          }
        }
      });
      // Simulation Log Entries
      const logTexts = document.querySelectorAll('.bts-log-entry .text');
      logTexts.forEach(el => {
        if (lang === 'fa') {
          const txt = el.textContent || "";
          if (txt === "Process started") el.textContent = "شروع فرآیند";
          else if (txt === "Process finished") el.textContent = "پایان فرآیند";
          else if (txt === "Process entered") el.textContent = "ورود به فرآیند";
          else if (txt === "Start Event") el.textContent = "رویداد شروع";
          else if (txt === "End Event") el.textContent = "رویداد پایان";
          else if (txt === "Task") el.textContent = "وظیفه";
          else if (txt === "User Task") el.textContent = "وظیفه کاربر";
          else if (txt === "Service Task") el.textContent = "وظیفه سرویس";
          else if (txt === "Exclusive Gateway") el.textContent = "درگاه انحصاری (XOR)";
          else if (txt === "Parallel Gateway") el.textContent = "درگاه موازی (AND)";
          else if (txt === "Inclusive Gateway") el.textContent = "درگاه جامع (OR)";
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
