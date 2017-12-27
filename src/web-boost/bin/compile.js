#!/usr/bin/env node

'use strict';

const Route = require('../lib/route');
const config = require('../lib/config');
const appPath = process.cwd();

/**
 * Init web-boost config
 */
config.init(appPath);

const routes = config.get('routes');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));
const promises = [].concat(
  appRoutes.map(route => route.compileView()),
  appRoutes.map(route => route.packAssets(true))
);

/**
 * Compile views & assets
 */
Promise.all(promises).then(() => {
  console.log('Compilation finished');
}).catch(err => {
  throw err;
});
