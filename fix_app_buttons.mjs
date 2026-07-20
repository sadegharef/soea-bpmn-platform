import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// 1. Fix minimap open to minimap close
code = code.replace(/minimap\.open\(\);/, 'minimap.close();');

// 2. Add the Theme switch outside the more menu and fix Share & Export
// Let's find the section after {/* Export Actions */} up to </header>
const headerRegex = /\{\/\* Export Actions \*\/\}[\s\S]*?<\/header>/;

const newHeaderEnd = `          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium text-sm"
              title={lang === "fa" ? "Switch to English" : "تغییر به فارسی"}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === "fa" ? "EN" : "فا"}</span>
            </button>

            <button
              onClick={handleThemeToggle}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={theme === "dark" ? (lang === 'fa' ? "حالت روشن" : "Light Mode") : (lang === 'fa' ? "حالت تاریک" : "Dark Mode")}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'fa' ? 'اشتراک و خروجی' : 'Share & Export'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
                
                <button
                  onClick={handleCopyEmbedLink}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right"
                >
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  {copiedLink ? (lang === 'fa' ? "لینک کپی شد" : "Link Copied") : (lang === 'fa' ? "کپی لینک اشتراک" : "Copy Share Link")}
                </button>

                <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-1"></div>

                <button
                  onClick={handleExportSVG}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                >
                  <FileCode className="w-4 h-4 text-orange-500" />
                  {lang === 'fa' ? 'خروجی تصویر (SVG)' : 'Export Image (SVG)'}
                </button>

                <button
                  onClick={() => handleExportPNG(3)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  {lang === 'fa' ? 'خروجی عکس (PNG)' : 'Export Image (PNG)'}
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                >
                  <FileDown className="w-4 h-4 text-rose-500" />
                  {lang === 'fa' ? 'خروجی فایل سند (PDF)' : 'Export Document (PDF)'}
                </button>

              </div>
            </div>
          </div>
        </div>
      </header>`;

code = code.replace(headerRegex, newHeaderEnd);

// Make sure Globe, Sun, Moon are imported
if (!code.includes('Sun,')) {
    code = code.replace('} from "lucide-react";', 'Sun, Moon, Globe } from "lucide-react";');
}

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
