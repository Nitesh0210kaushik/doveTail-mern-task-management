import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface TaskPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function TaskPageShell({ title, description, children }: TaskPageShellProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 dark:bg-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600" to="/dashboard">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-6 border-b border-slate-100 pb-5 dark:border-slate-800">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">TaskFlow</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
