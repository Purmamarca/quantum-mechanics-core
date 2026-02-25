import requests
import os
import json
from auth_utils import get_api_key

api_key = get_api_key()
if not api_key:
    print("Error: GEMINI_API_KEY not found. Set it in environment or .env file.")
    exit(1)

model = "veo-3.0-generate-001"
# endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predict"
# Let's try predictLongRunning as listed in supported methods
endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:predictLongRunning?key={api_key}"

headers = {
    "Content-Type": "application/json"
}

# Try payload for video generation
# Often: { "prompt": "..." } at root or { "instances": [...] }
# Let's try what looks like standard
payload = {
  "instances": [
    { "prompt": "A cinematic, ultra-detailed 3D visualization of quantum gravity architecture." }
  ],
  "parameters": {
    "sampleCount": 1
  }
}

print(f"Testing {endpoint}...")
response = requests.post(endpoint, headers=headers, json=payload)

print(f"Status: {response.status_code}")
print(response.text)

if response.status_code != 200:
    # Try different payload structure if 400
    # Maybe simple prompt?
    print("\nTrying simple payload...")
    payload2 = {
        "prompt": "A cinematic, ultra-detailed 3D visualization of quantum gravity architecture."
    }
    response2 = requests.post(endpoint, headers=headers, json=payload2)
    print(f"Status 2: {response2.status_code}")
    print(response2.text)
