'use strict';

const config = require('./config');
const JsAsset = require('./js-asset');
const ScssAsset = require('./scss-asset');

class AssetFactory {
  /**
   * @param {File} file
   * @return {*}
   */
  static create(file) {
    let assetsPath = config.getPath('app.assets');
    let type = file.getExt();

    switch (type) {
      case '.less':
        throw Error(`'${type}' is not supported`);
      case '.sass':
        return new ScssAsset(file, { includePaths: [assetsPath], indentedSyntax: true });
      case '.scss':
      case '.css':
        return new ScssAsset(file, { includePaths: [assetsPath] });
      case '.js':
        return new JsAsset(file);
      default:
        throw new Error(`${type} driver is not implemented!`);
    }
  }
}

module.exports = AssetFactory;
