import { describe, it, expect } from 'vitest';
import { computeCompletionStatus } from '../../src/services/profile/completion.service';

describe('profile integration', () => {
  it('computes complete status when all sections present', () => {
    const status = computeCompletionStatus(
      {
        skills: [{ name: 'React', level: 'advanced', isPrimary: true }],
        goals: { projectTypes: ['saas'], interests: ['AI'], timeline: '6 months' },
      },
      { completedAt: new Date(), skipped: false } as never,
      1,
    );
    expect(status).toBe('complete');
  });
});
