# Hosting Eden Construction

This project has two parts: **website** (Next.js) and **studio-eden-construction** (Sanity Studio). The live site is the website; the studio is for editing content.

## 1. Push the project to GitHub

From the project root (Eden Construction folder):

```bash
cd "/Users/rock/Documents/• Projects/• Github/• Eden Construction"

# If this folder isn’t a git repo yet:
git init
git add .
git commit -m "Initial commit: Eden Construction website and Sanity studio"

# Create a new repo on GitHub (github.com → New repository), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Use a **root .gitignore** in this folder so you don’t commit `node_modules`, `.next`, or env files. Each of `website/` and `studio-eden-construction/` already has its own `.gitignore`; if you run `git init` in the Eden Construction folder, add a root `.gitignore` that includes at least:

- `node_modules/`
- `.next/`
- `out/`
- `.env*`
- `.DS_Store`

(If you prefer a single repo with the website at the root, you can have only the `website` folder as the repo and ignore the studio or put it in a separate repo.)

---

## 2. Host the live site (recommended: Vercel)

**Vercel** works well with Next.js and gives you previews and simple env setup.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → import the repo you pushed.
3. Set **Root Directory** to `website` (so Vercel builds the Next app, not the studio).
4. Leave **Framework Preset** as Next.js. Build command: `npm run build` (or your package manager). Output: default.
5. **Deploy**. No env vars are required for the site if Sanity is using the public project id in code (as in `website/src/lib/sanity.client.ts`).

Your site will be at `https://your-project.vercel.app`. You can add a custom domain in Vercel later.

---

## 3. Optional: GitHub Pages (static export)

GitHub Pages only serves static files. To use it you must build the Next.js app as a **static export**.

1. In `website/next.config.ts`, set:

   ```ts
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
       remotePatterns: [ { protocol: 'https', hostname: 'cdn.sanity.io' } ],
     },
   }
   ```

2. Build and export:

   ```bash
   cd website
   npm run build
   ```

   The static site will be in `website/out/`.

3. In your GitHub repo, go to **Settings → Pages**. Under “Build and deployment”, choose **GitHub Actions** (or upload the contents of `out/` to a branch like `gh-pages` and select that branch as the source).

4. If you use **GitHub Actions**, add a workflow that runs `npm ci`, `npm run build`, and uploads the contents of `website/out` to the `gh-pages` branch (or to the `github-pages` deployment). The exact workflow depends on whether the repo root is the whole project or just `website`.

**Note:** With static export, the site is built once; new or updated Sanity content won’t appear until you run a new build and redeploy. For content that updates often, Vercel (with or without ISR) is usually easier.

---

## Summary

| Goal                    | Action                                              |
|-------------------------|-----------------------------------------------------|
| Put code on GitHub      | `git init`, add/commit, add remote, push (see §1).  |
| Host live site easily   | Use Vercel, root directory = `website` (see §2).   |
| Host on GitHub Pages    | Add `output: 'export'` and static build (see §3).   |

Keeping the site as-is (no static export) and hosting on **Vercel** is the path that doesn’t require any code or config changes and won’t break anything.
