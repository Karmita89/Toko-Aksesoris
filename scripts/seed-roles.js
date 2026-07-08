const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function ensureUser(email, password, role, name) {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    console.log(`User already exists: ${email} (${existingUser.role})`)
    return existingUser
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  })

  console.log(`Created user: ${email} (${role})`)
  return user
}

async function main() {
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@akschim.com'
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@akschim.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const userEmail = process.env.USER_EMAIL || 'user@akschim.com'
  const userPassword = process.env.USER_PASSWORD || 'User123!'

  await ensureUser(superadminEmail, superadminPassword, 'SUPERADMIN', 'Super Admin')
  await ensureUser(adminEmail, adminPassword, 'ADMIN', 'Admin')
  await ensureUser(userEmail, userPassword, 'USER', 'Regular User')
}

main()
  .catch((error) => {
    console.error('Seed roles failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
