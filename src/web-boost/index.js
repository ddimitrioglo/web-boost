#!/usr/bin/env node

'use strict';

const path = require('path');
// const Twig = require('./helpers/twig');
const Route = require('./lib/route');
const config = require('./lib/config');
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
app.set('views', path.join(appPath, config.get('app.config.views')));
app.use('/static', express.static(path.join(appPath, config.get('app.config.assets'))));

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
