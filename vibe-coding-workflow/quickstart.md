# 🚀 QUICK START GUIDE - 15 Minutes to Production-Ready Setup

## Step 1: Clone/Download Files (2 min)

```bash
# Create project directory
mkdir my-vibe-project && cd my-vibe-project
git init

# Copy all template files to your project:
# - contract.md
# - agent.md
# - mistake.md
# - merge-evaluation.md
# - merge_analyzer.py
# - .gitignore (create yourself)
```

## Step 2: Customize contract.md (5 min)

```bash
nano contract.md
```

**Minimal changes needed:**
1. Line 3: Replace `[Your Project Name]`
2. Line 22-28: Fill in your tech stack
3. Line 39-50: Define your 2-3 main features
4. Line 82-95: Your code standards
5. Line 155-170: Add 2-3 main features

**Keep everything else as template.**

```bash
git add contract.md
git commit -m "init: project contract"
```

## Step 3: Initialize AI / Skeleton (3 min)

Ask your AI assistant to generate:

```
Generate boilerplate for a [YOUR_TECH_STACK] project with:
- Folder structure matching this contract
- Basic component templates
- Test setup
- Package.json with dependencies

Contract: [paste contract.md content]
```

**Or manually create:**

```bash
mkdir -p src/{components,pages,services,utils,styles}
mkdir tests
touch package.json
```

## Step 4: Setup Developer Branches (3 min)

```bash
# Dev1 setup
git checkout -b branch-dev1
cp agent.md agent-dev1.md
cp mistake.md mistake-dev1.md
git add . && git commit -m "dev1: initial setup"

# Dev2 setup
git checkout main
git checkout -b branch-dev2
cp agent.md agent-dev2.md
cp mistake.md mistake-dev2.md
git add . && git commit -m "dev2: initial setup"
```

## Step 5: Add .gitignore (2 min)

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.DS_Store
coverage/
*.log
build/
.idea/
.vscode/local
temp/
*.swp
EOF

git add .gitignore
git commit -m "config: gitignore"
```

---

## ✅ You're Ready!

### Now Each Dev:

```bash
# Dev1: Start work on branch-dev1
git checkout branch-dev1

# Dev2: Start work on branch-dev2  
git checkout branch-dev2
```

### Daily Workflow (Repeat):

```bash
# After coding session:
1. Update agent-dev[1/2].md (session notes)
2. Update mistake-dev[1/2].md (if bugs found)
3. Run tests
4. git add . && git commit -m "[feature]: description"
5. git push origin branch-dev[X]
```

### Weekly Merge (Friday):

```bash
# Main branch evaluates both
python merge_analyzer.py --dev1 branch-dev1 --dev2 branch-dev2

# Review output
# Make merge decision
# Merge winner → main
```

---

## 🧪 Quick Test

**To verify setup works:**

```bash
# Check Python script
python merge_analyzer.py --help

# Should see:
# usage: merge_analyzer.py [-h] [--dev1 DEV1] [--dev2 DEV2] ...

# If error: install Python 3.8+
```

---

## 📋 What Each File Does

| File | Who Uses | When |
|------|----------|------|
| `contract.md` | Both devs | Review daily |
| `agent-dev1.md` | Dev1 | Update each session |
| `agent-dev2.md` | Dev2 | Update each session |
| `mistake-dev1.md` | Dev1 | Add bugs as found |
| `mistake-dev2.md` | Dev2 | Add bugs as found |
| `merge_analyzer.py` | Main branch | Merge time (weekly) |
| `merge-evaluation.md` | Main branch | Document merge decision |

---

## 🎯 First Week Checklist

- [ ] contract.md filled out (100% complete)
- [ ] Both devs have branches
- [ ] Both devs know how to update agent.md
- [ ] Testing framework set up
- [ ] First feature in progress
- [ ] agent.md updated 2+ times
- [ ] At least 1 bug logged and fixed
- [ ] First merge happened

---

## 🆘 Troubleshooting

### "Python script won't run"
```bash
# Check Python version
python --version  # Should be 3.8+

# If not installed:
# macOS: brew install python3
# Ubuntu: sudo apt install python3
# Windows: Download from python.org
```

### "Can't find agent.md"
```bash
# Make sure you copied it to correct location
ls -la agent-dev1.md

# Should show both files
ls -la agent-*.md
```

### "Merge conflict in git"
```bash
# Don't worry - this is normal
# Contact the other dev and resolve together

git merge --abort  # If unsure
```

### "Not sure what to write in agent.md"
- Check README.md for examples
- Refer to template sections
- Be honest about progress
- Document why, not just what

---

## 📞 Quick Help Commands

```bash
# See all branches
git branch -a

# Switch branch
git checkout branch-name

# See current branch
git branch

# View recent commits
git log --oneline -5

# Check file changes
git diff agent-dev1.md

# View file contents
cat agent-dev1.md
less mistake-dev1.md  # Press q to exit
```

---

## 🎬 Example: Your First Session

**Dev1 - Day 1:**

```bash
git checkout branch-dev1

# Code first feature...

# Update agent-dev1.md:
### SESSION 1: 2024-01-15 14:00

**Objective:** Build login form

**Tasks Completed:**
- [x] Create LoginForm component
- [x] Add form validation
- [x] Write unit tests

**Test Results:**
✅ 12/12 tests passing
Coverage: 78%

**Vibe Check:** 🔥 Great start!

# Save and commit
git add src/ agent-dev1.md tests/
git commit -m "feat: login form with validation"
git push origin branch-dev1
```

**Dev2 - Day 1:** (Same pattern on branch-dev2)

---

## 🎓 After First Merge

**Team meeting (Friday):**

```
Main branch runs:
python merge_analyzer.py --dev1 branch-dev1 --dev2 branch-dev2

Output shows:
branch-dev2: 85% score (better)
branch-dev1: 76% score

Decision: Merge branch-dev2 → main

Learning:
Dev2 had better test coverage (86% vs 78%)
Dev1: Great work! Next time aim for 85%+ coverage
```

---

## 🚀 From Here...

1. **Repeat weekly** - Cycle of code → evaluate → learn
2. **Track metrics** - Each cycle gets cleaner
3. **Build knowledge** - Team gets better at decisions
4. **Ship fast** - Only best code hits production

---

**Total Setup Time: ~15 minutes** ⏱️

**Value: Weeks of better coding practices** 📈

Good luck! 🎉