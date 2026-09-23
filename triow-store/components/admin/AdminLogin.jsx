'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError('That password is not correct.');
      setPassword('');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-luxe p-8">
        <Logo />
        <h1 className="mt-6 text-3xl">Admin sign in</h1>
        <p className="mt-1 text-sm text-white/60">Manage products, stock and orders.</p>

        <label htmlFor="admin-pass" className="label mt-6">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
          <input
            id="admin-pass"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'admin-pass-error' : undefined}
            className="field !pl-10"
          />
        </div>
        {error && <p id="admin-pass-error" role="alert" className="mt-2 text-xs text-red-300">{error}</p>}

        <button type="submit" className="btn btn-gold mt-6 w-full">Sign in</button>
        <Link href="/" className="mt-4 block text-center text-xs text-white/50 transition hover:text-gold">Back to the store</Link>
      </form>
    </div>
  );
}
