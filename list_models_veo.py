import requests
import os
from auth_utils import get_api_key

api_key = get_api_key()
if not api_key:
    print("Error: GEMINI_API_KEY not found. Set it in environment or .env file.")
    exit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

response = requests.get(url)
if response.status_code == 200:
    models = response.json().get('models', [])
    found = False
    for m in models:
        val = m['name'].lower()
        if 'veo' in val:
            print(f"Name: {m['name']}, SupportedGenerationMethods: {m.get('supportedGenerationMethods')}")
            found = True
    if not found:
        print("No models containing 'veo' found.")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
