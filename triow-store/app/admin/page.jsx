'use client';

import { useEffect, useState } from 'react';
import { ADMIN_PASSWORD } from '@/lib/config';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

const SESSION_KEY = 'triow:admin-session';

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = still checking

  useEffect(() => {
    try {
      setAuthed(sessionStorage.getItem(SESSION_KEY) === '1');
    } catch {
      setAuthed(false);
    }
  }, []);

  const login = (password) => {
    if (password !== ADMIN_PASSWORD) return false;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setAuthed(true);
    return true;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
  };

  if (authed === null) return null;
  return authed ? <AdminDashboard onLogout={logout} /> : <AdminLogin onLogin={login} />;
}
