'use strict';

class Logger {
  /**
   * @param message
   */
  static log(message) {
    Logger._log(Logger.LOG, message);
  }

  /**
   * @param message
   */
  static info(message) {
    Logger._log(Logger.INFO, message);
  }

  /**
   * @param {String} message
   */
  static error(message) {
    Logger._log(Logger.ERROR, message);
  }

  /**
   * @param {String} type
   * @param {String} message
   * @private
   */
  static _log(type, message) {
    const time = `[${(new Date()).toISOString()}]`;

    switch (type) {
      case Logger.LOG:
        console.log('✅', time, message);
        break;
      case Logger.INFO:
        console.log('💡', time, message);
        break;
      case Logger.ERROR:
        console.log('❌', time, message);
        break;
    }
  }

  /**
   * @returns {String}
   * @constructor
   */
  static get LOG() {
    return 'log';
  }

  /**
   * @returns {String}
   * @constructor
   */
  static get INFO() {
    return 'info';
  }

  /**
   * @returns {String}
   * @constructor
   */
  static get ERROR() {
    return 'error';
  }
}

module.exports = Logger;
