# 📋 PROJECT CONTRACT - [PROJECT NAME]

> **Source of Truth untuk semua development activity**

**Project Name:** [Project Name]  
**Version:** 1.0  
**Last Updated:** [YYYY-MM-DD]  
**Maintainer:** [Tech Lead Name]

---

## 🎯 PROJECT OVERVIEW

### Vision
[2-3 sentences describing the overall vision and what the project aims to achieve]

### Core Objectives
- [x] [Objective 1]
- [x] [Objective 2]
- [x] [Objective 3]
- [x] [Objective 4]
- [x] [Objective 5]

### Success Criteria
- [Metric 1: specific target, e.g., 99.9% API uptime]
- [Metric 2: specific target, e.g., < 500ms response time]
- [Metric 3: specific target, e.g., Zero critical security vulnerabilities]
- [Metric 4: specific target, e.g., 85%+ test coverage]
- [Metric 5: specific target, e.g., Mobile-responsive UI]

---

## 🏗️ ARCHITECTURE

### Tech Stack
```
Frontend:  [Framework + Version, e.g., React 18.2.0 + TypeScript 5.0]
Backend:   [Runtime + Framework + Version, e.g., Node.js 18 LTS + Express 4.18]
Database:  [Database + Version, e.g., PostgreSQL 14]
[Service]: [Service + Version, e.g., Redis 7 for caching]
[Service]: [Service + Version, e.g., SendGrid API v3 for email]
```

### Folder Structure
```
[project-root]/
├── src/
│   ├── components/
│   │   ├── [Component 1].tsx
│   │   ├── [Component 2].tsx
│   │   ├── [Component 3].tsx
│   │   └── [Component 4].tsx
│   ├── pages/
│   │   ├── [Page 1].tsx
│   │   ├── [Page 2].tsx
│   │   └── [Page 3].tsx
│   ├── services/
│   │   ├── [Service 1].ts
│   │   ├── [Service 2].ts
│   │   └── api.ts
│   ├── hooks/
│   │   ├── [Hook 1].ts
│   │   └── [Hook 2].ts
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
[ASCII diagram showing how components interact]

Example:
┌─────────────────────────────────────────────────────────────┐
│                    [FRONTEND LAYER]                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Component 1] | [Component 2] | [Component 3]       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ [Protocol/Token Type]
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  [BACKEND LAYER]                            │
│  ├── [Endpoint 1]: [Description]                           │
│  ├── [Endpoint 2]: [Description]                           │
│  ├── [Endpoint 3]: [Description]                           │
│  └── [Endpoint 4]: [Description]                           │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
    ┌──────────┐  ┌──────────┐   ┌──────────┐
    │Database  │  │Service 1 │   │Service 2 │
    │[Type]    │  │[Details] │   │[Details] │
    └──────────┘  └──────────┘   └──────────┘
```

---

## 🎬 FEATURE SPECIFICATIONS

### Feature 1: [Feature Name]
**Priority:** High/Medium/Low  
**Status:** Planned/In-Progress/Done  
**Owner:** Dev1/Dev2/Both

**Description:**
[2-3 sentences describing what this feature does and how users interact with it]

**Acceptance Criteria:**
- [ ] AC1: [Specific, measurable requirement]
- [ ] AC2: [Specific, measurable requirement]
- [ ] AC3: [Specific, measurable requirement]
- [ ] AC4: [Specific, measurable requirement]
- [ ] AC5: [Specific, measurable requirement]
- [ ] AC6: [Specific, measurable requirement]
- [ ] AC7: [Specific, measurable requirement]
- [ ] AC8: [Specific, measurable requirement]

**Technical Spec:**
```javascript
// API Endpoint (if applicable)
[METHOD] /[endpoint]

// Request
{
  field1: type (required/optional, constraints),
  field2: type (required/optional, constraints),
  field3: type (required/optional, constraints)
}

// Success Response ([HTTP Code])
{
  result: value,
  data: {
    field1: value,
    field2: value
  }
}

// Error Response ([HTTP Code])
{
  error: "Error message",
  code: "ERROR_CODE"
}
```

**Design Requirements:**
- UI: [Description of UI/UX approach]
- Mobile: [Mobile-specific requirements]
- Accessibility: [WCAG level and specific requirements]
- Performance: [Load time, render time targets]
- Responsive breakpoints: [Specific breakpoints: 320px, 768px, 1024px]

**Testing Requirements:**
- Unit: [Test cases and coverage targets]
- Integration: [What needs integration testing]
- E2E: [User flows to test end-to-end]
- Minimum coverage: [Percentage, e.g., 90%]

---

### Feature 2: [Feature Name]
**Priority:** High/Medium/Low  
**Status:** Planned/In-Progress/Done  
**Owner:** Dev1/Dev2/Both

**Description:**
[2-3 sentences describing the feature]

**Acceptance Criteria:**
- [ ] AC1: [Specific requirement]
- [ ] AC2: [Specific requirement]
- [ ] AC3: [Specific requirement]
- [ ] AC4: [Specific requirement]
- [ ] AC5: [Specific requirement]
- [ ] AC6: [Specific requirement]
- [ ] AC7: [Specific requirement]
- [ ] AC8: [Specific requirement]

