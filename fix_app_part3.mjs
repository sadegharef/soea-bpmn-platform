import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Replace the right side of the header
const newHeaderRight = `
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium text-sm"
              title={lang === "fa" ? "Switch to English" : "تغییر به فارسی"}
            >
              {lang === "fa" ? "EN" : "فا"}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={theme === "dark" ? (lang === 'fa' ? "حالت روشن" : "Light Mode") : (lang === 'fa' ? "حالت تاریک" : "Dark Mode")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button
              onClick={handleNewDiagram}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition font-medium text-sm"
            >
              <FilePlus className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'fa' ? 'جدید' : 'New'}</span>
            </button>
            <button
              onClick={() => document.getElementById("bpmn-upload")?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition font-medium text-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'fa' ? 'باز کردن' : 'Open'}</span>
            </button>
            <input
              type="file"
              id="bpmn-upload"
              accept=".bpmn,.xml"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            <button
              onClick={() => {
                if (currentDiagram) {
                  handleUpdateDiagram();
                } else {
                  setShowSaveDialog(true);
                }
              }}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition font-medium text-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">
                 {currentDiagram ? (lang === 'fa' ? 'ذخیره' : 'Save') : (lang === 'fa' ? 'ذخیره نمودار' : 'Save Diagram')}
              </span>
            </button>
            
            {currentDiagram && (
              <button
                onClick={handleSaveNewVersion}
                disabled={isSavingVersion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition font-medium text-sm"
              >
                {isSavingVersion ? <Loader2 className="w-4 h-4 animate-spin" /> : <History className="w-4 h-4" />}
                <span className="hidden sm:inline">{lang === 'fa' ? 'ذخیره نسخه جدید' : 'Save New Version'}</span>
              </button>
            )}

            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'fa' ? 'اشتراک و خروجی' : 'Export & Share'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
                {currentDiagram && (
                  <button
                    onClick={() => {
                      const shareUrl = window.location.origin + '/embed/' + currentDiagram.id;
                      navigator.clipboard.writeText(shareUrl);
                      alert(lang === 'fa' ? 'لینک اشتراک کپی شد!' : 'Share link copied!');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right"
                  >
                    <Link2 className="w-4 h-4 text-blue-500" />
                    {lang === 'fa' ? 'کپی لینک اشتراک' : 'Copy Share Link'}
                  </button>
                )}
                <button
                  onClick={handleExportSVG}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                >
                  <Image className="w-4 h-4 text-purple-500" />
                  {lang === 'fa' ? 'خروجی تصویر (SVG)' : 'Export Image (SVG)'}
                </button>
                <button
                  onClick={handleExportBPMN}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  {lang === 'fa' ? 'خروجی فایل (BPMN)' : 'Export File (BPMN)'}
                </button>
              </div>
            </div>
            
          </div>
`;

code = code.replace(/\{\/\* Action Buttons \*\/\}[\s\S]*?(?=<\/div>\s*<\/header>)/, newHeaderRight);

// Ensure imports for lucide-react include all we need
const requiredIcons = ['Sun', 'Moon', 'FilePlus', 'Upload', 'Save', 'History', 'Share2', 'Link2', 'Image', 'Download', 'Loader2', 'ChevronDown', 'Globe'];
requiredIcons.forEach(icon => {
  if (!code.includes(icon + ' ') && !code.includes(icon + ',')) {
    code = code.replace(/import \{([^}]+)\} from "lucide-react";/, 'import {$1, ' + icon + '} from "lucide-react";');
  }
});

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
