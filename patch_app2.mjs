import fs from 'fs';
let code = fs.readFileSync('src/components/BpmnModelerApp.tsx', 'utf8');

// Modifying the New Process modal to include tags
const tagInput = `
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {lang === 'fa' ? 'برچسب‌ها (با کاما جدا کنید)' : 'Tags (comma separated)'}
              </label>
              <input
                type="text"
                value={newProcessTags}
                onChange={(e) => setNewProcessTags(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={lang === 'fa' ? 'مثال: معماری, وضعیت موجود, فرآیند مالی' : 'e.g., AS-IS, Finance'}
              />
            </div>
`;
code = code.replace(/<div className="flex justify-end gap-2">/, tagInput + '\n            <div className="flex justify-end gap-2">');

fs.writeFileSync('src/components/BpmnModelerApp.tsx', code);
