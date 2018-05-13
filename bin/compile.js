#!/usr/bin/env node

'use strict';

const fse = require('fs-extra');
const path = require('path');
const glob = require('glob');
const Route = require('../src/route');
const config = require('../src/config');
const logger = require('../src/logger');
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const jpegRecompress = require('imagemin-jpeg-recompress');

/**
 * Init web-boost config
 */
config.init(process.cwd());

const routes = config.get('routes');
const buildPath = config.getPath('app.build');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));
const promises = [].concat(
  appRoutes.map(route => route.compileView()),
  appRoutes.map(route => route.packAssets())
);

/**
 * Compile application build
 */
Promise.all(promises).then(() => {
  return fse.copy(config.getPath('app.static'), buildPath);
}).then(() => {
  const images = glob.sync('**/*.{jpg,png}', { cwd: buildPath });

  return Promise.all(images.map(image => {
    const imagePath = path.join(buildPath, image);

    return imagemin([imagePath], path.dirname(imagePath), {
      plugins: [
        jpegRecompress({ method: 'smallfry' }),
        pngquant({ quality: '65-80' })
      ]
    });
  }));
}).then(() => {
  logger.log('Compilation finished');
}).catch(err => {
  throw err;
});
