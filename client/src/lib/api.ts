const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json'); // 保底
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiAuth<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  return api<T>(path, { ...options, headers });
}
