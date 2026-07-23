import fs from 'fs';

const enAdds = {
  "diffModalTitle": "Compare Versions (Diff)",
  "diffAdded": "Added",
  "diffRemoved": "Removed",
  "diffChanged": "Changed",
  "diffLayout": "Layout Change",
  "changesFound": "Changes Found",
  "noChangesFound": "No changes found.",
  "oldVersion": "Old Version",
  "currentVersion": "Current Version",
  "diffBadgeAdded": "+ Added",
  "diffBadgeRemoved": "- Removed",
  "diffBadgeChanged": "~ Changed",
  "diffBadgeLayout": "✥ Layout"
};

const faAdds = {
  "diffModalTitle": "مقایسه نسخه‌ها (Diff)",
  "diffAdded": "جدید (Added)",
  "diffRemoved": "حذف شده (Removed)",
  "diffChanged": "تغییر ویژگی‌ها (Changed)",
  "diffLayout": "جابجایی (Layout)",
  "changesFound": "تغییرات یافت شده",
  "noChangesFound": "هیچ تغییری یافت نشد.",
  "oldVersion": "نسخه قبلی",
  "currentVersion": "نسخه فعلی",
  "diffBadgeAdded": "+ جدید (Added)",
  "diffBadgeRemoved": "- حذف شده (Removed)",
  "diffBadgeChanged": "~ تغییر یافته (Changed)",
  "diffBadgeLayout": "✥ جابجا شده (Layout)"
};

let en = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));
Object.assign(en, enAdds);
fs.writeFileSync('src/i18n/en.json', JSON.stringify(en, null, 2));

let fa = JSON.parse(fs.readFileSync('src/i18n/fa.json', 'utf8'));
Object.assign(fa, faAdds);
fs.writeFileSync('src/i18n/fa.json', JSON.stringify(fa, null, 2));

let code = fs.readFileSync('src/components/DiffModal.tsx', 'utf8');

if(!code.includes("import { t } from '../lib/i18n';")) {
  code = code.replace(/import React, \{ useEffect, useRef, useState \} from 'react';/, "import React, { useEffect, useRef, useState } from 'react';\nimport { t } from '../lib/i18n';");
}

code = code.replace(/theme: 'light' \| 'dark';/, "theme: 'light' | 'dark';\n  lang: 'fa' | 'en';");
code = code.replace(/\{ oldXml, newXml, onClose, theme \}: DiffModalProps/, "{ oldXml, newXml, onClose, theme, lang }: DiffModalProps");
code = code.replace(/dir="rtl"/g, 'dir={lang === "fa" ? "rtl" : "ltr"}');
code = code.replace(/"<div class=\\"diff-badge diff-added\\">\+ جدید \(Added\)<\/div>"/g, '`<div class="diff-badge diff-added">${t("diffBadgeAdded", lang)}</div>`');
code = code.replace(/"<div class=\\"diff-badge diff-removed\\">- حذف شده \(Removed\)<\/div>"/g, '`<div class="diff-badge diff-removed">${t("diffBadgeRemoved", lang)}</div>`');
code = code.replace(/'<div class="diff-badge diff-changed">~ تغییر یافته \(Changed\)<\/div>'/g, '`<div class="diff-badge diff-changed">${t("diffBadgeChanged", lang)}</div>`');
code = code.replace(/'<div class="diff-badge diff-layout">✥ جابجا شده \(Layout\)<\/div>'/g, '`<div class="diff-badge diff-layout">${t("diffBadgeLayout", lang)}</div>`');

code = code.replace(/>مقایسه نسخه‌ها \(Diff\)</g, '>{t("diffModalTitle", lang)}<');
code = code.replace(/>تغییرات یافت شده</g, '>{t("changesFound", lang)}<');
code = code.replace(/>هیچ تغییری یافت نشد\.</g, '>{t("noChangesFound", lang)}<');
code = code.replace(/>جدید \(Added\)</g, '>{t("diffAdded", lang)}<');
code = code.replace(/>حذف شده \(Removed\)</g, '>{t("diffRemoved", lang)}<');
code = code.replace(/>تغییر ویژگی‌ها \(Changed\)</g, '>{t("diffChanged", lang)}<');
code = code.replace(/>جابجایی \(Layout\)</g, '>{t("diffLayout", lang)}<');
code = code.replace(/>نسخه قبلی</g, '>{t("oldVersion", lang)}<');
code = code.replace(/>نسخه فعلی</g, '>{t("currentVersion", lang)}<');

fs.writeFileSync('src/components/DiffModal.tsx', code);
