'use strict';

const path = require('path');
const File = require('./file');
const config = require('./config');
const TwigAsset = require('../lib/twig-asset');
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
   * Compile route view
   * @return {Promise}
   */
  compileView() {
    const viewSrc = this._absolutePath('app.config.views', this.getView());
    const viewOut = this._absolutePath('app.config.build', this.getPath(), 'index.html');
    const twigAsset = new TwigAsset(new File(viewSrc), this.getVars());

    return twigAsset.minify().then(html => {
      const outFile = new File(viewOut);

      return outFile.setContent(html);
    });
  }

  /**
   * Minify assets and pack into out files
   * @param compile
   * @return {Promise}
   */
  packAssets(compile = false) {
    const promises = Object.keys(this._assets).map(outAsset => {
      const outDir = compile ? 'app.config.build' : 'app.config.assets';
      const outAssetPath = this._absolutePath(outDir, outAsset);
      const outAssetFile = new File(outAssetPath);

      return this._concatAssetsTo(this._assets[outAsset], outAssetFile);
    });

    return Promise.all(promises);
  }

  /**
   * Minify and concat assets
   * @param {Array} assets
   * @param {File} outAssetFile
   * @returns {Promise}
   * @private
   */
  _concatAssetsTo(assets, outAssetFile) {
    let promises = assets.map(assetPath => {
      return AssetFactory.create(
        new File(this._absolutePath('app.config.assets', assetPath))
      );
    }).map(asset => {
      return asset.minify().then(content => Promise.resolve(Buffer.from(content, 'utf8')));
    });

    return Promise.all(promises).then(buffers => {
      return outAssetFile.setContent(Buffer.concat(buffers));
    });
  }

  /**
   * Build absolute path from crumbs
   * @param dotConfig
   * @param paths
   * @return {*|string}
   * @private
   */
  _absolutePath(dotConfig, ...paths) {
    paths.unshift(config.get('app.path'), config.get(dotConfig));

    return path.join.apply(null, paths);
  }
}

module.exports = Route;
