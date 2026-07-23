import fs from 'fs';
let en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
en['teamCollaborationDesc'] = "To add a comment, click on an element and select the comment icon 💬 from the context pad.";
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let fa = JSON.parse(fs.readFileSync('src/i18n/fa.json', 'utf8'));
fa['teamCollaborationDesc'] = "برای ثبت نظر روی یک عنصر، روی آن کلیک کرده و آیکون کامنت 💬 را از منوی شناور انتخاب کنید.";
fs.writeFileSync('src/i18n/fa.json', JSON.stringify(fa, null, 2));

let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');
code = code.replace(/\{lang === 'fa' \s*\? 'برای ثبت نظر روی یک عنصر، روی آن کلیک کرده و آیکون کامنت 💬 را از منوی شناور انتخاب کنید\.'\s*: 'To add a comment, click on an element and select the comment icon 💬 from the context pad\.'\}/g, '{t("teamCollaborationDesc", lang)}');
fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
