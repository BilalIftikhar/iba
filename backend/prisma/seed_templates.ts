import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    title: 'Social Media Scheduler',
    type: 'Marketing',
    short_description: 'Automatically generates, formats and schedules posts across LinkedIn, X, and Instagram based on your URL input.',
    full_description: 'Streamline your brand presence across all major platforms. This agent crawl your provided URLs (blogs, news, or site pages), extracts key value propositions, and generates optimized social posts with platform-specific hashtags and formatting. Integrated directly with Buffer or Hootsuite for instant scheduling.',
    use_case: 'Automatically generate and schedule social media content for multiple platforms using AI-powered content extraction from any webpage.',
    time_saved_weekly: '12h/week',
    roi_yearly: '4.2x ROI',
    tools: 'LinkedIn, X (Twitter), Instagram, OpenAI, Buffer',
    run_schedule: 'Daily at 9:00 AM',
    bookings_count: 12,
    difficulty: 'Easy',
    setup_time: '2-3 days',
    display_order: 1
  },
  {
    title: 'Email Campaign Manager',
    type: 'Sales',
    short_description: 'Personalized outreach at scale. Analyzes lead profiles to craft custom opening lines and follows up intelligently.',
    full_description: 'Stop sending generic cold emails. This automation researches your prospects using LinkedIn and company websites to write truly personalized outreach. It handles initial contact, monitors replies, and only notifies you when a lead is "warm" and ready for a meeting.',
    use_case: 'Automated sales outreach with deep personalization using web scraping and GPT-4 to improve response rates.',
    time_saved_weekly: '20h/week',
    roi_yearly: '8.5x ROI',
    tools: 'Gmail, Apollo.io, LinkedIn, OpenAI, HubSpot',
    run_schedule: 'Real-time on trigger',
    bookings_count: 45,
    difficulty: 'Hard',
    setup_time: '7-10 days',
    display_order: 2
  },
  {
    title: 'Weekly KPI Digest',
    type: 'Reporting',
    short_description: 'Aggregates data from Stripe, GA4, and Shopify to create an executive summary with trend analysis.',
    full_description: 'Get a clear view of your business performance without opening ten different dashboards. This agent connects to your financial and marketing tools, identifies key trends (e.g., CAC spikes or MRR growth), and delivers a concise summary to your Slack or Email every Monday morning.',
    use_case: 'Cross-platform data aggregation and automated business intelligence reporting for leadership teams.',
    time_saved_weekly: '5h/week',
    roi_yearly: '3.0x ROI',
    tools: 'Stripe, GA4, Shopify, Google Sheets, Slack',
    run_schedule: 'Every Monday at 8:00 AM',
    bookings_count: 8,
    difficulty: 'Medium',
    setup_time: '3-5 days',
    display_order: 3
  },
  {
    title: 'Blog Post Generator',
    type: 'Content',
    short_description: 'Transform long-form video or audio into SEO-optimized blog posts with custom tone and style matching.',
    full_description: 'Turn your existing content into a SEO machine. Provide a YouTube link or a podcast recording, and this automation will transcribe the audio, identify the main topics, and write a 1,500+ word blog post that matches your brand voice perfectly—complete with meta descriptions and header formatting.',
    use_case: 'Multi-channel content repurposing using Whisper for transcription and Claude 3 for high-quality long-form writing.',
    time_saved_weekly: '15h/week',
    roi_yearly: '5.2x ROI',
    tools: 'YouTube API, OpenAI Whisper, Claude 3, WordPress',
    run_schedule: 'On demand / webhook',
    bookings_count: 18,
    difficulty: 'Medium',
    setup_time: '4-6 days',
    display_order: 4
  },
  {
    title: 'Customer Ticket Auto-Replier',
    type: 'HR & Recruitment',
    short_description: 'Connects to Zendesk or Intercom to draft high-quality responses for Level 1 support queries automatically.',
    full_description: 'Provide instant support to your customers 24/7. This agent trained on your documentation and past successful tickets drafts responses to common questions. It can either reply directly or leave the response as a private note for your team to review and approve with one click.',
    use_case: 'Self-serve customer support automation using RAG (Retrieval Augmented Generation) on your knowledge base.',
    time_saved_weekly: '30h/week',
    roi_yearly: '12.4x ROI',
    tools: 'Zendesk, Intercom, OpenAI, Pinecone (Vector DB)',
    run_schedule: 'Real-time (Webhook)',
    bookings_count: 120,
    difficulty: 'Hard',
    setup_time: '10-14 days',
    display_order: 5
  },
  {
    title: 'Automated Invoice Processing',
    type: 'Finance',
    short_description: 'Extracts data from PDF invoices using OCR and automatically reconciles them with your accounting software.',
    full_description: 'Eliminate manual data entry for your accounts payable. This automation monitors your billing email, extracts vendor details, amounts, and dates from PDF attachments using advanced OCR, and maps them directly into your accounting system like Xero or QuickBooks for approval.',
    use_case: 'Financial operations automation using OCR and intelligent document processing (IDP).',
    time_saved_weekly: '18h/week',
    roi_yearly: '6.8x ROI',
    tools: 'Gmail API, AWS Textract, Xero, Google Drive',
    run_schedule: 'Real-time on email receipt',
    bookings_count: 22,
    difficulty: 'Medium',
    setup_time: '5-7 days',
    display_order: 6
  }
];

async function main() {
  console.log('Clearing existing templates...');
  await prisma.cmsAutomationTemplate.deleteMany({});

  console.log(`Seeding ${templates.length} templates...`);
  for (const t of templates) {
    await prisma.cmsAutomationTemplate.create({
      data: t
    });
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
