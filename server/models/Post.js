// server/models/Post.js
const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },   // 冗余用户名，省一次联表
    content: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    author: { type: Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    tags: [{ type: String, trim: true, lowercase: true }],
    comments: [CommentSchema],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ title: 'text', content: 'text' }); // 只做全文检索
PostSchema.index({ tags: 1 });                         // tags 单独普通索引（数组没问题）


module.exports = model('Post', PostSchema);
