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
                # We will just replace it properly
                chars = list(content)
                idx = 0
                while True:
                    idx = content.find('startTransition(async', idx)
                    if idx == -1: break
                    startIdx = content.find('{', idx)
                    if startIdx == -1: break
                    depth = 1
                    endIdx = startIdx + 1
                    while endIdx < len(chars) and depth > 0:
                        if chars[endIdx] == '{': depth += 1
                        elif chars[endIdx] == '}': depth -= 1
                        endIdx += 1
                    originalBlock = content[idx:endIdx + 2]
                    newBlock = re.sub(r'startTransition\s*\(\s*async\s*\(\)\s*=>\s*\{', 'startTransition(() => { void (async () => {', originalBlock)
                    newBlock = re.sub(r'\}\);\s*$', '})(); });', newBlock)
                    content = content[:idx] + newBlock + content[endIdx+2:]
                    chars = list(content)
                    idx += 10
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print('Fixed properly', path)
