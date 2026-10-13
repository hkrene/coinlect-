import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set (see .env.example).');
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists. Updating role to ADMIN...');
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: UserRole.ADMIN },
      });
      console.log('✅ User role updated to ADMIN');
      console.log('User:', updatedUser);
      return;
    }

    // Create new admin user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: UserRole.ADMIN,
        provider: 'local',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Role:', user.role);
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();