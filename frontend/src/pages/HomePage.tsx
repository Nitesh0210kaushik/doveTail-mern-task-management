import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <section className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">
        <p className="font-semibold uppercase tracking-[0.25em] text-blue-600">TaskFlow</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Manage tasks with clarity.</h1>
        <p className="mt-4 text-slate-500">Your workspace is ready for the task dashboard.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" to="/login">Sign in</Link>
          <Link className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50" to="/register">Create account</Link>
        </div>
      </section>
    </main>
  );
}
