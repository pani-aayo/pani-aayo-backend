import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '../../src/generated/prisma/client';

async function seedUsers(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: { code: 'superadmin' },
    update: {
      code: 'superadmin',
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('password', 10),
      userRoles: { create: { role: UserRole.ADMIN } },
    },
    create: {
      code: 'superadmin',
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: await bcrypt.hash('password', 10),
      userRoles: { create: { role: UserRole.ADMIN } },
    },
  });
}

export default seedUsers;
