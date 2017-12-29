#!/usr/bin/env node

'use strict';

const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const jpegRecompress = require('imagemin-jpeg-recompress');
const Route = require('../src/route');
const config = require('../src/config');
const appPath = process.cwd();

/**
 * Init web-boost config
 */
config.init(appPath);

const routes = config.get('routes');
const appRoutes = Object.keys(routes).map(route => new Route(route, routes[route]));
const promises = [].concat(
  appRoutes.map(route => route.compileView()),
  appRoutes.map(route => route.packAssets())
);

/**
 * Compile views & assets
 */
Promise.all(promises).then(() => {
  imagemin([`${config.getPath('app.assets', 'img')}/*.{jpg,png}`], config.getPath('app.public', 'img'), {
    plugins: [
      jpegRecompress({ method: 'smallfry' }),
      pngquant({ quality: '65-80' })
    ]
  })
}).then(() => {
  console.log('Compilation finished');
}).catch(err => {
  throw err;
});
