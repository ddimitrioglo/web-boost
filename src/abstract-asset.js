'use strict';

class AbstractAsset {
  /**
   * @param {File} file
   */
  constructor(file) {
    this._file = file;
  }

  /**
   * Get file object
   * @return {File}
   */
  file() {
    return this._file;
  }

  /**
   * @return {Promise}
   */
  rawContent() {
    return this._file.getContent();
  }

  /**
   * @return {Promise}
   */
  minify() {
    return Promise.reject(new Error(
      `${ this.constructor.name }.minify() not implemented!`
    ));
  }
}

module.exports = AbstractAsset;
