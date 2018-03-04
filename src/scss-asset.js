'use strict';

const sass = require('node-sass');
const AbstractAsset = require('./abstract-asset');

class ScssAsset extends AbstractAsset {
  /**
   * @param {File} file
   * @param {Object} config
   */
  constructor(file, config = {}) {
    super(file);

    this._config = config;
  }

  /**
   * Transpile & minify scss to css
   * @returns {Promise}
   */
  minify() {
    return this.rawContent().then(buffer => {
      let styles = buffer.toString();

      if (this.isCssMinified()) {
        return Promise.resolve(styles);
      }

      return new Promise((resolve, reject) => {
        const config = Object.assign({ data: styles, outputStyle: 'compressed' }, this._config);

        sass.render(config, (err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(res.css.toString());
        });
      });
    });
  }

  /**
   * Check if file is css and minified
   * @returns {Boolean}
   */
  isCssMinified() {
    return /.*\.min\.css$/.test(this.file().fullPath());
  }
}

module.exports = ScssAsset;
