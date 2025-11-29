# Required Environment Variables for Secure Payroll System

This document lists all environment variables required for the secure payroll application.

## Database (Supabase)

These are automatically provided by the Supabase integration:

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_URL` | PostgreSQL connection string (pooled) | Yes |
| `POSTGRES_PRISMA_URL` | Prisma-specific connection string | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct PostgreSQL connection | Yes |
| `POSTGRES_USER` | Database username | Yes |
| `POSTGRES_PASSWORD` | Database password | Yes |
| `POSTGRES_DATABASE` | Database name | Yes |
| `POSTGRES_HOST` | Database host | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin) | Yes |
| `SUPABASE_JWT_SECRET` | JWT secret for token verification | Yes |

## Security & Encryption

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `ENCRYPTION_KEY` | 32-character key for AES-256 encryption of audit logs and sensitive data | **Yes** | `your-32-character-encryption-key!` |

**How to generate:**
\`\`\`bash
# Generate a secure 32-character key
openssl rand -base64 32 | head -c 32
\`\`\`

## WebAuthn / Passkeys

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `WEBAUTHN_RP_ID` | Relying Party ID (your domain) | Yes | `yourdomain.com` or `localhost` |
| `WEBAUTHN_ORIGIN` | Origin URL for WebAuthn | Yes | `https://yourdomain.com` or `http://localhost:3000` |

**Production values:**
- `WEBAUTHN_RP_ID`: Your domain without protocol (e.g., `payroll.company.com`)
- `WEBAUTHN_ORIGIN`: Full URL with protocol (e.g., `https://payroll.company.com`)

**Development values:**
- `WEBAUTHN_RP_ID`: `localhost`
- `WEBAUTHN_ORIGIN`: `http://localhost:3000`

## CAPTCHA (hCaptcha)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `HCAPTCHA_SECRET_KEY` | hCaptcha secret key (server-side) | Yes | `0x...` |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | hCaptcha site key (client-side) | Yes | `...` |

**How to get:**
1. Go to https://www.hcaptcha.com/
2. Sign up for a free account
3. Create a new site
4. Copy the Site Key and Secret Key

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application URL for redirects | Auto-detected |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Supabase auth redirect URL for development | None |
| `SESSION_COOKIE_NAME` | Custom session cookie name | `session` |
| `JWT_EXPIRES_IN` | JWT token expiration | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | `7d` |
| `MAX_LOGIN_ATTEMPTS` | Account lockout threshold | `5` |
| `LOCKOUT_DURATION_MINUTES` | Initial lockout duration | `30` |

## GitHub Actions Secrets (for CI/CD)

If using the backup workflow, add these to your repository secrets:

| Secret | Description |
|--------|-------------|
| `POSTGRES_URL` | Same as above - for pg_dump |
| `ENCRYPTION_KEY` | Same as above - for encrypting backups |

## Setting Up Environment Variables

### Vercel Dashboard
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development

### Local Development
Create a `.env.local` file (never commit this):

\`\`\`env
# Supabase (from integration)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Security
ENCRYPTION_KEY=your-32-character-encryption-key!

# WebAuthn
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGIN=http://localhost:3000

# hCaptcha
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
\`\`\`

Note: The hCaptcha test keys above are for development only. They always pass verification.

## Security Checklist

- [ ] `ENCRYPTION_KEY` is unique and not shared across environments
- [ ] All secret keys are stored securely in Vercel/GitHub secrets
- [ ] Production `WEBAUTHN_ORIGIN` matches your actual domain
- [ ] hCaptcha keys are real (not test keys) in production
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets are committed to version control
