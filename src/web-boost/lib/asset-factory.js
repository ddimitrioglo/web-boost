'use strict';

const JsAsset = require('./js-asset');
const ScssAsset = require('./scss-asset');

class AssetFactory {
  /**
   * @param {File} file
   * @return {*}
   */
  static create(file) {
    let type = file.getExt();

    switch (type) {
      case '.sass':
      case '.less':
        throw Error(`'${type}' is not supported`);
        break;
      case '.scss':
      case '.css':
        return new ScssAsset(file);
        break;
      case '.js':
        return new JsAsset(file);
        break;
      default:
        throw new Error(`${type} driver is not implemented!`);
    }
  }
}

module.exports = AssetFactory;
