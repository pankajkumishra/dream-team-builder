import { describe, it, expect } from 'vitest';
import { AssessmentUpdateSchema } from './assessment';

describe('AssessmentSchema', () => {
  it('validates assessment responses', () => {
    const result = AssessmentUpdateSchema.parse({
      responses: { q1: 4, q2: 3 },
      submit: false,
    });
    expect(result.responses.q1).toBe(4);
  });

  it('rejects out-of-range likert values', () => {
    expect(() =>
      AssessmentUpdateSchema.parse({ responses: { q1: 6 }, submit: false }),
    ).toThrow();
  });
});
