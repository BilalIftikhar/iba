import { PrismaClient } from '@prisma/client';
import { seedAiExamples } from './seed_ai_examples';
import { seedAppTemplates } from './seed_app_templates';
import { seedAutomationTemplates } from './seed_templates';
import { seedUsers } from './seed_users';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await seedUsers(prisma);
    await seedAiExamples(prisma);
    await seedAppTemplates(prisma);
    await seedAutomationTemplates(prisma);
    
    console.log('✨ Seeding finished successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
