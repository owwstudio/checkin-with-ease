# 🐛 MISTAKE LOG - Bugs, Errors & Lessons

**Developer:** [Dev Name]  
**Branch:** [branch-devX]  
**Period:** [Start Date] to [End Date]  
**Total Issues:** [#] (Resolved: [#] | Pending: [#])

---

## 🔴 CRITICAL BUGS

### Bug 1: [Bug Title]
**Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Status:** ✅ Fixed / 🔄 In Progress / 🚫 Pending / 📚 Documentation Only  
**Date Found:** [YYYY-MM-DD]  
**Date Fixed:** [YYYY-MM-DD]

**Description:**
```
What happened:
[Describe the bug behavior]

Where it occurred:
- File: [path]
- Function: [function name]
- Line: [line #]

Impact:
- Users affected: [describe]
- Severity: [why critical/high/etc]
- Data loss/corruption: [yes/no]
```

**Root Cause Analysis:**
```
What I thought would happen:
[Explanation]

What actually happened:
[Explanation]

Why it happened:
- Primary cause: [explanation]
- Contributing factors:
  1. [Factor 1]
  2. [Factor 2]
  3. [Factor 3]

Understanding level: 💯 Full / 😊 Partial / 🤷 Still unclear
```

**The Fix:**
```javascript
// Before:
[problematic code snippet]

// After:
[fixed code snippet]

// Explanation:
[Why this fixes the issue]

// Testing:
- Test added: [test name]
- Regression prevention: [how tests prevent recurrence]
```

**Prevention Strategy:**
```
To prevent this in future:
1. [Lesson learned #1]
2. [Lesson learned #2]
3. [Change to development process]

Code review checklist item to add:
- [ ] [New checklist item]
```

**Time Impact:**
- Time to discover: [duration]
- Time to fix: [duration]
- Total impact: [hours lost/delayed]

**Linked Code Review:**
- PR: [link]
- Commit: [hash]
- Agent.md note: [line reference]

---

### Bug 2: [Bug Title]
[Follow same template for each critical bug]

---

## 🟠 HIGH PRIORITY ISSUES

### Issue 1: [Issue Title]
**Severity:** 🟠 High  
**Status:** ✅ Fixed / 🔄 In Progress / 🚫 Pending  
**Date Found:** [YYYY-MM-DD]

**Description:**
[Brief description of what went wrong]

**Root Cause:**
[Why it happened]

**Resolution:**
[How it was fixed]

**Prevention:**
[What to do differently next time]

---

### Issue 2: [Issue Title]
[Continue pattern]

---

## 🟡 MEDIUM PRIORITY ISSUES

### Issue 1: [Issue Title]
**Status:** ✅ Fixed / 🔄 In Progress / 🚫 Pending  
**Impact:** [what breaks when this happens]  
**Resolution:** [brief fix summary]

---

## 🟢 LOW PRIORITY ISSUES & TECH DEBT

### Issue 1: Code Smell - [Description]
**Type:** ⚠️ Tech Debt / 🎨 Style / 📦 Refactor Candidate

**What:** [Code that's not quite right but works]

**Why it's there:** [Time pressure / complexity / design constraint]

**Should refactor when:** [conditions for future refactor]

**How to refactor:** [brief plan]

---

## 📊 ERROR PATTERNS

### Most Common Mistake Type
```
Pattern: [Type of error I keep making]
Occurrences: [#]
Example bugs: [list of bug#s with this pattern]

Why I keep making it:
- [Root cause #1]
- [Root cause #2]

Prevention strategy:
1. [Step 1]
2. [Step 2]
```

### Logic Errors
```
Count: [#]
Examples:
- Bug #: [off-by-one error]
- Bug #: [wrong condition]
- Bug #: [async/await issue]

Pattern: [What's the pattern]
Prevention: [What to do differently]
```

### Integration Issues
```
Count: [#]
Examples:
- Bug #: [API mismatch]
- Bug #: [state management issue]
- Bug #: [communication between modules]

Pattern: [What's common]
Prevention: [Integration testing strategy]
```

### Environmental/Configuration Bugs
```
Count: [#]
Examples:
- Bug #: [env variable issue]
- Bug #: [version mismatch]

Pattern: [What causes these]
Prevention: [Documentation/setup improvements]
```

---

## 🧪 MISSED TEST CASES

### Gap 1: [Test Case Category]
**Coverage:** [what's NOT covered]  
**Impact:** [what could break without this test]  
**Test to add:** [specific test case needed]  
**Why it was missed:** [explanation]

**Example scenario:**
```javascript
// This edge case wasn't tested:
describe('Feature X', () => {
  // ❌ Missing test
  it('should handle [edge case]', () => {
    // test code
  });
});
```

---

## 🔄 DEBUGGING SESSIONS

### Session 1: [Date] - [Duration]
**Problem:** [What I was trying to debug]

**Tools Used:**
- [Tool 1 - how it helped]
- [Tool 2 - how it helped]

**Trial & Error:**
1. Hypothesis 1: [tried this, result]
2. Hypothesis 2: [tried this, result]
3. Hypothesis 3: [tried this, SUCCESS]

**Key Learnings:**
- [Something I learned about debugging]
- [Something I learned about the system]

**How I'll debug faster next time:**
- [Strategy improvement]

---

## 💾 REFACTORING NOTES

### Code That Needs Refactoring

#### Item 1: [Code/Component Name]
**Current Issues:**
- Issue 1: [description]
- Issue 2: [description]

**Why it's like this:**
[Time pressure / complexity / design evolution]

**Suggested Refactor:**
[New approach]

**Effort Estimate:** [hours]

**Priority:** [when to do it]

---

## 📚 EXTERNAL ERRORS & DEPENDENCIES

### Third-Party Library Issues
```
Library: [name/version]
Issue: [what went wrong]
Resolution: [how I worked around it]
Status: ✅ Workaround / 🔄 Waiting for patch / 🚫 Known limitation

Reference:
- GitHub issue: [link]
- Stack overflow: [link]
- Documentation: [link]
```

### API Issues
```
Endpoint: [URL]
Issue: [what went wrong]
Resolution: [how handled]
Team notified: ✅ Yes / ❌ No
```

---

## 👥 TEAM IMPACT

### Bugs That Might Affect Dev2
```
Bug/Issue: [name]
Impact: [how it affects them]
File conflict: [yes/no]
Notification sent: ✅ Yes / ❌ No
Date: [when notified]
```

### Knowledge Sharing
```
Important lesson to share:
- Topic: [what I learned]
- How Dev2 benefits: [explanation]
- Document location: [where documented]
```

---

## 📈 METRICS & TRENDS

### Bug Statistics
| Metric | Week 1 | Week 2 | Week 3 | Trend |
|--------|--------|--------|--------|-------|
| Critical | [#] | [#] | [#] | 📈 / 📉 |
| High | [#] | [#] | [#] | 📈 / 📉 |
| Medium | [#] | [#] | [#] | 📈 / 📉 |
| Low | [#] | [#] | [#] | 📈 / 📉 |
| **Total** | [#] | [#] | [#] | 📈 / 📉 |

### Quality Metrics Over Time
```
Week 1: [#] bugs per [lines of code/hours worked]
Week 2: [#] bugs per [lines of code/hours worked]
Week 3: [#] bugs per [lines of code/hours worked]

Trend: 📉 Improving / ➡️ Stable / 📈 Increasing
```

---

## 🎓 LESSONS LEARNED

### Top 5 Mistakes & Prevention
```
1. Mistake: [Type of error]
   Cause: [Why it happens]
   Prevention: [What to do differently]
   Success metric: [How to know it's prevented]

2. Mistake: [Another common error]
   Cause: [Why]
   Prevention: [What to do]
   Success metric: [How to verify]

3. Mistake: [Type of error]
   Cause: [Why]
   Prevention: [What to do]
   Success metric: [How to verify]

4. Mistake: [Type of error]
   Cause: [Why]
   Prevention: [What to do]
   Success metric: [How to verify]

5. Mistake: [Type of error]
   Cause: [Why]
   Prevention: [What to do]
   Success metric: [How to verify]
```

### Process Improvements
```
Based on mistakes, I should improve:
1. [Development process change]
2. [Testing approach change]
3. [Communication strategy]
4. [Code review focus]
```

---

## 🔗 REFERENCES & DOCUMENTATION

**Related Files:**
- agent.md: [link to relevant sections]
- contract.md: [link to relevant standards]
- Test files: [links to test suites]

**External Resources:**
- Stack Overflow: [links to helpful discussions]
- Blog posts: [links to learning resources]
- GitHub issues: [links to library issues]

---

## ✅ REVIEW CHECKLIST

- [ ] All bugs documented with severity
- [ ] Root causes analyzed
- [ ] Fixes tested and verified
- [ ] Prevention strategies documented
- [ ] Team notified of critical issues
- [ ] Linked to relevant code
- [ ] Lessons captured for team learning

---

## 📝 SIGN-OFF

**Last Updated:** [Date]  
**Review Date:** [Date]  
**Reviewer:** [Name]  
**Approved:** ✅ Yes / ❌ Needs Review

**Notes from Reviewer:**
[Any additional feedback]

---

**💡 Remember:**
- Mistakes are learning opportunities
- Being honest about bugs helps the team
- Document the WHY, not just the WHAT
- Each bug fixed is knowledge gained
- Prevention is better than cure