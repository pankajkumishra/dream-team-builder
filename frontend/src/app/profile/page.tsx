import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getMyProfile } from '@dream-team/backend';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const profile = await getMyProfile(session.user.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your profile</h1>
        {profile.completionStatus !== 'complete' && (
          <Link href="/profile/setup" className="btn-primary text-sm">
            Complete profile
          </Link>
        )}
      </div>
      {profile.completionStatus !== 'complete' && (
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
          Your profile is {profile.completionStatus}. Complete all sections for the best compatibility results.
        </p>
      )}
      <div className="card mt-6 space-y-4">
        <div>
          <h2 className="font-semibold">{profile.headline ?? 'No headline yet'}</h2>
          <p className="text-sm text-slate-500">Status: {profile.completionStatus}</p>
        </div>
        <section>
          <h3 className="font-medium">Skills</h3>
          <ul className="mt-1 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <li key={s.name} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                {s.name} ({s.level})
              </li>
            ))}
          </ul>
        </section>
        {profile.workStyleSummary && (
          <section>
            <h3 className="font-medium">Work style</h3>
            <p className="mt-1 text-sm text-slate-600">{profile.workStyleSummary}</p>
          </section>
        )}
        <section>
          <h3 className="font-medium">Goals</h3>
          <p className="mt-1 text-sm text-slate-600">
            {profile.goals.projectTypes?.join(', ') || 'Not set'} · {profile.goals.timeline ?? 'No timeline'}
          </p>
        </section>
        {profile.pastProjects && profile.pastProjects.length > 0 && (
          <section>
            <h3 className="font-medium">Past projects</h3>
            <ul className="mt-1 space-y-1">
              {profile.pastProjects.map((p) => (
                <li key={p.id} className="text-sm text-slate-600">
                  {p.title} {p.role && `— ${p.role}`}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
