# 📋 PROJECT CONTRACT - User Authentication System

> **Source of Truth untuk semua development activity**

**Project Name:** Secure Auth Platform  
**Version:** 1.0  
**Last Updated:** 2024-01-15  
**Maintainer:** Sarah Chen (Tech Lead)

---

## 🎯 PROJECT OVERVIEW

### Vision
Build a secure, user-friendly authentication system that handles user registration, login, and profile management with enterprise-grade security standards.

### Core Objectives
- [x] Implement JWT-based authentication
- [x] Build responsive login/signup forms
- [x] Create secure password reset flow
- [x] Implement role-based access control
- [x] Add email verification system

### Success Criteria
- 99.9% API uptime
- < 500ms response time for auth endpoints
- Zero critical security vulnerabilities
- 85%+ test coverage
- Mobile-responsive UI (iOS/Android compatible)

---

## 🏗️ ARCHITECTURE

### Tech Stack
```
Frontend:  React 18.2.0 + TypeScript 5.0
Backend:   Node.js 18 LTS + Express 4.18
Database:  PostgreSQL 14
Auth:      JWT tokens + refresh tokens
Email:     SendGrid API v3
```

### Folder Structure
```
secure-auth-platform/
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ResetPassword.tsx
│   │   └── ProfileSettings.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   └── api.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useForm.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   └── styles/
│       ├── global.css
│       └── themes.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── contract.md
└── .env.example
```

### System Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ LoginForm | SignupForm | ResetPassword | Settings    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ JWT Token
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS API                             │
│  ├── POST /auth/signup   (register user)                   │
│  ├── POST /auth/login    (authenticate)                    │
│  ├── POST /auth/refresh  (refresh token)                   │
│  ├── POST /auth/reset    (password reset)                  │
│  ├── GET  /user/profile  (get user data)                   │
│  ├── PUT  /user/profile  (update user)                     │
│  └── DELETE /auth/logout (logout)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    ┌────────┐    ┌──────────┐    ┌──────────┐
    │  PostgreSQL  │ SendGrid   │ JWT Keys  │
    │   (Users,    │ (Emails)   │ (Secure)  │
    │   Tokens)    │            │           │
    └────────┘    └──────────┘    └──────────┘
```

---

## 🎬 FEATURE SPECIFICATIONS

### Feature 1: User Registration (Signup)
**Priority:** High  
**Status:** In-Progress  
**Owner:** Both

**Description:**
Users should be able to create an account with email and password. System validates input, checks email uniqueness, creates user in database, sends verification email, and returns JWT token.

**Acceptance Criteria:**
- [ ] AC1: Form accepts email and password input
- [ ] AC2: Email format validated (RFC 5322)
- [ ] AC2: Password minimum 8 chars, includes upper + lower + number + special char
- [ ] AC4: Duplicate email prevented (409 Conflict response)
- [ ] AC5: Verification email sent within 2 seconds
- [ ] AC6: User can't access protected routes until email verified
- [ ] AC7: Invalid input returns clear error messages
- [ ] AC8: API responds in < 500ms

**Technical Spec:**
```javascript
// API Endpoint
POST /auth/signup

// Request
{
  email: string (required, valid email format)
  password: string (required, min 8 chars, complexity rules)
  firstName: string (required, 2-50 chars)
  lastName: string (required, 2-50 chars)
}

// Success Response (201)
{
  token: JWT (valid for 15 minutes),
  refreshToken: JWT (valid for 7 days),
  user: {
    id: uuid,
    email: string,
    firstName: string,
    lastName: string,
    verified: false
  }
}

// Error Response (400/409)
{
  error: "Email already exists" | "Invalid password" | etc
  code: "DUPLICATE_EMAIL" | "INVALID_PASSWORD" | etc
}
```

**Design Requirements:**
- UI: Clean, minimal signup form
- Mobile: Full-width, touch-optimized buttons
- Accessibility: WCAG 2.1 Level AA compliant
- Performance: Form should render < 100ms
- Responsive breakpoints: 320px, 768px, 1024px

**Testing Requirements:**
- Unit: Email validation (10+ test cases)
- Unit: Password validation (15+ test cases)
- Unit: User creation logic
- Integration: Email sending
- Integration: Database insertion
- E2E: Complete signup flow on mobile & desktop
- Minimum coverage: 90%

---

### Feature 2: User Login & Token Management
**Priority:** High  
**Status:** Planned  
**Owner:** Both

**Description:**
Users authenticate with email/password and receive JWT tokens. Tokens used for subsequent requests. Refresh token allows obtaining new access token without re-login.

**Acceptance Criteria:**
- [ ] AC1: Form accepts email and password
- [ ] AC2: Invalid credentials return 401 Unauthorized
- [ ] AC3: Successful login returns JWT access token (15 min expiry)
- [ ] AC4: Successful login returns refresh token (7 day expiry)
- [ ] AC5: Unverified emails can login but with limited access
- [ ] AC6: Tokens stored securely (HttpOnly cookies or secure storage)
- [ ] AC7: /refresh endpoint returns new access token using refresh token
- [ ] AC8: Logout clears tokens

**Technical Spec:**
```javascript
POST /auth/login
// Request
{
  email: string,
  password: string
}

// Success (200)
{
  token: "eyJhbGc..." (JWT, 15 min),
  refreshToken: "eyJhbGc..." (JWT, 7 days),
  user: { id, email, verified }
}

POST /auth/refresh
// Request (with refresh token in header)
Authorization: Bearer [refreshToken]

// Success (200)
{
  token: "eyJhbGc..." (new JWT, 15 min),
  refreshToken: "eyJhbGc..." (new refresh token, 7 days)
}

