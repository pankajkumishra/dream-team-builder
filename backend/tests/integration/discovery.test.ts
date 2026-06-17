import { describe, it, expect } from 'vitest';
import { previewCompatibility } from '../../src/services/discovery/preview-scorer';

describe('discovery integration', () => {
  it('generates compatibility preview for two profiles', () => {
    const viewer = {
      skills: [{ name: 'React', level: 'advanced', isPrimary: true }],
      goals: { projectTypes: ['saas'], interests: [], commitmentLevel: 'full-time' },
      assessment: { dimensionScores: { collaboration: 0.8 } },
    };
    const candidate = {
      skills: [{ name: 'Node.js', level: 'advanced', isPrimary: true }],
      goals: { projectTypes: ['saas'], interests: [], commitmentLevel: 'part-time' },
      assessment: { dimensionScores: { collaboration: 0.6 } },
    };

    const preview = previewCompatibility(viewer as never, candidate as never);
    expect(preview.score).toBeGreaterThan(0);
    expect(preview.highlights.length).toBeGreaterThan(0);
  });
});
