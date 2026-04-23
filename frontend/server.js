const Hexo = require('hexo');
const hexo = new Hexo(process.cwd(), {});

hexo.init()
  .then(() => {
    // 在hexo初始化之后加载插件
    require('hexo-server');
    return hexo.call('server', {
      port: 4000,
      ip: '0.0.0.0',
      debug: false,
      draft: false,
      open: false,
      defer: false
    });
  })
  .catch(err => {
    console.error(err);
    hexo.exit(err);
  });