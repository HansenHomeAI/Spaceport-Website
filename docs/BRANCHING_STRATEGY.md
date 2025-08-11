# Spaceport Website - Branching Strategy & Workflow

## 🌳 Branch Structure

Our repository uses a **dual-track development approach** to enable parallel work on ML pipeline and frontend features without conflicts.

### Branch Types

| Branch | Purpose | Triggers | Deploy Time |
|--------|---------|----------|-------------|
| `main` | Production ML pipeline, infrastructure | Container builds (17 min) | Long |
| `frontend-dev` | UI, authentication, frontend features | CDK no-op deploy (2-3 min) | Fast |

## 🔄 Daily Workflow

### Working on Frontend (UI, Auth, Styling)
```bash
# 1. Switch to frontend branch
git checkout frontend-dev

# 2. Make your changes to:
#    - index.html
#    - styles.css  
#    - script.js
#    - Any frontend-related files

# 3. Commit and push
git add .
git commit -m "feat: add login form validation"
git push
```

### Working on ML Pipeline (Containers, CDK)
```bash
# 1. Switch to main branch
git checkout main

# 2. Make your changes to:
#    - infrastructure/containers/**
#    - infrastructure/spaceport_cdk/**
#    - scripts/deployment/**

# 3. Commit and push (triggers 17-min container builds)
git add .
git commit -m "feat: optimize 3DGS training parameters"
git push
```

## 📅 Merge Protocol

### Daily Sync (Recommended)
Keep branches current to prevent conflicts:

```bash
# On frontend-dev branch, pull latest main changes
git checkout frontend-dev
git pull origin main
```

### Weekly Feature Merge
When frontend features are complete and tested:

```bash
# 1. Ensure frontend-dev is current
git checkout frontend-dev
git pull origin main

# 2. Switch to main and merge
git checkout main
git pull origin main
git merge frontend-dev

# 3. Push merged changes
git push
```

## 🎯 GitHub Actions Behavior

### Path-Based Triggers
Our CI/CD is smart and only runs what's needed:

**Container Build Workflow** (`build-containers.yml`):
- **Triggers ONLY on**:
  - `infrastructure/containers/**`
  - `scripts/deployment/deploy.sh`
  - `buildspec.yml`
- **Duration**: ~17 minutes
- **Cost**: High (GPU instances)

**CDK Deploy Workflow** (`cdk-deploy.yml`):
- **Triggers on**: ALL pushes to main/frontend-dev
- **Duration**: 2-3 minutes (no-op if no infrastructure changes)
- **Cost**: Minimal

### Branch Status Monitoring
On GitHub, you'll see both deployments:
```
🟡 main: "Build containers" - Running (12 min remaining)
🟢 frontend-dev: "CDK Deploy" - ✅ Completed
```

## 🛠️ Quick Commands Reference

### Branch Management
```bash
# Check current branch
git branch

# Switch branches
git checkout main
git checkout frontend-dev

# Create new feature branch
git checkout -b feature-name

# Delete branch (after merge)
git branch -d branch-name
```

### Staying Synced
```bash
# Update your current branch with latest remote changes
git pull

# See what changed
git status
git log --oneline -5

# Merge main into current branch
git pull origin main
```

## 🚨 Conflict Resolution

If you get merge conflicts:

1. **Don't panic** - conflicts are normal
2. **Open the conflicted files** and look for `<<<<<<< HEAD`
3. **Choose which changes to keep** (or combine them)
4. **Remove conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
5. **Test your changes**
6. **Commit the resolution**

## 📋 Best Practices

### Commit Messages
Use conventional commits for clarity:
```bash
feat: add user authentication system
fix: resolve mobile navigation bug  
docs: update deployment instructions
refactor: optimize container build process
```

### Before Pushing
Always check:
- [ ] Code works locally
- [ ] No console errors
- [ ] Files are properly formatted
- [ ] Commit message is descriptive

### Branch Hygiene
- **Merge frequently** (daily/every few commits)
- **Delete merged branches** to keep repo clean
- **Use descriptive branch names** (`feature/user-auth`, `fix/mobile-nav`)

## 🔄 Integration Points

### When ML Pipeline Changes Affect Frontend
If main branch changes impact frontend (new API endpoints, etc.):
```bash
# On frontend-dev branch
git pull origin main  # Get the latest changes
# Test and update frontend code accordingly
```

### When Frontend Changes Affect Infrastructure  
If frontend needs new AWS resources:
```bash
# Make infrastructure changes on main branch first
git checkout main
# Add necessary CDK resources
git commit -m "feat: add user authentication Lambda"
git push

# Then update frontend to use new resources
git checkout frontend-dev
git pull origin main
# Update frontend code
```

## 📞 Getting Help

**Check deployment status**: Visit [GitHub Actions](https://github.com/HansenHomeAI/Spaceport-Website/actions)

**Branch confused?** 
```bash
git status           # Where am I?
git branch          # What branches exist?
git log --oneline   # What happened recently?
```

**Need to reset?**
```bash
git stash           # Save current work
git checkout main   # Go to known good state
git pull            # Get latest
```

---

**Last Updated**: January 2025  
**Status**: Active Development Protocol  
**Next Review**: Monthly or when workflow changes 

<!-- No-op change to trigger CI/CD deployment for verification -->