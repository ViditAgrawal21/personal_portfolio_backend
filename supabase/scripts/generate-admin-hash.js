#!/usr/bin/env node
/**
 * Generate bcrypt password hash for admin users
 * Usage: node generate-admin-hash.js YourPassword123
 */

const bcrypt = require('bcrypt');

async function generateHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.error('❌ Error: Password required');
    console.log('Usage: node generate-admin-hash.js YourPassword123');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters');
    process.exit(1);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n✅ Password Hash Generated:\n');
  console.log(hash);
  console.log('\nSQL Update Command:\n');
  console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'your_email@example.com';`);
  console.log('\n');
}

generateHash().catch(console.error);
