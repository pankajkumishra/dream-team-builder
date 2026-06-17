import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listAnalyses } from '@dream-team/backend';

export default async function AnalysisPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const analyses = await listAnalyses(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team analyses</h1>
        <Link href="/analysis/new" className="btn-primary text-sm">New analysis</Link>
      </div>
      <ul className="mt-6 space-y-3">
        {analyses.map((a) => (
          <li key={a.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">Analysis {a.id.slice(0, 8)}...</p>
              <p className="text-sm text-slate-500">{a.status} · {new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
            {a.successProbability !== null && (
              <span className="text-lg font-semibold text-brand-600">{a.successProbability}%</span>
            )}
          </li>
        ))}
        {analyses.length === 0 && (
          <li className="card text-center text-slate-500">No analyses yet. Create your first team analysis.</li>
        )}
      </ul>
    </div>
  );
}
