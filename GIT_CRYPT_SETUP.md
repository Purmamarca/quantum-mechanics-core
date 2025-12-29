# Git-Crypt Installation & Setup Guide for Windows

## Current Status
- ✅ `.gitattributes` configured for encryption
- ⚠️ git-crypt not yet installed on Windows
- ℹ️ No sensitive data currently in repository

## Option 1: Install git-crypt on Windows (Recommended)

### Method A: Using Chocolatey (Easiest)
```powershell
# Install Chocolatey if not already installed
# Then run:
choco install git-crypt
```

### Method B: Using Scoop
```powershell
# Install Scoop if not already installed
# Then run:
scoop install git-crypt
```

### Method C: Manual Installation
1. Download git-crypt for Windows from: https://github.com/AGWA/git-crypt/releases
2. Extract the executable to a folder in your PATH (e.g., `C:\Program Files\Git\usr\bin\`)
3. Verify installation: `git-crypt --version`

## Option 2: Use Git's Built-in Encryption (Alternative)

If you can't install git-crypt, you can use Git's built-in filter system with GPG:

### Setup GPG Encryption
```bash
# Install GPG for Windows from: https://gnupg.org/download/

# Generate a GPG key
gpg --gen-key

# Configure Git to use GPG
git config --global gpg.program "C:/Program Files (x86)/GnuPG/bin/gpg.exe"

# Add to .gitattributes:
# *.env filter=gpg diff=gpg
# *.key filter=gpg diff=gpg

# Configure the filter
git config --global filter.gpg.smudge "gpg --decrypt"
git config --global filter.gpg.clean "gpg --encrypt --recipient YOUR_EMAIL"
```

## Option 3: Environment Variables (Current Best Practice)

For now, since we don't have sensitive data, use environment variables:

### Create .env file (NOT committed to git)
```bash
# .env (already in .gitignore)
API_KEY=your_api_key_here
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### Update .gitignore
```
# Environment variables
.env
.env.local
.env.*.local

# Secrets
secrets/
*.key
*.pem
```

## Current Repository Status

### Files Ready for Encryption (when git-crypt is installed)
According to `.gitattributes`, these patterns will be encrypted:
- `*.env` - Environment files
- `.env.*` - Environment variants
- `config/secrets.*` - Secret configurations
- `**/secrets/**` - Secrets directories
- `**/credentials/**` - Credentials directories
- `*.key` - Private keys
- `*.pem` - Certificate files
- `*.p12` - Certificate files
- `*.sql` - Database dumps
- `*.dump` - Database dumps
- `PRIVATE.md` - Private documentation

### Files That Stay Unencrypted
- `*.md` - Markdown files (except PRIVATE.md)
- `*.html` - HTML files
- `*.css` - CSS files
- `*.js` - JavaScript files
- `*.json` - JSON files
- `README.md` - Project documentation
- `LICENSE` - License file

## Quick Start (Once git-crypt is installed)

### 1. Initialize git-crypt
```bash
cd c:\Users\roanc\gauss-clean-energy\Gauss-Clean-Energy-1
git-crypt init
```

### 2. Export the key (for backup/sharing)
```bash
git-crypt export-key ../gauss-clean-energy.key
```

**⚠️ IMPORTANT**: Store this key file securely! Anyone with this key can decrypt your files.

### 3. Add a test encrypted file
```bash
# Create a test secret file
echo "API_KEY=test_secret_key_12345" > .env

# Add and commit
git add .env
git commit -m "Add encrypted environment file"

# Verify it's encrypted
git-crypt status
```

### 4. Push to GitHub
```bash
git push origin fix-nested-label
```

The `.env` file will be encrypted in the repository but decrypted in your local working directory.

## Verifying Encryption

### Check encryption status
```bash
git-crypt status
```

### View encrypted file on GitHub
The file will appear as binary/encrypted on GitHub but readable locally.

### Unlock repository on another machine
```bash
git clone https://github.com/roanco/Gauss-Clean-Energy.git
cd Gauss-Clean-Energy
git-crypt unlock /path/to/gauss-clean-energy.key
```

## Security Best Practices

1. **Never commit the key file** to the repository
2. **Store the key securely** (password manager, encrypted drive)
3. **Share keys securely** (encrypted email, secure file transfer)
4. **Rotate keys** if compromised
5. **Use GPG keys** for team collaboration (more secure than symmetric keys)

## Current Recommendation

Since git-crypt is not installed and we have no sensitive data:

1. ✅ Keep using `.gitignore` for local secrets
2. ✅ Use environment variables for configuration
3. ✅ `.gitattributes` is ready for when you install git-crypt
4. 📋 Install git-crypt when you need to commit sensitive data

## Installation Priority

**Low Priority**: No sensitive data currently in the repository.

**Install When**: You need to commit:
- API keys
- Database credentials
- Private certificates
- Sensitive configuration

## Next Steps

1. Choose an installation method above
2. Install git-crypt (when needed)
3. Run `git-crypt init`
4. Test with a sample encrypted file
5. Export and securely store the key

## Support

- git-crypt documentation: https://github.com/AGWA/git-crypt
- GPG for Windows: https://gnupg.org/download/
- Chocolatey: https://chocolatey.org/
- Scoop: https://scoop.sh/

---

**Status**: Infrastructure ready, installation pending  
**Priority**: Low (no sensitive data to encrypt yet)  
**Action Required**: Install git-crypt when needed
