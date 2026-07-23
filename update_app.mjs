import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Add import
if (!code.includes("import { t, formatDateTime } from '../lib/i18n';")) {
  code = code.replace(/import React, \{ useState, useEffect, useRef \} from "react";/, 'import React, { useState, useEffect, useRef } from "react";\nimport { t, formatDateTime } from "../lib/i18n";');
}

// Global lang -> let's make it state-based.
// It's already: const [lang, setLang] = useState<"fa" | "en">("fa");

// Replaces
code = code.replace(/lang === 'fa' \? 'آیا از حذف این نظر اطمینان دارید؟' : 'Are you sure you want to delete this comment\?'/g, 't("deleteCommentConfirm", lang)');
code = code.replace(/lang === 'fa' \? `آیا از حذف فرآیند "\$\{currentDiagram.name\}" اطمینان دارید؟` : `Are you sure you want to delete "\$\{currentDiagram.name\}"\?`/g, 't("deleteProcessConfirm", lang, { name: currentDiagram.name })');
code = code.replace(/lang === 'fa' \? "فرآیند جدید" : "New Process"/g, 't("newProcess", lang)');
code = code.replace(/lang === "fa" \? "en" : "fa"/g, 'lang === "fa" ? "en" : "fa"'); // Keep logic
code = code.replace(/lang === "fa" \? "Switch to English" : "تغییر به فارسی"/g, 't("switchLanguage", lang)');
code = code.replace(/lang === "fa" \? "EN" : "فا"/g, 't("switchLanguage", lang)');
code = code.replace(/lang === 'fa' \? "حالت روشن" : "Light Mode"/g, 't("lightMode", lang)');
code = code.replace(/lang === 'fa' \? "حالت تاریک" : "Dark Mode"/g, 't("darkMode", lang)');
code = code.replace(/lang === 'fa' \? 'اشتراک و خروجی' : 'Share & Export'/g, 't("shareAndExport", lang)');
code = code.replace(/lang === 'fa' \? "لینک کپی شد" : "Link Copied"/g, 't("linkCopied", lang)');
code = code.replace(/lang === 'fa' \? "کپی لینک اشتراک" : "Copy Share Link"/g, 't("copyShareLink", lang)');
code = code.replace(/lang === 'fa' \? 'خروجی تصویر \(SVG\)' : 'Export Image \(SVG\)'/g, 't("exportSVG", lang)');
code = code.replace(/lang === 'fa' \? 'خروجی عکس \(PNG\)' : 'Export Image \(PNG\)'/g, 't("exportPNG", lang)');
code = code.replace(/lang === 'fa' \? 'خروجی فایل سند \(PDF\)' : 'Export Document \(PDF\)'/g, 't("exportPDF", lang)');
code = code.replace(/lang === 'fa' \? 'خطای اعتبارسنجی فرآیند یافت شد' : 'issues found'/g, 't("issuesFound", lang)');
code = code.replace(/lang === 'fa' \? 'همکاری با تیم' : 'Team Collaboration'/g, 't("teamCollaboration", lang)');
code = code.replace(/lang === 'fa' \? 'نظرات عنصر' : 'Element Comments'/g, 't("elementComments", lang)');
code = code.replace(/lang === 'fa' \? 'اولین نظر را شما ثبت کنید\.\.\.' : 'Be the first to comment\.\.\.'/g, 't("firstComment", lang)');
code = code.replace(/lang === 'fa' \? 'حل شده' : 'Resolved'/g, 't("resolved", lang)');
code = code.replace(/lang === 'fa' \? 'تغییر وضعیت' : 'Toggle Resolve'/g, 't("toggleResolve", lang)');
code = code.replace(/lang === 'fa' \? 'پاسخ' : 'Reply'/g, 't("reply", lang)');
code = code.replace(/lang === 'fa' \? 'حذف' : 'Delete'/g, 't("delete", lang)');
code = code.replace(/lang === 'fa' \? 'در حال پاسخ\.\.\.' : 'Replying\.\.\.'/g, 't("replying", lang)');
code = code.replace(/lang === 'fa' \? "نظر خود را بنویسید\.\.\." : "Write your comment\.\.\."/g, 't("writeComment", lang)');
code = code.replace(/lang === 'fa' \? 'ثبت نظر' : 'Post Comment'/g, 't("postComment", lang)');
code = code.replace(/lang === 'fa' \? "کاربر سیستم" : "System User"/g, 't("systemUser", lang)');
code = code.replace(/lang === 'fa' \? 'یک عنصر را در بوم انتخاب کنید تا بتوانید نظر ثبت کنید\.' : 'Select an element on the canvas to add comments\.'/g, 't("teamCollaborationDesc", lang)');
code = code.replace(/lang === 'fa' \? 'برچسب‌ها \(با کاما جدا کنید\)' : 'Tags \(comma separated\)'/g, 't("tagsLabel", lang)');
code = code.replace(/lang === 'fa' \? 'مثال: معماری, وضعیت موجود, فرآیند مالی' : 'e\.g\., AS-IS, Finance'/g, 't("tagsPlaceholder", lang)');
code = code.replace(/lang === 'fa' \? 'افزودن برچسب' : 'Add tag'/g, 't("addTag", lang)');
code = code.replace(/lang === 'fa' \? 'عنوان برچسب\.\.\.' : 'Tag name\.\.\.'/g, 't("tagNamePlaceholder", lang)');

