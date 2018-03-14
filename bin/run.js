#!/usr/bin/env node

'use strict';

const path = require('path');
const config = require('../src/config');
const { Monitor } = require('forever-monitor');

const appPath = process.cwd();
const [ port ] = process.argv.slice(2);

/**
 * Init web-boost config
 */
config.init(appPath);

/**
 * Configure forever monitor
 */
const server = new Monitor(path.join(__dirname, '../index.js'), {
  max: 3,
  args: [
    port || 8080,
    appPath
  ],
  watch: true,
  watchDirectory: appPath,
  watchIgnorePatterns: ['node_modules/**', `${config.get('app.static')}/**`]
});

/**
 * Run forever monitor
 */
server.start();
