const fs = require('fs');
const path = require('path');

const directories = [
  'd:/Portfolio_Zahi/src/components/admin/pages',
  'd:/Portfolio_Zahi/src/components/admin/ui'
];

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
};

const replacements = [
  { search: /bg-charcoal-800\/60/g, replace: 'bg-white dark:bg-charcoal-800/60' },
  { search: /bg-charcoal-800\/80/g, replace: 'bg-gray-50 dark:bg-charcoal-800/80' },
  { search: /bg-charcoal-800\/40/g, replace: 'bg-white dark:bg-charcoal-800/40' },
  { search: /bg-charcoal-900(?![/\-\w])/g, replace: 'bg-gray-50 dark:bg-charcoal-900' },
  { search: /bg-charcoal-900\/40/g, replace: 'bg-white dark:bg-charcoal-900/40' },
  { search: /bg-charcoal-900\/60/g, replace: 'bg-gray-50 dark:bg-charcoal-900/60' },
  { search: /bg-charcoal-900\/80/g, replace: 'bg-white dark:bg-charcoal-900/80' },
  { search: /border-white\/5(?![/\-\w])/g, replace: 'border-gray-200 dark:border-white/5' },
  { search: /border-white\/10(?![/\-\w])/g, replace: 'border-gray-300 dark:border-white/10' },
  { search: /hover:border-white\/10(?![/\-\w])/g, replace: 'hover:border-gray-300 dark:hover:border-white/10' },
  { search: /bg-white\/5(?![/\-\w])/g, replace: 'bg-gray-100 dark:bg-white/5' },
  { search: /hover:bg-white\/5(?![/\-\w])/g, replace: 'hover:bg-gray-200 dark:hover:bg-white/5' },
  { search: /text-gray-400/g, replace: 'text-gray-500 dark:text-gray-400' },
  { search: /text-white(?![/\-\w])/g, replace: 'text-charcoal-900 dark:text-white' },
];

let updatedCount = 0;

for (const dir of directories) {
  const files = walkSync(dir);
  for (const file of files) {
    if (file.endsWith('AdminLayout.tsx') || file.endsWith('AdminSidebar.tsx') || file.endsWith('Button.tsx') || file.endsWith('Input.tsx') || file.endsWith('PageHeader.tsx')) {
      continue;
    }
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    for (const r of replacements) {
      content = content.replace(r.search, r.replace);
    }

    if (content !== original) {
      // Small adjustment for the specific case where text-white might be inside a string like bg-white/5 which we don't want to mess up, but regex ensures it's text-white.
      // One issue is button texts that should remain text-white in light mode. Let's fix that manually if needed.
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
      console.log('Updated:', file);
    }
  }
}

console.log(`Updated ${updatedCount} files.`);
