# Database Configuration Guide

This application supports both MySQL and PostgreSQL databases. You can switch between them using environment variables.

## Environment Variables

### Required Variables

```bash
# Database provider - either "mysql" or "postgresql"
DATABASE_PROVIDER=mysql

# Database connection URL
DATABASE_URL="your-database-connection-string"

# Direct URL (same as DATABASE_URL for most cases)
DIRECT_URL="your-database-connection-string"

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here
```

## MySQL Configuration

For MySQL databases (Namecheap shared hosting, etc.):

```bash
DATABASE_PROVIDER=mysql
DATABASE_URL="mysql://username:password@hostname:port/database_name"
DIRECT_URL="mysql://username:password@hostname:port/database_name"
```

### Example for Namecheap:
```bash
DATABASE_PROVIDER=mysql
DATABASE_URL="mysql://username:password@localhost:3306/afikomen_db"
DIRECT_URL="mysql://username:password@localhost:3306/afikomen_db"
```

## PostgreSQL Configuration

For PostgreSQL databases (Supabase, etc.):

```bash
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://username:password@hostname:port/database_name"
DIRECT_URL="postgresql://username:password@hostname:port/database_name"
```

### Example for Supabase:
```bash
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## Setup Commands

After setting your environment variables:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

3. **Or create a migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

## Switching Between Databases

To switch from MySQL to PostgreSQL (or vice versa):

1. Update your `.env` file with the new `DATABASE_PROVIDER` and connection strings
2. Run `npx prisma generate` to regenerate the client
3. Run `npx prisma db push` to apply the schema to the new database

## Notes

- The schema is designed to be compatible with both MySQL and PostgreSQL
- All field types and constraints work with both database providers
- The `@db.Text` attributes are supported by both providers
- JSON fields work with both MySQL and PostgreSQL
