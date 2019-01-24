'use strict';

const fs = require('fs');
const path = require('path');
const Twig = require('twig');
const { extend } = require('./util');

class Config {
  /**
   * Constructor
   */
  constructor() {
    const appPath = process.cwd();
    const wbConfig = require(path.join(appPath, 'web-boost'));
    const defaults = {
      template: {
        engine: 'twig', // useless till consolidate.js is integrated
        extensions: ''
      },
      server: {
        port: 8080,
        delay: 2000,
        retries: 3,
        ignorePatterns: ['node_modules']
      },
      app: {
        path: appPath,
        views: 'views',
        build: 'build',
        assets: 'assets',
        static: 'static'
      }
    };

    this._config = extend({}, defaults, wbConfig);
    this.initTemplate();
  }

  /**
   * @returns {Object}
   */
  initTemplate() {
    let extPath = path.join(this._config.app.path, this._config.template.extensions);
    let extensions = {};

    if (fs.existsSync(extPath) && fs.statSync(extPath).isFile()) {
      extensions = require(extPath);
    }

    if (!extensions.hasOwnProperty('extendFunction')) {
      extensions.extendFunction = {};
    }

    // Add asset function by default
    extensions.extendFunction.asset = (asset) => asset.replace(/^@/, '/');

    Object.keys(extensions).forEach(method => {
      Object.keys(extensions[method]).forEach(alias => {
        Twig[method].apply(null, [alias, extensions[method][alias]]);
      });
    });
  }

  /**
   * @param {String} viewPath
   * @param {Object} vars
   * @returns {Promise}
   */
  renderView(viewPath, vars) {
    return new Promise((resolve, reject) => {
      Twig.renderFile(viewPath, vars, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

  /**
   * Get absolute path of the property
   * @param {String} prop
   * @param suffixes
   * @return {*}
   */
  getPath(prop, ...suffixes) {
    suffixes.unshift(this.get('app.path'), this.get(prop));

    return path.join.apply(null, suffixes);
  }

  /**
   * Ser property
   * @param {String} path
   * @param {*} value
   */
  set(path, value) {
    let [cfg, key] = this._handle(path);

    cfg[key] = value;
  }

  /**
   * Get property
   * @param {String} path
   * @return {Boolean}
   */
  has(path) {
    let [cfg, key] = this._handle(path);

    return cfg.hasOwnProperty(key);
  }

  /**
   * Get property
   * @param {String} path
   * @return {*}
   */
  get(path) {
    let [cfg, key] = this._handle(path);

    return cfg[key];
  }

  /**
   * Handle multilevel config
   * @param {String|Array} path
   * @param {Object} config
   * @return {Array}
   * @private
   */
  _handle(path, config = this._config) {
    let crumbs = path.constructor === Array ? path : path.split('.');
    let property = crumbs[0];

    if (crumbs.length <= 1) {
      return [config, property];
    }

    if (!config.hasOwnProperty(property)) {
      config[property] = {};
    }

    return this._handle(crumbs.slice(1), config[property]);
  }
}

module.exports = new Config();
