'use strict';

/**
 * Config
 */
class Config {
  /**
   * Constructor
   */
  constructor() {
    this._config = {};
  }

  /**
   * @returns {Object}
   */
  getConfig() {
    return this._config;
  }

  /**
   * @param {Object} config
   */
  setConfig(config) {
    this._config = config;
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

    return !!cfg[key];
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
   * Delete property
   * @param path
   */
  del(path) {
    let [cfg, key] = this._handle(path);

    delete cfg[key];
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
