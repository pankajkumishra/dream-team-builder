'use client';

import { useState } from 'react';
import type { Skill } from '@dream-team/shared';
import { profileApi } from '../profile.api';

export function SkillsStep({ onComplete }: { onComplete: () => void }) {
  const [skills, setSkills] = useState<Skill[]>([{ name: '', level: 'intermediate', isPrimary: true }]);
  const [headline, setHeadline] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await profileApi.updateMe({
      headline,
      skills: skills.filter((s) => s.name.trim()),
    });
    setSaving(false);
    onComplete();
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Your skills</h2>
      <div>
        <label htmlFor="headline" className="block text-sm font-medium">Headline</label>
        <input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} className="input-field mt-1" placeholder="Full-stack founder" />
      </div>
      {skills.map((skill, i) => (
        <div key={i} className="flex gap-2">
          <input
            aria-label={`Skill ${i + 1} name`}
            value={skill.name}
            onChange={(e) => {
              const next = [...skills];
              next[i] = { ...next[i], name: e.target.value };
              setSkills(next);
            }}
            className="input-field"
            placeholder="Skill name"
          />
          <select
            aria-label={`Skill ${i + 1} level`}
            value={skill.level}
            onChange={(e) => {
              const next = [...skills];
              next[i] = { ...next[i], level: e.target.value as Skill['level'] };
              setSkills(next);
            }}
            className="input-field w-40"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={() => setSkills([...skills, { name: '', level: 'intermediate', isPrimary: false }])} className="btn-secondary text-sm">
        Add skill
      </button>
      <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : 'Save & continue'}
      </button>
    </div>
  );
}
