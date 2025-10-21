'use client';

import { useState } from 'react';
import { apiAuth } from '@/lib/api';

export default function NewPostPage() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags
        .split(',')
        .map((t) => t.replace(/^#/, '').trim())
        .filter(Boolean),
    };

    try {
      const res = await apiAuth<{ post: { _id: string } }>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(payload), // ✅ 必须 JSON.stringify
      });

      setMsg('发布成功！正在跳转…');
      setTimeout(() => {
        window.location.href = `/posts/${res.post._id}`;
      }, 500);
    } catch (err: any) {
      setMsg(err.message || '提交失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>发布新帖</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <textarea
          placeholder="内容"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ width: '100%', height: 120, marginBottom: '1rem' }}
        />
        <input
          type="text"
          placeholder="标签（用逗号分隔）"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? '提交中…' : '发布'}
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
