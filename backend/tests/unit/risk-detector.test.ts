import { describe, it, expect } from 'vitest';
import { detectRisks } from '../../src/services/compatibility/risk-detector';

describe('RiskDetector', () => {
  it('detects skill redundancy', () => {
    const profiles = [
      {
        skills: [{ name: 'React', level: 'advanced', isPrimary: true }],
        goals: { projectTypes: [], interests: [] },
        completionStatus: 'complete',
        assessment: { completedAt: new Date(), skipped: false },
      },
      {
        skills: [{ name: 'React', level: 'intermediate', isPrimary: true }],
        goals: { projectTypes: [], interests: [] },
        completionStatus: 'complete',
        assessment: { completedAt: new Date(), skipped: false },
      },
    ] as never;

    const flags = detectRisks(profiles, {
      workStyleAlignment: 0.7,
      goalAlignment: 0.7,
      skillComplementarity: 0.5,
      communicationFit: 0.7,
    });

    expect(flags.some((f) => f.type === 'skill_redundancy')).toBe(true);
  });

  it('detects goal conflicts', () => {
    const profiles = [
      { skills: [], goals: { projectTypes: [], timeline: '3 months quick exit', interests: [] }, completionStatus: 'complete', assessment: null },
      { skills: [], goals: { projectTypes: [], timeline: '5 year research', interests: [] }, completionStatus: 'complete', assessment: null },
    ] as never;

    const flags = detectRisks(profiles, {
      workStyleAlignment: 0.5,
      goalAlignment: 0.3,
      skillComplementarity: 0.5,
      communicationFit: 0.5,
    });

    expect(flags.some((f) => f.type === 'goal_conflict')).toBe(true);
  });
});
