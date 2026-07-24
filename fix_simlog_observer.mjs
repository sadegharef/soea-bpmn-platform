import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const additionalObserver = `
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
`;

code = code.replace(/\/\/ Context Pad titles/, additionalObserver + '\n      // Context Pad titles');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
