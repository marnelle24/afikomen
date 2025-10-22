#!/usr/bin/env node

/**
 * Dynamic Schema Generator
 * Generates the correct Prisma schema based on DATABASE_PROVIDER
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
  
  return envVars;
}

function generateSchema(provider) {
  const schemaTemplate = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Token system for usage limits
  tokenBalance    Int      @default(10000) // Monthly token allowance
  tokensUsed      Int      @default(0)   // Tokens consumed this month
  lastTokenReset  DateTime @default(now()) // When tokens were last reset
  
  verses    Verse[]
}

model Verse {
  id                String   @id @default(cuid())
  reference         String
  version           String
  verseContent      String   @db.Text
  context           String   @db.Text
  modernReflection  String   @db.Text
  weeklyActionPlan  Json
  shortPrayer       String   @db.Text
  tokenUsed         Int      @default(0) // OpenAI tokens consumed for this verse
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}`;

  return schemaTemplate;
}

function main() {
  log('🔄 Dynamic Schema Generator', 'info');
  log('========================', 'info');
  
  const envVars = loadEnvFile();
  const provider = envVars.DATABASE_PROVIDER;
  
  if (!provider) {
    log('❌ DATABASE_PROVIDER not found in .env file', 'error');
    log('Please add: DATABASE_PROVIDER=mysql or DATABASE_PROVIDER=postgresql', 'info');
    process.exit(1);
  }
  
  if (provider !== 'mysql' && provider !== 'postgresql') {
    log('❌ DATABASE_PROVIDER must be either "mysql" or "postgresql"', 'error');
    process.exit(1);
  }
  
  log(`📋 Generating schema for: ${provider}`, 'info');
  
  // Generate the schema
  const schemaContent = generateSchema(provider);
  
  // Write to schema file
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  fs.writeFileSync(schemaPath, schemaContent);
  
  log(`✅ Schema generated for ${provider}`, 'success');
  
  // Generate Prisma client
  log('\n🔄 Generating Prisma client...', 'info');
  const { execSync } = require('child_process');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('✅ Prisma client generated successfully', 'success');
  } catch (error) {
    log('❌ Failed to generate Prisma client', 'error');
    process.exit(1);
  }
  
  log('\n🎉 Schema generation complete!', 'success');
}

if (require.main === module) {
  main();
}

module.exports = { main };
