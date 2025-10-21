const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

/** 创建帖子（需要登录） */
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ error: 'title & content required' });
    }

    const post = await Post.create({
      author: req.user.id,
      authorName: req.user.username,
      title,
      content,
      tags: (tags || []).map((t) => String(t).trim()).filter(Boolean),
    });

    res.status(201).json({ post });
  } catch (e) {
    console.error('Create post error:', e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/** 列表 + 分页 ?page=1&pageSize=10&search=xxx */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '10', 10), 1), 50);
    const q = (req.query.search || '').trim();
    const where = q ? { $text: { $search: q } } : {};

    const [items, total] = await Promise.all([
      Post.find(where).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Post.countDocuments(where),
    ]);

    res.json({ items, total, page, pageSize });
  } catch (e) {
    console.error('List posts error:', e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/** 详情（评论按时间倒序返回） */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ post });
  } catch (e) {
    console.error('Get post error:', e);
    res.status(500).json({ error: e.message || 'Server error' });
  }
});

/** 评论（需要登录） */
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ error: 'content required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({
      author: req.user.id,
      authorName: req.user.username,
      content,
    });
    await post.save();

    // 返回最新的帖子（评论倒序）
    const fresh = await Post.findById(req.params.id).lean();
    fresh.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(201).json({ post: fresh });
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
