import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const regex = /      const noEntries = document\.querySelector\('\.bts-log \.bts-entry\.placeholder'\);\n      if \(noEntries\) \{\n         if \(lang === 'fa'\) noEntries\.textContent = "هیچ موردی ثبت نشده است";\n         else noEntries\.textContent = "No Entries";\n      \}\n    \}\);/m;

const replacement = `      const noEntries = document.querySelector('.bts-log .bts-entry.placeholder');
      if (noEntries) {
         if (lang === 'fa') noEntries.textContent = "هیچ موردی ثبت نشده است";
         else noEntries.textContent = "No Entries";
      }
    };
    
    updateTitles();
    const observer = new MutationObserver(() => {
      updateTitles();
    });`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
