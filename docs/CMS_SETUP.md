# Portfolio CMS — Setup Guide

Complete step-by-step instructions to set up the Supabase-backed CMS for this portfolio.

---

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier is sufficient)
- Node.js 18+
- This portfolio codebase cloned and dependencies installed (`npm install`)

---

## Step 1 — Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization, set a project name, database password, and region
4. Wait ~2 minutes for provisioning

---

## Step 2 — Run the Schema SQL

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of [`supabase/schema.sql`](../supabase/schema.sql)
4. Paste and click **Run**
5. You should see "Success. No rows returned." — all 12 tables are now created

---

## Step 3 — Run the Storage Policies SQL

1. First, **create the storage buckets** in Supabase Dashboard:
   - Go to **Storage** → **New Bucket**
   - Create these 6 buckets (all **Public**):
     - `profile-images`
     - `project-images`
     - `certificates`
     - `seo-assets`
     - `resumes`
     - `general-media`

2. Back in **SQL Editor**, run [`supabase/storage-policies.sql`](../supabase/storage-policies.sql)

---

## Step 4 — Seed Initial Data

1. In **SQL Editor**, run [`supabase/seed.sql`](../supabase/seed.sql)
2. This pre-populates all tables with your current hardcoded portfolio content
3. Your portfolio will work immediately after adding env vars

---

## Step 5 — Create Your Admin Account

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and a strong password
4. Click **Create User**

> **IMPORTANT**: Do NOT enable any signup providers (Google, GitHub, etc.) unless you want public signups. Only email/password is used.

---

## Step 6 — Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

> ⚠️ **NEVER** use the `service_role` key in the frontend. Only use the `anon` key.

---

## Step 7 — Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> The `.env` file is already in `.gitignore` — it will never be committed.

---

## Step 8 — Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view your portfolio.

---

## Step 9 — Access the Admin Dashboard

Navigate to: **`http://localhost:5173/.admin`**

- This redirects to the login page
- Sign in with the email/password you created in Step 5
- You'll be taken to the Admin Dashboard

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. In Vercel project settings → **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

> If using a custom domain (not GitHub Pages), change `base: '/Portfolio_Zahi/'` to `base: '/'` in `vite.config.ts`.

---

## Admin Dashboard Pages

| Page | Path | Description |
|---|---|---|
| Overview | `/.admin/dashboard` | Stats overview |
| Hero | `/.admin/dashboard/hero` | Edit hero section |
| About | `/.admin/dashboard/about` | Edit bio + profile image |
| Projects | `/.admin/dashboard/projects` | Add/edit/delete/reorder projects |
| Certificates | `/.admin/dashboard/certificates` | Manage certificates |
| Skills | `/.admin/dashboard/skills` | Manage skills |
| Contact | `/.admin/dashboard/contact` | Edit contact info |
| Social Links | `/.admin/dashboard/social-links` | Manage social links |
| SEO | `/.admin/dashboard/seo` | Per-page SEO metadata |
| Media | `/.admin/dashboard/media` | Upload/browse files |
| Settings | `/.admin/dashboard/settings` | Site-wide settings |

---

## Security Checklist

- [x] Row Level Security enabled on all tables
- [x] Public tables: `SELECT` only for `anon` role
- [x] All writes require `authenticated` role (logged-in admin)
- [x] Only `anon` key exposed in frontend bundle
- [x] `service_role` key never used client-side
- [x] Admin routes not in sitemap/navbar
- [x] `.env` excluded from git

---

## Supabase Free Tier Limits

| Resource | Free Tier | Expected Usage |
|---|---|---|
| Database | 500MB | <10MB |
| Storage | 1GB | <200MB |
| File uploads | 50MB each | Sufficient for images |
| Bandwidth | 2GB/month | Adequate for portfolio |
| Auth users | Unlimited | 1 admin |

---

## Troubleshooting

**`Missing Supabase environment variables`**  
→ Ensure `.env` file exists with both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Portfolio shows hardcoded content**  
→ Run `supabase/seed.sql` to populate the database

**Login page shows "Invalid credentials"**  
→ Confirm admin user was created in Supabase Authentication → Users

**Images not loading after upload**  
→ Ensure storage buckets are set to **Public** in Supabase Storage settings

**Admin route shows 404 on Vercel**  
→ Add a `vercel.json` at root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
