#!/usr/bin/env node

/**
 * Database Check Script
 * Checks database contents and helps debug login issues
 */

const { PrismaClient } = require('@prisma/client');

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

async function checkDatabase() {
  log('🔍 Database Check Utility', 'info');
  log('========================', 'info');
  
  const prisma = new PrismaClient();
  
  try {
    // Check if we can connect to the database
    log('🔄 Testing database connection...', 'info');
    await prisma.$connect();
    log('✅ Database connection successful', 'success');
    
    // Check users table
    log('\n📊 Checking users table...', 'info');
    const userCount = await prisma.user.count();
    log(`📈 Total users: ${userCount}`, 'info');
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          tokenBalance: true,
          tokensUsed: true
        },
        take: 5
      });
      
      log('\n👥 Recent users:', 'info');
      users.forEach((user, index) => {
        log(`  ${index + 1}. ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt.toISOString()}`, 'info');
        log(`     Tokens: ${user.tokensUsed}/${user.tokenBalance}`, 'info');
      });
    } else {
      log('⚠️  No users found in database', 'warning');
      log('💡 You may need to register a new user or migrate data from MySQL', 'info');
    }
    
    // Check verses table
    log('\n📖 Checking verses table...', 'info');
    const verseCount = await prisma.verse.count();
    log(`📈 Total verses: ${verseCount}`, 'info');
    
    if (verseCount > 0) {
      const verses = await prisma.verse.findMany({
        select: {
          id: true,
          reference: true,
          version: true,
          createdAt: true,
          tokenUsed: true
        },
        take: 3
      });
      
      log('\n📚 Recent verses:', 'info');
      verses.forEach((verse, index) => {
        log(`  ${index + 1}. ${verse.reference} (${verse.version}) - ${verse.tokenUsed} tokens`, 'info');
      });
    }
    
    // Check database provider
    log('\n🗄️  Database Information:', 'info');
    const provider = process.env.DATABASE_PROVIDER || 'unknown';
    log(`📋 Provider: ${provider}`, 'info');
    
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const urlType = databaseUrl.startsWith('mysql://') ? 'MySQL' : 
                     databaseUrl.startsWith('postgresql://') ? 'PostgreSQL' : 'Unknown';
      log(`🔗 Database URL: ${urlType}`, 'info');
    }
    
  } catch (error) {
    log(`❌ Database check failed: ${error.message}`, 'error');
    log('💡 Make sure your database is running and accessible', 'info');
  } finally {
    await prisma.$disconnect();
  }
  
  log('\n🎉 Database check complete!', 'success');
}

if (require.main === module) {
  checkDatabase().catch(console.error);
}

module.exports = { checkDatabase };
