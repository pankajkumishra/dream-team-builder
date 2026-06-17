import { describe, it, expect } from 'vitest';
import { ProfileUpdateSchema, SkillSchema } from './profile';

describe('ProfileSchema', () => {
  it('validates a skill', () => {
    const result = SkillSchema.parse({ name: 'TypeScript', level: 'advanced', isPrimary: true });
    expect(result.name).toBe('TypeScript');
  });

  it('rejects invalid skill level', () => {
    expect(() => SkillSchema.parse({ name: 'X', level: 'invalid', isPrimary: false })).toThrow();
  });

  it('validates profile update', () => {
    const result = ProfileUpdateSchema.parse({
      headline: 'Founder',
      skills: [{ name: 'React', level: 'intermediate', isPrimary: true }],
    });
    expect(result.headline).toBe('Founder');
  });

  it('rejects headline over 120 chars', () => {
    expect(() => ProfileUpdateSchema.parse({ headline: 'x'.repeat(121) })).toThrow();
  });
});
