/**
 * Database Configuration Utility
 * Validates and provides database configuration based on environment variables
 */

export interface DatabaseConfig {
  provider: 'mysql' | 'postgresql'
  url: string
  directUrl: string
  isValid: boolean
  errors: string[]
}

export function getDatabaseConfig(): DatabaseConfig {
  const errors: string[] = []
  
  // Get provider
  const provider = process.env.DATABASE_PROVIDER as 'mysql' | 'postgresql'
  if (!provider) {
    errors.push('DATABASE_PROVIDER is required')
  } else if (provider !== 'mysql' && provider !== 'postgresql') {
    errors.push('DATABASE_PROVIDER must be either "mysql" or "postgresql"')
  }
  
  // Get URLs
  const url = process.env.DATABASE_URL
  const directUrl = process.env.DIRECT_URL
  
  if (!url) {
    errors.push('DATABASE_URL is required')
  }
  
  if (!directUrl) {
    errors.push('DIRECT_URL is required')
  }
  
  // Validate URL format
  if (url && provider) {
    const expectedPrefix = provider === 'mysql' ? 'mysql://' : 'postgresql://'
    if (!url.startsWith(expectedPrefix)) {
      errors.push(`DATABASE_URL must start with "${expectedPrefix}" for ${provider}`)
    }
  }
  
  if (directUrl && provider) {
    const expectedPrefix = provider === 'mysql' ? 'mysql://' : 'postgresql://'
    if (!directUrl.startsWith(expectedPrefix)) {
      errors.push(`DIRECT_URL must start with "${expectedPrefix}" for ${provider}`)
    }
  }
  
  return {
    provider: provider || 'mysql',
    url: url || '',
    directUrl: directUrl || '',
    isValid: errors.length === 0,
    errors
  }
}

export function validateDatabaseConfig(): void {
  const config = getDatabaseConfig()
  
  if (!config.isValid) {
    console.error('❌ Database configuration errors:')
    config.errors.forEach(error => {
      console.error(`  - ${error}`)
    })
    console.error('\nPlease check your .env file and ensure all required variables are set.')
    console.error('See DATABASE_CONFIG.md for configuration examples.')
    process.exit(1)
  }
  
  console.log(`✅ Database configuration valid (${config.provider})`)
}

// Auto-validate on import in production
if (process.env.NODE_ENV === 'production') {
  validateDatabaseConfig()
}
