# Push to GitHub & get a live draft link

This project has two parts: **website** (Next.js) and **studio-eden-construction** (Sanity CMS). You only need to deploy the **website** to get a live draft URL; the studio can stay local or be deployed separately later.

---

## Part 1: Push to GitHub (with GitHub Desktop)

Right now your git repo is at your **Documents** folder, not inside Eden Construction. To push only this project to GitHub:

### Option A – Create a new repo in this folder (recommended)

1. **Open GitHub Desktop.**

2. **Create a new repository here:**
   - **File → Add Local Repository…**
   - Choose this folder:  
     `Documents/• Projects/• Github/• Eden Construction`
   - If it says “this directory does not appear to be a Git repository”, you’ll use **Option B** below.

3. **If it *is* a Git repo:**  
   You’ll see your changes. Make sure only files from **Eden Construction** are included (website, studio, root `.gitignore`).  
   - If you see stuff from other folders (Documents, etc.), **don’t use this repo**. Use **Option B** instead.

### Option B – Start a new Git repo in Eden Construction

1. **Create the repo in GitHub first:**
   - Go to [github.com/new](https://github.com/new).
   - Name it e.g. `eden-construction`.
   - Leave “Add a README” **unchecked** (you already have files).
   - Create the repository.

2. **In GitHub Desktop:**
   - **File → New Repository…**
   - **Name:** `Eden Construction` (or whatever you like).
   - **Local Path:** pick the parent folder so the new repo lives at  
     `…/Github/Eden Construction`.
   - **Git Ignore:** None (you already have `.gitignore` files).
   - **License:** optional.
   - Click **Create Repository**.

3. **Connect it to GitHub:**
   - **Repository → Repository Settings…** (or **Ctrl+,** / **Cmd+,**).
   - Click **Connect to GitHub** and sign in if needed.
   - Choose **Publish** (or **Add Existing Remote** if you created the repo in step 1) and select your `eden-construction` repo.

4. **First commit and push:**
   - In the left sidebar you should see all project files (website, studio, `.gitignore`, etc.).
   - **Summary:** e.g. `Initial commit – website + Sanity studio`
   - Click **Commit to main**.
   - Then **Push origin** (top bar).

After this, your code is on GitHub and you can use it for a live draft.

---

## Part 2: Get a live draft link (Vercel – free)

Vercel runs Next.js very well and gives you a URL like `eden-construction.vercel.app` (and optional custom domains later).

1. **Sign up / log in**
   - Go to [vercel.com](https://vercel.com) and sign in with your **GitHub** account.

2. **Import the project**
   - **Add New… → Project**.
   - Select the **eden-construction** (or whatever you named it) repo.
   - Click **Import**.

3. **Configure the build**
   - **Root Directory:** click **Edit** and set to: **`website`**  
     (so Vercel builds the Next.js app, not the repo root).
   - **Framework Preset:** should be **Next.js**.
   - **Build Command:** `next build` (default).
   - **Output Directory:** leave default.
   - **Install Command:** `npm install` (default).

4. **Environment variables**
   - Your site uses Sanity with project id `pyrxfvdm` and dataset `production` in code, so you don’t *have* to add env vars for the draft to work.
   - If you later add `.env` and use `process.env.NEXT_PUBLIC_SANITY_*`, add the same variables in **Environment Variables** in Vercel (e.g. for Production and Preview).

5. **Deploy**
   - Click **Deploy**.
   - Wait a couple of minutes. When it’s done you’ll get:
     - **Production URL:** e.g. `https://eden-construction.vercel.app`
     - Every push to `main` will update this (or you can use **Preview** deployments for other branches).

6. **Draft content**
   - The site reads from your Sanity project **production** dataset. So whatever you publish in Sanity Studio (locally or hosted) will appear on this live URL. No extra “draft link” config unless you add a separate Sanity dataset for drafts.

---

## Quick checklist

- [ ] Git repo exists only for Eden Construction (not whole Documents).
- [ ] `.env` and `node_modules` are not committed (they’re in `.gitignore`).
- [ ] Pushed to GitHub (GitHub Desktop: **Push origin**).
- [ ] Vercel project **Root Directory** set to **`website`**.
- [ ] First deploy succeeded; you have a live URL.

---

## If something doesn’t work

- **Build fails on Vercel:** Check the build log. Most often it’s “root directory” (must be `website`) or a missing dependency (fix in `website/package.json` and push again).
- **Site is blank or errors:** Open the live URL and check the browser console and Network tab; same Sanity project id/dataset means it should work like local.
- **GitHub Desktop “confusing”:** Stick to: **Changes → write Summary → Commit to main → Push origin**. Ignore branches until you need them.

Once this is set up, you can share the Vercel URL (e.g. `https://your-project.vercel.app`) and anyone can view the live draft from anywhere.
