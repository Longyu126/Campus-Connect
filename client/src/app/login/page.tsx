'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const data = await api<{ user:{id:string,username:string,email:string}; token:string }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify(form) }
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      setMsg(`登录成功，欢迎 ${data.user.username}！`);
      setTimeout(() => (window.location.href = '/'), 500);
    } catch (err:any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-xl font-bold">登录</h1>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email or Username"
          value={form.emailOrUsername}
          onChange={e=>setForm({...form,emailOrUsername:e.target.value})}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          required
        />
        <button disabled={loading} className="w-full rounded bg-black text-white py-2">
          {loading ? '登录中…' : '登录'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm">没有账号？<a className="underline" href="/register">去注册</a></p>
      </form>
    </main>
  );
}
