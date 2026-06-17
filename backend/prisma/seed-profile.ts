import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'dotnet.dev@example.com';
  const password = 'Password123!';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: 'Alex Developer',
      passwordHash,
      profile: {
        create: {
          headline: '.NET full-stack developer',
          bio: 'Experienced C# and ASP.NET developer building modern web applications.',
          skills: [
            { name: '.NET', level: 'expert', isPrimary: true },
            { name: 'C#', level: 'expert', isPrimary: true },
            { name: 'Web App Development', level: 'advanced', isPrimary: false },
            { name: 'ASP.NET Core', level: 'advanced', isPrimary: false },
          ],
          experienceYears: 8,
          expertiseAreas: ['backend', 'web', 'api'],
          goals: {
            projectTypes: ['saas', 'hackathon'],
            timeline: '6 months',
            commitmentLevel: 'full-time',
            interests: ['web apps', 'cloud', 'microservices'],
          },
          workStyleSummary:
            'You are a structured, collaborative developer who thrives building reliable web applications with .NET and C#.',
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
      name: 'Alex Developer',
      passwordHash,
    },
    include: { profile: true },
  });

  if (user.profile) {
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        headline: '.NET full-stack developer',
        bio: 'Experienced C# and ASP.NET developer building modern web applications.',
        skills: [
          { name: '.NET', level: 'expert', isPrimary: true },
          { name: 'C#', level: 'expert', isPrimary: true },
          { name: 'Web App Development', level: 'advanced', isPrimary: false },
          { name: 'ASP.NET Core', level: 'advanced', isPrimary: false },
        ],
        experienceYears: 8,
        expertiseAreas: ['backend', 'web', 'api'],
        goals: {
          projectTypes: ['saas', 'hackathon'],
          timeline: '6 months',
          commitmentLevel: 'full-time',
          interests: ['web apps', 'cloud', 'microservices'],
        },
        workStyleSummary:
          'You are a structured, collaborative developer who thrives building reliable web applications with .NET and C#.',
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
