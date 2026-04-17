import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const adminPassword = 'adminpassword123'; // Default password for the seeded admin
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = {
    email: 'admin@iba.si',
    password_hash: hashedPassword,
    first_name: 'IBA',
    last_name: 'Admin',
    company_name: 'IBA',
    role: UserRole.superadmin,
    hourly_rate: 0,
    notification_preferences: { email: true, whatsapp: false },
  };

  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {},
    create: adminUser,
  });

  console.log('✅ Seeded admin user: admin@iba.si');
  console.log(`🔑 Password is: ${adminPassword}`);
}
