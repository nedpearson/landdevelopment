const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../apps/web/src/lib/workspace/WorkspaceRegistry.ts');
if (!fs.existsSync(registryPath)) {
  console.log('Skipping route validation, WorkspaceRegistry not found');
  process.exit(0);
}

const content = fs.readFileSync(registryPath, 'utf8');
const hrefRegex = /href:\s*'([^']+)'/g;
const uniqueHrefs = new Set();
let match;
while ((match = hrefRegex.exec(content)) !== null) {
  uniqueHrefs.add(match[1]);
}

const routes = Array.from(uniqueHrefs);
let missingCount = 0;
const missingRoutes = [];

routes.forEach(route => {
  if (route === '/') return; // Home route is handled by apps/web/src/app/page.tsx
  
  // Clean up dynamic routes for validation if needed, though WorkspaceRegistry uses static hrefs
  const appDir = path.join(__dirname, '../apps/web/src/app', route);
  const pagePath = path.join(appDir, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    missingCount++;
    missingRoutes.push(route);
  }
});

if (missingCount > 0) {
  console.error('\n❌ BUILD FAILED: NAVIGATION INTEGRITY ERROR');
  console.error(`Found ${missingCount} visible navigation links that point to non-existent routes:`);
  missingRoutes.forEach(r => console.error(`  - ${r} (Expected: apps/web/src/app${r}/page.tsx)`));
  console.error('\nAll routes defined in WorkspaceRegistry.ts must have a corresponding page.tsx implementation.');
  process.exit(1);
}

console.log('✅ Navigation Integrity Passed: All ' + routes.length + ' registered routes exist.');
