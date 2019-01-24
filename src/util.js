'use strict';

const mergeWith = require('lodash.mergewith');
const { createHash } = require('crypto');

/**
 * @param {String} text
 * @returns {*}
 */
function toMd5(text) {
  return createHash('md5').update(text).digest('hex');
}

/**
 * Get timestamp based uuid
 * @return {*}
 */
function uuid() {
  return toMd5(Date.now().toString());
}

/**
 * Recursively merges object properties
 * @param {Object} object
 * @param {Object} source
 * @returns {Object}
 */
function extend(object, ...source) {
  return mergeWith(object, ...source, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}

/**
 * Public methods
 */
module.exports = {
  extend
};
