'use client';

import { useState } from 'react';
import { analysisApi } from '@/features/analysis/analysis.api';
import { AnalysisReport } from '@/features/analysis/AnalysisReport';

export default function NewAnalysisPage() {
  const [profileIds, setProfileIds] = useState('');
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const ids = profileIds.split(',').map((s) => s.trim()).filter(Boolean);
      const created = await analysisApi.create(ids) as { id: string };
      const result = await analysisApi.get(created.id);
      setReport(result as Record<string, unknown>);
    } catch {
      setError('Analysis failed. Ensure you have at least 2 valid profile IDs.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Team compatibility analysis</h1>
      <p className="mt-2 text-slate-600">Enter profile IDs (comma-separated) to analyze a team.</p>
      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label htmlFor="profileIds" className="block text-sm font-medium">Profile IDs</label>
          <input id="profileIds" value={profileIds} onChange={(e) => setProfileIds(e.target.value)} className="input-field mt-1" placeholder="uuid-1, uuid-2" required />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Analyzing...' : 'Run analysis'}
        </button>
      </form>
      {report && <div className="mt-6"><AnalysisReport report={report as Parameters<typeof AnalysisReport>[0]['report']} /></div>}
    </div>
  );
}
