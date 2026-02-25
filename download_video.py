import requests
import os

from auth_utils import get_api_key

api_key = get_api_key()
if not api_key:
    print("Error: GEMINI_API_KEY not found in environment or .env file")
    exit(1)

url = "https://generativelanguage.googleapis.com/v1beta/files/lwyqe3z4qvr5:download?alt=media"

# The provided URL already has the file ID.
# To download, we might need the API key in headers.

headers = {
    "x-goog-api-key": api_key
}

print(f"Downloading {url}...")
response = requests.get(url, headers=headers, stream=True)

if response.status_code == 200:
    with open("quantum_gravity_veo.mp4", "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print("Download complete: quantum_gravity_veo.mp4")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
