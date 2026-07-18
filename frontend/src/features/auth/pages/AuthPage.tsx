import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useCurrentUser } from '../../../hooks/auth/useCurrentUser';
import type { AuthMode } from '../types/auth.types';
import { getCsrfToken } from '../../../services/auth.service';

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [csrfReady, setCsrfReady] = useState(false);
  const { login, register, loading, error } = useAuth();
  const { isLoading: sessionLoading, isSuccess: isAuthenticated } = useCurrentUser();

  useEffect(() => {
    if (!sessionLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, sessionLoading]);

  useEffect(() => {
    void getCsrfToken().then(() => setCsrfReady(true));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    if (isRegister && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate('/dashboard', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-4 dark:bg-slate-100 sm:py-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-200 dark:bg-white md:grid-cols-2">
        <div className="hidden bg-slate-50 p-8 text-slate-900 dark:bg-slate-50 dark:text-slate-900 md:block lg:p-10">
          <div className="flex h-full flex-col justify-between">
            <div>
              <Link className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600" to="/">TaskFlow</Link>
              <h1 className="mt-12 text-4xl font-bold leading-tight text-slate-900 lg:mt-16 lg:text-5xl">Organize your work. Own your time.</h1>
              <p className="mt-6 max-w-sm text-lg leading-8 text-slate-600">Keep your tasks clear, focused, and moving forward.</p>
            </div>
            <p className="text-sm text-slate-500">Simple task management for focused teams.</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8">
          <Link className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600" to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-600">Welcome to TaskFlow</p>
            <h2 className="mt-1.5 text-3xl font-bold text-slate-900">{isRegister ? 'Create your account' : 'Welcome back'}</h2>
            <p className="mt-2 text-slate-500">{isRegister ? 'Start organizing your tasks today.' : 'Sign in to continue to your workspace.'}</p>
          </div>

          <form className="space-y-3" onSubmit={submit}>
            {isRegister && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
                <Input className="py-2.5 dark:!border-slate-200 dark:!bg-white dark:!text-slate-900 dark:!placeholder:text-slate-400" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required minLength={2} />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email address</span>
              <Input className="py-2.5 dark:!border-slate-200 dark:!bg-white dark:!text-slate-900 dark:!placeholder:text-slate-400" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
              <Input className="py-2.5 dark:!border-slate-200 dark:!bg-white dark:!text-slate-900 dark:!placeholder:text-slate-400" autoComplete={isRegister ? 'new-password' : 'current-password'} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter at least 8 characters" minLength={8} required />
            </label>
            {isRegister && (
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Confirm password</span>
                <Input className="py-2.5 dark:!border-slate-200 dark:!bg-white dark:!text-slate-900 dark:!placeholder:text-slate-400" autoComplete="new-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" minLength={8} required />
              </label>
            )}
            {(formError || error) && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError || error}</div>}
            <Button size="full" disabled={loading || !csrfReady} type="submit">
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
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
