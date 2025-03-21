require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// 使用MongoDB连接字符串
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DATABASE || "surveyDB";
const collectionName = process.env.MONGO_COLLECTION || "responses";

if (!mongoUri) {
  console.error('错误: 环境变量未正确设置');
  console.error('请确保设置了 MONGO_URI 环境变量');
  process.exit(1);
}

async function importData() {
  let client;
  try {
    console.log('正在连接到 MongoDB...');
    client = await MongoClient.connect(mongoUri);
    console.log('连接成功！');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 读取模拟数据
    const mockDataPath = path.join(__dirname, 'mock-data.json');
    if (!fs.existsSync(mockDataPath)) {
      console.error('错误: mock-data.json 文件不存在');
      process.exit(1);
    }

    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    console.log(`准备导入 ${mockData.length} 条记录...`);

    // 为每条记录添加时间戳和ID
    const dataToInsert = mockData.map((item, index) => ({
      ...item,
      _id: `mock-${index}`,
      timestamp: new Date()
    }));

    // 插入数据
    const result = await collection.insertMany(dataToInsert);
    console.log(`成功导入 ${result.insertedCount} 条记录！`);

  } catch (error) {
    console.error('导入数据时出错:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('数据库连接已关闭');
    }
  }
}

// 安装 mongodb 包
const { execSync } = require('child_process');
try {
  console.log('正在安装 mongodb 包...');
  execSync('npm install mongodb', { stdio: 'inherit' });
  console.log('mongodb 包安装完成');
  
  // 运行导入程序
  importData().catch(console.error);
} catch (error) {
  console.error('安装 mongodb 包时出错:', error);
}