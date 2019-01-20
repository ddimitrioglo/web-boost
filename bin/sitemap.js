#!/usr/bin/env node

'use strict';

const url = require('url');
const fse = require('fs-extra');
const path = require('path');
const logger = require('../src/logger');
const config = require('../src/config');

const [ domain ] = process.argv.slice(2);

if (!domain) {
  logger.error('Domain is required');
  process.exit(1);
}

const URL = url.parse(domain);

if (!URL.protocol) {
  logger.error('Required domain format: http(s)://domain.com');
  process.exit(1);
}

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
