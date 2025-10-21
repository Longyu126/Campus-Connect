// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();               // ← 一定要在最前面先初始化 app

// 中间件
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => res.json({ ok: true }));

// 路由挂载（现在 app 已经有值了）
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// 数据库 & 启动
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connect error:', err);
    process.exit(1);
  });
