import { PrismaClient } from '@prisma/client';

export async function seedAppTemplates(prisma: PrismaClient) {
  const templates = [
    {
      title: 'Client Portal',
      category: 'Business Operations',
      icon: '🤝',
      short_description: 'Manage tasks, share files, track invoices',
      full_description: 'A centralized client-facing portal that consolidates project management, file sharing, and invoice tracking into a single polished dashboard. Features role-based access control, real-time notifications, and seamless integration with existing tools.',
      use_case: 'I need a Client Portal app. Secure dashboard for my clients to view documents, track project progress, share files, and manage invoices. Should include role-based access, real-time notifications, and activity logs.',
      roi_yearly: '$6,000',
      delivery_time: '10–14 days',
      difficulty: 'Medium',
      key_features: 'Project & task tracker\nFile sharing & approvals\nInvoice & payment history\nClient-specific dashboards\nActivity logging',
      data_sources: 'Airtable, Notion, Stripe, HubSpot',
      is_published: true,
      display_order: 1,
      bookings_count: 4,
    },
    {
      title: 'Inventory Management',
      category: 'Operations',
      icon: '📦',
      short_description: 'Track stock levels, suppliers, reorder points',
      full_description: 'End-to-end inventory management system with real-time stock tracking, automated reorder alerts, multi-location support, and supplier management. Integrates directly with your existing databases and spreadsheets.',
      use_case: 'I need an Inventory Management app. Track stock levels in real-time across multiple locations, manage suppliers, set automated reorder points, and generate inventory reports with insights.',
      roi_yearly: '$8,400',
      delivery_time: '12–16 days',
      difficulty: 'Medium',
      key_features: 'Real-time stock tracking\nMulti-location support\nAutomated reorder alerts\nSupplier management\nInventory analytics',
      data_sources: 'Airtable, Google Sheets, SQL databases, Xano',
      is_published: true,
      display_order: 2,
      bookings_count: 2,
    },
    {
      title: 'Employee Onboarding',
      category: 'HR & People',
      icon: '👋',
      short_description: 'Guide new hires through documents, training',
      full_description: 'A comprehensive onboarding platform that walks new employees through paperwork, training modules, and team introductions. Features progress tracking, document e-signing, and automated task assignment.',
      use_case: 'I need an Employee Onboarding app. Streamline the new hire process with step-by-step checklists, document e-signing, training module tracking, and team introductions. Should support multiple departments.',
      roi_yearly: '$4,800',
      delivery_time: '8–12 days',
      difficulty: 'Easy',
      key_features: 'Step-by-step onboarding checklist\nDocument e-signing\nTraining module tracker\nDepartment-specific flows\nProgress dashboard',
      data_sources: 'Notion, Airtable, Google Sheets, HubSpot',
      is_published: true,
      display_order: 3,
      bookings_count: 1,
    },
  ];

  for (const t of templates) {
    await prisma.cmsAppTemplate.upsert({
      where: { id: t.title.toLowerCase().replace(/\s+/g, '-') },
      update: t,
      create: { ...t, id: t.title.toLowerCase().replace(/\s+/g, '-') },
    });
  }

  console.log(`✅ Seeded ${templates.length} app templates`);
}
