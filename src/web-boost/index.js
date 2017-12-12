#!/usr/bin/env node

'use strict';

const path = require('path');
const Twig = require('twig');
const Route = require('./lib/route');
const config = require('./lib/config');
const express = require('express');

const [port, configPath] = process.argv.slice(2);
const appPath = path.dirname(configPath);
const app = express();

config.setConfig(require(configPath));
config.set('app.path', appPath);

/**
 * Twig configuration
 */
Twig.extendFunction('asset', (asset) => {
  return asset.replace('@', '/');
});

/**
 * App configuration
 */
let assetsPath = config.get('app.config.assets');
app.set('views', path.join(appPath, config.get('app.config.views')));
app.use(`/${assetsPath}`, express.static(path.join(appPath, assetsPath)));

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
