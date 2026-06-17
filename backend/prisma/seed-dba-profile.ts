import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'dba.expert@example.com';
  const password = 'Password123!';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: 'Jordan Data Architect',
      passwordHash,
      profile: {
        create: {
          headline: 'Database architect & DBA',
          bio: 'Specialist in SQL Server and PostgreSQL administration, schema design, and enterprise data architecture.',
          skills: [
            { name: 'SQL Server', level: 'expert', isPrimary: true },
            { name: 'PostgreSQL Admin', level: 'expert', isPrimary: true },
            { name: 'DB Architect', level: 'expert', isPrimary: false },
            { name: 'Database Design', level: 'advanced', isPrimary: false },
          ],
          experienceYears: 12,
          expertiseAreas: ['database', 'data architecture', 'backend'],
          goals: {
            projectTypes: ['saas', 'research'],
            timeline: '1 year',
            commitmentLevel: 'full-time',
            interests: ['data modeling', 'performance tuning', 'cloud databases'],
          },
          workStyleSummary:
            'You are a detail-oriented database professional who values structured planning, data integrity, and reliable system design.',
          completionStatus: 'partial',
        },
      },
      visibilitySettings: {
        create: {
          discoverable: true,
          showSkills: true,
          showGoals: true,
          showAssessmentSummary: true,
        },
      },
    },
    update: {
      name: 'Jordan Data Architect',
      passwordHash,
    },
    include: { profile: true },
  });

  if (user.profile) {
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        headline: 'Database architect & DBA',
        bio: 'Specialist in SQL Server and PostgreSQL administration, schema design, and enterprise data architecture.',
        skills: [
          { name: 'SQL Server', level: 'expert', isPrimary: true },
          { name: 'PostgreSQL Admin', level: 'expert', isPrimary: true },
          { name: 'DB Architect', level: 'expert', isPrimary: false },
          { name: 'Database Design', level: 'advanced', isPrimary: false },
        ],
        experienceYears: 12,
        expertiseAreas: ['database', 'data architecture', 'backend'],
        goals: {
          projectTypes: ['saas', 'research'],
          timeline: '1 year',
          commitmentLevel: 'full-time',
          interests: ['data modeling', 'performance tuning', 'cloud databases'],
        },
        workStyleSummary:
          'You are a detail-oriented database professional who values structured planning, data integrity, and reliable system design.',
        completionStatus: 'partial',
      },
    });
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  console.log('Profile created/updated successfully');
  console.log('---');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Profile ID:', profile?.id);
  console.log('Skills:', JSON.stringify(profile?.skills, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
