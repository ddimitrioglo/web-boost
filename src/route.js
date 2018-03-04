'use strict';

const File = require('./file');
const config = require('./config');
const TwigAsset = require('./twig-asset');
const AssetFactory = require('./asset-factory');

class Route {
  /**
   * @param {String} path
   * @param {Object} options
   */
  constructor(path, options) {
    this._path = path;
    this._view = options.view;
    this._assets = options.assets || {};
    this._vars = Object.assign({ routeName: path }, options.vars);
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
   * Compile route view
   * @return {Promise}
   */
  compileView() {
    const viewSrc = config.getPath('app.views', this.getView());
    const viewOut = config.getPath('app.public', this.getPath(), 'index.html');
    const twigAsset = new TwigAsset(new File(viewSrc), this.getVars());

    return twigAsset.minify().then(html => {
      const outFile = new File(viewOut);

      return outFile.setContent(html);
    });
  }

  /**
   * Minify assets and pack into out files
   * @return {Promise}
   */
  packAssets() {
    const promises = Object.keys(this._assets).map(outAsset => {
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
    let assetsList = [];
    assets.forEach(asset => {
      assetsList.push(...asset.startsWith('$.') ? config.get(asset) : [asset]);
    });

    let promises = assetsList.map(assetPath => {
      const file = new File(config.getPath('app.assets', assetPath));

      return AssetFactory.create(file);
    }).map(asset => {
      return asset.minify().then(content => Promise.resolve(Buffer.from(content, 'utf8')));
    });

    return Promise.all(promises).then(buffers => {
      const outAssetFile = new File(config.getPath('app.public', outAsset));

      return outAssetFile.setContent(Buffer.concat(buffers));
    });
  }
}

module.exports = Route;
