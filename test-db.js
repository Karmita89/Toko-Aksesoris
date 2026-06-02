const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✓ Connected to database:', result[0].version);
    
    // Try to get all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('Tables in database:');
    if (tables.length === 0) {
      console.log('  ⚠ No tables found! Schema needs to be pushed.');
    } else {
      tables.forEach((t, i) => console.log(`  ${i + 1}. ${t.table_name}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