**Technical Spec:**
```javascript
[API specifications]
```

**Design Requirements:**
- UI: [Description]
- Mobile: [Requirements]
- Accessibility: [WCAG compliance]
- Performance: [Targets]

**Testing Requirements:**
- Unit: [Test cases]
- Integration: [Integration tests]
- E2E: [End-to-end flows]
- Coverage: [Minimum %]

---

### Feature 3: [Feature Name]
**Priority:** High/Medium/Low  
**Status:** Planned/In-Progress/Done  
**Owner:** Dev1/Dev2/Both

**Description:**
[2-3 sentences describing the feature]

**Acceptance Criteria:**
- [ ] AC1: [Specific requirement]
- [ ] AC2: [Specific requirement]
- [ ] AC3: [Specific requirement]
- [ ] AC4: [Specific requirement]
- [ ] AC5: [Specific requirement]
- [ ] AC6: [Specific requirement]

**Technical Spec:**
```javascript
[API specifications]
```

**Design Requirements:**
- UI: [Description]
- Mobile: [Requirements]
- Accessibility: [WCAG compliance]

**Testing Requirements:**
- Unit: [Test cases]
- Integration: [Integration tests]
- E2E: [End-to-end flows]

---

## 🔐 CODE STANDARDS

### Naming Convention
```javascript
// Variables & Functions: camelCase
const userName = "value";
function validateInput(param) { }

// Classes & Components: PascalCase
class UserService { }
function UserCard() { }

// Constants: UPPER_SNAKE_CASE
const MAX_ATTEMPTS = 5;
const API_TIMEOUT_MS = 5000;
```

### File Organization
- Max [lines] per component file
- Max [lines] per utility file
- One component per file
- Related utilities grouped in modules

### Performance Standards
- Bundle size: < [size] KB (gzipped)
- Initial page load: < [time] seconds
- API response: < [time] ms
- Lighthouse score: > [score]
- CLS (Layout shift): < [value]

### Error Handling
```javascript
// All API calls MUST have try-catch
try {
  const response = await api.post('[endpoint]', data);
  return response.data;
} catch (error) {
  // Specific error messages
  if (error.response?.status === 401) {
    throw new Error("[Specific error message]");
  }
  throw new Error("[Generic error message]");
}
```

### Testing Standards
- Minimum coverage: [%]
- All public functions: [requirement]
- Critical user flows: [requirement]
- Mocking strategy: [Describe mocking approach]

### Code Style
```javascript
// ESLint config: [Style guide]
// Prettier: [Formatting rules]
// TypeScript: [Strictness level]
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
   - Evidence of testing (screenshots, logs, etc.)
   
2. Main only merges if:
   - ✅ Contract.md compliant
   - ✅ [Coverage %]+ code coverage
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
- [ ] [Test command] passes (all tests)
- [ ] Code coverage >= [%]
- [ ] [Linter command] (zero errors)
- [ ] No [Type checker] errors
- [ ] [Performance check tool] score >= [score]
- [ ] Contract.md compliance verified

### Performance Metrics (MUST MEET)
| Metric | Target | Current |
|--------|--------|---------|
| [Metric 1] | [target] | - |
| [Metric 2] | [target] | - |
| [Metric 3] | [target] | - |
| [Metric 4] | [target] | - |
| [Metric 5] | [target] | - |

---

## 🚨 CONSTRAINTS & DEPENDENCIES

### Hard Constraints
- [Constraint 1]: [Description]
- [Constraint 2]: [Description]
- [Constraint 3]: [Description]
- [Constraint 4]: [Description]

### External Dependencies
- [Service 1] [Version]: [What it provides]
- [Service 2] [Version]: [What it provides]
- [Service 3] [Version]: [What it provides]

### Browser Support
- [Browser 1] [Version]+
- [Browser 2] [Version]+
- [Browser 3] [Version]+
- Mobile browsers ([OS] [Version]+, [OS] [Version]+)

---

## 📅 TIMELINE & PHASES

### Phase 1: [Phase Name] [Date Range]
- Tasks: [Task 1, Task 2, Task 3]
- Owner: [Dev1/Dev2/Both]
- Deliverable: [What will be completed]

### Phase 2: [Phase Name] [Date Range]
- Tasks: [Task 1, Task 2, Task 3]
- Owner: [Dev1/Dev2/Both]
- Deliverable: [What will be completed]

### Phase 3: [Phase Name] [Date Range]
- Tasks: [Task 1, Task 2, Task 3]
- Owner: [Dev1/Dev2/Both]
- Deliverable: [What will be completed]

---

## 📝 SIGN-OFF

**Reviewed by:** [Name] ([Role]) - [YYYY-MM-DD]  
**Approved by:** [Name] ([Role]) - [YYYY-MM-DD]  

---

## 🔗 References
- [Reference 1]: [URL or description]
- [Reference 2]: [URL or description]
- [Reference 3]: [URL or description]
- [Reference 4]: [URL or description]

---

**⚠️ Any changes to this contract must be approved by [Tech Lead Name] before new code is written.**