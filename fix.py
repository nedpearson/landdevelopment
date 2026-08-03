import os
files = ['apps/web/src/app/deliverables/page.tsx', 'apps/web/src/app/fieldwork/page.tsx', 'apps/web/src/app/leasehold/page.tsx', 'apps/web/src/app/properties/page.tsx', 'apps/web/src/app/utilities/page.tsx', 'apps/web/src/app/wells/page.tsx']
content = '''import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Page | Land Intelligence OS' };
export default function Page() { return <div className=\
p-8
text-white\>Coming soon.</div>; }
'''
for f in files:
    if os.path.exists(f):
        with open(f, 'w') as fh:
            fh.write(content)
