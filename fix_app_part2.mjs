import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

const newHeaderRight = `
          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setLang(lang === "fa" ? "en" : "fa")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition font-medium text-sm"
              title={lang === "fa" ? "Switch to English" : "تغییر به فارسی"}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === "fa" ? "EN" : "فا"}</span>
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

            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'fa' ? 'اشتراک و ذخیره' : 'Share & Save'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 origin-top-right">
                
                <button
                  onClick={() => {
                    if (currentDiagram) {
                      handleUpdateDiagram();
                    } else {
                      setShowSaveDialog(true);
                    }
                  }}
                  disabled={isSaving}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Save className="w-4 h-4 text-blue-500" />}
                  {currentDiagram ? (lang === 'fa' ? 'ذخیره روی فضای ابری' : 'Save to Cloud') : (lang === 'fa' ? 'ذخیره نمودار جدید' : 'Save New Diagram')}
                </button>
                
                {currentDiagram && (
                  <button
                    onClick={handleSaveNewVersion}
                    disabled={isSavingVersion}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                  >
                    {isSavingVersion ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : <History className="w-4 h-4 text-emerald-500" />}
                    {lang === 'fa' ? 'ذخیره به عنوان نسخه جدید' : 'Save as New Version'}
                  </button>
                )}

                {currentDiagram && (
                  <button
                    onClick={() => {
                      const shareUrl = window.location.origin + '/embed/' + currentDiagram.id;
                      navigator.clipboard.writeText(shareUrl);
                      alert(lang === 'fa' ? 'لینک اشتراک کپی شد!' : 'Share link copied!');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-right border-t border-slate-100 dark:border-slate-700"
                  >
                    <Link2 className="w-4 h-4 text-amber-500" />
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
                  <Download className="w-4 h-4 text-indigo-500" />
                  {lang === 'fa' ? 'خروجی فایل (BPMN)' : 'Export File (BPMN)'}
                </button>

              </div>
            </div>
            
          </div>
`;

code = code.replace(/\{\/\* Action Buttons \*\/\}[\s\S]*?(?=<\/div>\s*<\/header>)/, newHeaderRight);

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
