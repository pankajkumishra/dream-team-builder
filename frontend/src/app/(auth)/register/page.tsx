'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      name: form.get('name'),
      action: 'register',
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError('Could not create account. Email may already be in use.');
      return;
    }
    router.push('/profile/setup');
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" type="text" className="input-field mt-1" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field mt-1" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={8} className="input-field mt-1" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="text-brand-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
