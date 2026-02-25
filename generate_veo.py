import os
import time
import json
import argparse
import requests

from auth_utils import get_api_key

def generate_video(prompt, key_arg=None):
    api_key = key_arg if key_arg else get_api_key()
    if not api_key:
        print("Error: GEMINI_API_KEY not found.")
        return

    model_name = "veo-3.0-generate-001"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:predictLongRunning?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    # Payload for Veo
    payload = {
        "instances": [
             { "prompt": prompt }
        ],
        "parameters": {
            "sampleCount": 1,
            # "aspectRatio": "16:9", # Optional
            # "negativePrompt": ""   # Optional
        }
    }
    
    print(f"Sending request to Veo 3 ({model_name})...")
    print(f"Prompt: {prompt[:50]}...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            print(f"Error starting generation: {response.status_code}")
            print(response.text)
            return

        operation = response.json()
        op_name = operation.get('name')
        if not op_name:
            print("No operation name returned.")
            print(operation)
            return
            
        print(f"\nOperation started: {op_name}")
        print("Waiting for video generation (this may take a minute)...")
        
        # Poll for completion
        while True:
            time.sleep(5) 
            op_url = f"https://generativelanguage.googleapis.com/v1beta/{op_name}?key={api_key}"
            op_resp = requests.get(op_url)
            
            if op_resp.status_code != 200:
                print(f"Error checking status: {op_resp.status_code}")
                continue
                
            op_data = op_resp.json()
            
            if op_data.get('done'):
                if 'error' in op_data:
                    print("Operation failed!")
                    print(op_data['error'])
                else:
                    # Success
                    print("\nGeneration Complete!")
                    # Inspect for video URI
                    # Structure usually: response -> video -> uri OR result -> video -> uri
                    # Veo result structure might be nested
                    resp_body = op_data.get('response')
                    if resp_body:
                        print("Result:")
                        print(json.dumps(resp_body, indent=2))
                        
                        # Try to find URI
                        # Could be in candidates, or direct video object? 
                        # Based on typical AI Studio LRO:
                        # might be under 'result' type url?
                        pass 
                    else:
                        print("Done but no response body?")
                        print(json.dumps(op_data, indent=2))
                break
            else:
                print(".", end="", flush=True)

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", help="API Key")
    parser.add_argument("--prompt", help="Prompt")
    args = parser.parse_args()
    
    PROMPT = args.prompt if args.prompt else "A cinematic, ultra-detailed 3D visualization of quantum gravity architecture. The camera pushes through a macro lens view of the fabric of spacetime. Initially, it looks like a smooth, dark, iridescent grid (General Relativity). As the camera zooms in closer to the Planck scale, the smooth fabric breaks down into a foaming, turbulent geometric network of discrete loops and nodes (Spin Networks). Glowing golden threads connect floating polyhedrons, representing the discrete quantization of space. The background is a deep void filled with shifting mathematical fractals. The lighting is ethereal and volumetric, highlighting the 'grains' of space interacting with gravity. 8k resolution, scientific simulation style, unreal engine 5 render."
    
    generate_video(PROMPT, args.key)
