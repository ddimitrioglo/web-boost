'use strict';

const File = require('./file');
const AssetFactory = require('./asset-factory');

class Route {
  /**
   * @param {String} path
   * @param {Object} options
   */
  constructor(path, options) {
    this._path = path;
    this._view = options.view;
    this._vars = options.vars || {};
    this._assets = options.assets || {};
  }

  /**
   * @return {String}
   */
  getPath() {
    return this._path;
  }

  /**
   * @return {String}
   */
  getView() {
    return this._view;
  }

  /**
   * @return {Object}
   */
  getVars() {
    return this._vars;
  }

  /**
   * Minify assets and pack into out files
   * @returns {Promise}
   */
  packAssets() {
    let promises = Object.keys(this._assets).map(outAsset => {
      return this._concatAssetsTo(this._assets[outAsset], outAsset);
    });

    return Promise.all(promises);
  }

  /**
   * Minify and concat assets
   * @param {Array} assets
   * @param {String} outAsset
   * @returns {Promise}
   * @private
   */
  _concatAssetsTo(assets, outAsset) {
    let promises = assets.map(assetPath => {
      return AssetFactory.create(new File(assetPath));
    }).map(asset => {
      return asset.minify().then(content => Promise.resolve(Buffer.from(content, 'utf8')));
    });

    return Promise.all(promises).then(buffers => {
      let outFile = new File(outAsset);

      return outFile.setContent(Buffer.concat(buffers));
    });
  }
}

module.exports = Route;
