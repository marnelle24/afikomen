#!/usr/bin/env node

/**
 * Database Setup Script
 * Helps configure the database based on environment variables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

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

function checkEnvVar(name, required = true) {
  const value = process.env[name];
  if (required && !value) {
    log(`❌ Missing required environment variable: ${name}`, 'error');
    return false;
  }
  if (value) {
    log(`✅ ${name}: ${value.substring(0, 20)}...`, 'success');
  }
  return true;
}

function runCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'info');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'success');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'error');
    return false;
  }
}

function main() {
  log('🚀 Database Setup Script', 'info');
  log('========================', 'info');
  
  // Check environment variables
  log('\n📋 Checking environment variables...', 'info');
  const hasProvider = checkEnvVar('DATABASE_PROVIDER');
  const hasUrl = checkEnvVar('DATABASE_URL');
  const hasDirectUrl = checkEnvVar('DIRECT_URL');
  const hasJwtSecret = checkEnvVar('JWT_SECRET');
  const hasOpenAI = checkEnvVar('OPENAI_API_KEY');
  
  if (!hasProvider || !hasUrl || !hasDirectUrl || !hasJwtSecret || !hasOpenAI) {
    log('\n❌ Missing required environment variables. Please check your .env file.', 'error');
    process.exit(1);
  }
  
  const provider = process.env.DATABASE_PROVIDER;
  log(`\n🗄️  Database Provider: ${provider}`, 'info');
  
  if (provider !== 'mysql' && provider !== 'postgresql') {
    log('❌ DATABASE_PROVIDER must be either "mysql" or "postgresql"', 'error');
    process.exit(1);
  }
  
  // Generate Prisma client
  log('\n🔧 Setting up Prisma...', 'info');
  if (!runCommand('npx prisma generate', 'Generating Prisma client')) {
    process.exit(1);
  }
  
  // Ask user what they want to do
  log('\n📝 What would you like to do?', 'info');
  log('1. Push schema to database (npx prisma db push)', 'info');
  log('2. Create migration (npx prisma migrate dev)', 'info');
  log('3. Just generate client (already done)', 'info');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\nEnter your choice (1-3): ', (answer) => {
    rl.close();
    
    switch (answer.trim()) {
      case '1':
        runCommand('npx prisma db push', 'Pushing schema to database');
        break;
      case '2':
        runCommand('npx prisma migrate dev --name init', 'Creating initial migration');
        break;
      case '3':
        log('✅ Database setup complete!', 'success');
        break;
      default:
        log('❌ Invalid choice. Exiting.', 'error');
        process.exit(1);
    }
    
    log('\n🎉 Setup complete! You can now run your application.', 'success');
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };
