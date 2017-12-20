#!/usr/bin/env node

'use strict';

// @todo
// check if server is already running
// include fs-extra
// minify html during compile

const fs = require('fs');
const url = require('url');
const path = require('path');
const Crawler = require('crawler');

const appPath = process.cwd();
const server = 'http://localhost:8080/';
const buildPath = path.join(appPath, '_build/');
const config = require(path.join(appPath, 'web-boost.json'));

const crawler = new Crawler({
  callback: (error, res, done) => {
    const uri = res.options.uri;
    const dist = uri.replace(server, buildPath);

    if (!error) {
      try {
        fs.mkdirSync(dist);
      } catch(e) {
        if ( e.code !== 'EEXIST' ) throw e;
      }

      fs.writeFile(path.join(dist, 'index.html'), res.body, () => {
        console.log(uri +' successfully compiled');
      });
    }
    done();
  }
});

crawler.queue(Object.keys(config.routes).map(route => url.resolve(server, route)));