POST /auth/logout
// No request body needed
// Clear tokens on client
```

**Design Requirements:**
- Clean login form
- "Remember me" checkbox (optional)
- "Forgot password?" link
- Loading state during authentication
- Error messages for failed login

**Testing Requirements:**
- Unit: Password verification
- Unit: Token generation
- Integration: Complete login flow
- E2E: Login and access protected page
- Coverage: 85%+

---

### Feature 3: Password Reset Flow
**Priority:** Medium  
**Status:** Planned  
**Owner:** Dev2 focus

**Description:**
Users can request password reset. System sends reset link via email. Link is valid for 1 hour. User sets new password and gets new tokens.

**Acceptance Criteria:**
- [ ] AC1: Reset link sent within 2 seconds
- [ ] AC2: Reset link valid for exactly 1 hour
- [ ] AC3: Reset link one-time use only
- [ ] AC4: Password update invalidates all existing tokens
- [ ] AC5: Email confirmation sent after reset
- [ ] AC6: Invalid/expired links show clear message

**Technical Spec:**
```javascript
POST /auth/forgot-password
{ email: string }

POST /auth/reset-password
{
  token: string (from email link),
  newPassword: string
}
```

**Design Requirements:**
- Step 1: Enter email form
- Step 2: Confirmation message
- Step 3: Reset form (from email link)
- Success confirmation

**Testing Requirements:**
- Time-based token expiration
- One-time link usage
- Token invalidation cascade
- Email delivery verification

---

## 🔐 CODE STANDARDS

### Naming Convention
```javascript
// Variables & Functions: camelCase
const userEmail = "user@example.com";
function validateEmail(email) { }

// Classes & Components: PascalCase
class AuthService { }
function LoginForm() { }

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const JWT_EXPIRY_MINUTES = 15;
```

### File Organization
- Max 300 lines per component file
- Max 200 lines per utility file
- One component per file
- Related utilities grouped in modules

### Performance Standards
- Bundle size: < 150 KB (gzipped)
- Initial page load: < 2 seconds
- API response: < 500ms
- Lighthouse score: > 90
- CLS (Layout shift): < 0.1

### Error Handling
```javascript
// All API calls MUST have try-catch
try {
  const response = await api.post('/auth/login', data);
  return response.data;
} catch (error) {
  // Specific error messages
  if (error.response?.status === 401) {
    throw new Error("Invalid email or password");
  }
  throw new Error("Server error. Please try again.");
}
```

### Testing Standards
- Minimum coverage: 85%
- All public functions: unit tests required
- Critical user flows: E2E tests required
- Mocking strategy: Mock external APIs (SendGrid, DB)

### Code Style
```javascript
// ESLint config: Airbnb style guide
// Prettier: 2 spaces, 100 char line length
// TypeScript strict mode enabled
```

---

## 🔄 WORKFLOW RULES

### Git Flow
```
main (production)
  ├── branch-dev1 (feature A)
  └── branch-dev2 (feature B)
```

**Merge Rules:**
1. PR must include:
   - Link to agent.md
   - Test coverage %
   - 3+ test screenshots
   
2. Main only merges if:
   - ✅ Contract.md compliant
   - ✅ 85%+ code coverage
   - ✅ No overlapping higher-quality code
   - ✅ agent.md & mistake.md reviewed

### Conflict Resolution
If Dev1 and Dev2 both implement same feature:

**Decision Criteria (weighted):**
1. Contract compliance: 100%
2. Code efficiency: 80%
3. Test coverage: 20%
4. Bugs found: -10% per critical bug

Winner merges → Main  
Loser refactors → Incorporate best practices

---

## 📊 QUALITY GATES

### Before Merge Checklist
- [ ] agent.md completed with all sessions
- [ ] mistake.md reviewed, all bugs documented
- [ ] npm test passes (all tests)
- [ ] Code coverage >= 85%
- [ ] npm run lint (zero errors)
- [ ] No TypeScript errors (tsc --noEmit)
- [ ] Lighthouse score >= 90
- [ ] Contract.md compliance verified

### Performance Metrics (MUST MEET)
| Metric | Target | Current |
|--------|--------|---------|
| Login API Response | < 500ms | - |
| Signup API Response | < 700ms | - |
| Page Load Time | < 2s | - |
| Bundle Size | < 150KB | - |
| Test Coverage | >= 85% | - |

---

## 🚨 CONSTRAINTS & DEPENDENCIES

### Hard Constraints
- Must be PCI DSS compliant (passwords never logged)
- Must support GDPR (user data deletion)
- Must have 2FA ready (for future phase)
- Passwords must be bcrypt hashed

### External Dependencies
- SendGrid API v3 (email delivery)
- PostgreSQL 14+ (database)
- AWS S3 (future: profile pics)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 10+)

---

## 📅 TIMELINE & PHASES

### Phase 1: Signup & Login [Jan 15-21]
- Dev1 & Dev2 both implement signup/login
- Evaluate and merge best implementations
- Deliverable: Working auth endpoints + UI

### Phase 2: Password Reset [Jan 22-28]
- Implement forgot password flow
- Email integration testing
- Deliverable: Complete password reset

### Phase 3: Security & Polish [Jan 29 - Feb 4]
- Security audit
- Performance optimization
- Mobile polish
- Deliverable: Production-ready system

---

## 📝 SIGN-OFF

**Reviewed by:** Mike Johnson (Security Lead) - 2024-01-15  
**Approved by:** Sarah Chen (Tech Lead) - 2024-01-15  

---

## 🔗 References
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [SendGrid API Docs](https://docs.sendgrid.com)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html)

---

**⚠️ Any changes to this contract must be approved by Sarah Chen before new code is written.**