// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 chars' });
    }

    // 去重
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: 'Email or username already in use' });

    // 哈希
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, passwordHash });

    // 签发 token
    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 不把哈希返回给前端
    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'emailOrUsername and password required' });
    }

    // 支持用 email 或 username 登录
    const query = emailOrUsername.includes('@')
      ? { email: emailOrUsername.toLowerCase() }
      : { username: emailOrUsername };

    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: { id: user._id, username: user.username, email: user.email }, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// 获取当前用户
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('_id username email createdAt');
  res.json({ user });
});

module.exports = router;
