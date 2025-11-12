import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.user.deleteMany()

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Smith',
        email: 'bob@example.com'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie@example.com'
      }
    })
  ])

  console.log('✅ Database seeded with 3 users')
  console.log(users)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })