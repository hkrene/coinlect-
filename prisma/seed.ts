import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'Admin'

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set (see .env.example).')
    process.exit(1)
  }

  const hashedPassword = await hashPassword(adminPassword)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      provider: 'local'
    },
  })

  console.log('Created admin account:', admin.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })