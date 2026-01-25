#!/usr/bin/env node
/**
 * Generate bcrypt password hash for admin users
 * Usage: node scripts/create-admin.js
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🔐 Admin User Setup\n');
  
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password (min 8 chars): ');
  
  if (password.length < 8) {
    console.error('\n❌ Password must be at least 8 characters');
    rl.close();
    process.exit(1);
  }
  
  console.log('\n⏳ Generating password hash...\n');
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log('✅ Password hash generated!\n');
  console.log('📋 SQL Insert Command:\n');
  console.log(`INSERT INTO admin_users (email, password_hash, role) VALUES`);
  console.log(`('${email}', '${hash}', 'super_admin');\n`);
  console.log('📋 Or run in Supabase SQL Editor:\n');
  
  rl.close();
}

main().catch(console.error);
