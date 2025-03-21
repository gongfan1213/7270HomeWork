# 健康追踪应用
# 初稿
- 暂时的，后期提交会替换成英文的
- AI功能暂时还没有加，后期会完善的

![image](https://github.com/user-attachments/assets/b788c52c-5c70-4d35-a3bc-f1733c9ae25e)

- 点击注册
  
  ![image](https://github.com/user-attachments/assets/9dafb91e-f7b6-4b65-b43c-9e11d009c683)
- 用户已存在

  ![image](https://github.com/user-attachments/assets/3cdda9a4-7f5d-4ad0-b4d2-a30c54bc3c0f)

- 用户登陆

  ![image](https://github.com/user-attachments/assets/0099fa94-d39a-46ab-8c67-4fe6301e7348)

- 个人资料

![image](https://github.com/user-attachments/assets/0d211818-6a28-43ce-b4a7-598ce0a9d62a)

- 健康报告

![image](https://github.com/user-attachments/assets/439f60aa-521c-41e4-85de-305288dad106)


- 健康目标

  ![image](https://github.com/user-attachments/assets/b5725312-1801-4f40-94fc-d14a1fc8e474)

- 睡眠记录

![image](https://github.com/user-attachments/assets/21cb0a8e-3d03-4f81-b867-df0eae290dcc)

- 运动记录

  ![image](https://github.com/user-attachments/assets/32e190d7-0f63-49d6-a4f3-cf8dab7d921b)

- 体重记录

![image](https://github.com/user-attachments/assets/73279e35-c1c7-45cd-be78-2ec24737dd53)

- 健康概览

  ![image](https://github.com/user-attachments/assets/54219a51-7463-49e3-a99e-d924be4e7223)

![image](https://github.com/user-attachments/assets/6d534de6-8a21-4a38-8ec1-5ddbfb425a58)

# 这个项目如何运行
- 首先安装git，最好用trae
- 第二步
- 在本地的文件夹下，git clone git@github.com:gongfan1213/7270HomeWork.git
- 然后下载Node_modules,npm run serve
- 然后npm start
- 然后 访问5000
- 终端出现服务段在5000还有数据库连接正常说明是没有错误的，正常运行

- 需要创建.env文件
- 配置,在Azure上找到对应的字段，复制粘贴，前几节课的实验文档当中好像有如何配置的
  ```js
  MONGO_URI=
MONGO_DATABASE=
MONGO_COLLECTION=
COSMOSDB_ENDPOINT=
COSMOSDB_KEY=
MONGO_DATABASE=
MONGO_COLLECTION=
JWT_SECRET=
```
COMP7270 Web和移动编程 & COMP7980 动态Web和移动编程 - HKBU - 2025春季

## 项目描述

这是一个使用Vue.js和Express.js构建的健康追踪应用，具有以下特点：

- 使用Bootstrap进行响应式网页设计
- 实现了多种交互式健康数据图表（使用amCharts）
- 采用两层架构：Vue.js单页应用前端和Express.js后端
- 使用MongoDB存储用户健康数据
- 实现基于令牌的身份验证
- 支持多种健康数据的记录和分析

## 技术栈

- **前端**：Vue.js, Bootstrap, amCharts, HTML, CSS, JavaScript, Ajax
- **后端**：Express.js, Node.js
- **数据库**：MongoDB
- **认证**：JWT (JSON Web Tokens)

## 功能特点

- 用户注册和登录
- 记录和跟踪健康数据（体重、运动、睡眠等）
- 数据可视化和分析
- 个人健康目标设置
- 响应式设计，适配各种设备

## 安装与运行

### 前提条件

- Node.js (v14+)
- npm (v6+)
- MongoDB

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/health-tracker.git
cd health-tracker
