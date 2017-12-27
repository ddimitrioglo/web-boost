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
   * @returns {File}
   */
  file() {
    return this._file;
  }

  /**
   * @returns {Promise}
   */
  rawContent() {
    return this._file.getContent();
  }

  /**
   * @returns {Promise}
   */
  minify() {
    return Promise.reject(new Error(
      `${ this.constructor.name }.minify() not implemented!`
    ));
  }
}

module.exports = AbstractAsset;
