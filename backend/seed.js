const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const passwordHash = await bcrypt.hash('Admin@123!', 10);

  // Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@primeauth.com' },
    update: {},
    create: {
      email: 'admin@primeauth.com',
      name: 'Platform Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // Regular User
  const user = await prisma.user.upsert({
    where: { email: 'user@primeauth.com' },
    update: {},
    create: {
      email: 'user@primeauth.com',
      name: 'Regular User',
      passwordHash,
      role: 'USER',
    },
  });

  // Tasks
  await prisma.task.create({
    data: {
      title: 'Review System Logs',
      description: 'Check for any anomalous activities in the last 24 hours.',
      status: 'PENDING',
      priority: 'HIGH',
      userId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Complete Onboarding',
      description: 'Finish the mandatory security training.',
      status: 'PENDING',
      priority: 'MEDIUM',
      userId: user.id,
    },
  });

  console.log('Seeding completed. Users: admin@primeauth.com, user@primeauth.com. Password: Admin@123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
