import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Flat sources stay at the repository root. Next.js requires app/, lib/ and
// supabase/ at runtime, so npm scripts recreate those folders automatically.
const root = path.dirname(fileURLToPath(import.meta.url));
const files = [
  ['page.tsx', 'app/page.tsx'],
  ['admin-page.tsx', 'app/admin/page.tsx'],
  ['layout.tsx', 'app/layout.tsx'],
  ['globals.css', 'app/globals.css'],
  ['products.ts', 'lib/products.ts'],
  ['schema.sql', 'supabase/schema.sql'],
];

for (const [source, destination] of files) {
  const target = path.join(root, destination);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(root, source), target);
}

console.log('Next.js runtime folders prepared from the flat root files.');
