import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Dream Team Builder',
  description: 'Predict team compatibility before projects begin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Providers>
          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
