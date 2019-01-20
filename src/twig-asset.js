'use strict';

const { minify } = require('html-minifier');
const AbstractAsset = require('./abstract-asset');
const { renderView } = require('./config');

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
    return renderView(this.file().fullPath(), this._vars);
  }

  /**
   * Minify html
   * @returns {Promise}
   */
  minify() {
    return this.rawContent().then(html => minify(html, {
      removeComments: true,
      collapseWhitespace: true,
      removeStyleLinkTypeAttributes: true
    }));
  }
}

module.exports = TwigAsset;
