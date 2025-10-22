#!/usr/bin/env node

/**
 * Login Test Script
 * Tests the login functionality with the current database
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

async function testLogin() {
  log('🔐 Login Test Utility', 'info');
  log('===================', 'info');
  
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    log('🔄 Testing database connection...', 'info');
    await prisma.$connect();
    log('✅ Database connection successful', 'success');
    
    // Get a test user
    log('\n👤 Finding test user...', 'info');
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        tokenBalance: true,
        tokensUsed: true,
        lastTokenReset: true
      }
    });
    
    if (!user) {
      log('❌ No users found in database', 'error');
      return;
    }
    
    log(`✅ Found user: ${user.email}`, 'success');
    
    // Test password verification (using a dummy password for testing)
    log('\n🔑 Testing password verification...', 'info');
    const testPassword = 'test123'; // This won't work, but let's see the error
    
    try {
      const isValid = await bcrypt.compare(testPassword, user.password);
      log(`🔐 Password verification result: ${isValid}`, 'info');
    } catch (error) {
      log(`❌ Password verification error: ${error.message}`, 'error');
    }
    
    // Test JWT generation
    log('\n🎫 Testing JWT generation...', 'info');
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      log('✅ JWT generation successful', 'success');
      log(`🎫 Token length: ${token.length} characters`, 'info');
    } catch (error) {
      log(`❌ JWT generation error: ${error.message}`, 'error');
    }
    
    // Test user data structure
    log('\n📊 User data structure:', 'info');
    log(`  ID: ${user.id}`, 'info');
    log(`  Email: ${user.email}`, 'info');
    log(`  Name: ${user.name || 'No name'}`, 'info');
    log(`  Token Balance: ${user.tokenBalance}`, 'info');
    log(`  Tokens Used: ${user.tokensUsed}`, 'info');
    log(`  Last Reset: ${user.lastTokenReset}`, 'info');
    
    // Check for any null/undefined values that might cause issues
    const issues = [];
    if (!user.id) issues.push('ID is missing');
    if (!user.email) issues.push('Email is missing');
    if (!user.password) issues.push('Password is missing');
    if (user.tokenBalance === null || user.tokenBalance === undefined) issues.push('Token balance is missing');
    if (user.tokensUsed === null || user.tokensUsed === undefined) issues.push('Tokens used is missing');
    if (!user.lastTokenReset) issues.push('Last token reset is missing');
    
    if (issues.length > 0) {
      log('\n⚠️  Data issues found:', 'warning');
      issues.forEach(issue => log(`  - ${issue}`, 'warning'));
    } else {
      log('\n✅ User data structure looks good', 'success');
    }
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'error');
    log(`📋 Error details: ${error.stack}`, 'error');
  } finally {
    await prisma.$disconnect();
  }
  
  log('\n🎉 Login test complete!', 'success');
}

if (require.main === module) {
  testLogin().catch(console.error);
}

module.exports = { testLogin };
