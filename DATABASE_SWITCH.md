# Database Switch Configuration

This guide shows how to easily switch between MySQL and PostgreSQL databases using a single environment variable.

## Setup Your .env File

Add both database configurations to your `.env` file:

```bash
# Database Mode - Change this to switch databases
DATABASE_PROVIDER=mysql

# MySQL Configuration (Namecheap, etc.)
MYSQL_DATABASE_URL="mysql://username:password@hostname:port/database_name"
MYSQL_DIRECT_URL="mysql://username:password@hostname:port/database_name"

# PostgreSQL Configuration (Supabase, etc.)
POSTGRES_DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
POSTGRES_DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Other required variables
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

## How to Switch Databases

### Method 1: Automatic Switch (Recommended)
```bash
# Switch to MySQL
DATABASE_PROVIDER=mysql npm run db:switch

# Switch to PostgreSQL  
DATABASE_PROVIDER=postgresql npm run db:switch
```

### Method 2: Manual Switch
1. Edit your `.env` file and change `DATABASE_PROVIDER` to either `mysql` or `postgresql`
2. Run the switch script:
```bash
npm run db:switch
```

### Method 3: Direct Environment Variable
```bash
# For MySQL
DATABASE_PROVIDER=mysql npm run dev

# For PostgreSQL
DATABASE_PROVIDER=postgresql npm run dev
```

## What the Switch Script Does

1. ✅ Reads your `.env` file
2. ✅ Checks the `DATABASE_PROVIDER` value
3. ✅ Automatically sets `DATABASE_URL` and `DIRECT_URL` based on your provider
4. ✅ Regenerates the Prisma client for the selected database
5. ✅ Confirms the switch was successful

## Example Usage

```bash
# Start with MySQL
DATABASE_PROVIDER=mysql npm run db:switch
npm run dev

# Switch to PostgreSQL
DATABASE_PROVIDER=postgresql npm run db:switch
npm run dev

# Switch back to MySQL
DATABASE_PROVIDER=mysql npm run db:switch
npm run dev
```

## Troubleshooting

### Error: "MySQL URLs not found"
- Make sure you have `MYSQL_DATABASE_URL` and `MYSQL_DIRECT_URL` in your `.env` file

### Error: "PostgreSQL URLs not found"  
- Make sure you have `POSTGRES_DATABASE_URL` and `POSTGRES_DIRECT_URL` in your `.env` file

### Error: "DATABASE_PROVIDER not found"
- Add `DATABASE_PROVIDER=mysql` or `DATABASE_PROVIDER=postgresql` to your `.env` file

## Benefits

- 🔄 **One command switching** between databases
- 🛡️ **Automatic validation** of configuration
- 📝 **No manual URL editing** required
- 🚀 **Instant Prisma client regeneration**
- ✅ **Error-free database switching**
