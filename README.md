# Sean Walter · 数字观测站

[![Website](https://img.shields.io/badge/website-dream22180971.github.io-283547)](https://dream22180971.github.io/) [![GitHub Pages](https://img.shields.io/badge/hosting-GitHub%20Pages-222)](https://pages.github.com/) [![Languages](https://img.shields.io/badge/language-中文%20%7C%20English-bb8572)](https://dream22180971.github.io/) [![GitHub stars](https://img.shields.io/github/stars/Dream22180971/Dream22180971.github.io?style=social)](https://github.com/Dream22180971/Dream22180971.github.io/stargazers)

一个围绕个人网站星系设计的导航站：从 AI 工程、软件测试与开源项目，走到阅读、电影和生活随想。

**在线访问：** https://dream22180971.github.io/

## 网站内容

- **星系入口**：三个可点击的轨道节点，连接个人主站、项目作品集和生活博客。
- **精选发现**：展示[动画记忆博物馆](https://museum.seanwalter.top/)的真实首页画面，提供体验与项目仓库入口。
- **精选项目与文章**：项目链接指向 GitHub，文章链接指向主站原文。
- **中英文切换**：默认中文，语言偏好保存在访客的浏览器中；英文界面链接的文章可能仍为中文。

## 本地运行

```bash
git clone https://github.com/Dream22180971/Dream22180971.github.io.git
cd Dream22180971.github.io
python -m http.server 8000
```

访问 http://localhost:8000/。纯静态网站，无需安装依赖或执行构建。

## 项目结构与维护

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面结构、内容、链接和搜索元数据 |
| `galaxy.js` | 首屏粒子与网站节点运动 |
| `language.js` | 中英文文案与语言切换 |
| `sections-design.css` / `sections-motion.js` | 内容区样式和滚动动效 |
| `footer.js` / `favicon.svg` | 页脚年份和浏览器标签图标 |
| `assets/museum-home.webp` | 动画记忆博物馆线上首页截图 |
| `robots.txt` / `sitemap.xml` | 抓取规则和首页站点地图 |

- **添加网站**：在 `.scene` 增加 `.point` 链接，更新 `language.js` 翻译、`galaxy.js` 中的域名简介和页脚链接；修改脚本后更新页面引用的版本参数。
- **更新精选内容**：项目和文章在 `index.html` 中手动维护，不会自动同步；动画馆网站改版后可更新截图。
- **动效与可访问性**：节点悬停或聚焦时可查看简介；支持键盘导航和减少动态效果设置。粒子在页面隐藏或离开可视区域时停止运行。
- **SEO**：页面包含标题、描述、规范网址和 Person 结构化数据。中英文目前共用一个网址，英文不是独立索引页面；可在 Search Console 提交站点地图并查看索引状态。

## 部署

仓库通过 GitHub Pages 发布：在 **Settings → Pages** 中选择 **Deploy from a branch**，指定 `main` 分支和 `/ (root)`。推送后可在仓库的 Actions 查看构建与部署状态。

## 喜欢这个项目？

如果这里的星系交互、动效节奏或组织方式对你有帮助，欢迎点一个 Star。它会让我知道这个方向值得继续打磨，也方便你之后回来查看更新。

[**给这个仓库点 Star**](https://github.com/Dream22180971/Dream22180971.github.io/stargazers) · [**Fork 后改成自己的导航站**](https://github.com/Dream22180971/Dream22180971.github.io/fork)

如果只想先看看效果，直接访问 [线上站点](https://dream22180971.github.io/) 更快。
