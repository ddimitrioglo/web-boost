#!/usr/bin/env node

'use strict';

const path = require('path');
const { Monitor } = require('forever-monitor');

const appPath = process.cwd();
const [ port ] = process.argv.slice(2);

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
  watchIgnorePatterns: ['node_modules/**', 'assets/dist/**']
});

/**
 * Run forever monitor
 */
server.start();
