#!/usr/bin/env node
import program from 'commander';
import * as Utils from './utils/index.js';

program.parse(process.argv);

export function setCurrentTemplate(templateFileName) {
  try {
    if (!templateFileName) {
      return console.log(
        'argument [templateFileName] should exist and be a valid json file'
      );
    }
    let checkExists = Utils.fileCheck(Utils.configLocation());
    if (checkExists) {
      let jsonObj = Utils.readJsonObjFromFile(Utils.configLocation());
      if (jsonObj) {
        let updatedObj = Utils.setKeyValue(
          jsonObj,
          'currentTemplate',
          templateFileName
        );
        return Utils.writeJsonToFile(
          Utils.configDirectoryLocation(),
          'config.json',
          updatedObj
        );
      }
    }
  } catch (error) {
    console.log({error});
  }
}

try {
  if (!program.args.length) {
    console.error(
      'template file must be supplied (example: sweeter load-template my-template.json)'
    );
    process.exit(1);
  } else {
    Utils.preCheck();
    setCurrentTemplate(program.args);
    console.log('FINISHED');
  }
} catch (error) {
  console.log({error});
}
