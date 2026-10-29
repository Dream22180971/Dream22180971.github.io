(() => {
  const translations = {
    '精选':'Featured', '项目':'Projects', '文章':'Writing',
    '在这里，':'Welcome to', '连接我的':'my ', '不同世界。':'different worlds.',
    '你好，我是肖恩。这里是我的数字观测站，连接技术实践、开源项目，以及生活中值得留下的灵感。':'I’m Sean. This is my digital observatory, connecting technical writing, open-source projects, and ideas from everyday life.',
    '探索精选内容':'Explore featured work', '技术实践 ↗':'Technical writing ↗', '项目作品 ↗':'Projects ↗', '白日梦想 ↗':'Daydreams ↗',
    '探索 · 创造 · 记录':'Explore · Create · Reflect', 'AI 产品 / 质量工程 / 生活观察':'AI products / Quality engineering / Life',
    '正在构建。':'Currently building.', '从真实问题开始。':'Starting with real problems.', '本地汇总多个 AI Coding Agent 的用量数据。':'A local view of usage across AI coding agents.', '把需求转化为结构化测试资产。':'Turn requirements into structured testing assets.', '查看项目 ↗':'View project ↗', '查看全部项目 ↗':'View all projects ↗',
    '动画记忆博物馆':'Animation Memory Museum', '把动画海报、台词与个人回忆组织成数字展厅。':'A digital exhibition of animation posters, quotes, and personal memories.',
    'FEATURED DISCOVERY / 精选发现':'FEATURED DISCOVERY / SELECTED WORK', '把动画海报、台词与个人回忆，组织成一座可以慢慢逛的数字展厅。':'A digital museum bringing animation posters, memorable lines and personal memories together.', '进入动画馆 ↗':'Explore the museum ↗',
    '实践与思考。':'Practice & reflection.', '从问题、验证和复盘中留下的记录。':'Notes from problems, verification, and reflection.',
    'AI 写完了，也说修好了：测试人员如何验收编码 Agent？':'AI says it’s fixed: how should testers verify a coding agent’s work?', '把 Agent 的完成声明拆成可以复查的验收证据。':'Turn an agent’s completion claim into reviewable evidence.', 'AI 测试 ↗':'AI testing ↗',
    '普通电脑搭一套高中九科 RAG 助手，我真正解决了哪些问题？':'Building a nine-subject RAG assistant on an ordinary computer', '从教材解析到检索验证，了解项目的实际边界。':'From textbook parsing to retrieval checks and real-world limitations.', '项目实践 ↗':'Project notes ↗',
    '让 AI 给博客做体检：10 个坏链接、1.7MB 封面图和一个被推翻的假设':'An AI blog health check: broken links, a large cover image, and a disproved assumption', '从真实缺陷出发，记录一次验证与复盘。':'A verification and retrospective grounded in real defects.', '实践复盘 ↗':'Retrospective ↗', '查看全部文章 ↗':'View all articles ↗',
    'SEAN WALTER / 白日梦想家':'SEAN WALTER / Daydreamer', '个人主站':'Personal website'
  };
  const button = document.querySelector('.language');
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const value = node.nodeValue;
    const key = value.trim();
    if (Object.prototype.hasOwnProperty.call(translations, key)) nodes.push({ node, value, key });
  }
  function setLanguage(lang) {
    nodes.forEach(({node,value,key}) => { node.nodeValue = lang === 'en' ? value.replace(key, translations[key]) : value; });
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.title = lang === 'en' ? 'Sean Walter | Digital Observatory' : 'Sean Walter | 数字观测站';
    document.querySelector('meta[name="description"]').content = lang === 'en' ? 'Sean’s personal spaces: technology, open-source projects, and life.' : '肖恩的个人空间：技术实践、开源项目与生活记录。';
    document.querySelector('nav').setAttribute('aria-label', lang === 'en' ? 'Main navigation' : '主导航');
    const museum = document.querySelector('.discovery-visual');
    if (museum) {
      museum.setAttribute('aria-label', lang === 'en' ? 'Explore the Animation Memory Museum' : '进入动画记忆博物馆');
      museum.querySelector('img').alt = lang === 'en' ? 'Animation Memory Museum homepage with a television in a sunset-lit room' : '动画记忆博物馆网站首页：夕阳房间与电视';
    }
    button.textContent = lang === 'en' ? '中文' : 'EN';
    button.setAttribute('aria-label', lang === 'en' ? '切换为中文' : 'Switch to English');
    try { localStorage.setItem('language', lang); } catch (_) { /* The page remains usable when storage is unavailable. */ }
  }
  let initial = 'zh';
  try { if (localStorage.getItem('language') === 'en') initial = 'en'; } catch (_) { /* Use the default language. */ }
  setLanguage(initial);
  button.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'zh' : 'en'));
})();
