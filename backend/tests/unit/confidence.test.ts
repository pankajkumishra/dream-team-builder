import { describe, it, expect } from 'vitest';
import { computeConfidence } from '../../src/services/compatibility/confidence';

describe('ConfidenceCalculator', () => {
  it('returns high confidence for complete profiles', () => {
    const profiles = [
      { completionStatus: 'complete', assessment: { completedAt: new Date(), skipped: false } },
      { completionStatus: 'complete', assessment: { completedAt: new Date(), skipped: false } },
    ] as never;
    expect(computeConfidence(profiles)).toBe('high');
  });

  it('returns low confidence when assessment skipped', () => {
    const profiles = [
      { completionStatus: 'complete', assessment: { completedAt: null, skipped: true } },
      { completionStatus: 'partial', assessment: null },
    ] as never;
    expect(computeConfidence(profiles)).toBe('low');
  });
});
