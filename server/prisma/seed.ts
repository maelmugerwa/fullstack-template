import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.task.deleteMany();
  console.log('🗑️  Cleared existing tasks');

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the fullstack template project',
        completed: false,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        completed: true,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication system with login and registration',
        completed: false,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design database schema',
        description: 'Create and optimize database models for the application',
        completed: true,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write unit tests',
        description: 'Achieve 80% code coverage with comprehensive unit tests',
        completed: false,
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });