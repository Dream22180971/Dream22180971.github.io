# DaydreamerBlog - 个人博客系统

## 项目简介

DaydreamerBlog 是一个基于 Hexo 框架和 Fluid 主题构建的现代化个人博客系统，包含完整的前台展示和后台管理功能。项目采用前后端分离架构，前台使用 Hexo 静态站点生成器提供高性能的内容展示，后台使用 Node.js 原生 HTTP 服务器实现便捷的内容管理。

## 目录结构（前后端分离）

```
DaydreamerBlog/
├── frontend/                  # 前台：Hexo + Fluid（GitHub Pages 自动发布）
│   ├── source/                # 文章与资源（source/_posts、source/_data、source/img 等）
│   ├── _config.yml            # Hexo 主配置（url 等）
│   ├── package.json
│   └── package-lock.json
├── backend/                   # 后台：本地运行的管理系统（不部署到 Pages）
│   ├── api/
│   ├── ui/
│   ├── utils/
│   └── server.js
└── .github/workflows/pages.yml # Actions：构建 frontend 并发布到 Pages
```

## 项目架构

### 整体架构
项目采用**双层架构**设计，实现了内容管理与展示的完美分离：

1. **前台博客系统**（端口 4000）
   - 基于 Hexo 静态站点生成器，提供高性能的静态页面
   - 使用 Fluid 主题提供现代化、响应式的用户界面
   - 支持文章、分类、标签、归档等核心博客功能
   - 集成本地搜索、图片懒加载等增强特性

2. **后台管理系统**（端口 4001）
   - 自定义 Node.js HTTP 服务器，轻量高效
   - RESTful API 设计，提供标准化的接口
   - Session 认证机制，确保管理后台安全
   - 完整的内容管理功能，包括文章、媒体、配置、链接管理

### 技术栈

#### 前台技术栈
- **静态站点生成器**: Hexo 8.1.1
- **主题**: Fluid 1.9.9
- **UI框架**: Bootstrap 5.x
- **JavaScript库**: jQuery 3.x
- **渲染引擎**: EJS 2.0.0, Marked 7.0.1
- **搜索**: hexo-generator-search 2.4.0
- **部署**: hexo-deployer-git 4.0.0

#### 后台技术栈
- **运行时**: Node.js
- **HTTP服务器**: 原生 http 模块
- **路由**: 自定义 Router 类
- **认证**: Session-based 认证
- **文件操作**: fs 模块
- **构建集成**: Hexo API 调用

#### 开发工具
- **热重载**: hexo-browsersync 0.3.0
- **站点地图**: hexo-generator-sitemap 3.0.1

## 快速开始

### 安装依赖
```bash
cd frontend
npm install
```

### 本地开发

#### 启动前台博客系统
```bash
cd frontend
npm run server
```
前台访问地址: http://localhost:4000

#### 启动后台管理系统
```bash
node backend/server.js
```
后台访问地址: http://localhost:4001/admin/

首次使用需要访问 http://localhost:4001/admin/setup 完成初始化设置。

### 生成静态页面
```bash
cd frontend
npm run generate
```

### 发布方式（GitHub Pages）

站点通过 GitHub Actions 自动发布：push 到 `main` 后自动在云端执行构建并部署到 `https://dream22180971.github.io/`。

## 核心功能

### 前台博客系统 ✅
- ✅ 现代化响应式设计（Fluid主题）
- ✅ 完整的文章展示系统
- ✅ 分类和标签管理
- ✅ 归档页面
- ✅ 友情链接页面
- ✅ 关于页面
- ✅ 本地搜索功能
- ✅ 图片懒加载
- ✅ 首页动态打字效果
- ✅ 平滑滚动体验
- ✅ SEO优化（Schema.org结构化数据）

### 后台管理系统 ✅
- ✅ 自定义HTTP服务器（端口4001）
- ✅ RESTful API设计
- ✅ Session认证机制
- ✅ 初始化设置功能
- ✅ 用户登录/登出
- ✅ 文章管理（创建、编辑、删除、列表）
- ✅ 媒体文件上传管理
- ✅ 站点配置管理
- ✅ 友情链接管理
- ✅ Hexo构建触发
- ✅ 自定义路由器实现

### 性能优化 ✅
- ✅ 添加CDN预连接（preconnect）
- ✅ 关键资源预加载（preload）
- ✅ 图片懒加载优化（loading="lazy"）
- ✅ 智能缓存策略：
  - HTML文件：no-cache（每次请求重新验证）
  - 静态资源：7天缓存（max-age=604800）

