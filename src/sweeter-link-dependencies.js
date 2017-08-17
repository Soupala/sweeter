#!/usr/bin/env node
import program from 'commander';
import * as Utils from './utils/index.js';

function linkPackagesToGlobal(sortedPackages) {
  try {
    for (var key = 0; key < sortedPackages.length; key++) {
      if (templateJson[key].packageName && templateJson[key].status !== 'off') {
        let packageLocation = sortedPackages[key].pathToDir;
        let linkCommandString = 'cd ' + packageLocation + '; ' + 'npm link';
        console.log(
          new Date() +
            ': ' +
            'INITIATED LINKING OF PACKAGE ' +
            packageLocation +
            ' == > GLOBAL NODE_MODULES'
        );
        Utils.execCommand(linkCommandString);
      }
    }
  } catch (error) {
    console.log({error});
  }
}

function linkDependenciesToGlobal(sortedPackages) {
  try {


    // for (var i = 0; i < sortedPackages.length; i++) {
    //   let pathToDir = sortedPackages[i].pathToDir;
    for (var key = 0; key < sortedPackages.length; key++) {
      if (sortedPackages[key].packageName && templateJson[key].status !== 'off') {
        let pathToDir = sortedPackages[key].pathToDir;
        let packageJsonPath = pathToDir + '/package.json';
        let packageJsonExistence = Utils.checkIfPathExists(packageJsonPath);
        if (packageJsonExistence) {
          let deps = sortedPackages[key].linkDependencies;
          for (let depKey in deps) {
            let dep = deps[depKey];
            appendCommands =
              'cd ' + packageLocation + '; ' + 'npm link ' + dep;
            console.log(
              new Date() +
                ': ' +
                'INITIATED SYMLINKING ' +
                packageLocation +
                ' - INTO PACKAGE ' +
                dep
            );
          }
        } else {
          console.log('NO PACKAGE.JSON FOUND HERE');
        }
      }
    }
  } catch (error) {
    console.log({error});
  }
}

function linkDependencies() {
  try {
    let templateJson = Utils.retrieveCurrentLoadedTemplate();
    if (!templateJson) {
      Utils.bootstrapDefaultTemplate();
      templateJson = Utils.retrieveCurrentLoadedTemplate();
    }

    // generate a temp file for writing the shell script to be generated

    const tempPath = Utils.configDirectoryLocation() + '/.tmp';
    const utcFilename = Utils.utcShellFilename();
    let initialContent = '#!/bin/sh';

    // will take content appends from the loop
    let contentWithAppended = initialContent;

    Utils.writeContentToFile(tempPath, utcFilename, initialContent);

    let sortedPackages = [];

    // sort the keys first
    for (let key in templateJson) {
      if (templateJson[key].packageName) {
        let packageSlice = templateJson[key];
        sortedPackages.push(packageSlice);
        if (sortedPackages) {
          sortedPackages.sort(function(a, b) {
            return a.order - b.order;
          });
        }
      }
    }

    for (var key = 0; key < sortedPackages.length; key++) {
      if (sortedPackages[key].packageName) {
        let packageLocation = sortedPackages[key].pathToDir;
        let userCommand = '\n cd ' + packageLocation + '; ' + 'npm link;';
        contentWithAppended += userCommand;
        let feedback = '\n echo \'' + new Date() + ': ' + 'INITIATED LINKING OF PACKAGE ' + packageLocation + ' == > GLOBAL NODE_MODULES' + '\';';
        contentWithAppended += feedback;
      }
    }

    for (var key = 0; key < sortedPackages.length; key++) {
      if (sortedPackages[key].packageName) {
        let packageLocation = sortedPackages[key].pathToDir;
        let packageJsonPath = packageLocation + '/package.json';
        let packageJsonExistence = Utils.checkIfPathExists(packageJsonPath);
        if (packageJsonExistence) {
          let deps = sortedPackages[key].linkDependencies;
          for (let depKey in deps) {
            let dep = deps[depKey];
              let userCommand = '\n cd ' + packageLocation + '; ' + 'npm link ' + dep + ';';
              contentWithAppended += userCommand;
              let feedback = '\n echo \'' + new Date() + ': ' + 'INITIATED LINKING OF ' + packageLocation + ' - INTO PACKAGE ' + dep + '\';';
              contentWithAppended += feedback;
          }
        } else {
          console.log('NO PACKAGE.JSON FOUND HERE');
        }
      }
    }

    Utils.writeContentToFile(tempPath, utcFilename, contentWithAppended);

    let shellCommand = 'sh ' + tempPath + '/' + utcFilename;

    Utils.execCommand(shellCommand);

  } catch (error) {
    console.log({error});
  }
}

try {
  Utils.preCheck();
  linkDependencies();
} catch (error) {
  console.log({error});
}
