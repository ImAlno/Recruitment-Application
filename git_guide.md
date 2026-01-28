# Git Team Workflow Guide

This guide explains how to work collaboratively with Git and GitHub using a **rebase-based workflow** to maintain a clean, linear history.

---

## Core Principles

- `main` is always stable and protected.
- No direct commits to `main`.
- Each feature or fix is developed in its own branch.
- All changes go through **pull requests (PRs)**.
- Rebase your feature branches onto `main` to keep history linear.
- Rebase only your own branches.

---

## Repository Setup

- Protect `main`:
  - Require PRs for merges.
  - Require code review approvals.
  - Disallow force pushes to `main`.
- Allow force pushes on feature branches only.

---

## Daily Workflow

### 1. Start a New Feature

Always create a branch from the latest `main`:

```bash
git checkout main
git fetch origin
git pull origin main
git checkout -b feature/short-description
```

### 2. Work Locally

Commit frequently with clear messages:

```bash
git add .
git commit -m "Implement feature X"
```

### 3. Publish the Branch

Push your feature branch to GitHub:

```bash
git push origin feature/short-description
```

### 4. Open a Pull Request

On GitHub:
- Base branch: `main`
- Compare branch: `feature/short-description`
- Provide a clear description
- Assign reviewers if needed

**Important:** Before opening the PR, fetch and rebase your branch on `main`:

```bash
git fetch origin
git checkout feature/short-description
git rebase origin/main
```
Resolve any conflicts, then push with:
```bash
git push --force-with-lease
```

---

## Updating a Feature Branch During Review

If `main` receives new commits while your PR is open:

```bash
git fetch origin
git checkout feature/short-description
git rebase origin/main
```
Resolve conflicts, then push:

```bash
git push --force-with-lease
```

The PR updates automatically.

---

## Code Review

- Reviewers comment and approve changes.
- Author can respond with new commits.
- Rebase again if `main` has changed.

---

## Merging the Pull Request

On GitHub:
- Use **Squash and merge** or **Rebase and merge**.
- Avoid merge commits to keep history linear.

---

## Cleanup After Merge

```bash
git checkout main
git pull origin main
git branch -d feature/short-description
git push origin --delete feature/short-description
```

---

## Rebase Rules

✅ Rebase:
- Your own feature branches
- Before opening or updating a PR
- To clean up commits (`git rebase -i`)

❌ Never rebase:
- `main` branch
- Shared branches
- Branches actively used by others

---

## Conflict Handling

- Conflicts are resolved locally during rebase:
  ```bash
  git add <files>
  git rebase --continue
  ```
- Abort rebase if needed:
  ```bash
  git rebase --abort
  ```

---

## Commit Hygiene

Before final push, use interactive rebase to clean up commits:

```bash
git rebase -i origin/main
```
- Squash fixups
- Edit commit messages
- Remove unnecessary commits

---

## Workflow Summary

```
main
  ↓
feature branch
  ↓ (commits)
rebase onto main
  ↓
pull request
  ↓
review
  ↓
squash/rebase merge
  ↓
main (clean, linear)
```

---

This workflow ensures a clean, professional, and collaborative GitHub workflow for small to mid-sized teams.

