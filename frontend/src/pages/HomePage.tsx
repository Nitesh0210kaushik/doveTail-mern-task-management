import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const features = [
  {
    icon: '✓',
    title: 'Stay organized',
    text: 'Keep every task, deadline, and priority in one clear workspace.'
  },
  {
    icon: '↗',
    title: 'Move faster',
    text: 'Focus on the work that matters with simple, distraction-free planning.'
  },
  {
    icon: '◈',
    title: 'Work with confidence',
    text: 'Your tasks are private, secure, and always available when you need them.'
  }
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-6 py-6 lg:px-8">
        <Link className="text-lg font-bold tracking-[0.25em] text-blue-400" to="/">
          TASKFLOW
        </Link>
        <div className="flex items-center gap-3">
          <Link className="hidden px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white sm:block" to="/login">
            Sign in
          </Link>
          <Link to="/register">
            <Button size="default">Get started</Button>
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:pb-32 lg:pt-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            A calmer way to manage your work
          </div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Turn busy days into
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              clear progress.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            TaskFlow gives you a simple, focused space to plan your priorities,
            track progress, and finish what matters.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <Button size="default" className="px-7 py-3.5">Create your free account</Button>
            </Link>
            <Link className="text-sm font-semibold text-slate-300 transition hover:text-white" to="/login">
              Already have an account? <span className="text-blue-400">Sign in →</span>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.08] p-3 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-900/95 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium text-slate-500">MY WORKSPACE</p>
                  <h2 className="mt-1 text-xl font-semibold">Today&apos;s focus</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60" />
                  <span className="text-xs font-medium text-slate-400">Live workspace</span>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-500/10 p-4">
                  <p className="text-xs text-slate-500">Completed</p>
                  <p className="mt-1 text-2xl font-bold text-blue-300">68%</p>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-800"><div className="h-1.5 w-[68%] rounded-full bg-blue-500" /></div>
                </div>
                <div className="rounded-xl bg-emerald-500/10 p-4">
                  <p className="text-xs text-slate-500">This week</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-300">24</p>
                  <p className="mt-2 text-xs text-emerald-300">↑ 12% from last week</p>
                </div>
              </div>
              <div className="space-y-3 pt-5">
                {[
                  ['Review product feedback', 'In Progress', 'blue'],
                  ['Prepare weekly priorities', 'Pending', 'amber'],
                  ['Send project update', 'Completed', 'emerald']
                ].map(([title, status, color]) => (
                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-4" key={title}>
                    <span className={color === 'emerald' ? 'flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-xs text-emerald-300' : 'h-5 w-5 rounded-full border border-slate-600'}>{color === 'emerald' ? '✓' : ''}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-200">{title}</p>
                      <p className={color === 'blue' ? 'mt-1 text-xs text-blue-300' : color === 'amber' ? 'mt-1 text-xs text-amber-300' : 'mt-1 text-xs text-emerald-300'}>{status}</p>
                    </div>
                    <span className="text-slate-600">•••</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
                + Add a new task
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-3 lg:px-8">
          {features.map((feature) => (
            <div className="flex gap-4" key={feature.title}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-lg text-blue-300">{feature.icon}</span>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">Make space for progress</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Your next productive day starts here.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Set your priorities, make a plan, and move forward one task at a time.
        </p>
        <Link className="mt-8 inline-block" to="/register">
          <Button size="default" className="px-8">Start organizing today</Button>
        </Link>
      </section>
    </main>
  );
}
