import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Change this to your actual Google email
  const YOUR_EMAIL = "dennis.s.favour@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email: YOUR_EMAIL },
  });

  if (!user) {
    console.log("❌ User not found. Make sure you've logged in at least once first.");
    return;
  }

  console.log(`✅ Found user: ${user.name} (${user.id})`);

  const updatedCompanies = await prisma.company.updateMany({
    where: { isDemo: true },
    data: { userId: user.id },
  });

  const updatedApps = await prisma.application.updateMany({
    where: { isDemo: true },
    data: { userId: user.id },
  });

  console.log(`✅ Claimed ${updatedCompanies.count} demo companies`);
  console.log(`✅ Claimed ${updatedApps.count} demo applications`);
  console.log('🎉 Done — log in and you should see the demo data.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });