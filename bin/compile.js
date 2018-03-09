#!/usr/bin/env node

'use strict';

const fse = require('fs-extra');
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const jpegRecompress = require('imagemin-jpeg-recompress');
const Route = require('../src/route');
const config = require('../src/config');
const logger = require('../src/logger');
const appPath = process.cwd();

/**
 * Init web-boost config
 */
config.init(appPath);

const routes = config.get('routes');
const buildPath = config.getPath('app.build');
const staticPath = config.getPath('app.static');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));
const promises = [].concat(
  appRoutes.map(route => route.compileView()),
  appRoutes.map(route => route.packAssets())
);

/**
 * Compile application build
 */
Promise.all(promises).then(() => {
  return fse.copy(staticPath, buildPath);
}).then(() => {
  imagemin([`${buildPath}/*.{jpg,png}`], buildPath, {
    plugins: [
      jpegRecompress({ method: 'smallfry' }),
      pngquant({ quality: '65-80' })
    ]
  })
}).then(() => {
  logger.log('Compilation finished');
}).catch(err => {
  throw err;
});
