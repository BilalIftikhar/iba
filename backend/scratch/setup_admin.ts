import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@iba.si';
    const password = 'admin123';
    
    console.log(`Checking for user: ${email}...`);
    
    let user = await prisma.user.findUnique({
        where: { email }
    });
    
    if (user) {
        console.log(`User found! Updating password to: ${password}`);
        const password_hash = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { email },
            data: { password_hash }
        });
        console.log('Password updated successfully.');
    } else {
        console.log(`User not found. Creating user: ${email} with password: ${password}`);
        const password_hash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password_hash,
                first_name: 'Admin',
                last_name: 'IBA',
                hourly_rate: 0
            }
        });
        console.log('User created successfully.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
