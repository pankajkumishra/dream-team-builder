import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { listConnections } from '@dream-team/backend';

export default async function ConnectionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const connections = await listConnections(session.user.id, { direction: 'inbox' });

  return (
    <div>
      <h1 className="text-2xl font-bold">Connection requests</h1>
      <ul className="mt-6 space-y-3">
        {connections.map((c) => (
          <li key={c.id} className="card">
            <p className="font-medium">Request from {c.initiatorId.slice(0, 8)}...</p>
            <p className="text-sm text-slate-500">Status: {c.status}</p>
            {c.message && <p className="mt-1 text-sm text-slate-600">{c.message}</p>}
          </li>
        ))}
        {connections.length === 0 && (
          <li className="card text-center text-slate-500">No connection requests.</li>
        )}
      </ul>
    </div>
  );
}
