// client/src/lib/auth.js
export const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
export const getUsername = () => (typeof window !== 'undefined' ? localStorage.getItem('username') : null);
export const setAuth = (token: string, username: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }
};

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
};
