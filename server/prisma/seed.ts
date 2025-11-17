import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.vote.deleteMany()
  await prisma.pollOption.deleteMany()
  await prisma.poll.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for registered users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create sample users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      isGuest: false
    }
  })

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      isGuest: false
    }
  })

  const guest = await prisma.user.create({
    data: {
      name: 'Guest User',
      email: 'guest_temp@guest.local',
      password: null,
      isGuest: true
    }
  })

  console.log('✅ Created 3 users (2 registered, 1 guest)')

  // Create sample polls
  const poll1 = await prisma.poll.create({
    data: {
      question: 'What is your favorite programming language?',
      authorId: alice.id,
      options: {
        create: [
          { text: 'JavaScript' },
          { text: 'Python' },
          { text: 'TypeScript' },
          { text: 'Go' }
        ]
      }
    },
    include: { options: true }
  })

  const poll2 = await prisma.poll.create({
    data: {
      question: 'Best frontend framework?',
      authorId: bob.id,
      options: {
        create: [
          { text: 'React' },
          { text: 'Vue' },
          { text: 'Angular' },
          { text: 'Svelte' }
        ]
      }
    },
    include: { options: true }
  })

  console.log('✅ Created 2 polls')

  // Create some votes
  await prisma.vote.create({
    data: {
      userId: bob.id,
      pollId: poll1.id,
      optionId: poll1.options[2].id // TypeScript
    }
  })

  await prisma.vote.create({
    data: {
      userId: alice.id,
      pollId: poll2.id,
      optionId: poll2.options[0].id // React
    }
  })

  await prisma.vote.create({
    data: {
      userId: guest.id,
      pollId: poll1.id,
      optionId: poll1.options[0].id // JavaScript
    }
  })

  console.log('✅ Created 3 votes')
  console.log('\n📋 Sample credentials:')
  console.log('  Email: alice@example.com | Password: password123')
  console.log('  Email: bob@example.com | Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })