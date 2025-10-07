# Deployment Guide

## Quick Setup for Development

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd afikomen
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.local.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.local.example .env.local
   ```

3. **Set up database**
   ```bash
   npm run setup
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables Required

```env
# Database (MySQL)
DATABASE_URL="mysql://root:root@localhost:3306/bible_verse_app"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# OpenAI API Key (get from https://platform.openai.com)
# Used for both Bible verse fetching and AI-powered insights
OPENAI_API_KEY="sk-..."
```

## Database Setup Options

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create database: `createdb bible_verse_app`
3. Update `DATABASE_URL` in `.env.local`

### Option 2: Supabase (Recommended for production)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Update `DATABASE_URL` in `.env.local`

### Option 3: Vercel Postgres
1. Add Vercel Postgres addon to your Vercel project
2. Use the provided connection string

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify dashboard

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

## API Keys Setup

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create account and add payment method
3. Generate API key
4. Add to environment variables

**Note:** The app uses OpenAI for both:
- Fetching Bible verses in different translations
- Generating AI-powered insights and reflections

## Production Checklist

- [ ] Set strong JWT secret
- [ ] Use production database (not local)
- [ ] Set up proper CORS if needed
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Test all functionality
- [ ] Set up backups for database

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Ensure database server is running
- Verify credentials

### API Key Issues
- Verify API keys are correct
- Check API key permissions
- Ensure billing is set up for OpenAI

### Build Issues
- Run `npm install` to ensure all dependencies
- Check TypeScript errors: `npm run lint`
- Verify all environment variables are set
