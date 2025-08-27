const fs = require('fs');
const path = require('path');

const root = __dirname;
const localesDir = path.join(root, 'locales');

// Map file names to namespace keys expected by config
const fileToNamespace = new Map([
  ['common.json', 'common'],
  ['auth.json', 'auth'],
  ['dashboard.json', 'dashboard'],
  ['master-data.json', 'masterData'],
  ['employee.json', 'employee'],
  ['scheduling.json', 'scheduling'],
  ['settings.json', 'settings'],
  ['validation.json', 'validation'],
  ['chatbot.json', 'chatbot'],
  ['toast.json', 'toast'],
  ['workflow.json', 'workflow'],
  ['leave-management.json', 'leaveManagement'],
  ['translator.json', 'translator'],
  ['main-menu.json', 'mainMenu'],
]);

function readJsonSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return undefined;
  }
}

function mergeLocale(locale) {
  const localeDir = path.join(localesDir, locale);
  const output = {};

  for (const [fileName, nsKey] of fileToNamespace.entries()) {
    const filePath = path.join(localeDir, fileName);
    if (fs.existsSync(filePath)) {
      const data = readJsonSafe(filePath);
      if (data !== undefined) {
        output[nsKey] = data;
      }
    }
  }

  const outPath = path.join(localeDir, 'all.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  return { outPath, keys: Object.keys(output) };
}

function main() {
  const locales = fs.readdirSync(localesDir).filter((entry) => {
    const p = path.join(localesDir, entry);
    return fs.statSync(p).isDirectory() && ['en', 'ar'].includes(entry);
  });

  const results = locales.map((l) => ({ locale: l, ...mergeLocale(l) }));
  for (const r of results) {
    console.log(`[i18n] ${r.locale} -> ${r.outPath} (${r.keys.length} namespaces: ${r.keys.join(', ')})`);
  }
}

main();


