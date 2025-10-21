'use client';
import { useEffect, useState } from 'react';
import { getToken, getUsername, clearAuth } from '@/lib/auth';

export default function MePage() {
  const [profile, setProfile] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      // 没有登录，跳到登录页
      window.location.href = '/login';
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error((await res.json().catch(() => null))?.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setProfile(data.user);
      } catch (e: any) {
        setErr(e.message || 'Failed to load profile');
      }
    })();
  }, []);

  function logout() {
    clearAuth();
    window.location.href = '/';
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold mb-4">个人中心</h1>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        {!profile ? (
          <p>加载中…</p>
        ) : (
          <div className="space-y-2">
            <div>用户名：<b>{profile.username}</b></div>
            <div>邮箱：{profile.email}</div>
            <div>创建时间：{new Date(profile.createdAt).toLocaleString()}</div>
            <div className="pt-2">
              <button onClick={logout} className="rounded bg-black text-white px-3 py-2">退出登录</button>
            </div>
          </div>
        )}
        <div className="mt-4 text-sm">
          <a className="underline" href="/">返回首页</a>
        </div>
      </div>
    </main>
  );
}
