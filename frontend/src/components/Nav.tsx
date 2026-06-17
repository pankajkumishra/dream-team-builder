import Link from 'next/link';
import { auth, signOut } from '@/auth';

const navLinks = [
  { href: '/profile', label: 'Profile' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/composition/new', label: 'Composition' },
  { href: '/discovery', label: 'Discovery' },
  { href: '/connections', label: 'Connections' },
];

export async function Nav() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4" aria-label="Main navigation">
        <Link href="/" className="text-lg font-semibold text-brand-700">
          Dream Team Builder
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <ul className="hidden gap-4 md:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button type="submit" className="btn-secondary text-sm">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-sm">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
