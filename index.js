#!/usr/bin/env node

'use strict';

const Route = require('./src/route');
const config = require('./src/config');
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

/**
 * Init web-boost routes
 */
const routes = config.get('routes');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));

/**
 * Trigger assets compilation
 */
Promise.all(appRoutes.map(route => route.packAssets())).catch(err => { throw err; });

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
