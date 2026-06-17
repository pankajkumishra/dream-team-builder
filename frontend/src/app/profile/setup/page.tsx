import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ProfileWizard } from '@/features/profile/ProfileWizard';

export default async function ProfileSetupPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  return (
    <div>
      <h1 className="text-2xl font-bold">Set up your profile</h1>
      <p className="mt-2 text-slate-600">Complete each step to build your team-readiness snapshot.</p>
      <div className="mt-6">
        <ProfileWizard />
      </div>
    </div>
  );
}
