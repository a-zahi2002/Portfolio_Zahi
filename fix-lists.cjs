const fs = require('fs');
const path = require('path');

const dir = 'd:/Portfolio_Zahi/src/components/admin/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('List.tsx'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Make hover actions visible on mobile
  content = content.replace(/opacity-0 group-hover:opacity-100/g, 'opacity-100 md:opacity-0 md:group-hover:opacity-100 mt-2 sm:mt-0 w-full sm:w-auto justify-end');

  // Allow flex items to wrap on very small screens
  // We need to be careful with the main flex container of the list items.
  // It usually looks like: className="flex items-center gap-4 p-4
  // Let's change it to className="flex flex-col sm:flex-row sm:items-center gap-4 p-4
  content = content.replace(/className="flex items-center gap-4 p-4/g, 'className="flex flex-col sm:flex-row sm:items-center gap-4 p-4');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed mobile responsiveness in:', file);
  }
}
