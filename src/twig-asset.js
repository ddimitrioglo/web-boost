'use strict';

const Twig = require('../helpers/twig');
const { minify } = require('html-minifier');
const AbstractAsset = require('./abstract-asset');

class TwigAsset extends AbstractAsset {
  /**
   * @param {File} file
   * @param {Object} vars
   */
  constructor(file, vars = {}) {
    super(file);

    this._vars = vars;
  }

  /**
   * Get html from twig
   * @returns {Promise}
   */
  rawContent() {
    return new Promise((resolve, reject) => {
      Twig.renderFile(this.file().fullPath(), this._vars, (err, html) => {
        if (err) {
          return reject(err);
        }

        resolve(html);
      });
    });
  }

  /**
   * Minify html
   * @returns {Promise}
   */
  minify() {
    return this.rawContent().then(html => {
      return Promise.resolve(
        minify(html, {
          removeComments: true,
          collapseWhitespace: true,
          removeStyleLinkTypeAttributes: true
        })
      );
    });
  }
}

module.exports = TwigAsset;
