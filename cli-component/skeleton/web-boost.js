module.exports = {
  server: {
    port: 8000,
    ignorePatterns: ['build']
  },
  routes: {
    '/': {
      view: 'index.twig',
      vars: {
        title: 'Home page',
        greeting: 'Hello world!'
      },
      assets: {
        'js/index.min.js': [
          'js/index.js'
        ],
        'css/index.min.css': [
          'styles/bootstrap.min.css',
          'styles/base.scss',
          'styles/index.scss'
        ]
      }
    },
    '/user': {
      view: 'user.twig',
      vars: {
        title: 'User\'s page',
        greeting: 'Hi John Doe!'
      },
      assets: {
        'css/user.min.css': [
          'styles/bootstrap.min.css',
          'styles/user.scss'
        ]
      }
    }
  }
};
