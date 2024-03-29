import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed data here
  await prisma.roles.create({
    data: {
      Name: 'Admin',
      Description: 'Administrator role',
    },
  })

  await prisma.faculties.create({
    data: {
      Name: 'Faculty 1',
      Description: 'Description for Faculty 1',
      IsEnabledGuest: false,
    },
  })

  await prisma.users.create({
    data: {
      Name: 'User 1',
      Password: 'password',
      Salt: 'salt',
      Email: 'user1@example.com',
    },
  })
  // Add more data as necessary
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })