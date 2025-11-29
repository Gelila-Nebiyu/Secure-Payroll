# Security Checklist for Secure Payroll System

Use this checklist before deploying to production.

## Authentication & Authorization

- [ ] **Password Hashing**: Argon2id is configured with secure parameters
- [ ] **Password Policy**: Minimum 12 characters, complexity requirements enforced
- [ ] **Account Lockout**: Implemented after 5 failed attempts
- [ ] **Session Management**: httpOnly, Secure, SameSite cookies configured
- [ ] **TOTP MFA**: Secrets encrypted at rest, QR codes generated securely
- [ ] **WebAuthn**: Proper origin and RP ID configured for production domain
- [ ] **CAPTCHA**: hCaptcha enabled on registration to prevent bots

## Access Control

- [ ] **MAC (Mandatory)**: Security labels on data and users enforced
- [ ] **DAC (Discretionary)**: Resource owners can grant/revoke permissions
- [ ] **RBAC (Role-Based)**: Roles assigned with least privilege principle
- [ ] **RuBAC (Rule-Based)**: Time/location/device rules configured
- [ ] **ABAC (Attribute-Based)**: Fine-grained policies using attributes
- [ ] **Policy Engine**: All API routes protected by PEP middleware

## Data Protection

- [ ] **TLS/HTTPS**: Enforced in production (Vercel provides this)
- [ ] **Encryption at Rest**: Audit logs and sensitive data encrypted
- [ ] **Encryption Key**: Unique 32-character key for each environment
- [ ] **Database**: Row Level Security (RLS) enabled where applicable
- [ ] **Sensitive Data**: TOTP secrets, passwords never logged

## Audit & Logging

- [ ] **User Activity**: All user actions logged with timestamp, IP, action
- [ ] **System Events**: Startup, config changes, security events logged
- [ ] **Log Encryption**: Audit log metadata encrypted with AES-256-GCM
- [ ] **Centralized Logging**: Logs aggregated for monitoring
- [ ] **Alerting**: Critical events trigger security alerts

## Backup & Recovery

- [ ] **Regular Backups**: Daily automated backups configured
- [ ] **Backup Encryption**: Backups encrypted before storage
- [ ] **Backup Testing**: Restoration tested periodically
- [ ] **Retention Policy**: Backup retention period defined

## Infrastructure

- [ ] **Environment Variables**: All secrets in Vercel environment, not in code
- [ ] **Rate Limiting**: API endpoints protected against abuse
- [ ] **Input Validation**: All inputs validated and sanitized
- [ ] **SQL Injection**: Parameterized queries used (via Supabase client)
- [ ] **CORS**: Properly configured for production domain

## Code Security

- [ ] **Dependencies**: No known vulnerabilities (run `npm audit`)
- [ ] **Secrets**: No hardcoded credentials in codebase
- [ ] **Error Handling**: Errors don't leak sensitive information
- [ ] **Debug Logs**: No sensitive data in console logs

## Compliance

- [ ] **Audit Trail**: Complete trail of all data access and modifications
- [ ] **Data Classification**: Data properly labeled (Public/Internal/Confidential)
- [ ] **Access Reviews**: Process for periodic access reviews defined
- [ ] **Incident Response**: Security incident procedure documented

## Before Production Deployment

1. Run all SQL scripts in order (001-012)
2. Verify all environment variables are set
3. Test authentication flow (register, login, MFA)
4. Test access control (try accessing resources without permission)
5. Verify audit logs are being written and encrypted
6. Test account lockout functionality
7. Verify CAPTCHA is working
8. Check health endpoint returns healthy status
