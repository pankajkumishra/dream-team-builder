import { describe, it, expect } from 'vitest';
import { analyzeGaps } from '../../src/services/composition/gap-analyzer';
import { ROLE_TEMPLATES } from '../../src/services/composition/role-templates';

describe('composition integration', () => {
  it('identifies gap roles when team is empty', () => {
    const { gapRoles } = analyzeGaps(ROLE_TEMPLATES.saas, []);
    expect(gapRoles.length).toBeGreaterThan(0);
  });
});
