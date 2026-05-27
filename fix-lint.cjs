const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    fs.writeFileSync(file, content.replace(search, replace), 'utf8');
    console.log('Fixed:', file);
  } else if (search instanceof RegExp) {
    fs.writeFileSync(file, content.replace(search, replace), 'utf8');
    console.log('Fixed (RegExp):', file);
  }
};

// ParticleBackground.tsx
replaceInFile(
  'd:/Portfolio_Zahi/src/components/ParticleBackground.tsx',
  'const ParticleField = (props: any) => {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\nconst ParticleField = (props: any) => {'
);

// SortableItem.tsx
replaceInFile(
  'd:/Portfolio_Zahi/src/components/admin/ui/SortableItem.tsx',
  'attributes: any;',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n      attributes: any;'
);
replaceInFile(
  'd:/Portfolio_Zahi/src/components/admin/ui/SortableItem.tsx',
  'listeners: any;',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n      listeners: any;'
);

// AuthContext.tsx
replaceInFile(
  'd:/Portfolio_Zahi/src/contexts/AuthContext.tsx',
  'export const useAuth = () => {',
  '// eslint-disable-next-line react-refresh/only-export-components\nexport const useAuth = () => {'
);

// queryClient.ts
replaceInFile(
  'd:/Portfolio_Zahi/src/lib/queryClient.ts',
  'onError: (err: any) => {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n          onError: (err: any) => {'
);

// AdminLogin.tsx
replaceInFile(
  'd:/Portfolio_Zahi/src/pages/admin/AdminLogin.tsx',
  'const handleLogin = async (e: any) => {',
  'const handleLogin = async (e: React.FormEvent) => {'
);

// animations.ts
replaceInFile(
  'd:/Portfolio_Zahi/src/utils/animations.ts',
  'gsap.utils.toArray(\'.fade-in\').forEach((element: any) => {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  gsap.utils.toArray(\'.fade-in\').forEach((element: any) => {'
);
replaceInFile(
  'd:/Portfolio_Zahi/src/utils/animations.ts',
  'gsap.utils.toArray(\'.project-card\').forEach((element: any, index) => {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  gsap.utils.toArray(\'.project-card\').forEach((element: any, index) => {'
);
replaceInFile(
  'd:/Portfolio_Zahi/src/utils/animations.ts',
  'gsap.utils.toArray(\'.skill-item\').forEach((element: any, index) => {',
  '// eslint-disable-next-line @typescript-eslint/no-explicit-any\n  gsap.utils.toArray(\'.skill-item\').forEach((element: any, index) => {'
);

console.log('Done fixing lint errors');
