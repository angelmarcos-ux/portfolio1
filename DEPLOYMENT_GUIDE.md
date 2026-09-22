# 🚀 Enterprise Monorepo Deployment Guide

Your portfolio and the 5 advanced applications are structured as a **Monorepo**. This is how top-tier tech companies (like Vercel, Meta, and Google) structure their code. 

Instead of managing 6 different GitHub repositories, you manage **one**, but deploy them as **6 completely separate websites** with their own domains.

Here is the exact step-by-step guide to deploying them separately on **Vercel** (the industry standard).

---

## Step 1: Push to GitHub
First, push this entire `portfolio` folder to a single GitHub repository.

```bash
git add .
git commit -m "feat: institutional portfolio and 5 advanced apps"
git push origin main
```

---

## Step 2: Deploy the Main Portfolio
1. Log in to [Vercel](https://vercel.com) and click **Add New -> Project**.
2. Import your GitHub repository.
3. **Framework Preset:** Vercel will automatically detect `Nuxt.js`.
4. **Root Directory:** Leave this as `./` (the root).
5. Click **Deploy**.
*Result: Your main portfolio is now live.*

---

## Step 3: Deploy Project 2 (Next.js - Aura Health)
1. Go back to the Vercel dashboard and click **Add New -> Project** again.
2. Import the **exact same** GitHub repository.
3. **Crucial Step:** In the "Root Directory" section, click **Edit**.
4. Select `apps/project-2`.
5. **Framework Preset:** Vercel will automatically detect `Next.js`.
6. Click **Deploy**.
*Result: Project 2 is now live on its own separate URL/domain!*

---

## Step 4: Deploy Project 3 (Vue - Nexus Logistics)
1. Click **Add New -> Project**.
2. Import the repository.
3. Edit **Root Directory** -> Select `apps/project-3`.
4. **Framework Preset:** Vercel will detect `Vite`.
5. Click **Deploy**.

---

## Step 5: Deploy Project 4 (React - AutoVision Edge)
1. Click **Add New -> Project**.
2. Import the repository.
3. Edit **Root Directory** -> Select `apps/project-4`.
4. **Framework Preset:** Vercel will detect `Vite`.
5. Click **Deploy**.

---

## Step 6: Deploy Project 5 (Nuxt - LuxeCommerce)
1. Click **Add New -> Project**.
2. Import the repository.
3. Edit **Root Directory** -> Select `apps/project-5`.
4. **Framework Preset:** Vercel will detect `Nuxt.js`.
5. Click **Deploy**.

---

## Step 7: Deploy Project 1 (Static HTML - QuantTrade)
Because Project 1 is a pure HTML/JS file, it's currently inside `public/projects/project-1`. 
1. Click **Add New -> Project**.
2. Import the repository.
3. Edit **Root Directory** -> Select `public/projects/project-1`.
4. **Framework Preset:** Select `Other`.
5. Click **Deploy**.

---

### Why this is a $15k/mo architecture:
By keeping everything in a Monorepo (`apps/`), you share configurations, keep your local development clean, and demonstrate to technical recruiters/CTOs that you understand enterprise-scale codebase management. When you update one project and push to GitHub, Vercel is smart enough to **only rebuild the project that was changed**.