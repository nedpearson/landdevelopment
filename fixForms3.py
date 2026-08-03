import os, re
files = ['apps/web/src/app/acquisition/page.tsx', 'apps/web/src/app/billing/page.tsx', 'apps/web/src/app/commissions/page.tsx', 'apps/web/src/app/comps/page.tsx', 'apps/web/src/app/demographics/page.tsx', 'apps/web/src/app/listings/page.tsx', 'apps/web/src/app/row/page.tsx', 'apps/web/src/app/tours/page.tsx', 'apps/web/src/app/traffic/page.tsx']
for fp in files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            c = f.read()
        
        c = c.replace('\\\\n  const showToast', '\\n  const showToast')
        c = c.replace('\\n  const showToast', '\n  const showToast')
        
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(c)
        print('Updated ' + fp)
    except Exception as e:
        print('Error on ' + fp + ': ' + str(e))

