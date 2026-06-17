import { describe, it, expect } from 'vitest';
import { scoreTeam, computeSuccessProbability } from '../../src/services/compatibility/scorer';

const mockProfile = (overrides: Record<string, unknown> = {}) => ({
  id: '1',
  userId: 'u1',
  headline: null,
  bio: null,
  skills: [{ name: 'React', level: 'advanced', isPrimary: true }],
  experienceYears: 3,
  expertiseAreas: [],
  goals: { projectTypes: ['saas'], timeline: '6 months', interests: [] },
  workStyleSummary: null,
  completionStatus: 'complete' as const,
  profileVersion: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  assessment: {
    dimensionScores: { collaboration: 0.8, communication: 0.7, pace: 0.6 },
    completedAt: new Date(),
    skipped: false,
  },
  ...overrides,
});

describe('CompatibilityScorer', () => {
  it('scores a team of two profiles', () => {
    const p1 = mockProfile();
    const p2 = mockProfile({
      id: '2',
      userId: 'u2',
      skills: [{ name: 'Node.js', level: 'advanced', isPrimary: true }],
    });
    const scores = scoreTeam([p1, p2] as never);
    expect(scores.workStyleAlignment).toBeGreaterThan(0);
    expect(scores.skillComplementarity).toBeGreaterThan(0);
    const probability = computeSuccessProbability(scores);
    expect(probability).toBeGreaterThan(0);
    expect(probability).toBeLessThanOrEqual(100);
  });
});