### 技术实现亮点
- ✅ 双层架构设计，前后端分离
- ✅ 轻量级自定义路由系统
- ✅ 基于Cookie的Session管理
- ✅ 无缝集成Hexo API
- ✅ 模块化代码结构
- ✅ 统一的错误处理机制

## 项目结构

```
DaydreamerBlog/
├── frontend/                  # Hexo 源码
│   ├── source/
│   ├── _config.yml
│   ├── package.json
│   └── package-lock.json
├── backend/                   # 后台管理系统
│   ├── api/
│   ├── ui/
│   ├── utils/
│   └── server.js
└── .github/workflows/pages.yml
```

### 架构说明

#### 前台系统
- **入口**: `server.js` 或 `simple-server.js`
- **端口**: 4000
- **功能**: 博客文章展示、搜索、归档、分类、标签等

#### 后台系统
- **入口**: `backend/server.js`
- **端口**: 4001
- **功能**: 
  - 用户认证（登录/登出）
  - 文章CRUD操作
  - 媒体文件上传管理
  - 站点配置管理
  - 友情链接管理
  - Hexo构建触发

#### API路由设计
后台采用RESTful API设计，主要端点：
- `POST /api/admin/auth/setup` - 初始化设置
- `POST /api/admin/auth/login` - 用户登录
- `POST /api/admin/auth/logout` - 用户登出
- `GET /api/admin/articles` - 获取文章列表
- `GET /api/admin/articles/:filename` - 获取文章详情
- `POST /api/admin/articles` - 创建文章
- `PUT /api/admin/articles/:filename` - 更新文章
- `DELETE /api/admin/articles/:filename` - 删除文章
- `GET /api/admin/media` - 获取媒体列表
- `POST /api/admin/media/upload` - 上传媒体文件
- `DELETE /api/admin/media/:filename` - 删除媒体文件
- `GET /api/admin/config` - 获取站点配置
- `PUT /api/admin/config` - 更新站点配置
- `GET /api/admin/links/friends` - 获取友情链接
- `PUT /api/admin/links/friends` - 更新友情链接
- `POST /api/admin/build` - 触发Hexo构建

## 文章发布流程

### 方式一：通过后台管理系统（推荐）

1. **启动后台管理系统**
   ```bash
   npm run admin
   ```

2. **登录后台**
   - 访问 http://localhost:4001/admin/
   - 输入用户名和密码登录

3. **创建文章**
   - 点击"新建文章"
   - 填写文章标题、分类、标签
   - 使用Markdown编辑器编写内容
   - 上传图片等媒体资源
   - 点击"保存"

4. **触发构建**
   - 在后台点击"构建"按钮
   - 系统自动执行Hexo构建命令
   - 生成静态页面

5. **预览和部署**
   - 访问 http://localhost:4000 预览效果
   - 确认无误后执行部署命令

### 方式二：通过命令行

1. **创建文章**
   ```bash
   # 创建新文章
   hexo new "文章标题"
   
   # 或使用npm脚本
   npm run new "文章标题"
   ```

2. **编辑文章**
   - 在 `frontend/source/_posts/` 目录找到生成的Markdown文件
   - 编辑文章内容和Front Matter

3. **生成静态页面**
   ```bash
   hexo generate
   ```

4. **本地预览**
   ```bash
   hexo server
   ```

5. **部署发布**
   ```bash
   hexo deploy
   ```

### Front Matter 示例

```yaml
---
title: 文章标题
date: 2024-01-01 00:00:00
categories: 
  - 技术
tags:
  - Hexo
  - 博客
---
```

### 文章目录结构

```
source/_posts/
├── welcome.md
├── 如何利用Hexo搭建个人博客.md
└── 软件测试入门.md
```

## 配置说明

### 主要配置文件

#### 1. Hexo主配置文件
**文件路径**: `frontend/_config.yml`

主要配置项：
- **站点信息**: title, subtitle, description, keywords, author
- **URL配置**: url, root, permalink
- **目录配置**: source_dir, public_dir, tag_dir, archive_dir, category_dir
- **写作配置**: new_post_name, default_layout, post_asset_folder
- **分类和标签**: default_category, category_map, tag_map
- **日期格式**: date_format, time_format
- **分页配置**: per_page, pagination_dir
- **主题配置**: theme: fluid
- **搜索配置**: search.path, search.field, search.content
- **懒加载配置**: lazyload.enable, lazyload.loadingImg
- **打字效果**: typing.enable, typing.typeSpeed, typing.cursorChar
- **目录配置**: toc.enable, toc.headingSelector, toc.collapseDepth

#### 2. 后台配置文件
**文件路径**: `backend/api/config.js`

管理后台的站点配置，包括：
- 站点基本信息
- 导航菜单配置
- 社交媒体链接
- 其他自定义配置

