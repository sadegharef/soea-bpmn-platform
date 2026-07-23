import fs from 'fs';

const enAdds = {
  "defaultEditorName": "Process User",
  "saveVersionError": "Error saving version",
  "saveDbError": "An error occurred saving version to database.",
  "loadXmlError": "Error loading old version XML file.",
  "pdfExportError": "Error rendering PDF export.",
  "diffRequiresTwoVersions": "At least two versions are needed for comparison.",
  "diffError": "An error occurred generating comparison.",
  "logoLetter": "H",
  "versionHistoryTitle": "Version History",
  "diffTooltip": "Shows differences from previous version",
  "viewingOldVersion": "You are viewing an old version ({version}).",
  "backToLatest": "Back to Latest Changes",
  "historyPanelTitle": "Process History",
  "historyPanelDesc": "Selecting a version loads its content. Save new changes as a minor version.",
  "versionLabel": "Version {version}",
  "finalVersion": "Final Version",
  "historyLabel": "History",
  "byEditor": "By: {editorName}",
  "closePanel": "Close Panel",
  "openPanel": "Open Panel",
  "elementDetails": "Element Details",
  "commentsAndDiscussions": "Comments & Discussions",
  "statusReady": "Status: Ready",
  "copyrightText": "All rights reserved for Yazd University Enterprise Architecture Lab.",
  "versionNumber": "Version 1.0.0",
  "platformSettings": "Platform Settings",
  "showGrid": "Show Dot Grid Background",
  "showGridDesc": "Disabling is useful for cleaner exports",
  "confirm": "Confirm",
  "helpAndShortcuts": "Help & Shortcuts",
  "openFile": "Open File",
  "undoText": "Undo",
  "redoText": "Redo",
  "copy": "Copy",
  "paste": "Paste",
  "selectAll": "Select All",
  "directEdit": "Direct Edit",
  "handTool": "Hand Tool",
  "lassoTool": "Lasso Tool",
  "spaceTool": "Space Tool",
  "createBpmnProcess": "Create New BPMN Process",
  "businessProcessTitle": "Business Process Title:",
  "processNameExample": "e.g., Leave Request, Hiring...",
  "cancel": "Cancel",
  "createAndLoad": "Create & Load"
};

const faAdds = {
  "defaultEditorName": "کاربر فرآیند",
  "saveVersionError": "خطا در ذخیره نسخه",
  "saveDbError": "خطایی در ذخیره نسخه در پایگاه داده رخ داد.",
  "loadXmlError": "خطا در بارگذاری فایل XML نسخه قدیمی.",
  "pdfExportError": "خطایی در رندر نسخه برداری PDF به وجود آمد.",
  "diffRequiresTwoVersions": "حداقل دو نسخه از فرآیند برای مقایسه نیاز است.",
  "diffError": "خطایی در ایجاد مقایسه رخ داد.",
  "logoLetter": "هـ",
  "versionHistoryTitle": "تاریخچه نسخه‌ها",
  "diffTooltip": "تفاوت‌ها با نسخه قبلی ثبت‌شده را نمایش می‌دهد",
  "viewingOldVersion": "شما در حال مشاهده نسخه قدیمی ({version}) هستید.",
  "backToLatest": "بازگشت به آخرین تغییرات",
  "historyPanelTitle": "تاریخچه تغییرات فرآیند",
  "historyPanelDesc": "انتخاب هر نسخه محتوای فایل را بارگذاری خواهد کرد. تغییرات جدید را در یک نسخه فرعی ثبت کنید.",
  "versionLabel": "نسخه {version}",
  "finalVersion": "نسخه نهایی",
  "historyLabel": "تاریخچه",
  "byEditor": "توسط: {editorName}",
  "closePanel": "بستن پنل",
  "openPanel": "باز کردن پنل",
  "elementDetails": "جزئیات عنصر",
  "commentsAndDiscussions": "نظرات و گفتگوها",
  "statusReady": "وضعیت: آماده به کار",
  "copyrightText": "کلیه حقوق هم برای آزمایشگاه معماری سازمانی دانشگاه یزد محفوظ است.",
  "versionNumber": "نسخه ۱.۰.۰",
  "platformSettings": "تنظیمات پلتفرم",
  "showGrid": "نمایش پس‌زمینه نقطه‌ای",
  "showGridDesc": "غیرفعال کردن آن برای خروجی‌های پاک‌تر مفید است",
  "confirm": "تایید",
  "helpAndShortcuts": "راهنما و کلیدهای میانبر",
  "openFile": "باز کردن فایل",
  "undoText": "بازگردانی",
  "redoText": "انجام مجدد",
  "copy": "کپی",
  "paste": "چسباندن",
  "selectAll": "انتخاب همه",
  "directEdit": "ویرایش مستقیم",
  "handTool": "ابزار دست",
  "lassoTool": "ابزار کمند",
  "spaceTool": "ابزار فضا",
  "createBpmnProcess": "ایجاد فرآیند جدید BPMN",
  "businessProcessTitle": "عنوان فرآیند کسب‌وکار:",
  "processNameExample": "مثال: فرآیند درخواست مرخصی، استخدام...",
  "cancel": "انصراف",
  "createAndLoad": "ایجاد و بارگذاری"
};

