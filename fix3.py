import os
import re
src_dir = os.path.join(os.getcwd(), 'apps', 'web', 'src')
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'startTransition(async' in content:
                # simple regex replace
                new_content = re.sub(r'startTransition\s*\(\s*async\s*\(\)\s*=>\s*\{', 'startTransition(() => { void (async () => {', content)
                # To fix the closing brackets, we assume it looks like \}); at the end of the block. We will replace ALL \}); that come after the start with \})(); });
                # That's too risky. Let's do it manually for each match.
                parts = content.split('startTransition(async')
                result = parts[0]
                for part in parts[1:]:
                    # part starts with ' () => {'
                    result += 'startTransition(() => { void (async'
                    # find the matching closing bracket
                    # Since we know the formatting is usually \});\n
                    part_replaced = re.sub(r'\}\);', '})(); });', part, count=1)
                    result += part_replaced
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(result)
                print(f'Fixed {path}')
