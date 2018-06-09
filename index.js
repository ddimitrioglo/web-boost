#!/usr/bin/env node

'use strict';

const Route = require('./src/route');
const config = require('./src/config');
const logger = require('./src/logger');
const Twig = require('./helpers/twig');
const simples = require('simples');
const [ port, appPath ] = process.argv.slice(2);

/**
 * Init web-boost config
 */
config.init(appPath);

/**
 * Create simple server
 */
const server = simples(parseInt(port));
server.serve(config.getPath('app.static'));

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
  server.get(route.getPath(), connection => {
    renderView(route.getView(), route.getVars()).then(html => {
      connection.end(html);
    });
  });
});

/**
 * @param {String} view
 * @param {Object} vars
 * @returns {Promise}
 */
function renderView(view, vars) {
  return new Promise((resolve, reject) => {
    const viewPath = config.getPath('app.views', view);

    Twig.renderFile(viewPath, vars, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
}

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
