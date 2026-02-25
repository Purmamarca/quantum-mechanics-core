import json
import re
import sys

try:
    with open('video_results_full.txt', 'r', encoding='utf-16-le') as f:
        content = f.read()
except:
    # Try utf-8 if utf-16 failed
    with open('video_results_full.txt', 'r', encoding='utf-8') as f:
        content = f.read()

match = re.search(r'"uri":\s*"(https://[^"]+)"', content)
if match:
    uri = match.group(1)
    print(f"Found URI: {uri}")
    with open('video_url.txt', 'w') as out:
        out.write(uri)
else:
    print("No URI found in content")
