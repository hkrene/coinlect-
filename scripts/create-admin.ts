import { PrismaClient, UserRole } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

async function createAdmin() {
  const email = 'hirwarene6@gmail.com';
  const password = 'Holimonk.2004';
  const name = 'Admin User';

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
