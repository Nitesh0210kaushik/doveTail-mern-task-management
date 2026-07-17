import { Link, useLocation } from 'react-router-dom';

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="text-center text-white">
        <p className="text-7xl font-bold">404</p>
        <p className="mt-3 text-slate-400">Page not found: {location.pathname}</p>
        <Link className="mt-6 inline-block text-blue-400 hover:text-blue-300" to="/">Back home</Link>
      </div>
    </main>
  );
}
