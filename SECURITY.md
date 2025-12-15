# Security Policy

## Overview

This document outlines the security measures implemented in the Gauss Clean Energy project, including encryption, data protection, and best practices.

## Encryption with git-crypt

### What is git-crypt?

git-crypt enables transparent encryption and decryption of files in a git repository. Files that you choose to protect are encrypted when committed, and decrypted when checked out.

### Setup Instructions

#### Initial Setup (Repository Owner)

1. **Initialize git-crypt** (if not already done):
   ```bash
   git-crypt init
   ```

2. **Add collaborators** (using GPG keys):
   ```bash
   git-crypt add-gpg-user USER_ID
   ```
   
   Or export a symmetric key for sharing:
   ```bash
   git-crypt export-key /path/to/keyfile
   ```

3. **Commit the .gitattributes file**:
   ```bash
   git add .gitattributes
   git commit -m "Add git-crypt configuration"
   ```

#### Collaborator Setup

If you're a collaborator receiving access:

1. **Receive the key file** from the repository owner (via secure channel)

2. **Unlock the repository**:
   ```bash
   git-crypt unlock /path/to/keyfile
   ```

3. **Verify encryption status**:
   ```bash
   git-crypt status
   ```

### What Gets Encrypted

According to `.gitattributes`, the following files are automatically encrypted:

- **Environment files**: `*.env`, `.env.*`
- **Secret configurations**: `config/secrets.*`
- **Credentials**: Files in `**/secrets/**` and `**/credentials/**`
- **Private keys**: `*.key`, `*.pem`, `*.p12`
- **Database dumps**: `*.sql`, `*.dump`
- **Private documentation**: `PRIVATE.md`, `**/private/**`

### What Stays Unencrypted

Public code files remain unencrypted:
- Source code: `*.js`, `*.html`, `*.css`
- Documentation: `*.md` (except PRIVATE.md)
- Configuration: `*.json`, `.gitignore`
- License and README files

## Current Project Security Status

### Public Repository
This is a **public repository** containing a solar calculator web application. Currently:
- ✅ No sensitive data is stored in the repository
- ✅ No API keys or credentials are committed
- ✅ No user data is collected or stored
- ✅ All calculations are performed client-side

### git-crypt Configuration
- ✅ `.gitattributes` configured for future use
- ⚠️ git-crypt not yet initialized (no sensitive files to encrypt)
- ℹ️ Ready for encryption when needed

## Best Practices

### For Developers

1. **Never commit sensitive data**:
   - API keys
   - Database credentials
   - Private keys
   - User data
   - Authentication tokens

2. **Use environment variables**:
   ```javascript
   // Good
   const apiKey = process.env.API_KEY;
   
   // Bad
   const apiKey = "sk_live_abc123...";
   ```

3. **Check before committing**:
   ```bash
   git diff --cached
   git-crypt status
   ```

4. **Use .gitignore** for local files:
   ```
   .env
   .env.local
   node_modules/
   *.log
   ```

### For Repository Owners

1. **Initialize git-crypt** before adding sensitive files
2. **Audit commits** regularly for accidentally committed secrets
3. **Rotate keys** if compromised
4. **Document** what should be encrypted
5. **Use GPG keys** for team collaboration when possible

## Incident Response

### If Sensitive Data is Committed

1. **Immediately rotate** all exposed credentials
2. **Remove from history** using:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch PATH/TO/FILE" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** to remote (coordinate with team)
4. **Notify** affected parties
5. **Review** security practices

### If Encryption Key is Compromised

1. **Generate new key**:
   ```bash
   git-crypt init
   ```
2. **Re-encrypt** all sensitive files
3. **Distribute new key** to authorized users only
4. **Audit** repository access logs

## Client-Side Security

### Current Implementation

The calculator runs entirely in the browser:
- ✅ No server-side processing
- ✅ No data transmission
- ✅ No cookies or local storage
- ✅ No external API calls

### Privacy

- **No tracking** of user inputs
- **No data collection** beyond anonymous analytics (if enabled)
- **No personal information** required or stored
- **All calculations** performed locally

## Dependencies Security

### Monitoring

Regularly check for vulnerabilities:
```bash
npm audit
```

### Current Status
- ✅ No npm dependencies (vanilla JavaScript)
- ✅ No third-party libraries
- ✅ Only Google Fonts CDN (trusted source)

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. **Email** the maintainer directly (see GitHub profile)
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Checklist

- [x] .gitattributes configured for git-crypt
- [x] .gitignore includes sensitive file patterns
- [x] No hardcoded credentials in code
- [x] Client-side only (no server vulnerabilities)
- [x] No external dependencies
- [x] Security policy documented
- [ ] git-crypt initialized (when needed)
- [ ] Regular security audits scheduled

## Additional Resources

- [git-crypt Documentation](https://github.com/AGWA/git-crypt)
- [OWASP Security Guidelines](https://owasp.org/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## Version History

### v1.0 (Current)
- Initial security documentation
- git-crypt configuration
- Security best practices established
