const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Delete existing seeded users (only the test users, not all users)
  const testEmails = [
    'haftom@example.com',
    'yohannes@example.com',
    'bsery@example.com',
    'gebre@example.com',
  ]

  console.log('🗑️  Deleting existing seeded users...')
  const deleteResult = await prisma.user.deleteMany({
    where: {
      email: {
        in: testEmails,
      },
    },
  })
  console.log(`✅ Deleted ${deleteResult.count} existing seeded users`)

  // Create test users without pictures
  const users = [
    {
      email: 'haftom@example.com',
      name: 'Haftom Gidey',
      password: await bcrypt.hash('password123', 10),
      picture: null,
    },
    {
      email: 'yohannes@example.com',
      name: 'Yohannes Dillo',
      password: await bcrypt.hash('password123', 10),
      picture: null,
    },
    {
      email: 'bsery@example.com',
      name: 'Bsery Adem',
      password: await bcrypt.hash('password123', 10),
      picture: null,
    },
    {
      email: 'gebre@example.com',
      name: 'Gebre Hadgu',
      password: await bcrypt.hash('password123', 10),
      picture: null,
    },
  ]

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    })
    console.log(`✅ Created user: ${user.email}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
