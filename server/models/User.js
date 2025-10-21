// server/models/User.js
const { Schema, model } = require('mongoose');
const validator = require('validator');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Invalid email format',
      },
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 为常用查询创建索引（唯一索引已经在字段上声明）
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

module.exports = model('User', UserSchema);
