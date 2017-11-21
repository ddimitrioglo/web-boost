'use strict';

const UglifyJS = require('uglify-es');
const AbstractAsset = require('./abstract-asset');

class JsAsset extends AbstractAsset {
  /**
   * @param {File} file
   */
  constructor(file) {
    super(file);
  }

  /**
   * Transpile & minify js
   * @returns {Promise}
   */
  minify() {
    return this.rawContent().then(buffer => {
      let script = buffer.toString();

      if (this.isJsMinified()) {
        return Promise.resolve(script);
      }

      return new Promise((resolve, reject) => {
        let result = UglifyJS.minify(script, {});

        if (result.error) {
          return reject(result.error);
        }

        resolve(result.code);
      });
    });
  }

  /**
   * Check if file is js and minified
   * @returns {Boolean}
   */
  isJsMinified() {
    return /.*\.min\.js/.test(this.file().path());
  }
}

module.exports = JsAsset;
