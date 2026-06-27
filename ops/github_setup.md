# GitHub Setup

## Suggested repository name

```txt
lisso-platform
```

Alternative names:

```txt
lisso-shisha-os
lisso-web-ecosystem
lisso-os
```

## Initial commands

```bash
git init
git add .
git commit -m "Initial LISSO project preparation kit"
git branch -M main
git remote add origin git@github.com:YOUR_ACCOUNT/lisso-platform.git
git push -u origin main
```

## Suggested branch strategy

- main: stable
- develop: active integration
- feature/shisha-os-admin
- feature/home-site
- feature/cloud-run-api

## CI / Auto-merge / Deploy workflows

This repo includes GitHub Actions workflows under `.github/workflows/`:

- `ci.yml`: builds/lints any app under `apps/*` that has a `package.json`. Runs on PRs and pushes to `main`.
- `auto-merge.yml`: enables GitHub's native auto-merge on PRs (squash) so they merge into `main`
  automatically once required checks pass.
- `deploy.yml`: scaffold for deploying to Vercel and Cloud Run on push to `main`. Steps are
  skipped automatically until the related secrets are configured.

### One-time repository settings (do via GitHub web UI, requires admin)

1. **Protect `main` from deletion / force-push**
   - Settings → Branches → Add branch protection rule for `main`.
   - Enable "Restrict deletions" and "Restrict force pushes".
   - Enable "Require a pull request before merging".
   - Enable "Require status checks to pass before merging" and select the `CI / build` check.
2. **Allow auto-merge**
   - Settings → General → Pull Requests → check "Allow auto-merge".
3. **Configure deploy secrets** (Settings → Secrets and variables → Actions)
   - Vercel: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - GCP: `GCP_PROJECT_ID`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`

Once these are set, PRs (including ones opened by Claude) will run CI, auto-merge into `main`
when green, and `main` will redeploy automatically.
