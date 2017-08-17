#!/usr/bin/env node
import program from 'commander';
import fse from 'fs-extra';
import * as Utils from './utils/index.js';

function removeAllLockfiles() {
  try {
    let templateJson = Utils.retrieveCurrentLoadedTemplate();
    if (!templateJson) {
      Utils.bootstrapDefaultTemplate();
      templateJson = Utils.retrieveCurrentLoadedTemplate();
    }
    for (let key in templateJson) {
      if (templateJson[key].packageName && templateJson[key].status !== 'off') {
        let pathToDir = templateJson[key].pathToDir;
        let lockfilePath = pathToDir + '/package-lock.json';
        let lockfileExistence = Utils.checkIfPathExists(lockfilePath);
        if (lockfileExistence) {
          console.log(
            new Date() +
              ': ' +
              'INITIATED REMOVAL OF PACKAGE LOCKFILE FOR ' +
              templateJson[key].packageName
          );
          fse.unlinkSync(pathToDir + '/package-lock.json', err => {
            if (err) return console.error(err);
          });
        }
        let shrinkwrapPath = pathToDir + '/npm-shrinkwrap.json';
        let shrinkwrapExistence = Utils.checkIfPathExists(shrinkwrapPath);
        if (shrinkwrapExistence) {
          console.log(
            new Date() +
              ': ' +
              'INITIATED REMOVAL OF PACKAGE LOCKFILE FOR ' +
              templateJson[key].packageName
          );
          fse.unlinkSync(pathToDir + '/npm-shrinkwrap.json', err => {
            if (err) return console.error(err);
          });
        }
      }
    }
  } catch (error) {
    console.log({error});
  }
}

try {
  Utils.preCheck();
  removeAllLockfiles();
  console.log('FINISHED');
} catch (error) {
  console.log({error});
}
