#!/usr/bin/env node

'use strict';

const WebBoost = require('web-boost');
const WebBoostApp = new WebBoost();

WebBoostApp
  .configure()
  .addRoute({
    path: '/',
    view: 'index.twig',
    vars: {
      title: 'Home page',
      description: 'test description'
    },
    // assets: {
    //   '@assets/dist/index.min.js': [
    //     '@assets/src/js/main.js',
    //     '@assets/src/js/index.js'
    //   ],
    //   '@assets/dist/index.min.css': [
    //     '@assets/src/styles/main.scss',
    //     '@assets/src/styles/index.scss'
    //   ]
    // }
  })
  .addRoute({
    path: '/user',
    view: 'user.twig',
    vars: {
      title: 'Users12 page',
      description: 'Users page description'
    }
  })
  .listen(8080);
