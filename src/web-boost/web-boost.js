'use strict';

const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const Twig = require('twig');
const express = require('express');
const WebRoute = require('./lib/web-route');
const cfg = require('./config');

class WebBoost {
  /**
   * Constructor
   */
  constructor() {
    this._app = express();
    this._server = http.createServer(this._app);
    cfg.set('app.path', path.dirname(require.main.filename));
  }

  getApp() {
    return this._app;
  }

  configure(config = {}) {
    cfg.set('app.config', Object.assign(this._getDefaults(), config));
    let assetsPath = this._appConfig().assets;

    this._twigConfig();
    this.getApp().set('views', path.join(this._appPath(), this._appConfig().views));
    this.getApp().use(`/${assetsPath}`, express.static(path.join(this._appPath(), assetsPath)));

    return this;
  }

  addRoute(options) {
    const route = new WebRoute(options);

    route.packAssets().then(() => {
      // if (route.getPath() === '/user') {
      //   console.error('ASDASDSA');
      //   this._server.close();
      // }

      this.getApp().get(route.getPath(), (req, res) => {
        res.render(route.getView(), route.getVars());
      });

      // route.watchAssets(() => {
      //   console.log('changed');
      //   route.packAssets().then(() => {
      //     console.log('compiled');
      //   })
      //
      //   // nodemon.emit('restart');
      // });
    }).catch(err => {
      console.log(`Route error: ${err}`);
    });

    // this._subscribeAssets(route.getPath(), route.assets);
    // this.getApp().get(route.path, (req, res) => {


      // res.render(route.view, route.vars);

      // @todo: move _packAssets into configure (do not repack assets on each request)
      // this._packAssets(route.assets).then(assetsVars => {
      //
      //   console.log(assetsVars);
      //
      //   res.render(route.view, Object.assign({}, route.vars, assetsVars));
      // }).catch(err => {
      //   this._handleError(res, err);
      // });
    // });

    return this;
  }

  listen(port = 8000) {
    this._server.listen(port);

    // this.getApp().listen(port, () => {
    //   setTimeout(() => {
    //     this.getApp().close();
    //   }, 5000);
    // })

    // @todo: use this for reloading
    // server.on('close', function() {
    //   server.listen(3000);
    // });
    //
    // server.listen(8080);
    // server.close();

  }

  // /**
  //  * Pack assets
  //  * @param assets
  //  * @return {Promise}
  //  * @private
  //  */
  // _packAssets(assets) {
  //   let result = {};
  //   if (!assets) {
  //     return Promise.resolve(result);
  //   }
  //
  //   let promises = Object.keys(assets).map(outFile => {
  //     let packer = new Packer(assets[outFile], outFile, this._appPath);
  //     packer.watch(() => {
  //       console.log('!!!');
  //     });
  //
  //     return packer.pack();
  //   });
  //
  //   return Promise.all(promises).then(res => {
  //     res.forEach(file => {
  //       result[file.path()] = file.fullPath();
  //     });
  //
  //     return Promise.resolve(result);
  //   });
  // }

  /**
   * Get default application config
   * @return {Object}
   * @private
   */
  _getDefaults() {
    return {
      views: 'views',
      assets: 'assets'
    };
  }

  /**
   * Get application path
   * @return {String}
   * @private
   */
  _appPath() {
    return cfg.get('app.path');
  }

  /**
   * Get main configuration
   * @return {*}
   * @private
   */
  _appConfig() {
    return cfg.get('app.config');
  }

  _subscribeAssets(route, assets) {
    if (!cfg.has(`assets.${route}`)) {
      cfg.set(`assets.${route}`, assets);
    }
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
