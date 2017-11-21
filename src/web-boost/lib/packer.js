'use strict';

const fs = require('fs');
const File = require('./file');
const AssetFactory = require('./asset-factory');

class Packer {
  /**
   * @param {Array} entryFiles
   * @param {String} outFile
   * @param {String} relativeTo
   */
  constructor(entryFiles, outFile, relativeTo) {
    this._outFile = new File(outFile, relativeTo);

    this._entryAssets = entryFiles.map(filePath => {
      return AssetFactory.create(new File(filePath, relativeTo), Packer.getExt(outFile));
    });
  }

  /**
   * File watcher
   * @param {Function} callback
   */
  watch(callback) {
    this._entryAssets.forEach(asset => {
      if (asset.file().fullPath()) {
        // force a restart
        // nodemon.emit('restart');
        fs.watchFile(asset.file().fullPath(), callback);
      }
    });
  }



  // watch(fromStart = false) {
  //   if (fromStart) {
  //     fs.watchFile(Packer.NON_EXISTING_FILE, this.pack.bind(this));
  //   }
  //
  //   this._entryAssets.forEach(asset => {
  //     if (asset.file().fullPath()) {
  //       fs.watchFile(asset.file().fullPath(), this.pack.bind(this));
  //     }
  //   });
  // }

  /**
   * Minify entry files and pack into out file
   * @returns {Promise}
   */
  pack() {
    return new Promise((resolve, reject) => {
      let promises = this._entryAssets.map(asset => {
        return asset.minify().then(content => Promise.resolve(Buffer.from(content, 'utf8')));
      });

      Promise.all(promises).then(buffers => {
        this._outFile.setContent(Buffer.concat(buffers)).then(() => {
          resolve(this._outFile);
        })
      }).catch(err => reject(err));
    });
  }

  static getExt(fileName) {
    return fileName.split('.').pop();
  }

  /**
   * Get non-existing file
   * @purpose trigger ENOENT error on watch
   * @returns {String}
   * @constructor
   */
  static get NON_EXISTING_FILE() {
    return './nonexistent.file';
  }
}

module.exports = Packer;
