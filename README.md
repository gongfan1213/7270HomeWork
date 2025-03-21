# 健康追踪应用

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