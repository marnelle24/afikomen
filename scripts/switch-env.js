#!/usr/bin/env node

/**
 * Environment Switch Script
 * Switches between development (.env.dev) and production (.env) environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function loadEnvFile(envFile) {
  const envPath = path.join(process.cwd(), envFile);
  
  if (!fs.existsSync(envPath)) {
    log(`❌ ${envFile} not found`, 'error');
    return null;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove surrounding quotes if present
        value = value.replace(/^["']|["']$/g, '');
        envVars[key.trim()] = value;
      }
    }
  });
  
  return envVars;
}

function switchToEnvironment(envFile) {
  log(`🔄 Switching to ${envFile} environment...`, 'info');
  
  const envVars = loadEnvFile(envFile);
  if (!envVars) {
    return false;
  }
  
  // Update Prisma schema with the correct provider
  const provider = envVars.DATABASE_PROVIDER;
  if (!provider) {
    log(`❌ DATABASE_PROVIDER not found in ${envFile}`, 'error');
    return false;
  }
  
  log(`📋 Database provider: ${provider}`, 'info');
  
  // Create .env.local with the environment variables for Next.js
  const envLocalContent = Object.entries(envVars)
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n');
  
  fs.writeFileSync('.env.local', envLocalContent);
  log('✅ Created .env.local with environment variables', 'success');
  
  // Set all environment variables from the env file
  const env = { 
    ...process.env, 
    DATABASE_PROVIDER: provider,
    DATABASE_URL: envVars.DATABASE_URL,
    DIRECT_URL: envVars.DIRECT_URL,
    JWT_SECRET: envVars.JWT_SECRET,
    OPENAI_API_KEY: envVars.OPENAI_API_KEY,
    BIBLE_API_KEY: envVars.BIBLE_API_KEY
  };
  
  // Generate schema for the provider
  try {
    execSync('node scripts/generate-schema.js', { 
      stdio: 'inherit',
      env: env
    });
    log(`✅ Generated Prisma schema for ${provider}`, 'success');
  } catch (error) {
    log(`❌ Failed to generate Prisma schema: ${error.message}`, 'error');
    return false;
  }
  
  // Generate Prisma client
  try {
    execSync('npx prisma generate', { stdio: 'inherit', env: env });
    log('✅ Prisma client generated successfully', 'success');
  } catch (error) {
    log(`❌ Failed to generate Prisma client: ${error.message}`, 'error');
    return false;
  }
  
  log(`✅ Successfully switched to ${envFile} environment`, 'success');
  log(`📡 Database: ${provider}`, 'info');
  log(`🔗 URL: ${envVars.DATABASE_URL.substring(0, 30)}...`, 'info');
  
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const environment = args[0];
  
  log('🔄 Environment Switch Utility', 'info');
  log('============================', 'info');
  
  if (!environment) {
    log('Usage: node scripts/switch-env.js <environment>', 'info');
    log('Available environments:', 'info');
    log('  dev     - Development (MySQL)', 'info');
    log('  prod    - Production (PostgreSQL)', 'info');
    process.exit(1);
  }
  
  let envFile;
  let envName;
  
  switch (environment.toLowerCase()) {
    case 'dev':
    case 'development':
      envFile = '.env.dev';
      envName = 'Development (MySQL)';
      break;
    case 'prod':
    case 'production':
      envFile = '.env';
      envName = 'Production (PostgreSQL)';
      break;
    default:
      log(`❌ Unknown environment: ${environment}`, 'error');
      log('Available: dev, development, prod, production', 'info');
      process.exit(1);
  }
  
  log(`🎯 Target: ${envName}`, 'info');
  
  if (switchToEnvironment(envFile)) {
    log('\n🎉 Environment switch complete!', 'success');
    log('You can now run your application with the selected environment.', 'info');
  } else {
    log('\n❌ Environment switch failed!', 'error');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { switchToEnvironment };
