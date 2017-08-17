#!/usr/bin/env node
import program from 'commander';
import * as Utils from './utils/index.js';

program.parse(process.argv);

export function updateOrderInCurrentTemplate(order) {
  try {
    let packageName = Utils.retrievePackageName();
    if (!packageName) {
      return console.log(
        'package in the current working directory does does not exist or does not have a name'
      );
    }
    let templateJson = Utils.retrieveCurrentLoadedTemplate();
    if (!templateJson) {
      Utils.bootstrapDefaultTemplate();
      templateJson = Utils.retrieveCurrentLoadedTemplate();
    }
    if (packageName in templateJson) {
      templateJson[packageName].order = Number(order[0]);
    }
    Utils.writeTemplateJsonBackToFile(templateJson);
    return;
  } catch (error) {
    console.log({error});
  }
}

try {
  if (!program.args.length) {
    console.error('value required');
    process.exit(1);
  } else {
    Utils.preCheck();
    updateOrderInCurrentTemplate(program.args);
    console.log('FINISHED');
  }
} catch (error) {
  console.log({error});
}
