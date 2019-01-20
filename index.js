'use strict';

const http = require('http');
const router = require('./src/router');
const config = require('./src/config');
const logger = require('./src/logger');
const Compiler = require('./src/compiler');

const assets = {};
const port = config.get('server.port');
const routes = config.get('routes');
const staticPath = config.getPath('app.static');

router.setStatic(staticPath);

Object.keys(routes).forEach(route => {
  router.register(route, () => {
    const params = routes[route];
    const view = config.getPath('app.views', params.view);
    const vars = Object.assign({ routeName: route }, params.vars);

    return compile(route)
      .then(() => config.renderView(view, vars))
      .then(html => Promise.resolve({ body: html }));
  });
});

const server = http.createServer((req, res) => {
  router.route(req, res);
});

server.listen(port);

// @todo Move this into router's method
process.on('message', message => {
  if (message === 'restart') {
    process.exit(0);
  }
});

/**
 * Lazy assets compile
 * @param {String} route
 * @return {Promise}
 */
function compile(route) {
  if (assets.hasOwnProperty(route)) {
    return Promise.resolve();
  }

  assets[route] = true;
  logger.info('Preparing assets...');
  return (new Compiler(route, routes[route])).packAssets();
}
