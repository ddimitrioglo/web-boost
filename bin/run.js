#!/usr/bin/env node

'use strict';

const path = require('path');
const watch = require('node-watch');
const logger = require('../src/logger');
const config = require('../src/config');
const cluster = require('cluster');

const port = config.get('server.port');
const delay = config.get('server.delay');
const retries = config.get('server.retries');
const server = path.join(__dirname, '../index.js');
const ignorePatterns = [config.get('app.static'), ...config.get('server.ignorePatterns')].map(it => new RegExp(it, 'i'));

cluster.setupMaster({ exec: server });

let fails = 0;
let files = 0;
let worker = cluster.fork();
logger.info(`Starting... (http://localhost:${port})`);

/**
 * Watcher config
 */
watch(process.cwd(), {
  recursive: true,
  filter: it => ignorePatterns.every(regex => !regex.test(it))
}, (evt, name) => {
  files++;
});

/**
 * Delayed restart
 */
setInterval(() => {
  if (files > 0 && !worker.isDead()) {
    worker.send('restart');
    files = 0;
  }
}, delay);

/**
 * Child restart handling
 */
cluster.on('exit', (deadWorker, code) => {
  if (code === 1) {
    fails++;
  }

  if (fails > retries) {
    logger.error('Constantly failing...');
    process.exit(1);
  }

  worker = cluster.fork();
  logger.info('Restarting...');
});