let en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
Object.assign(en, enAdds);
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let fa = JSON.parse(fs.readFileSync('src/i18n/fa.json', 'utf8'));
Object.assign(fa, faAdds);
fs.writeFileSync('src/i18n/fa.json', JSON.stringify(fa, null, 2));

let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

code = code.replace(/"کاربر فرآیند"/g, 't("defaultEditorName", lang)');
code = code.replace(/"خطا در ذخیره نسخه"/g, 't("saveVersionError", lang)');
code = code.replace(/"خطایی در ذخیره نسخه در پایگاه داده رخ داد\."/g, 't("saveDbError", lang)');
code = code.replace(/"خطا در بارگذاری فایل XML نسخه قدیمی\."/g, 't("loadXmlError", lang)');
code = code.replace(/"خطایی در رندر نسخه برداری PDF به وجود آمد\."/g, 't("pdfExportError", lang)');
code = code.replace(/"حداقل دو نسخه از فرآیند برای مقایسه نیاز است\."/g, 't("diffRequiresTwoVersions", lang)');
code = code.replace(/"خطایی در ایجاد مقایسه رخ داد\."/g, 't("diffError", lang)');
code = code.replace(/>هـ</g, '>{t("logoLetter", lang)}<');
code = code.replace(/title="تاریخچه نسخه‌ها"/g, 'title={t("versionHistoryTitle", lang)}');
code = code.replace(/title="تفاوت‌ها با نسخه قبلی ثبت‌شده را نمایش می‌دهد"/g, 'title={t("diffTooltip", lang)}');
code = code.replace(/<span>شما در حال مشاهده نسخه قدیمی \(\{viewingVersion\}\) هستید\.<\/span>/g, '<span>{t("viewingOldVersion", lang, {version: String(viewingVersion)})}</span>');
code = code.replace(/بازگشت به آخرین تغییرات/g, '{t("backToLatest", lang)}');
code = code.replace(/>تاریخچه تغییرات فرآیند</g, '>{t("historyPanelTitle", lang)}<');
code = code.replace(/انتخاب هر نسخه محتوای فایل را بارگذاری خواهد کرد\. تغییرات جدید را در یک نسخه فرعی ثبت کنید\./g, '{t("historyPanelDesc", lang)}');
code = code.replace(/>نسخه \{v\.version\}</g, '>{t("versionLabel", lang, {version: String(v.version)})}<');
code = code.replace(/"نسخه نهایی" : "تاریخچه"/g, 't("finalVersion", lang) : t("historyLabel", lang)');
code = code.replace(/>توسط: \{v\.editorName\}</g, '>{t("byEditor", lang, {editorName: v.editorName})}<');
code = code.replace(/title=\{isPropertiesOpen \? "بستن پنل" : "باز کردن پنل"\}/g, 'title={isPropertiesOpen ? t("closePanel", lang) : t("openPanel", lang)}');
code = code.replace(/جزئیات عنصر/g, '{t("elementDetails", lang)}');
code = code.replace(/نظرات و گفتگوها/g, '{t("commentsAndDiscussions", lang)}');
code = code.replace(/>وضعیت: آماده به کار</g, '>{t("statusReady", lang)}<');
code = code.replace(/کلیه حقوق هم برای آزمایشگاه معماری سازمانی دانشگاه یزد محفوظ است\./g, '{t("copyrightText", lang)}');
code = code.replace(/>نسخه ۱\.۰\.۰</g, '>{t("versionNumber", lang)}<');
code = code.replace(/>تنظیمات پلتفرم</g, '>{t("platformSettings", lang)}<');
code = code.replace(/>نمایش پس‌زمینه نقطه‌ای</g, '>{t("showGrid", lang)}<');
code = code.replace(/>غیرفعال کردن آن برای خروجی‌های پاک‌تر مفید است</g, '>{t("showGridDesc", lang)}<');
code = code.replace(/>تایید</g, '>{t("confirm", lang)}<');
code = code.replace(/>راهنما و کلیدهای میانبر</g, '>{t("helpAndShortcuts", lang)}<');
code = code.replace(/>باز کردن فایل</g, '>{t("openFile", lang)}<');
code = code.replace(/>بازگردانی</g, '>{t("undoText", lang)}<');
code = code.replace(/>انجام مجدد</g, '>{t("redoText", lang)}<');
code = code.replace(/>کپی</g, '>{t("copy", lang)}<');
code = code.replace(/>چسباندن</g, '>{t("paste", lang)}<');
code = code.replace(/>انتخاب همه</g, '>{t("selectAll", lang)}<');
code = code.replace(/>ویرایش مستقیم</g, '>{t("directEdit", lang)}<');
code = code.replace(/>ابزار دست</g, '>{t("handTool", lang)}<');
code = code.replace(/>ابزار کمند</g, '>{t("lassoTool", lang)}<');
code = code.replace(/>ابزار فضا</g, '>{t("spaceTool", lang)}<');
code = code.replace(/>ایجاد فرآیند جدید BPMN</g, '>{t("createBpmnProcess", lang)}<');
code = code.replace(/>عنوان فرآیند کسب‌وکار:</g, '>{t("businessProcessTitle", lang)}<');
code = code.replace(/placeholder="مثال: فرآیند درخواست مرخصی، استخدام\.\.\."/g, 'placeholder={t("processNameExample", lang)}');
code = code.replace(/>ایجاد و بارگذاری</g, '>{t("createAndLoad", lang)}<');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
