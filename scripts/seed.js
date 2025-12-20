const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const users = [
    {
      email: 'haftom@example.com',
      name: 'Haftom Gidey',
      password: await bcrypt.hash('password123', 10),
      picture: 'https://ui-avatars.com/api/?name=haftom+Gidey&background=2DD4BF&color=fff',
    },
    {
      email: 'yohannes@example.com',
      name: 'Yohannes Dillo',
      password: await bcrypt.hash('password123', 10),
      picture: 'https://ui-avatars.com/api/?name=Yohannes+Dillo&background=2DD4BF&color=fff',
    },
    {
      email: 'bsery@example.com',
      name: 'Bsery Adem',
      password: await bcrypt.hash('password123', 10),
      picture: 'https://ui-avatars.com/api/?name=Bsery+Adem&background=2DD4BF&color=fff',
    },
    {
      email: 'gebre@example.com',
      name: 'Gebre Hadgu',
      password: await bcrypt.hash('password123', 10),
      picture: 'https://ui-avatars.com/api/?name=Gebre+Hadgu&background=2DD4BF&color=fff',
    },
    
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
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
