'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const data = await api<{ user:{id:string,username:string,email:string}; token:string }>(
        '/api/auth/register',
        { method: 'POST', body: JSON.stringify(form) }
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      setMsg(`注册成功，欢迎 ${data.user.username}！`);
      // 跳回首页
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
        <h1 className="text-xl font-bold">注册</h1>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Username"
          value={form.username}
          onChange={e=>setForm({...form,username:e.target.value})}
          required
        />
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password (>=6)"
          value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          required
          minLength={6}
        />
        <button disabled={loading} className="w-full rounded bg-black text-white py-2">
          {loading ? '提交中…' : '注册'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-sm">已有账号？<a className="underline" href="/login">去登录</a></p>
      </form>
    </main>
  );
}
