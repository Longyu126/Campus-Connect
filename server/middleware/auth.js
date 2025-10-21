// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 确保有这个模型

module.exports = async function auth(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 同时给出 id 和 username
    if (decoded && decoded.id && decoded.username) {
      req.user = { id: decoded.id, username: decoded.username };
      return next();
    }

    // 如果 token 里没有 username，就查库补上
    const user = await User.findById(decoded.id).select('username');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = { id: user._id.toString(), username: user.username };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
