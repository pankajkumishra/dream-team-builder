import type { ProjectDomain } from '@prisma/client';

export interface RoleTemplate {
  title: string;
  prioritySkills: string[];
  idealTraits: string[];
}

export const ROLE_TEMPLATES: Record<ProjectDomain, RoleTemplate[]> = {
  saas: [
    { title: 'Product Lead', prioritySkills: ['product management', 'user research'], idealTraits: ['structured', 'user-focused'] },
    { title: 'Backend Engineer', prioritySkills: ['Node.js', 'PostgreSQL', 'API design'], idealTraits: ['reliable', 'detail-oriented'] },
    { title: 'Frontend Engineer', prioritySkills: ['React', 'TypeScript', 'UX'], idealTraits: ['creative', 'collaborative'] },
    { title: 'Go-to-Market Lead', prioritySkills: ['sales', 'marketing', 'growth'], idealTraits: ['communicative', 'persistent'] },
  ],
  research: [
    { title: 'Research Lead', prioritySkills: ['methodology', 'data analysis'], idealTraits: ['rigorous', 'patient'] },
    { title: 'Domain Expert', prioritySkills: ['subject expertise', 'writing'], idealTraits: ['curious', 'thorough'] },
    { title: 'Technical Contributor', prioritySkills: ['programming', 'statistics'], idealTraits: ['analytical', 'collaborative'] },
  ],
  hackathon: [
    { title: 'Full-Stack Developer', prioritySkills: ['React', 'Node.js', 'rapid prototyping'], idealTraits: ['fast-paced', 'adaptable'] },
    { title: 'Designer', prioritySkills: ['UI/UX', 'Figma'], idealTraits: ['creative', 'user-focused'] },
    { title: 'Pitch Lead', prioritySkills: ['presentation', 'storytelling'], idealTraits: ['communicative', 'energetic'] },
  ],
  student: [
    { title: 'Project Lead', prioritySkills: ['coordination', 'documentation'], idealTraits: ['organized', 'reliable'] },
    { title: 'Technical Lead', prioritySkills: ['programming', 'problem solving'], idealTraits: ['dedicated', 'collaborative'] },
    { title: 'Research/Analysis', prioritySkills: ['research', 'writing'], idealTraits: ['thorough', 'curious'] },
  ],
  other: [
    { title: 'Team Lead', prioritySkills: ['leadership', 'communication'], idealTraits: ['organized', 'decisive'] },
    { title: 'Technical Specialist', prioritySkills: ['domain expertise'], idealTraits: ['skilled', 'reliable'] },
    { title: 'Operations', prioritySkills: ['planning', 'coordination'], idealTraits: ['structured', 'detail-oriented'] },
  ],
};
