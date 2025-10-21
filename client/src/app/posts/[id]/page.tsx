'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken, getUsername } from '@/lib/auth';

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

type Comment = {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  comments?: Comment[];
};

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // 评论表单
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 加载帖子
  const load = async () => {
    try {
      setLoading(true);
      setMsg(null);
      const res = await fetch(`${BASE}/api/posts/${id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `加载失败: ${res.status}`);
      }
      const json = await res.json();
      setPost(json.post);
    } catch (e: any) {
      setMsg(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 提交评论
  const submitComment = async () => {
    try {
      const token = getToken();
      if (!token) {
        setMsg('请先登录再发表评论');
        return;
      }
      const content = comment.trim();
      if (!content) return;

      setSubmitting(true);
      setMsg(null);

      const res = await fetch(`${BASE}/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `发表评论失败: ${res.status}`);
      }

      const json = await res.json();
      setPost(json.post); // 后端返回完整最新 post
      setComment('');     // 清空输入框
    } catch (e: any) {
      setMsg(e.message || '发表评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* 返回按钮：放在最顶部 */}
      <div>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <span className="text-lg">←</span>
          <span>返回列表</span>
        </Link>
      </div>

      {loading && <div>加载中...</div>}
      {!loading && msg && <div className="text-red-600">{msg}</div>}
      {!loading && !post && !msg && <div>未找到该帖子</div>}

      {post && (
        <>
          <section className="space-y-2">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="text-sm text-gray-600">
              作者：{post.authorName} · {new Date(post.createdAt).toLocaleString()}
            </div>
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.tags?.length ? (
              <div className="text-sm text-gray-600">
                标签：{post.tags.map((t) => `#${t}`).join(' ')}
              </div>
            ) : null}
          </section>

          {/* 发表评论（登录后可见） */}
          <section className="space-y-3 border-t pt-6">
            <h2 className="text-lg font-semibold">发表评论</h2>
            <div className="text-sm text-gray-600">
              {getUsername() ? <>已登录为 <b>{getUsername()}</b></> : <>未登录，提交会提示登录</>}
            </div>
            <textarea
              className="w-full border rounded p-2 min-h-[90px]"
              placeholder="写下你的看法…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
            />
            <div className="flex gap-3">
              <button
                onClick={submitComment}
                disabled={submitting}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
              >
                {submitting ? '提交中…' : '提交评论'}
              </button>
              <button
                onClick={() => setComment('')}
                disabled={submitting || !comment.trim()}
                className="px-4 py-2 rounded border disabled:opacity-50"
              >
                清空
              </button>
            </div>
          </section>

          {/* 评论列表 */}
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold">全部评论</h2>
            {post.comments && post.comments.length > 0 ? (
              <ul className="space-y-4">
                {post.comments.map((c) => (
                  <li key={c._id} className="border rounded p-3">
                    <div className="text-sm text-gray-600 mb-1">
                      {c.authorName} · {new Date(c.createdAt).toLocaleString()}
                    </div>
                    <div className="whitespace-pre-wrap">{c.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">还没有评论，来抢沙发吧～</div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