// Other fixed strings
code = code.replace(/>هم‌نگار</, '>{t("app.title", lang)}<');
code = code.replace(/>بوم مشترک فرآیندهای شما</, '>{t("app.subtitle", lang)}<');
code = code.replace(/>فرآیند فعال:</, '>{t("activeProcess", lang)}<');
code = code.replace(/آخرین نسخه:/g, '{t("latestVersion", lang)}');
code = code.replace(/>فرآیند جدید</, '>{t("newProcess", lang)}<');
code = code.replace(/placeholder="نام فرآیند\.\.\."/g, 'placeholder={t("processNamePlaceholder", lang)}');
code = code.replace(/placeholder="نام ویرایشگر\.\.\."/g, 'placeholder={t("editorNamePlaceholder", lang)}');
code = code.replace(/title="واگرد \(Undo\)"/g, 'title={t("undo", lang)}');
code = code.replace(/title="مجدد \(Redo\)"/g, 'title={t("redo", lang)}');
code = code.replace(/>تاریخچه</g, '>{t("history", lang)}<');
code = code.replace(/title="فیت کردن صفحه"/g, 'title={t("fitViewport", lang)}');
code = code.replace(/title="بزرگ‌نمایی"/g, 'title={t("zoomIn", lang)}');
code = code.replace(/title="کوچک‌نمایی"/g, 'title={t("zoomOut", lang)}');
code = code.replace(/>حذف کامل این فرآیند</g, '>{t("deleteProcessBtn", lang)}<');
code = code.replace(/>ایجاد فرآیند جدید</g, '>{t("createNewProcess", lang)}<');
code = code.replace(/>نام فرآیند</g, '>{t("processName", lang)}<');
code = code.replace(/>ایجاد</, '>{t("create", lang)}<');
code = code.replace(/>انصراف</, '>{t("cancel", lang)}<');

// Date formatting
code = code.replace(/new Date\(comment\.date\)\.toLocaleDateString\(lang === 'fa' \? 'fa-IR' : 'en-US'\)/g, 'formatDateTime(comment.date, lang)');
code = code.replace(/new Date\(reply\.date\)\.toLocaleDateString\(lang === 'fa' \? 'fa-IR' : 'en-US'\)/g, 'formatDateTime(reply.date, lang)');

// Ensure right/left margins are fixed using auto layout (Tailwind logical properties are mostly just using standard flex, but let's see)

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
