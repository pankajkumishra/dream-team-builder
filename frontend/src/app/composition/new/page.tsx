'use client';

import { useState } from 'react';
import { CompositionResults } from '@/features/composition/CompositionResults';

export default function CompositionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/v1/compositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectIntent: {
          title: form.get('title'),
          domain: form.get('domain'),
          stage: form.get('stage'),
          description: form.get('description'),
          timeline: form.get('timeline'),
          goals: String(form.get('goals')).split(',').map((s) => s.trim()).filter(Boolean),
        },
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Team composition recommendations</h1>
      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Project title</label>
          <input id="title" name="title" required className="input-field mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium">Domain</label>
            <select id="domain" name="domain" className="input-field mt-1">
              <option value="saas">SaaS</option>
              <option value="research">Research</option>
              <option value="hackathon">Hackathon</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="stage" className="block text-sm font-medium">Stage</label>
            <select id="stage" name="stage" className="input-field mt-1">
              <option value="idea">Idea</option>
              <option value="mvp">MVP</option>
              <option value="growth">Growth</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea id="description" name="description" required className="input-field mt-1" rows={3} />
        </div>
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium">Timeline</label>
          <input id="timeline" name="timeline" className="input-field mt-1" placeholder="6 months" />
        </div>
        <div>
          <label htmlFor="goals" className="block text-sm font-medium">Goals (comma-separated)</label>
          <input id="goals" name="goals" className="input-field mt-1" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Generating...' : 'Get recommendations'}
        </button>
      </form>
      {result && (
        <div className="mt-6">
          <CompositionResults result={result as Parameters<typeof CompositionResults>[0]['result']} />
        </div>
      )}
    </div>
  );
}
