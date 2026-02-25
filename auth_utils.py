import os

def get_api_key():
    """
    Retrieves the Gemini API key from environment variables or a .env file.
    Returns:
        str: The API key if found, None otherwise.
    """
    # Priority 1: Environment Variable
    key = os.environ.get("GEMINI_API_KEY")
    if key and not key.startswith("YOUR_"):
        return key
    
    # Priority 2: .env file in the current directory
    if os.path.exists(".env"):
        try:
            with open(".env", "r") as f:
                for line in f:
                    if line.strip().startswith("GEMINI_API_KEY="):
                        k = line.strip().split("=", 1)[1].strip().strip('"')
                        if k and not k.startswith("YOUR_"):
                            return k
        except Exception:
            pass
            
    return None
