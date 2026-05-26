# Production Deployment Guide: Vercel & Supabase

This guide outlines how to deploy the portfolio application to production using **Vercel** for hosting the frontend React SPA, and **Supabase** for database, auth, and media storage.

---

## 1. Supabase Project Setup

Ensure your Supabase project is active and ready:
1. Initialize your Supabase database schema and policies by executing the SQL files in the `supabase/` directory via the Supabase SQL Editor:
   - Run `supabase/schema.sql` (Creates tables, schema structure, and buckets)
   - Run `supabase/storage-policies.sql` (Sets up permissions for the media library)
   - Run `supabase/seed.sql` (Optionally seeds initial portfolio contents)
2. Go to **Settings > API** in your Supabase dashboard and note your credentials:
   - **Project URL**
   - **API Key (anon public)**

---

## 2. Supabase Authentication Configurations

To allow safe admin authentication redirects in production:
1. In the Supabase Dashboard, go to **Authentication > URL Configuration**.
2. Set the **Site URL** to your production frontend URL (e.g., `https://your-portfolio.vercel.app/`).
3. Add the following redirect paths to **Redirect URLs**:
   - `https://your-portfolio.vercel.app/.admin/dashboard`
   - `http://localhost:5173/.admin/dashboard` (for local development testing)

---

## 3. Vercel Deployment Steps

### Option A: Via Vercel Web Dashboard (Recommended)

1. Push your code repository to a Git host (GitHub, GitLab, or Bitbucket).
2. Open the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your portfolio repository.
4. Expand the **Environment Variables** section and add:
   - `VITE_SUPABASE_URL`: (Your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Supabase anon public key)
5. Click **Deploy**. Vercel will automatically build and publish your project using the standard SPA configurations.

### Option B: Via Vercel CLI

If you have the Vercel CLI installed:
1. Open a terminal in the project root.
2. Run:
   ```bash
   vercel
   ```
3. Set the environment variables when prompted or configure them under your Vercel project settings afterwards.
4. Deploy to production using:
   ```bash
   vercel --prod
   ```

---

## 4. Environment Variables Reference

The frontend application requires the following environment variables to communicate with Supabase:

| Variable | Description | Value Location |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | The public endpoint of your Supabase project database API. | Supabase settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | The anonymous public key, safe to expose in client-side builds. | Supabase settings > API > anon public key |

*Do NOT commit your real keys or `.env` files. Ensure they are kept in Git ignore.*

---

## 5. Custom Domain Configuration

To map a custom domain (e.g., `www.yourname.com`) to Vercel:
1. In the Vercel dashboard, go to your project **Settings > Domains**.
2. Enter your custom domain and click **Add**.
3. Update your DNS configuration at your domain registrar with the CNAME or A records provided by Vercel.
4. Ensure your Supabase **Site URL** and **Redirect URLs** (Authentication settings) are updated to match your new domain.

---

## 6. Troubleshooting

### 1. Browser Refresh on Admin Sub-Routes Returns 404
- **Problem**: Refreshing a page under `/.admin/dashboard/` or navigating directly to `/.admin/login` shows a 404 page.
- **Solution**: Check that the `vercel.json` file exists in the root directory and contains the rewrites configuration:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

### 2. Administrator Session Logouts Unexpectedly
- **Problem**: When a user refreshes the page, they are logged out.
- **Solution**: The frontend application has persistence built-in. Verify that your Supabase client setup (`src/lib/supabase.ts`) keeps `persistSession: true` active inside the auth configuration.

### 3. Media Uploads Fail
- **Problem**: Uploading a file in the media library or updating images fails.
- **Solution**: Ensure your storage policy has been properly created. Open the Supabase dashboard, select **Storage**, select the respective bucket (e.g., `media`, `projects`, `about`, `certificates`), and confirm that select/insert/delete rules are configured correctly as outlined in `supabase/storage-policies.sql`.

### 4. Admin Pages Indexed on Search Engines
- **Problem**: Search bots (like Googlebot) are indexing the admin portal.
- **Solution**: The `SEOHead` component automatically injects `<meta name="robots" content="noindex, nofollow" />` for any path starting with `/.admin`. Verify that your routing rendering is wrapping admin page templates inside a component calling `SEOHead` with `/admin` routes.
