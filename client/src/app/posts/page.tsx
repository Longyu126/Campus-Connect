'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Post = {
  _id: string; title: string; content: string;
  authorName: string; createdAt: string; tags?: string[];
};
type ListResp = { items: Post[]; total: number; page: number; pageSize: number };

export default function PostsPage() {
  const [list, setList] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(q = '') {
    setLoading(true);
    try {
      const data = await api<ListResp>(`/api/posts?search=${encodeURIComponent(q)}&page=1&pageSize=20`);
      setList(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">帖子列表</h1>
        <a className="underline" href="/new">发布新帖</a>
      </div>

      <div className="mb-4 flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="搜索标题/内容/标签"
               value={search} onChange={(e)=>setSearch(e.target.value)} />
        <button className="rounded bg-black text-white px-3" onClick={()=>load(search)}>搜索</button>
      </div>

      {loading ? <p>加载中…</p> : (
        <ul className="space-y-3">
          {list.map(p => (
            <li key={p._id} className="bg-white rounded-2xl shadow p-4">
              <a className="text-lg font-semibold underline" href={`/posts/${p._id}`}>{p.title}</a>
              <div className="text-sm text-gray-500 mt-1">
                by {p.authorName} · {new Date(p.createdAt).toLocaleString()}
              </div>
              {p.tags && p.tags.length > 0 && (
                <div className="mt-2 text-xs">{p.tags.map(t => <span key={t} className="mr-2">#{t}</span>)}</div>
              )}
              <p className="mt-2 line-clamp-2">{p.content}</p>
            </li>
          ))}
          {list.length === 0 && <p>暂无帖子。</p>}
        </ul>
      )}
    </main>
  );
}
