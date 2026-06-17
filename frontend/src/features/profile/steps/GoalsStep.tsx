'use client';

import { useState } from 'react';
import { profileApi } from '../profile.api';

export function GoalsStep({ onComplete }: { onComplete: () => void }) {
  const [timeline, setTimeline] = useState('');
  const [commitmentLevel, setCommitmentLevel] = useState<'part-time' | 'full-time' | 'flexible'>('flexible');
  const [projectTypes, setProjectTypes] = useState('');
  const [interests, setInterests] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await profileApi.updateMe({
      goals: {
        timeline,
        commitmentLevel,
        projectTypes: projectTypes.split(',').map((s) => s.trim()).filter(Boolean),
        interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
      },
    });
    setSaving(false);
    onComplete();
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Goals & interests</h2>
      <div>
        <label htmlFor="projectTypes" className="block text-sm font-medium">Project types (comma-separated)</label>
        <input id="projectTypes" value={projectTypes} onChange={(e) => setProjectTypes(e.target.value)} className="input-field mt-1" placeholder="saas, research, hackathon" />
      </div>
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium">Timeline</label>
        <input id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className="input-field mt-1" placeholder="6 months" />
      </div>
      <div>
        <label htmlFor="commitment" className="block text-sm font-medium">Commitment level</label>
        <select id="commitment" value={commitmentLevel} onChange={(e) => setCommitmentLevel(e.target.value as typeof commitmentLevel)} className="input-field mt-1">
          <option value="part-time">Part-time</option>
          <option value="full-time">Full-time</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium">Interests (comma-separated)</label>
        <input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} className="input-field mt-1" placeholder="AI, climate, education" />
      </div>
      <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : 'Save & continue'}
      </button>
    </div>
  );
}
