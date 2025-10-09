# 🚀 Deploy Afikomen to Vercel - Step by Step

## ✅ Prerequisites Checklist
- [x] Database synced with Supabase
- [ ] Code ready to deploy
- [ ] GitHub repository created
- [ ] Vercel account ready

---

## 📝 Step 1: Prepare Your Code for Deployment

### 1.1 Create `.env.example` file
```bash
# In your project root, create this file
touch .env.example
```

Add this content to `.env.example`:
```env
# Supabase Database
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT Secret (use a strong random string)
JWT_SECRET="your-jwt-secret-here"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-key-here"
```

### 1.2 Verify `.gitignore` excludes sensitive files
Your `.gitignore` should include:
```
.env
.env.local
.env*.local
node_modules/
.next/
```

---

## 📦 Step 2: Push to GitHub

### 2.1 Check Git Status
```bash
git status
```

### 2.2 Stage All Changes
```bash
git add .
```

### 2.3 Commit Your Code
```bash
git commit -m "Ready for Vercel deployment - Supabase connected"
```

### 2.4 Create GitHub Repository

**Option A: Using GitHub Website**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `afikomen` or `afikomen-app`
3. Description: "Bible verse insight app with AI-powered reflections"
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** check "Initialize with README" (you already have one)
6. Click **"Create repository"**

**Option B: Using GitHub CLI** (if installed)
```bash
gh repo create afikomen --public --source=. --push
```

### 2.5 Push to GitHub
```bash
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/afikomen.git

# If remote already exists, use:
# git remote set-url origin https://github.com/YOUR-USERNAME/afikomen.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub repositories

### 3.2 Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your **afikomen** repository in the list
3. Click **"Import"** next to it

### 3.3 Configure Project

**Framework Preset**: `Next.js` (should auto-detect)

**Root Directory**: Leave as `./`

**Build Settings**: Leave as default
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add each one:

#### Add These 4 Variables:

**Variable 1:**
- **Name**: `DATABASE_URL`
- **Value**: (Copy from your `.env` file - the one with port 6543)
  ```
  postgresql://postgres.yourref:yourpassword@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- **Environment**: Select all (Production, Preview, Development)

**Variable 2:**
- **Name**: `DIRECT_URL`
- **Value**: (Copy from your `.env` file - the one with port 5432)
  ```
  postgresql://postgres.yourref:yourpassword@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
  ```
- **Environment**: Select all

**Variable 3:**
- **Name**: `JWT_SECRET`
- **Value**: (Copy from your `.env` file or generate new)
  ```
  your-super-secret-jwt-key-minimum-32-characters-long
  ```
- **Environment**: Select all

**Variable 4:**
- **Name**: `OPENAI_API_KEY`
- **Value**: (Your OpenAI API key starting with sk-)
  ```
  sk-proj-xxxxxxxxxxxxxxxxxxxxx
  ```
- **Environment**: Select all

### 3.5 Deploy!

1. Click **"Deploy"**
2. Wait for deployment (usually 2-5 minutes)
3. Watch the build logs for any errors

---

## 🎉 Step 4: Verify Your Deployment

### 4.1 Visit Your Live Site

Once deployment completes, Vercel will show:
- ✅ **Deployment URL**: `https://your-project-name.vercel.app`
- Click **"Visit"** to open your live site

### 4.2 Test Core Features

**Test 1: Landing Page**
- [ ] Landing page loads correctly
- [ ] Animations work smoothly
- [ ] Dark mode toggle works
- [ ] Login/Register buttons work

**Test 2: Authentication**
- [ ] Click "Register" → Create test account
- [ ] Verify account creation successful
- [ ] Check automatic redirect to dashboard
- [ ] Logout works
- [ ] Login with same account works

**Test 3: Verse Processing**
- [ ] Navigate to `/app` page
- [ ] Enter a verse (e.g., "John 3:16")
- [ ] Select version (NIV, KJV, etc.)
- [ ] Click "Reveal the word"
- [ ] Verify AI insights appear:
  - [ ] Verse content
  - [ ] Context
  - [ ] Modern reflection
  - [ ] 7-day action plan
  - [ ] Prayer

**Test 4: Token System**
- [ ] Token balance shows in header
- [ ] Token usage tracked correctly
- [ ] Dashboard shows token stats
- [ ] Token deduction works after verse processing

**Test 5: Dashboard**
- [ ] Stats cards display correctly
- [ ] Recent verses show
- [ ] Verse history displays
- [ ] Click on verse opens modal with full details

---

## 🔧 Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `yourdomain.com`
4. Click **"Add"**

### 5.2 Configure DNS in Namecheap

1. Log into Namecheap
2. Go to **Domain List** → Your domain → **Manage**
3. Go to **Advanced DNS** tab
4. Add these records:

**For Root Domain (yourdomain.com):**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

**For www subdomain:**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### 5.3 Verify Domain

1. Wait 5-10 minutes for DNS propagation
2. Vercel will automatically verify and issue SSL certificate
3. Your site will be live at `https://yourdomain.com`

---

## 🔄 Step 6: Update Your App

### When you make changes:

```bash
# 1. Make your code changes
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Vercel auto-deploys! ✨
# Visit vercel.com/dashboard to see deployment progress
```

### Force Redeploy (if needed):

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click **"..."** menu on latest deployment
4. Click **"Redeploy"**

---

## 📊 Step 7: Monitor & Maintain

### Daily Monitoring:
- **Vercel Analytics**: Check traffic and performance
- **Supabase Logs**: Monitor database queries
- **Error Logs**: Check Vercel runtime logs

### Weekly Maintenance:
- Review token usage across users
- Check database storage (Supabase free tier: 500MB)
- Monitor OpenAI API costs
- Review application errors

### Monthly Tasks:
- Update dependencies: `npm update`
- Review security alerts: `npm audit`
- Check Supabase database size
- Review and optimize slow queries

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | 100GB bandwidth/month | Unlimited projects |
| **Supabase** | 500MB database | 2 projects |
| **OpenAI** | Pay as you go | ~$0.03 per verse (GPT-4) |

**Estimated Monthly Cost:**
- Vercel: **$0** (within free tier)
- Supabase: **$0** (within free tier)
- OpenAI: **$0.30 - $3.00** (10-100 verse queries)

---

## 🚨 Troubleshooting Common Deployment Issues

### Error: "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Error: "Prisma Client not found"
Add to `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Error: "Database connection failed"
- Check environment variables in Vercel
- Verify Supabase project is active (not paused)
- Test connection string locally first

### Error: "Build timeout"
- Optimize your build by removing unused dependencies
- Check for infinite loops in your code
- Contact Vercel support if build takes >15 minutes

---

## ✅ Deployment Complete!

Your Afikomen app is now live on Vercel with:
- ✨ Supabase PostgreSQL database
- 🔐 Secure authentication
- 🤖 AI-powered verse insights
- 📊 Token usage tracking
- 🌙 Dark mode support
- 📱 Fully responsive design

**Share your app**: `https://your-project.vercel.app`

🎉 **Congratulations on deploying your app!** 🎉

