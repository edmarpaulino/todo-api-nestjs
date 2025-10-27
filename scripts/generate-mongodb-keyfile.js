/**
 * Generate MongoDB Keyfile for Replica Set Authentication
 *
 * This script generates a secure random keyfile required for MongoDB replica set
 * internal authentication. The keyfile must be between 6 and 1024 characters.
 *
 * Usage: node scripts/generate-mongodb-keyfile.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const KEYFILE_DIR = path.join(__dirname, '..', 'docker', 'mongodb', 'keyfile')
const KEYFILE_PATH = path.join(KEYFILE_DIR, 'mongodb-keyfile')
const KEY_LENGTH = 756 // Characters (recommended size)

function generateKeyfile() {
  console.log('🔐 Generating MongoDB keyfile...\n')

  // Ensure directory exists
  if (!fs.existsSync(KEYFILE_DIR)) {
    fs.mkdirSync(KEYFILE_DIR, { recursive: true })
    console.log(`✓ Created directory: ${KEYFILE_DIR}`)
  }

  // Check if keyfile already exists
  if (fs.existsSync(KEYFILE_PATH)) {
    console.log(`⚠️  Keyfile already exists at: ${KEYFILE_PATH}`)
    console.log('   To regenerate, delete the existing file first.\n')
    return
  }

  // Generate secure random key using base64 encoding
  // MongoDB keyfile should contain base64 characters
  const key = crypto
    .randomBytes(KEY_LENGTH)
    .toString('base64')
    .substring(0, KEY_LENGTH)

  // Write keyfile
  fs.writeFileSync(KEYFILE_PATH, key, { mode: 0o600 })

  console.log(`✓ Keyfile generated successfully!`)
  console.log(`   Location: ${KEYFILE_PATH}`)
  console.log(`   Length: ${key.length} characters`)
  console.log('\n✅ MongoDB replica set keyfile is ready to use.\n')
  console.log('💡 Next steps:')
  console.log('   1. Start your MongoDB services: docker-compose up -d')
  console.log('   2. Test the replica set: node test-replica-set.js\n')
}

// Run the generator
try {
  generateKeyfile()
} catch (error) {
  console.error('\n❌ Error generating keyfile:', error.message)
  process.exit(1)
}
