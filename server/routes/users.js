const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户模型 - 稍后我们会创建这个文件
const User = require('../models/User');

// 中间件 - 稍后我们会创建这个文件
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    注册用户
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 检查用户是否已存在
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    // 创建新用户
    user = new User({
      name,
      email,
      password
    });

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 保存用户
    await user.save();

    // 创建JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

// @route   POST api/users/login
// @desc    用户登录
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: '无效的凭据' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '无效的凭据' });
    }

    // 创建JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

// @route   GET api/users/profile
// @desc    获取用户资料
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;