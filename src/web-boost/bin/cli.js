#!/usr/bin/env node

'use strict';

const path = require('path');
const { Monitor } = require('forever-monitor');

const appPath = process.cwd();
const [port, config] = process.argv.slice(2);

/**
 * Configure forever monitor
 */
const server = new Monitor(path.join(__dirname, '../index.js'), {
  max: 3,
  args: [
    port || 8080,
    path.join(appPath, config ? config : 'web-boost.json')
  ],
  watch: true,
  watchDirectory: appPath,
  watchIgnorePatterns: ['node_modules/**', 'assets/dist/**']
});

/**
 * Run forever monitor
 */
server.start();
