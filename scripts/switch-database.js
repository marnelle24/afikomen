#!/usr/bin/env node

/**
 * Database Switch Script
 * Automatically sets DATABASE_URL and DIRECT_URL based on DATABASE_PROVIDER
 */

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

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found. Please create one first.', 'error');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return { envVars, lines };
}

function saveEnvFile(envVars, lines) {
  const envPath = path.join(process.cwd(), '.env');
  const newLines = [];
  
  // Keep existing lines and update DATABASE_URL and DIRECT_URL
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=') || trimmed.startsWith('DIRECT_URL=')) {
      // Skip these lines, we'll add them at the end
      return;
    }
    newLines.push(line);
  });
  
  // Add the new DATABASE_URL and DIRECT_URL
  newLines.push(`DATABASE_URL="${envVars.DATABASE_URL}"`);
  newLines.push(`DIRECT_URL="${envVars.DIRECT_URL}"`);
  
  fs.writeFileSync(envPath, newLines.join('\n'));
}

function updatePrismaSchema(provider) {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  
  if (!fs.existsSync(schemaPath)) {
    log('❌ Prisma schema file not found', 'error');
    process.exit(1);
  }
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Replace the provider in the datasource block
  const updatedContent = schemaContent.replace(
    /provider = "mysql"|provider = "postgresql"/,
    `provider = "${provider}"`
  );
  
  fs.writeFileSync(schemaPath, updatedContent);
  log(`✅ Updated Prisma schema to use ${provider}`, 'success');
}

function main() {
  log('🔄 Database Switch Utility', 'info');
  log('========================', 'info');
  
  const { envVars, lines } = loadEnvFile();
  
  // Check if DATABASE_PROVIDER is set
  const provider = envVars.DATABASE_PROVIDER;
  if (!provider) {
    log('❌ DATABASE_PROVIDER not found in .env file', 'error');
    log('Please add: DATABASE_PROVIDER=mysql or DATABASE_PROVIDER=postgresql', 'info');
    process.exit(1);
  }
  
  log(`📋 Current provider: ${provider}`, 'info');
  
  // Determine which URLs to use
  let databaseUrl, directUrl;
  
  if (provider === 'mysql') {
    databaseUrl = envVars.MYSQL_DATABASE_URL;
    directUrl = envVars.MYSQL_DIRECT_URL;
    
    if (!databaseUrl || !directUrl) {
      log('❌ MySQL URLs not found. Please add MYSQL_DATABASE_URL and MYSQL_DIRECT_URL to .env', 'error');
      process.exit(1);
    }
  } else if (provider === 'postgresql') {
    databaseUrl = envVars.POSTGRES_DATABASE_URL;
    directUrl = envVars.POSTGRES_DIRECT_URL;
    
    if (!databaseUrl || !directUrl) {
      log('❌ PostgreSQL URLs not found. Please add POSTGRES_DATABASE_URL and POSTGRES_DIRECT_URL to .env', 'error');
      process.exit(1);
    }
  } else {
    log('❌ DATABASE_PROVIDER must be either "mysql" or "postgresql"', 'error');
    process.exit(1);
  }
  
  // Update the environment variables
  envVars.DATABASE_URL = databaseUrl;
  envVars.DIRECT_URL = directUrl;
  
  // Update Prisma schema with the correct provider
  updatePrismaSchema(provider);
  
  // Save the updated .env file
  saveEnvFile(envVars, lines);
  
  log(`✅ Switched to ${provider}`, 'success');
  log(`📡 DATABASE_URL: ${databaseUrl.substring(0, 30)}...`, 'info');
  
  // Generate Prisma client for the new database
  log('\n🔄 Generating Prisma client...', 'info');
  const { execSync } = require('child_process');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('✅ Prisma client generated successfully', 'success');
  } catch (error) {
    log('❌ Failed to generate Prisma client', 'error');
    process.exit(1);
  }
  
  log('\n🎉 Database switch complete!', 'success');
  log('You can now run your application with the selected database.', 'info');
}

if (require.main === module) {
  main();
}

module.exports = { main };
