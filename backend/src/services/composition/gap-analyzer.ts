import type { Profile } from '@prisma/client';
import { parseSkills } from '../profile/completion.service';
import type { RoleTemplate } from './role-templates';

export function analyzeGaps(
  templates: RoleTemplate[],
  existingProfiles: Profile[],
) {
  const filledRoles: { title: string; coveredBy?: string }[] = [];
  const gapRoles: { title: string; priority?: string }[] = [];

  const existingSkills = new Set(
    existingProfiles.flatMap((p) =>
      parseSkills(p.skills).map((s) => s.name.toLowerCase()),
    ),
  );

  for (const role of templates) {
    const covered = role.prioritySkills.some((skill) =>
      existingSkills.has(skill.toLowerCase()),
    );
    if (covered && existingProfiles.length > 0) {
      filledRoles.push({ title: role.title, coveredBy: existingProfiles[0]?.id });
    } else {
      gapRoles.push({ title: role.title, priority: 'high' });
    }
  }

  return { filledRoles, gapRoles };
}
