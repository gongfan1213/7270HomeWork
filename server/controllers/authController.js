const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 用户注册
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  
  try {
    // 检查用户是否已存在
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: '用户已存在' });
    }
    
    // 创建新用户
    user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });
    
    await user.save();
    
    // 创建JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'healthtrackersecret',
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
};

// 用户登录
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 检查用户是否存在
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: '无效的凭据' });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: '无效的凭据' });
    }
    
    // 创建JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'healthtrackersecret',
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
};

// 获取当前用户
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};