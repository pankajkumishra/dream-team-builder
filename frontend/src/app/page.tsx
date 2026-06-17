import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();
  if (session) redirect('/profile');

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-slate-900">Build your dream team</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Predict team compatibility before projects begin. Analyze work styles, skills, and goals
        to form better startup, hackathon, and research teams.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/register" className="btn-primary">
          Get started
        </Link>
        <Link href="/login" className="btn-secondary">
          Log in
        </Link>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Build your profile', desc: 'Skills, work-style assessment, goals, and past projects' },
          { title: 'Analyze compatibility', desc: 'Team reports with risk flags and success probability' },
          { title: 'Discover teammates', desc: 'Find compatible co-founders and collaborators' },
        ].map((item) => (
          <div key={item.title} className="card text-left">
            <h2 className="font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
