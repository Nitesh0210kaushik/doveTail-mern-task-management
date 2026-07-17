import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <p className="font-bold tracking-[0.2em] text-blue-600">TASKFLOW</p>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Dashboard</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Welcome to your workspace</h1>
        <p className="mt-3 text-slate-500">Task management features will appear soon.</p>
      </section>
    </main>
  );
}
