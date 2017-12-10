'use strict';

const fs = require('fs');
const File = require('./file');
const AssetFactory = require('./asset-factory');

class WebRoute {
  /**
   * @param {Object} options
   */
  constructor(options) {
    this._path = options.path;
    this._view = options.view;
    this._vars = options.vars || {};
    this._assets = options.assets || {};

    // this._outFile = new File(outFile, relativeTo);
    //
    // this._entryAssets = entryFiles.map(filePath => {
    //   return AssetFactory.create(new File(filePath, relativeTo), WebRoute.getExt(outFile));
    // });
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
   * Watch WebRoute assets
   * @param {Function} callback
   */
  watchAssets(callback) {
    Object.keys(this._assets).map(outAsset => {
      this._assets[outAsset].map(assetPath => new File(assetPath)).forEach(assetFile => {
        if (assetFile.fullPath()) {
          // @todo: force a restart!!! (ex: nodemon.emit('restart');)
          console.log(`Start watching ${assetFile.fullPath()}`);

          fs.watchFile(assetFile.fullPath(), callback);
        }
      });
    });

    // this._entryAssets.forEach(asset => {
    //   if (asset.file().fullPath()) {
    //     // force a restart
    //     // nodemon.emit('restart');
    //     fs.watchFile(asset.file().fullPath(), callback);
    //   }
    // });
  }



  // watch(fromStart = false) {
  //   if (fromStart) {
  //     fs.watchFile(WebRoute.NON_EXISTING_FILE, this.pack.bind(this));
  //   }
  //
  //   this._entryAssets.forEach(asset => {
  //     if (asset.file().fullPath()) {
  //       fs.watchFile(asset.file().fullPath(), this.pack.bind(this));
  //     }
  //   });
  // }

  /**
   * Minify WebRoute assets and pack into out files
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

  // static getExt(fileName) {
  //   return fileName.split('.').pop();
  // }

  // /**
  //  * Get non-existing file
  //  * @purpose trigger ENOENT error on watch
  //  * @returns {String}
  //  * @constructor
  //  */
  // static get NON_EXISTING_FILE() {
  //   return './nonexistent.file';
  // }
}

module.exports = WebRoute;
