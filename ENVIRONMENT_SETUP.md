# Environment Setup Guide

This project uses separate environment files for development and production to ensure clean database switching.

## Environment Files

### `.env.dev` - Development Environment
- **Database**: MySQL (local)
- **Purpose**: Local development and testing
- **Usage**: `npm run env:dev`

### `.env` - Production Environment  
- **Database**: PostgreSQL (Supabase)
- **Purpose**: Production deployment
- **Usage**: `npm run env:prod`

## Quick Commands

### Environment Switching
```bash
# Switch to development (MySQL)
npm run env:dev

# Switch to production (PostgreSQL)
npm run env:prod
```

### Development with Specific Database
```bash
# Start development server with MySQL
npm run dev:mysql

# Start development server with PostgreSQL
npm run dev:postgres
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Environment Configuration

### Development (.env.dev)
```bash
DATABASE_PROVIDER=mysql
DATABASE_URL="mysql://root:root@localhost:3306/bible_verse_app"
DIRECT_URL="mysql://root:root@localhost:3306/bible_verse_app"
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-key"
BIBLE_API_KEY="your-bible-key"
```

### Production (.env)
```bash
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://postgres:password@host:port/database"
DIRECT_URL="postgresql://postgres:password@host:port/database"
JWT_SECRET="your-jwt-secret"
OPENAI_API_KEY="your-openai-key"
BIBLE_API_KEY="your-bible-key"
```

## Workflow

### For Development (MySQL)
1. Switch to development environment:
   ```bash
   npm run env:dev
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Your app will use MySQL database

### For Production Testing (PostgreSQL)
1. Switch to production environment:
   ```bash
   npm run env:prod
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Your app will use PostgreSQL database

### For Deployment
1. Ensure `.env` is configured for production
2. Deploy to your hosting platform
3. The production environment will use PostgreSQL

## Troubleshooting

### Issue: "URL must start with postgresql://"
- **Cause**: Environment variables not loaded correctly
- **Solution**: Run `npm run env:prod` to switch to PostgreSQL

### Issue: "URL must start with mysql://"
- **Cause**: Environment variables not loaded correctly  
- **Solution**: Run `npm run env:dev` to switch to MySQL

### Issue: Data not switching between databases
- **Cause**: Prisma client not regenerated
- **Solution**: Run `npm run db:generate` after switching environments

### Issue: Development server not picking up changes
- **Cause**: Server cache
- **Solution**: Restart the development server (`Ctrl+C` then `npm run dev`)

## Benefits

✅ **Clean separation** between development and production
✅ **No more .env.local conflicts**
✅ **Easy database switching** with single commands
✅ **Consistent environment** across team members
✅ **Production-ready** configuration
✅ **Automatic Prisma client regeneration**

## File Structure

```
├── .env.dev          # Development (MySQL)
├── .env              # Production (PostgreSQL)
├── scripts/
│   ├── switch-env.js     # Environment switching
│   ├── generate-schema.js # Schema generation
│   └── switch-database.js # Legacy database switching
└── prisma/
    └── schema.prisma     # Dynamic schema
```
