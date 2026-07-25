import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /\/\/ Token Simulation Log header[\s\S]*?\/\/ Palette item titles/;

const replacement = `// Token Simulation Log header
      const logHeader = document.querySelector('.bts-log .bts-header');
      if (logHeader) {
        // Find text node inside bts-header
        for (const node of logHeader.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
             const originalText = logHeader.getAttribute('data-original-text') || node.nodeValue.trim();
             if (!logHeader.hasAttribute('data-original-text')) {
               logHeader.setAttribute('data-original-text', originalText);
             }
             if (lang === 'fa') {
               if (originalText === 'Simulation Log') {
                 node.nodeValue = ' تاریخچه شبیه‌سازی ';
               }
             } else {
               node.nodeValue = ' ' + originalText + ' ';
             }
          }
        }
      }
      
      // Palette item titles`;

code = code.replace(regex, replacement);

const regex2 = /\/\/ Simulation Log Entries[\s\S]*?\}\);\n    \}\);/;

const replacement2 = `// Simulation Log Entries
      const logTexts = document.querySelectorAll('.bts-log .bts-entry .bts-text');
      logTexts.forEach(el => {
        const originalText = (el.getAttribute('data-original-text') || el.textContent || "").trim();
        if (!el.hasAttribute('data-original-text')) {
          el.setAttribute('data-original-text', originalText);
        }
        
        let newText = originalText;
        if (lang === 'fa') {
          if (originalText === "Process started") newText = "شروع فرآیند";
          else if (originalText === "Process finished") newText = "پایان فرآیند";
          else if (originalText === "Process entered") newText = "ورود به فرآیند";
          else if (originalText === "Start Event") newText = "رویداد شروع";
          else if (originalText === "End Event") newText = "رویداد پایان";
          else if (originalText === "Task") newText = "وظیفه";
          else if (originalText === "User Task") newText = "وظیفه کاربر";
          else if (originalText === "Service Task") newText = "وظیفه سرویس";
          else if (originalText === "Exclusive Gateway") newText = "درگاه انحصاری (XOR)";
          else if (originalText === "Parallel Gateway") newText = "درگاه موازی (AND)";
          else if (originalText === "Inclusive Gateway") newText = "درگاه جامع (OR)";
        }
        
        el.textContent = newText;
        el.setAttribute('title', newText);
      });
      
      const noEntries = document.querySelector('.bts-log .bts-entry.placeholder');
      if (noEntries) {
         if (lang === 'fa') noEntries.textContent = "هیچ موردی ثبت نشده است";
         else noEntries.textContent = "No Entries";
      }
    });`;

code = code.replace(regex2, replacement2);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
