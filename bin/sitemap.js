#!/usr/bin/env node

'use strict';

const url = require('url');
const fse = require('fs-extra');
const path = require('path');
const logger = require('../src/logger');
const config = require('../src/config');

const appPath = process.cwd();
const [ domain ] = process.argv.slice(2);
const URL = url.parse(domain);

if (!URL.protocol) {
  logger.error('Domain format: http(s)://domain.com');
  process.exit(1);
}

/**
 * Init web-boost config
 */
config.init(appPath);

const today = new Date();
const origin = `${URL.protocol}//${URL.hostname}`;
const rows = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

/**
 * Refresh all page urls
 */
Object.keys(config.get('routes')).forEach(routeName => {
  rows.push(`  <url>
    <loc>${origin}${routeName}</loc>
    <lastmod>${today.toISOString().slice(0,10)}</lastmod>
  </url>`);
});

rows.push('</urlset>');

/**
 * Save sitemap.xml into build directory
 */
fse.outputFile(path.join(config.getPath('app.build'), 'sitemap.xml'), rows.join('\n')).then(() => {
  logger.log('sitemap.xml has been refreshed');
});
