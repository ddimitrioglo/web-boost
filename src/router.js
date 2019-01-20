'use strict';

const fs = require('fs');
const URL = require('url');
const path = require('path');
const { lookup } = require('mime-types');

class Router {
  /**
   * Router constructor
   */
  constructor() {
    this.static = path.join(process.cwd(), 'static');
    this.handlers = {};
  }

  /**
   * Set custom static files path
   * @param {String} staticPath
   */
  setStatic(staticPath) {
    this.static = staticPath;
  }

  /**
   * @param {String} url
   * @param {Function} handler
   */
  register(url, handler) {
    this.handlers[url] = handler;
  };

  /**
   * @param {Object} req
   * @param {Object} res
   * @return {void}
   */
  route(req, res) {
    this._getHandler(req).then(result => {
      res.writeHead(result.statusCode || 200, Object.assign({ 'Content-Type': 'text/html' }, result.headers));
      res.write(result.body);
      res.end();
    }).catch(err => {
      res.write(err.stack);
      res.end();
    });
  }

  /**
   * @param {Object} req
   * @return {Promise}
   * @private
   */
    _getHandler(req) {
    let { pathname } = URL.parse(req.url, true);

    if (this.handlers.hasOwnProperty(pathname)) {
      return this.handlers[pathname].apply(null, [req]);
    }

    return new Promise(resolve => {
      const file = path.join(this.static, pathname);

      fs.readFile(file, (err, res) => {
        if (err) {
          return resolve({
            statusCode: 404,
            headers: { 'Content-Type': 'text/plain' },
            body: 'No such route or file'
          });
        }

        return resolve({
          statusCode: 200,
          headers: { 'Content-Type': lookup(file) || 'text/html' },
          body: res
        });
      });
    });
  }
}

module.exports = new Router();
