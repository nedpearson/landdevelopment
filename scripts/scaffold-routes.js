const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('apps/web/src/lib/workspace/WorkspaceRegistry.ts', 'utf8');
const hrefRegex = /href:\s*'([^']+)'/g;
const uniqueHrefs = new Set();
let match;
while ((match = hrefRegex.exec(content)) !== null) {
  uniqueHrefs.add(match[1]);
}

const routes = Array.from(uniqueHrefs);
let createdCount = 0;

routes.forEach(route => {
  if (route === '/' || route === '/properties') return;
  
  const appDir = path.join('apps/web/src/app', route);
  const pagePath = path.join(appDir, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    const titleName = route.replace('/', '').replace(/-/g, ' ');
    const titleCase = titleName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const pageContent = `import { CanonicalModule } from '@/components/ui/CanonicalModule';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${titleCase} | Land Intelligence OS',
};

export default function ${titleCase.replace(/\s/g, '')}Page() {
  return <CanonicalModule title="${titleCase}" />;
}
`;

    fs.writeFileSync(pagePath, pageContent);
    createdCount++;
  }
});

console.log('Successfully generated ' + createdCount + ' missing production routes.');
