'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');

class File {
  /**
   * @param {String} path
   * @param {String} appPath
   */
  constructor(path, appPath) {
    this._path = path;
    this._fullPath = (/^@.*/.test(path)) ? path.replace('@', `${appPath}/`) : path;
    this._url = url.parse(/^\/\/.*/.test(path) ? `http:${path}` : path);
    this._content = false;
  }

  /**
   * @returns {String|*}
   */
  path() {
    return this._path;
  }

  /**
   * Get url object (if path is remote)
   * @returns {Url|boolean}
   */
  url() {
    return this.isRemote() ? this._url : false;
  }

  /**
   * Get file's absolute path (if it's local)
   * @returns {String|Boolean}
   */
  fullPath() {
    return this.isRemote() ? false : path.resolve(this._fullPath);
  }

  /**
   * Get local file extension
   * @return {String|Boolean}
   */
  getExt() {
    return this.isRemote() ? false : path.extname(this._fullPath);
  }

  /**
   * Check if file is remote
   * @returns {Boolean}
   */
  isRemote() {
    return Boolean(this._url.hostname);
  }

  /**
   * Get file content
   * @returns {Promise<Buffer>}
   */
  getContent() {
    if (this._content) {
      return Promise.resolve(this._content);
    }

    return this.url() ? this.getRemoteContent() : this.getLocalContent();
  }

  /**
   * Set content to the local file
   * @param {String|Buffer} content
   * @returns {Promise}
   */
  setContent(content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.fullPath(), content, { flag: 'w+' }, err => {
        return err ? reject(err) : resolve('Done');
      });
    });
  }

  /**
   * Get local file content
   * @returns {Promise}
   */
  getLocalContent() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.fullPath(), null, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

  /**
   * Get remote content (imitate Chrome)
   * @returns {Promise}
   */
  getRemoteContent() {
    return new Promise((resolve, reject) => {
      let protocol = this._url.protocol.replace(':', '');
      let options = Object.assign({}, this._url, {
        headers: {
          'User-Agent': File.USER_AGENT
        }
      });

      require(protocol).request(options, res => {
        let buffers = [];
        res.on('data', data => { buffers.push(data); });
        res.on('end', () => {
          this._content = Buffer.concat(buffers);
          resolve(this._content);
        });
      }).on('error', err => {
        reject(err);
      }).end();
    });
  }

  /**
   * Request User-Agent
   * @returns {String}
   * @constructor
   */
  static get USER_AGENT() {
    return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';
  }
}

module.exports = File;
