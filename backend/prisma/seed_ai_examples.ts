import { PrismaClient } from '@prisma/client';

export async function seedAiExamples(prisma: PrismaClient) {
  const examples = [
    {
      id: 'ai-sales-assistant',
      title: 'Custom AI Sales Assistant',
      description: 'Built around your specific products & pricing logic',
      icon_emoji: '📈',
      is_published: true,
      display_order: 1,
    },
    {
      id: 'ai-operations-app',
      title: 'Internal Operations App',
      description: 'Following your exact approval flows & processes',
      icon_emoji: '📋',
      is_published: true,
      display_order: 2,
    },
    {
      id: 'ai-onboarding-bot',
      title: 'AI-Powered Client Onboarding',
      description: 'Tailored to your specific service delivery',
      icon_emoji: '👋',
      is_published: true,
      display_order: 3,
    },
    {
      id: 'ai-reporting-tool',
      title: 'Custom Intelligence & Reporting Tool',
      description: 'Built for your KPIs and business data',
      icon_emoji: '📊',
      is_published: true,
      display_order: 4,
    },
    {
      id: 'ai-whatsapp-integration',
      title: 'WhatsApp Business API Integration',
      description: 'AI-powered customer communication & automation',
      icon_emoji: '💬',
      is_published: true,
      display_order: 5,
    },
    {
      id: 'ai-customer-support',
      title: 'Customer Service Transformation',
      description: 'Zendesk, Intercom, or any support platform with AI',
      icon_emoji: '🎧',
      is_published: true,
      display_order: 6,
    },
  ];

  for (const ex of examples) {
    await prisma.cmsAiExample.upsert({
      where: { id: ex.id },
      update: ex,
      create: ex,
    });
  }

  console.log(`✅ Seeded ${examples.length} AI implementation examples`);
}
