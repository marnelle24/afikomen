#!/usr/bin/env node

/**
 * PostgreSQL Debug Script
 * Comprehensive debugging for PostgreSQL connection issues
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m',  // Yellow
    error: '\x1b[31m',    // Red
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

async function debugPostgreSQL() {
  log('🐘 PostgreSQL Debug Utility', 'info');
  log('==========================', 'info');
  
  // Check environment variables
  log('\n🔧 Environment Variables:', 'info');
  log(`DATABASE_PROVIDER: ${process.env.DATABASE_PROVIDER}`, 'info');
  log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`, 'info');
  log(`DIRECT_URL: ${process.env.DIRECT_URL ? 'Set' : 'Not set'}`, 'info');
  log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`, 'info');
  
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    const isPostgreSQL = url.startsWith('postgresql://') || url.startsWith('postgres://');
    log(`Database type: ${isPostgreSQL ? 'PostgreSQL' : 'MySQL'}`, 'info');
    log(`URL preview: ${url.substring(0, 30)}...`, 'info');
  }
  
  // Check Prisma schema
  log('\n📋 Prisma Schema Check:', 'info');
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const providerMatch = schemaContent.match(/provider = "(\w+)"/);
    if (providerMatch) {
      log(`Schema provider: ${providerMatch[1]}`, 'info');
    }
  }
  
  // Test Prisma client
  log('\n🔄 Testing Prisma Client:', 'info');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // Test connection
    log('🔄 Testing database connection...', 'info');
    await prisma.$connect();
    log('✅ Database connection successful', 'success');
    
    // Test a simple query
    log('🔄 Testing simple query...', 'info');
    const userCount = await prisma.user.count();
    log(`✅ User count query successful: ${userCount} users`, 'success');
    
    // Test user query with all fields
    log('🔄 Testing user query with all fields...', 'info');
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        tokenBalance: true,
        tokensUsed: true,
        lastTokenReset: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (user) {
      log('✅ User query successful', 'success');
      log(`User data:`, 'info');
      log(`  ID: ${user.id}`, 'info');
      log(`  Email: ${user.email}`, 'info');
      log(`  Name: ${user.name}`, 'info');
      log(`  Token Balance: ${user.tokenBalance}`, 'info');
      log(`  Tokens Used: ${user.tokensUsed}`, 'info');
      log(`  Last Reset: ${user.lastTokenReset}`, 'info');
      log(`  Created: ${user.createdAt}`, 'info');
      log(`  Updated: ${user.updatedAt}`, 'info');
      
      // Check for any null values that might cause issues
      const nullFields = [];
      Object.entries(user).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          nullFields.push(key);
        }
      });
      
      if (nullFields.length > 0) {
        log(`⚠️  Null fields found: ${nullFields.join(', ')}`, 'warning');
      } else {
        log('✅ No null fields found', 'success');
      }
    } else {
      log('❌ No users found', 'error');
    }
    
    // Test verses query
    log('🔄 Testing verses query...', 'info');
    const verseCount = await prisma.verse.count();
    log(`✅ Verses query successful: ${verseCount} verses`, 'success');
    
  } catch (error) {
    log(`❌ Database error: ${error.message}`, 'error');
    log(`📋 Error details: ${error.stack}`, 'error');
    
    // Check for specific PostgreSQL errors
    if (error.message.includes('connection')) {
      log('💡 Connection issue - check your DATABASE_URL', 'info');
    } else if (error.message.includes('relation') || error.message.includes('table')) {
      log('💡 Table/relation issue - run "npm run db:push" to sync schema', 'info');
    } else if (error.message.includes('permission') || error.message.includes('access')) {
      log('💡 Permission issue - check your database credentials', 'info');
    }
  } finally {
    await prisma.$disconnect();
  }
  
  log('\n🎉 PostgreSQL debug complete!', 'success');
}

if (require.main === module) {
  debugPostgreSQL().catch(console.error);
}

module.exports = { debugPostgreSQL };
