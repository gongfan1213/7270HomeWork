require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');  // 添加这一行

// 设置 mongoose strictQuery 选项
mongoose.set('strictQuery', false);

// 初始化Express应用
const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 添加错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).send('服务器内部错误');
});

// 路由
try {
  app.use('/api/users', require('./server/routes/users'));
  app.use('/api/auth', require('./server/routes/auth'));
  app.use('/api/health-data', require('./server/routes/healthData'));
  app.use('/api/exercises', require('./server/routes/exercises'));
} catch (error) {
  console.error('加载路由失败:', error);
}

// 处理前端路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 处理所有其他请求，返回index.html（用于SPA）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => {
    console.error('MongoDB连接失败:', err.message);
    // 不要立即退出，让服务器继续运行
    console.log('将继续运行服务器，但数据库功能可能不可用');
  });

// 提供静态资源 - 修改这部分
// 无论是开发环境还是生产环境，都尝试提供静态文件
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'client/public')));
app.use(express.static(path.join(__dirname, 'public')));

// 所有未匹配的路由都返回前端应用或友好的错误页面
app.get('*', (req, res) => {
  // 尝试多个可能的前端构建位置
  const possiblePaths = [
    path.resolve(__dirname, 'client', 'dist', 'index.html'),
    path.resolve(__dirname, 'client', 'public', 'index.html'),
    path.resolve(__dirname, 'public', 'index.html')
  ];
  
  for (const htmlPath of possiblePaths) {
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  // 如果找不到前端文件，返回简单的HTML
  res.send(`
    <html>
      <head>
        <title>健康追踪应用</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .error { color: #e74c3c; }
          .success { color: #2ecc71; }
          pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow: auto; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>健康追踪应用 API 服务器已启动</h1>
        <div class="card">
          <p class="success">✅ 服务器已成功启动</p>
          <p>API 端点可在 <code>/api</code> 路径下访问</p>
          <p class="error">⚠️ 前端文件未找到。请确保您已构建前端项目。</p>
        </div>
        <div class="card">
          <h2>快速修复指南</h2>
          <p>1. 构建前端项目:</p>
          <pre>cd client && npm run build</pre>
          <p>2. 确保client目录存在并包含前端代码</p>
          <p>3. 检查控制台日志以获取更多错误信息</p>
        </div>
      </body>
    </html>
  `);
});

// 尝试不同的端口直到找到可用的
function startServer(port) {
  try {
    app.listen(port, () => console.log(`服务器运行在端口 ${port}`));
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.log(`端口 ${port} 已被占用，尝试端口 ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('启动服务器失败:', err);
    }
  }
}

// 设置初始端口
const PORT = process.env.PORT || 5000;
startServer(PORT);