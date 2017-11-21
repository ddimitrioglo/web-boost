'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');
const Twig = require('twig');
const express = require('express');
const Packer = require('./lib/packer');

class WebBoost {

  constructor() {
    this._app = express();
    this._appPath = path.dirname(require.main.filename);
    this._config = {
      views: 'views',
      assets: 'assets'
    };
  }

  app() {
    return this._app;
  }

  config() {
    return this._config;
  }

  configure(config = {}) {
    this._config = Object.assign(this._config, config);
    let assetsPath = this.config().assets;

    this._twigConfig();
    this.app().set('views', path.join(this._appPath, this.config().views));
    this.app().use(`/${assetsPath}`, express.static(path.join(this._appPath, assetsPath)));

    return this;
  }

  addRoute(route) {
    this.app().get(route.path, (req, res) => {
      // @todo: move _packAssets into configure (do not repack assets on each request)
      this._packAssets(route.assets).then(assetsVars => {

        console.log(assetsVars);

        res.render(route.view, Object.assign({}, route.vars, assetsVars));
      }).catch(err => {
        this._handleError(res, err);
      });
    });

    return this;
  }

  listen(port = 8000) {
    this.app().listen(port)
  }

  /**
   * Pack assets
   * @param assets
   * @return {Promise}
   * @private
   */
  _packAssets(assets) {
    let result = {};
    if (!assets) {
      return Promise.resolve(result);
    }

    let promises = Object.keys(assets).map(outFile => {
      let packer = new Packer(assets[outFile], outFile, this._appPath);
      packer.watch(() => {
        console.log('!!!');
      });

      return packer.pack();
    });

    return Promise.all(promises).then(res => {
      res.forEach(file => {
        result[file.path()] = file.fullPath();
      });

      return Promise.resolve(result);
    });
  }

  /**
   * Twig configuration
   * @private
   */
  _twigConfig() {
    Twig.extendFunction('asset', (asset) => {
      return asset.replace('@', '/');
    });
  }

  /**
   * Error handler
   * @param res
   * @param {Error} err
   * @private
   */
  _handleError(res, err) {
    let code = err.code || 500;
    let message = err.message || 'Something went wrong';
    res.status(code).send(message);
  }
}

module.exports = WebBoost;
