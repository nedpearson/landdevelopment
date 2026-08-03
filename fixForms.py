import os, re
files = ['apps/web/src/app/acquisition/page.tsx', 'apps/web/src/app/billing/page.tsx', 'apps/web/src/app/commissions/page.tsx', 'apps/web/src/app/comps/page.tsx', 'apps/web/src/app/demographics/page.tsx', 'apps/web/src/app/listings/page.tsx', 'apps/web/src/app/row/page.tsx', 'apps/web/src/app/tours/page.tsx', 'apps/web/src/app/traffic/page.tsx']
repl = '''  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitGenericForm(Object.fromEntries(formData.entries()));
    setIsModalOpen(false);
    showToast(result.success ? 'Saved successfully!' : 'Error saving');
  };
'''
for fp in files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            c = f.read()
        if 'import { submitGenericForm }' not in c:
            c = c.replace('import React', 'import { submitGenericForm } from \'@/actions/genericActions\';\\nimport React')
        if 'const handleSubmit =' not in c:
            c = c.replace('const showToast', repl + '\\n  const showToast')
        c = re.sub(r'onSubmit=\{.*preventDefault\(\);.*showToast\(.*\).*?\}', 'onSubmit={handleSubmit}', c)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(c)
        print('Updated ' + fp)
    except Exception as e:
        print('Error on ' + fp + ': ' + str(e))

