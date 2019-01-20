'use strict';

const File = require('./file');
const config = require('./config');
const TwigAsset = require('./twig-asset');
const AssetFactory = require('./asset-factory');

class Compiler {
  /**
   * @param {String} route
   * @param {Object} options
   */
  constructor(route, options) {
    this._view = options.view;
    this._route = route;
    this._assets = options.assets || {};
    this._vars = Object.assign({ routeName: route }, options.vars);
  }

  /**
   * Compile route view
   * @return {Promise}
   */
  compileView() {
    const viewSrc = config.getPath('app.views', this._view);
    const viewOut = config.getPath('app.build', this._route, 'index.html');
    const twigAsset = new TwigAsset(new File(viewSrc), this._vars);

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
   * @return {Promise}
   * @private
   */
  _concatAssetsTo(assets, outAsset) {
    const promises = assets.map(assetPath => {
      const file = new File(config.getPath('app.assets', assetPath));

      return AssetFactory.create(file);
    }).map(asset => {
      return asset.minify().then(content => Promise.resolve(Buffer.from(content, 'utf8')));
    });

    return Promise.all(promises).then(buffers => {
      const outAssetFile = new File(config.getPath('app.static', outAsset));

      return outAssetFile.setContent(Buffer.concat(buffers));
    });
  }
}

module.exports = Compiler;
