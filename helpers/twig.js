'use strict';

const Twig = require('twig');

/**
 * Twig configuration
 */
Twig.extendFunction('asset', (asset) => {
  return asset.replace(/^@/, '/');
});

module.exports = Twig;
