'use client';

import { useEffect, useState } from 'react';
import { EmptyDiscovery } from '@/features/discovery/EmptyDiscovery';
import { VisibilitySettings } from '@/features/discovery/VisibilitySettings';

interface DiscoveryResult {
  profileId: string;
  headline: string | null;
  compatibilityPreview: { score: number; highlights: string[] };
}

export default function DiscoveryPage() {
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [guidance, setGuidance] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/discovery')
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results ?? []);
        setGuidance(data.guidance);
        setLoading(false);
      });
  }, []);

  if (loading) return <p role="status">Loading discovery...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Discover teammates</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {results.length === 0 ? (
            <EmptyDiscovery guidance={guidance} />
          ) : (
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.profileId} className="card">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{r.headline ?? 'Team member'}</h2>
                    <span className="text-brand-600 font-semibold">{r.compatibilityPreview.score}% match</span>
                  </div>
                  <ul className="mt-2 text-sm text-slate-600">
                    {r.compatibilityPreview.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
        <VisibilitySettings />
      </div>
    </div>
  );
}
