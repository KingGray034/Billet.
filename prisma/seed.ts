import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  const companies = await Promise.all([
    prisma.company.create({
      data: { name: 'Google', website: 'https://careers.google.com', industry: 'Technology' },
    }),
    prisma.company.create({
      data: { name: 'Meta', website: 'https://www.metacareers.com', industry: 'Technology' },
    }),
    prisma.company.create({
      data: { name: 'Amazon', website: 'https://www.amazon.jobs', industry: 'E-commerce' },
    }),
    prisma.company.create({
      data: { name: 'Microsoft', website: 'https://careers.microsoft.com', industry: 'Technology' },
    }),
    prisma.company.create({
      data: { name: 'Netflix', website: 'https://jobs.netflix.com', industry: 'Entertainment' },
    }),
  ]);

  console.log('✅ Created 5 companies');

  await Promise.all([
    prisma.application.create({
      data: {
        position: 'Senior Frontend Engineer',
        companyId: companies[0].id,
        status: 'PENDING',
        dateApplied: new Date('2024-04-01'),
        location: 'Mountain View, CA',
        salary: '$180k - $250k',
        jobDescription: 'Build next-generation web applications using React, TypeScript, and modern tools.',
        notes: 'Great company culture',
      },
    }),
    prisma.application.create({
      data: {
        position: 'Backend Engineer',
        companyId: companies[2].id,
        status: 'APPLIED',
        dateApplied: new Date('2024-03-25'),
        location: 'Seattle, WA',
        salary: '$170k - $240k',
        contactEmail: 'recruiting@amazon.com',
        jobDescription: 'Build scalable microservices for AWS.',
        notes: 'Applied through referral',
      },
    }),
    prisma.application.create({
      data: {
        position: 'Software Engineer',
        companyId: companies[4].id,
        status: 'SCREENING',
        dateApplied: new Date('2024-03-20'),
        location: 'Los Gatos, CA',
        salary: '$175k - $235k',
        contactEmail: 'talent@netflix.com',
        jobDescription: 'Work on Netflix streaming platform.',
        notes: 'Phone screening next week',
      },
    }),
    prisma.application.create({
      data: {
        position: 'Product Manager',
        companyId: companies[0].id,
        status: 'INTERVIEW',
        dateApplied: new Date('2024-03-15'),
        location: 'Remote',
        salary: '$140k - $190k',
        contactEmail: 'pm-hiring@google.com',
        jobDescription: 'Lead product strategy for Google Cloud.',
        notes: 'Final round next week',
      },
    }),
    prisma.application.create({
      data: {
        position: 'Data Scientist',
        companyId: companies[2].id,
        status: 'OFFER',
        dateApplied: new Date('2024-03-10'),
        location: 'New York, NY',
        salary: '$155k + equity',
        contactEmail: 'offers@amazon.com',
        jobDescription: 'ML models for content recommendation.',
        notes: 'Negotiating compensation',
      },
    }),
    prisma.application.create({
      data: {
        position: 'UX Designer',
        companyId: companies[3].id,
        status: 'ACCEPTED',
        dateApplied: new Date('2024-02-28'),
        location: 'San Francisco, CA',
        salary: '$130k - $170k',
        jobDescription: 'Design user experiences for Microsoft 365.',
        notes: 'Start date: May 1st',
      },
    }),
    prisma.application.create({
      data: {
        position: 'Security Engineer',
        companyId: companies[4].id,
        status: 'REJECTED',
        dateApplied: new Date('2024-03-05'),
        location: 'Austin, TX',
        salary: '$145k - $200k',
        jobDescription: 'Secure streaming infrastructure.',
        notes: 'Need more cloud security experience',
      },
    }),
  ]);

  console.log('✅ Created 7 applications');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });