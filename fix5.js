const fs = require('fs');
const files = ['apps/web/src/app/deliverables/page.tsx', 'apps/web/src/app/fieldwork/page.tsx', 'apps/web/src/app/leasehold/page.tsx', 'apps/web/src/app/properties/page.tsx', 'apps/web/src/app/utilities/page.tsx', 'apps/web/src/app/wells/page.tsx'];
files.forEach(f => { if (fs.existsSync(f)) { fs.writeFileSync(f, content); } });
