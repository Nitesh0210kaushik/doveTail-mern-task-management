import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../hooks/useAuth';
import type { AuthMode } from '../types/auth.types';

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading, error } = useAuth();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate('/');
    } catch {
      // The hook exposes the API error for the form.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 to-indigo-900 p-12 text-white md:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">TaskFlow</span>
              <h1 className="mt-20 text-5xl font-bold leading-tight">Organize your work. Own your time.</h1>
              <p className="mt-6 max-w-sm text-lg leading-8 text-blue-100">Keep your tasks clear, focused, and moving forward.</p>
            </div>
            <p className="text-sm text-blue-200">Simple task management for focused teams.</p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-10">
            <p className="text-sm font-semibold text-blue-600">Welcome to TaskFlow</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
            <p className="mt-2 text-slate-500">{isRegister ? 'Start organizing your tasks today.' : 'Sign in to continue to your workspace.'}</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form className="space-y-5" onSubmit={submit}>
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required minLength={2} />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required />
            </label>
            <Button size="full" disabled={loading} type="submit">
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link className="font-semibold text-blue-600 hover:text-blue-700" to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Sign in' : 'Create one'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
