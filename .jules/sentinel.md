# Sentinel's Journal - Quantum Mechanics Core

## 2026-02-25 - Hardcoded API Keys in Automation Scripts

**Vulnerability:** Multiple Python scripts (`download_video.py`, `list_models.py`, `list_models_veo.py`, `test_veo_raw.py`, `list_exact_names.py`) contained a hardcoded Google AI API key.
**Learning:** Development-time scripts often bypass security reviews and maintain hardcoded credentials for "convenience," which then get committed to the repository.
**Prevention:** Use a unified environment variable loader or a `.env` file that is excluded from version control. Ensure all scripts use this loader instead of literal string keys.
