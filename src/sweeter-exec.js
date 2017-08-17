#!/usr/bin/env node
import program from 'commander';
import fse from 'fs-extra';
import * as Utils from './utils/index.js';

program.parse(process.argv);

function execute(command) {
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
      if (templateJson[key].packageName && templateJson[key].status !== 'off') {
        let packageSlice = templateJson[key];
        sortedPackages.push(packageSlice);
        if (sortedPackages) {
          sortedPackages.sort(function(a, b) {
            return a.order - b.order;
          });
        }
      }
    }

    for (var i = 0; i < sortedPackages.length; i++) {
      let pathToDir = sortedPackages[i].pathToDir;
      let packageJsonPath = pathToDir + '/package.json';
      let packageJsonExistence = Utils.checkIfPathExists(packageJsonPath);
      if (packageJsonExistence) {
        let userCommand = '\n cd ' + pathToDir + ' && ' + command + ';';
        contentWithAppended += userCommand;
      } else {
        console.log('NO PACKAGE.JSON FOUND HERE');
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
  let array = program.rawArgs;
  array.splice(0, 2);
  let string = '';
  for (let arg in array) {
    string = string + ' ' + array[arg];
  }
  execute(string);
} catch (error) {
  console.log({error});
}
