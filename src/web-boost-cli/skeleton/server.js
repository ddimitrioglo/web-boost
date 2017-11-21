const WebBoost = require('web-boost');
const WebBoostApp = new WebBoost();

WebBoostApp
  .configure()
  .addRoute({
    path: '/',
    view: 'index.twig',
    vars: {
      title: 'Home page',
      description: 'test description'
    },
    // assets: {
    //   '@assets/result.min.js': [
    //     '@test.js',
    //     '@test1.min.js'
    //   ],
    //   '@assets/result.min.css': [
    //     '@test1.scss',
    //     '@test2.scss',
    //     '@test3.scss'
    //   ]
    // }
  })
  .addRoute({
    path: '/user',
    view: 'user.twig',
    vars: {
      title: 'Users12 page',
      description: 'Users page description'
    }
  })
  .listen(8080);
