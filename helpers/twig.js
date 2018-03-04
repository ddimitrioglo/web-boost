'use strict';

const Twig = require('twig');
const logger = require('../src/logger');

/**
 * Twig configuration
 */
Twig.extendFunction('asset', (asset) => {
  try {
    return asset.replace(/^@/, '/');
  } catch (error) {
    logger.error(`'asset()' syntax error: ${error.message}`);
  }
});

module.exports = Twig;
