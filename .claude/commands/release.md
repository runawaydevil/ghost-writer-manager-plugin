# Release Command

Run this command when ready to ship a new release. It covers lint, commit, version bump, build, and tagging.

## Steps

1. **Run lint** — fix any ESLint errors before releasing:
   ```
   npm run lint
   ```
   If there are errors, fix them and commit before continuing.

2. **Ensure working tree is clean** — all changes must be committed:
   ```
   git status
   ```

3. **Bump version** — choose the appropriate bump level:
   ```
   npm version patch   # bug fixes (0.2.5 → 0.2.6)
   npm version minor   # new features (0.2.x → 0.3.0)
   npm version major   # breaking changes (0.x.x → 1.0.0)
   ```
   This automatically:
   - Updates `manifest.json` and `versions.json`
   - Creates a git commit with the version bump
   - Creates a git tag with `v` prefix (e.g., `v0.2.6`) — **we will fix this below**

4. **Fix the tag** — Obsidian uses tags WITHOUT the `v` prefix. Delete the auto-created tag and recreate it:
   ```
   # Get the version number (e.g., 0.2.6)
   VERSION=$(node -p "require('./manifest.json').version")

   # Delete the v-prefixed tag locally and remotely
   git tag -d "v${VERSION}"
   git push origin ":refs/tags/v${VERSION}"

   # Create the correct tag without v prefix
   git tag "${VERSION}"
   ```

5. **Build** — generate the production bundle:
   ```
   npm run build
   ```

6. **Push everything** — push commits and the new tag:
   ```
   git push origin main
   git push origin "${VERSION}"
   ```

7. **Create GitHub release** (manual) — go to GitHub and create a release from the tag, attaching:
   - `main.js`
   - `manifest.json`
   - `styles.css` (if it exists)

## Tag Convention

**CRITICAL**: Tags must NEVER have a `v` prefix.

- ✅ Correct: `0.2.6`, `0.3.0`, `1.0.0`
- ❌ Wrong: `v0.2.6`, `v0.3.0`, `v1.0.0`

`npm version` always creates a `v`-prefixed tag. Always delete it and recreate without the prefix.

## Quick Reference (copy-paste)

```bash
# Bump version (change 'patch' as needed)
npm version patch

# Fix the tag
VERSION=$(node -p "require('./manifest.json').version")
git tag -d "v${VERSION}"
git push origin ":refs/tags/v${VERSION}"
git tag "${VERSION}"

# Build and push
npm run build
git push origin main
git push origin "${VERSION}"
```
