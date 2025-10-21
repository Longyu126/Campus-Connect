'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [apiMsg, setApiMsg] = useState('Loading...');
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // 从 localStorage 取用户名
    setUsername(localStorage.getItem('username'));

    // 调用后端 hello 接口
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/hello`);
        const data = await res.json();
        setApiMsg(data.message ?? 'No message');
      } catch {
        setApiMsg('Failed to reach API');
      }
    })();
  }, []);

  function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  // 跳转到登录页
  window.location.href = '/login';
}

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full rounded-2xl shadow p-8 bg-white">
        <h1 className="text-2xl font-bold mb-3">Campus Connect</h1>

        {username ? (
          <>
            <div className="mb-1">Hi, <b>{username}</b> 👋</div>

            {/* ✅ 新增：进入个人中心链接 */}
            <div className="mb-2 text-sm">
              <a className="underline mr-3" href="/me">进入个人中心</a>
              <button className="underline" onClick={logout}>退出登录</button>
              <a className="underline mr-3" href="/posts">帖子列表</a>
              <a className="underline" href="/new">发布新帖</a>
            </div>
          </>
        ) : (
          <div className="mb-3 text-sm">
            <a className="underline mr-3" href="/login">登录</a>
            <a className="underline" href="/register">注册</a>
          </div>
        )}

        <p>API says: <span className="font-mono">{apiMsg}</span></p>
      </div>
    </main>
  );
}
