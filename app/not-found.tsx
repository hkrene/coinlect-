import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        The page you are looking for cannot be found.
      </p>
      <Link href="/" className="rounded-md bg-white px-5 py-3 text-black font-semibold hover:bg-slate-200">
        Go back home
      </Link>
    </main>
  );
}