#### 3. 依赖配置文件
**文件路径**: `package.json`

项目依赖和脚本配置：
- **生产依赖**: Hexo核心、主题、渲染器、插件等
- **开发依赖**: 热重载、站点地图等
- **脚本命令**:
  - `npm run clean` - 清理缓存
  - `npm run generate` - 生成静态页面
  - `npm run server` - 启动Hexo服务器
  - `npm run deploy` - 部署发布
  - `npm run new` - 创建新文章
  - `npm run publish` - 一键发布
  - `npm run admin` - 启动后台管理

### 环境变量
项目当前使用文件系统存储配置，未来可扩展为环境变量配置：
- `PORT` - 前台服务器端口（默认4000）
- `ADMIN_PORT` - 后台服务器端口（默认4001）
- `SESSION_SECRET` - Session加密密钥

## 技术亮点

### 1. 双层架构设计
- 前台使用Hexo静态站点生成器，性能优异
- 后台使用Node.js原生HTTP服务器，轻量高效
- 前后端完全分离，便于独立开发和部署

### 2. 自定义路由系统
- 实现了轻量级的RESTful路由器
- 支持路径参数解析（如 `/api/admin/articles/:filename`）
- 统一的错误处理机制

### 3. Session认证机制
- 基于Cookie的Session管理
- 支持初始化设置流程
- 自动重定向未认证请求

### 4. Hexo集成
- 通过Hexo API实现构建触发
- 无缝集成Hexo的文章管理
- 支持Markdown渲染和静态页面生成

### 5. 性能优化
- CDN预连接和资源预加载
- 图片懒加载
- 智能缓存策略
- 静态资源压缩

## 开发指南

### 添加新功能

#### 前台功能
1. 在 `source/_posts/` 添加文章
2. 在 `css/` 和 `js/` 添加样式和脚本
3. 修改 `_config.yml` 配置
4. 运行 `hexo generate` 生成页面

#### 后台功能
1. 在 `admin/api/` 添加API路由
2. 在 `admin/ui/` 添加UI页面
3. 在 `admin/utils/` 添加工具函数
4. 在 `admin/router.js` 注册路由
5. 重启后台服务器

### 调试技巧

#### 前台调试
```bash
# 启动开发服务器
hexo server --debug

# 查看构建日志
hexo generate --debug
```

#### 后台调试
```bash
# 启动后台服务器
node admin/server.js

# 查看API请求日志
# 服务器会输出所有请求信息
```

### 常见问题

**Q: 端口被占用怎么办？**
A: 修改 `server.js` 或 `admin/server.js` 中的PORT常量

**Q: 如何重置后台密码？**
A: 删除 `admin/.setup` 文件，重新访问 `/admin/setup`

**Q: 图片上传失败？**
A: 检查 `img/` 目录权限，确保可写

**Q: Hexo构建失败？**
A: 检查Markdown文件格式，确保Front Matter正确

## 贡献指南

欢迎提交Issue和Pull Request！

### 提交Issue
- 描述问题现象
- 提供复现步骤
- 附上错误日志或截图
- 说明环境信息（Node版本、操作系统等）

### 提交PR
- Fork项目到自己的仓库
- 创建功能分支
- 编写代码并测试
- 提交Pull Request
- 等待代码审查

### 代码规范
- 使用ES6+语法
- 遵循现有代码风格
- 添加必要的注释
- 确保代码可读性

## 许可证

MIT License

## 联系方式

- **作者**: Dreamer
- **博客**: http://localhost:4000
- **GitHub**: https://github.com/Dream22180971
- **邮箱**: (待补充)

## 致谢

感谢以下开源项目：
- [Hexo](https://hexo.io/) - 快速、简洁且高效的博客框架
- [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) - 一款 Material Design 风格的 Hexo 主题
- [Bootstrap](https://getbootstrap.com/) - 流行的前端UI框架
- [jQuery](https://jquery.com/) - 快速、小型且功能丰富的JavaScript库

## 更新日志

### v1.0.0 (2024-01-01)
- ✅ 初始化项目
- ✅ 集成Hexo和Fluid主题
- ✅ 实现后台管理系统
- ✅ 完成基础功能开发
- ✅ 性能优化和用户体验提升

### v1.1.0 (2026-04-04)
- ✅ 重新架构项目文档
- ✅ 优化README.md结构和内容
- ✅ 完善API路由文档
- ✅ 增强项目架构说明
- ✅ 提升文档可读性和专业性
- ✅ 优化登录页面和初始化设置页面样式
- ✅ 修复页面加载问题，确保样式正确应用
- ✅ 改进用户界面视觉效果，提升用户体验