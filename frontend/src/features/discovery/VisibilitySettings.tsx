'use client';

import { useState } from 'react';

export function VisibilitySettings() {
  const [discoverable, setDiscoverable] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await fetch('/api/v1/profiles/me/visibility', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discoverable,
        showSkills: true,
        showGoals: true,
        showAssessmentSummary: true,
        showPastProjects: false,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card">
      <h2 className="font-semibold">Visibility settings</h2>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={discoverable}
          onChange={(e) => setDiscoverable(e.target.checked)}
        />
        Appear in teammate discovery
      </label>
      <button type="button" onClick={handleSave} className="btn-primary mt-4 w-full text-sm">
        Save settings
      </button>
      {saved && <p className="mt-2 text-sm text-green-600" role="status">Saved!</p>}
    </div>
  );
}
