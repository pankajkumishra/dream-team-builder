'use client';

import { useState } from 'react';
import { profileApi } from '../profile.api';

export function PastProjectsStep({ onComplete }: { onComplete: () => void }) {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await profileApi.addPastProject({ title, role, description, outcome: 'completed' });
    setSaving(false);
    onComplete();
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Past projects</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Project title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field mt-1" />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium">Your role</label>
        <input id="role" value={role} onChange={(e) => setRole(e.target.value)} className="input-field mt-1" placeholder="Lead developer" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field mt-1" rows={3} />
      </div>
      <button type="button" onClick={handleSave} disabled={saving || !title} className="btn-primary">
        {saving ? 'Saving...' : 'Save & finish'}
      </button>
    </div>
  );
}
