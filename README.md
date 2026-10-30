<div align="center">

# 🌌 Sean Walter · 数字观测站

**在星系里，找到我的每一个数字空间。**

[![Website](https://img.shields.io/badge/%F0%9F%8C%90_%E5%9C%A8%E7%BA%BF%E7%AB%99%E7%82%B9-dream22180971.github.io-283547?style=for-the-badge)](https://dream22180971.github.io/)
[![GitHub stars](https://img.shields.io/github/stars/Dream22180971/Dream22180971.github.io?style=social)](https://github.com/Dream22180971/Dream22180971.github.io/stargazers)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222?style=flat-square&logo=github&logoColor=white)](https://pages.github.com/)

</div>

---

## ✨ 这是什么

一个围绕**个人网站星系**设计的导航站：从 AI 工程、软件测试与开源项目，走到阅读、电影和生活随想。

纯静态、无构建、无依赖，打开就能看。

**🌐 在线访问：** https://dream22180971.github.io/

## 🧭 网站内容

| 区域 | 体验 |
| --- | --- |
| 🪐 **星系入口** | 三个可点击的轨道节点，连接个人主站、项目作品集和生活博客 |
| 🏛️ **精选发现** | 独立展示[动画记忆博物馆](https://museum.seanwalter.top/)，附体验与仓库入口 |
| 🛠️ **精选项目** | LLM Usage Collector、TestPilotAgent 等项目的 GitHub 入口 |
| 📝 **精选文章** | 指向主站原文，不重复发布全文 |
| 🌏 **中英文切换** | 默认中文，语言偏好保存在访客浏览器；英文界面链接的文章可能仍为中文 |

## 🎨 交互设计

- 🛰️ **轨道运动**：网站节点均匀分布并绕中心运行，悬停节点或键盘聚焦时暂停，方便点击。
- 💫 **悬停预览**：悬停或键盘聚焦节点时显示该空间简介，其他节点适度弱化。
- 🌠 **粒子星系**：Canvas 绘制细颗粒旋臂并持续流动，页面隐藏或离开视口时停止渲染。
- ✨ **点击互动**：首屏点击出现点线星图，后续区域点击绽放星光；链接仍正常跳转。
- 🪄 **滚动叙事**：内容区背景随滚动漂移，标题光晕、按钮光束与底部文字粒子呼应首屏。
- ♿ **可访问性**：支持键盘焦点；系统开启「减少动态效果」时关闭运动；触控目标不小于 44px。

## 🚀 本地运行

```bash
git clone https://github.com/Dream22180971/Dream22180971.github.io.git
cd Dream22180971.github.io
python -m http.server 8000
```

打开 http://localhost:8000/ 即可。

## 🗂️ 项目结构

| 文件 | 用途 |
| --- | --- |
| 📄 `index.html` | 页面结构、内容、链接与搜索元数据 |
| 🌌 `galaxy.js` | 首屏粒子与网站节点运动 |
| 🌐 `language.js` | 中英文文案与语言切换 |
| 🎨 `sections-design.css` | 内容区布局与视觉样式 |
| 🎞️ `sections-motion.js` | 滚动动效与入场节奏 |
| 🕰️ `footer.js` | 页脚年份自动更新 |
| 🔖 `favicon.svg` | 星球与轨道图标 |
| 🖼️ `assets/museum-home.webp` | 动画记忆博物馆首页截图 |
| 🤖 `robots.txt` / 🗺️ `sitemap.xml` | 抓取规则与首页站点地图 |

## 🧩 维护指南

- ➕ **添加网站**：在 `.scene` 增加 `.point` 链接，更新 `language.js` 翻译、`galaxy.js` 域名简介与页脚链接，并更新脚本版本参数。
- 🔄 **更新精选内容**：项目与文章在 `index.html` 手动维护，不会自动同步；动画馆改版后可更新截图。
- 🔍 **SEO**：已包含标题、描述、规范网址与 Person 结构化数据。中英文共用一个网址，英文不是独立索引页面；可在 Search Console 提交站点地图。

## 📦 部署

通过 GitHub Pages 发布：**Settings → Pages → Deploy from a branch**，选择 `main` 与 `/ (root)`。推送后在仓库 **Actions** 查看构建与部署状态。

## ⭐ 喜欢这个项目？

如果这里的星系交互、动效节奏或组织方式对你有帮助，欢迎点一个 Star。它会让我知道这个方向值得继续打磨，也方便你之后回来查看更新。

[**⭐ 给这个仓库点 Star**](https://github.com/Dream22180971/Dream22180971.github.io/stargazers) · [**🍴 Fork 后改成自己的导航站**](https://github.com/Dream22180971/Dream22180971.github.io/fork)

只想先看看效果？直接访问 [线上站点](https://dream22180971.github.io/) 更快。

---

<div align="center">

**从真实问题出发，小步构建，持续发布。**

</div>
