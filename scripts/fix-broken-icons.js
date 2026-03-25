#!/usr/bin/env node

/**
 * Fix broken tech stack icon URLs
 * 
 * Issues fixed:
 * 1. Clearbit.com ERR_NAME_NOT_RESOLVED → Replace Snowflake icon
 * 2. logos-world.net 403 NotSameOrigin → Replace Tableau icon
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const iconFixes = [
  {
    name: 'Snowflake',
    oldIcon: 'https://logo.clearbit.com/snowflake.com',
    newIcon: 'https://unpkg.com/simple-icons@v9/icons/snowflake.svg',
    reason: 'Clearbit Logo API deprecated/blocked'
  },
  {
    name: 'Tableau', 
    oldIcon: 'https://logos-world.net/wp-content/uploads/2021/10/Tableau-Symbol.png',
    newIcon: 'https://cdn.worldvectorlogo.com/logos/tableau-software.svg',
    reason: 'logos-world.net blocks cross-origin embedding'
  }
];

async function fixIcons() {
  console.log('🔧 Starting icon URL fixes...\n');

  for (const fix of iconFixes) {
    try {
      console.log(`📝 Fixing ${fix.name} icon...`);
      console.log(`   ❌ Old: ${fix.oldIcon}`);
      console.log(`   ✅ New: ${fix.newIcon}`);
      console.log(`   📋 Reason: ${fix.reason}`);

      // Find the tech stack entry
      const techEntry = await prisma.techStack.findFirst({
        where: {
          name: {
            equals: fix.name,
            mode: 'insensitive'
          }
        }
      });

      if (!techEntry) {
        console.log(`   ⚠️  Entry for ${fix.name} not found\n`);
        continue;
      }

      // Update the icon URL
      const updated = await prisma.techStack.update({
        where: { id: techEntry.id },
        data: { icon: fix.newIcon },
        select: { id: true, name: true, icon: true }
      });

      console.log(`   ✅ Updated successfully!`);
      console.log(`   🆔 ID: ${updated.id}`);
      console.log(`   🔗 New Icon: ${updated.icon}\n`);

    } catch (error) {
      console.error(`   ❌ Error fixing ${fix.name}:`, error.message);
      console.error(`   📋 Details:`, error);
    }
  }

  console.log('🎉 Icon fixing complete!');
}

async function main() {
  try {
    await fixIcons();
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Script interrupted');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  main();
}

module.exports = { fixIcons, iconFixes };