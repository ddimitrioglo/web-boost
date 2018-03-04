#!/usr/bin/env node

'use strict';

const Route = require('./src/route');
const config = require('./src/config');
const logger = require('./src/logger');
const express = require('express');

const app = express();
const [port, appPath] = process.argv.slice(2);

/**
 * Init web-boost config
 */
config.init(appPath);

/**
 * App configuration
 */
app.set('views', config.getPath('app.views'));
app.use('/', express.static(config.getPath('app.public')));
app.use('/img', express.static(config.getPath('app.assets', 'img')));
app.use('/fonts', express.static(config.getPath('app.assets', 'fonts')));

/**
 * Init web-boost routes
 */
const routes = config.get('routes');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));

/**
 * Trigger assets compilation
 */
Promise.all(appRoutes.map(route => route.packAssets()))
  .then(() => logger.info('Ok'))
  .catch(err => handleError(err));

/**
 * Init app routes
 */
appRoutes.forEach(route => {
  app.get(route.getPath(), (req, res) => {
    res.render(route.getView(), route.getVars());
  });
});

/**
 * Listen server
 */
app.listen(port);

/**
 * @param {Error} error
 */
function handleError(error) {
  let errorMsg = error.message;
  if (error.code === 'ENOENT') {
    errorMsg = `${error.path.replace(`${appPath}/`, '@')} does not exist`;
  }

  logger.error(errorMsg);
}
