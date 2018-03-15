#!/usr/bin/env node

'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
let [ appName, destination ] = process.argv.slice(2);

if (!appName || !destination) {
  console.log('Usage: web-boost-cli [app-name] [path]');
  process.exit(1);
}

const sourcePath = path.join(__dirname, 'skeleton');
const destinationPath = path.resolve(process.cwd(), destination);
const appPackageJson = path.join(destination, 'package.json');

fse.copy(sourcePath, destinationPath).then(() => {
  fs.renameSync(`${appPackageJson}.tmpl`, appPackageJson);

  const packageSrc = JSON.parse(fs.readFileSync(appPackageJson));
  const packageOut = JSON.stringify(packageSrc, (key, val) => (key === 'name') ? appName : val, 2);

  fs.writeFileSync(appPackageJson, packageOut);

  console.log(`${appName} successfully generated (cd ${destinationPath})`);
}).catch(err => {
  throw err;
});
