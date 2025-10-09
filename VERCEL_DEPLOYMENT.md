# 🚀 Vercel Deployment Guide for Afikomen App

This guide will walk you through deploying your Afikomen application to Vercel with Supabase database.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ GitHub account
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ Supabase project set up (you already have this!)
- ✅ OpenAI API key

---

## 🔧 Step 1: Prepare Your Application

### 1.1 Check Your Environment Variables

Make sure your `.env` file has all required variables:
```env
DATABASE_URL="postgresql://postgres.your-ref:[password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your-ref:[password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this"
OPENAI_API_KEY="sk-your-openai-api-key"
```

### 1.2 Create `.env.example` File

Create a template for others (without sensitive data):
```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT Secret (generate a strong random string)
JWT_SECRET="your-jwt-secret-here"

# OpenAI API Key
OPENAI_API_KEY="sk-..."
```

### 1.3 Update `.gitignore`

Make sure `.env` and `.env.local` are in your `.gitignore`:
```
.env
.env.local
.env*.local
```

---

## 📦 Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Afikomen app ready for deployment"
```

### 2.2 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., "afikomen-app")
3. Don't initialize with README (you already have one)

### 2.3 Push to GitHub
```bash
# Replace with your repository URL
git remote add origin https://github.com/YOUR-USERNAME/afikomen-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect Your Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose your **afikomen-app** repository
5. Click **"Import"**

### 3.2 Configure Project Settings

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (leave as default)

**Output Directory**: `.next` (leave as default)

### 3.3 Add Environment Variables

Click on **"Environment Variables"** and add ALL of these:

#### Required Environment Variables:

| Name | Value | Where to Get It |
|------|-------|----------------|
| `DATABASE_URL` | `postgresql://postgres.xxx:[password]@...6543/postgres?pgbouncer=true` | Supabase → Settings → Database → Connection string (Session mode, port 6543) |
| `DIRECT_URL` | `postgresql://postgres.xxx:[password]@...5432/postgres` | Supabase → Settings → Database → Connection string (Direct mode, port 5432) |
| `JWT_SECRET` | Your secret key | Generate one at [randomkeygen.com](https://randomkeygen.com) or use: `openssl rand -base64 32` |
| `OPENAI_API_KEY` | `sk-...` | [OpenAI Platform](https://platform.openai.com/api-keys) |

**⚠️ Important for Supabase:**
- Make sure to use **Transaction mode (port 5432)** for `DIRECT_URL`
- Make sure to use **Session mode (port 6543)** with `?pgbouncer=true` for `DATABASE_URL`

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (3-5 minutes)
3. Vercel will show you the deployment URL

---

## 🗄️ Step 4: Set Up Database Schema on Supabase

After your first deployment, you need to create the database tables:

### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Link your project:
```bash
vercel link
```

4. Pull environment variables:
```bash
vercel env pull .env.local
```

5. Push database schema:
```bash
npx prisma db push
```

6. Generate Prisma client:
```bash
npx prisma generate
```

### Option B: Using Prisma Studio (Alternative)

1. Run locally with production env:
```bash
npx prisma db push
```

This will create all tables in your Supabase database.

---

## ✅ Step 5: Verify Deployment

### 5.1 Check Your Live Site

1. Visit your Vercel URL (e.g., `https://afikomen-app.vercel.app`)
2. Test the landing page loads
3. Click "Register" and create a test account
4. Try processing a Bible verse
5. Check token usage is tracked

### 5.2 Check Database in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. You should see tables:
   - `User`
   - `Verse`
   - And migrations table

### 5.3 Test All Features

- ✅ User registration
- ✅ User login
- ✅ Verse processing
- ✅ Token tracking
- ✅ Dashboard stats
- ✅ Verse history
- ✅ Dark mode toggle

---

## 🔄 Step 6: Continuous Deployment

Now that everything is set up:

### Every time you make changes:

```bash
# 1. Make your changes
git add .
git commit -m "Your commit message"
git push origin main

# 2. Vercel automatically deploys!
# Check deployment status at: vercel.com/dashboard
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails - "Prisma Client not generated"

**Solution:**
Add build script to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "vercel-build": "prisma generate && prisma db push --accept-data-loss && next build"
  }
}
```

### Issue 2: Database Connection Fails

**Solution:**
- Verify both `DATABASE_URL` and `DIRECT_URL` are correct in Vercel environment variables
- Check Supabase project is not paused (free tier pauses after 7 days of inactivity)
- Ensure passwords don't have special characters (or URL-encode them)

### Issue 3: OpenAI API Calls Fail

**Solution:**
- Verify `OPENAI_API_KEY` is set in Vercel environment variables
- Check your OpenAI account has available credits
- Ensure API key is not expired

### Issue 4: JWT Token Issues

**Solution:**
- Make sure `JWT_SECRET` is the same across all deployments
- Don't change `JWT_SECRET` after users have logged in (they'll need to re-login)

---

## 🎨 Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to your Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `afikomen.com`)
4. Follow DNS configuration instructions

### 7.2 Update DNS Records

In your domain registrar (Namecheap):
1. Add **A Record** or **CNAME Record** as shown in Vercel
2. Wait for DNS propagation (up to 48 hours, usually 1-2 hours)

---

## 📊 Step 8: Monitor Your Application

### Vercel Dashboard Features:

1. **Analytics**: View page views and performance
2. **Logs**: Check runtime logs for errors
3. **Deployments**: See all deployment history
4. **Environment Variables**: Manage secrets

### Supabase Dashboard Features:

1. **Table Editor**: View and edit database records
2. **SQL Editor**: Run custom queries
3. **Database**: Monitor connections and performance
4. **Logs**: Check database activity

---

## 🔒 Security Best Practices

### Production Checklist:

- [ ] Strong `JWT_SECRET` (at least 32 characters)
- [ ] Supabase database has strong password
- [ ] OpenAI API key is protected (never commit to Git)
- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Database backups enabled in Supabase
- [ ] SSL enabled (Vercel does this automatically)
- [ ] Rate limiting configured for API routes (optional)

---

## 🎯 Quick Deployment Checklist

- [ ] **Step 1**: Code pushed to GitHub
- [ ] **Step 2**: Repository imported to Vercel
- [ ] **Step 3**: Environment variables added in Vercel
- [ ] **Step 4**: First deployment successful
- [ ] **Step 5**: Database schema pushed to Supabase
- [ ] **Step 6**: Test registration and login
- [ ] **Step 7**: Test verse processing
- [ ] **Step 8**: Verify token tracking works
- [ ] **Step 9**: Check all pages load correctly
- [ ] **Step 10**: Celebrate! 🎉

---

## 📞 Need Help?

**Vercel Support:**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

**Supabase Support:**
- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Discord: [discord.supabase.com](https://discord.supabase.com)

**Common Resources:**
- Prisma + Supabase: [supabase.com/docs/guides/integrations/prisma](https://supabase.com/docs/guides/integrations/prisma)
- Next.js on Vercel: [nextjs.org/learn/basics/deploying-nextjs-app](https://nextjs.org/learn/basics/deploying-nextjs-app)

---

## 🎉 Your App is Live!

Once deployed, your Afikomen app will be available at:
- **Vercel URL**: `https://afikomen-app.vercel.app` (or your custom domain)
- **Features**: Fully functional with database, authentication, and AI-powered verse insights
- **Scale**: Automatically scales with Vercel's infrastructure

Enjoy your deployed application! 🙌

