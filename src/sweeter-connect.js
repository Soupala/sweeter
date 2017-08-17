#!/usr/bin/env node
import program from 'commander';
import * as Utils from './utils/index.js';

export function savePackageLocationToCurrentTemplate(
  packageName,
  pathToDir,
  linkedDependencies,
  order
) {
  try {
    let templateJson = Utils.retrieveCurrentLoadedTemplate();
    if (!templateJson) {
      Utils.bootstrapDefaultTemplate();
      templateJson = Utils.retrieveCurrentLoadedTemplate();
    }
    if (packageName in templateJson) {
      templateJson[packageName].pathToDir = pathToDir;
    } else {
      templateJson = Object.assign({}, templateJson, templateJson[packageName]);
      templateJson[packageName] = {
        packageName,
        pathToDir,
        linkedDependencies,
        order
      };
    }
    Utils.writeTemplateJsonBackToFile(templateJson);
    return;
  } catch (error) {
    console.log({error});
  }
}

try {
  Utils.preCheck();
  let defaultOrder = 0;
  let linkedDependencies = [];
  let pathToDir = Utils.getAbsPathToCurrentLocation();
  let isAPackage = Utils.fileCheck(pathToDir + '/' + 'package.json');
  if (isAPackage) {
    let packageName = Utils.retrievePackageName();
    savePackageLocationToCurrentTemplate(
      packageName,
      pathToDir,
      linkedDependencies,
      defaultOrder
    );
    console.log('FINISHED');
  } else {
    console.log(
      'A valid package.json in the current directory is required for this command.'
    );
  }
} catch (error) {
  console.log({error});
}
