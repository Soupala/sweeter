import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';
import touch from 'touch';
import homedir from 'homedir';
import shell from 'shelljs';
import Package from '../../package.json';

// export function execCommand(command) {
//   try {
//     shell.exec(command, function(code, stdout, stderr) {
//       if (stdout) {
//         console.log(new Date() + ': ' + stdout);
//       }
//       if (stderr) {
//         console.log(new Date() + ': ' + stderr);
//         console.log('Code:', code);
//       }
//     });
//   } catch (error) {
//     console.log({error});
//   }
// }

export async function execCommand(command) {
  console.log('command', command);
  if (command) {
    try {
      await shell.exec(command, function(code, stdout, stderr) {
        if (stdout) {
          console.log(new Date() + ':' + 'EXECUTING COMMAND - ' + command);
          console.log(new Date() + ': ' + stdout);
        }
        if (stderr) {
          console.log(new Date() + ': ' + stderr);
          console.log('EXIT CODE:', code);
        }
        if (code === 0) {
          return;
        }
      });
    } catch (error) {
      console.log({error});
    }
  }
}

export const defaultSettings = {
  basePath: homedir() + '/.sweeter',
  templatesDirectory: 'templates',
  currentTemplate: 'default.json'
};

export function bootstrapConfig() {
  let filename = 'config.json';
  let json = {
    basePath: defaultSettings.basePath,
    templatesDirectory: defaultSettings.templatesDirectory,
    currentTemplate: defaultSettings.currentTemplate
  };
  let gitignoreContent = '.tmp';
  gitignoreContent += '\n config.js';
  fse.ensureDir(defaultSettings.basePath);
  writeContentToFile(defaultSettings.basePath, '.gitignore', gitignoreContent);
  return writeJsonToFile(defaultSettings.basePath, filename, json);
}

export function configDirectoryLocation() {
  return homedir() + '/.sweeter';
}

export function configLocation() {
  return homedir() + '/.sweeter/config.json';
}

export function bootstrapDefaultTemplate() {
  let filename = 'default.json';
  let json = {templateName: 'default'};
  return writeJsonToFile(
    defaultSettings.basePath + '/' + defaultSettings.templatesDirectory,
    filename,
    json
  );
}

export function configExistence() {
  try {
    let basePathExists = checkIfPathExists(configLocation());
    if (basePathExists) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export function templateExistence() {
  try {
    let configJsonFile = fileCheck(configLocation());
    if (configJsonFile) {
      let configJson = JSON.parse(fs.readFileSync(configLocation()));
      let basePath = configJson.basePath;
      let templatesDirectory = configJson.templatesDirectory;
      let currentTemplate = configJson.currentTemplate;
      let templateCheck = checkIfPathExists(
        basePath + '/' + templatesDirectory + '/' + currentTemplate
      );
      if (templateCheck) {
        return true;
      } else return false;
    }
  } catch (error) {
    return false;
  }
}

export function getAbsPathToCurrentLocation() {
  try {
    return process.cwd();
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function checkIfPathExists(fileOrFolderPath) {
  try {
    return fs.existsSync(fileOrFolderPath);
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function fileCheck(pathToFile) {
  try {
    let actualCheck = checkIfPathExists(pathToFile);
    if (actualCheck) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log({error});
  }
}

export function retrievePackageName() {
  try {
    let file = getAbsPathToCurrentLocation() + '/' + 'package.json';
    let checkExists = fileCheck(file);
    if (checkExists) {
      let packageJson = JSON.parse(fs.readFileSync(file));
      let name = packageJson.name;
      return name;
    } else return false;
  } catch (error) {
    return false;
  }
}

export function readJsonObjFromFile(absPathToFile) {
  return JSON.parse(fs.readFileSync(absPathToFile));
}

export function setKeyValue(jsonObj, key, value) {
  try {
    if (!jsonObj || !key || !value) {
      console.log('something is missing');
      return false;
    } else {
      if (key in jsonObj) {
        jsonObj[key] = value;
      } else {
        jsonObj = Object.assign({}, jsonObj, jsonObj[key]);
        jsonObj[key] = value;
      }
      return jsonObj;
    }
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function writeJsonToFile(pathToDir, filename, json) {
  try {
    if (pathToDir && filename && json) {
      fse
        .ensureDir(pathToDir)
        .then(() => {
          touch.sync(pathToDir + '/' + filename);
          fs.writeFile(
            pathToDir + '/' + filename,
            JSON.stringify(json, null, 2),
            function(error) {
              if (error) return console.log({error});
            }
          );
        })
        .catch(err => {
          console.error({err});
        });
    }
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function writeContentToFile(pathToDir, filename, content) {
  try {
    if (pathToDir && filename && content) {
      fse
        .ensureDir(pathToDir)
        .then(() => {
          touch.sync(pathToDir + '/' + filename);
          fs.writeFile(pathToDir + '/' + filename, content, function(error) {
            if (error) return console.log({error});
          });
        })
        .catch(err => {
          console.error({err});
        });
    }
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function writeTemplateJsonBackToFile(templateJson) {
  try {
    let jsonConfigFile = configLocation();
    let checkExists = fileCheck(jsonConfigFile);
    if (checkExists) {
      let configJson = JSON.parse(fs.readFileSync(jsonConfigFile));
      let templateDirectory = configJson.templatesDirectory;
      let templateFileName = configJson.currentTemplate;
      return writeJsonToFile(
        configDirectoryLocation() + '/' + templateDirectory,
        templateFileName,
        templateJson
      );
    } else {
      console.log(jsonConfigFile + ' is missing.');
      return false;
    }
  } catch (error) {
    console.log({error});
  }
}

export function retrieveCurrentLoadedTemplate() {
  try {
    let jsonConfigFile = configLocation();
    let checkExists = fileCheck(jsonConfigFile);
    let jsonConfig = JSON.parse(fs.readFileSync(jsonConfigFile));
    if (checkExists) {
      let templateDirectory = jsonConfig.templatesDirectory;
      let templateFileName = jsonConfig.currentTemplate;
      let templateFileCheck = fileCheck(
        homedir() + '/.sweeter/' + templateDirectory + '/' + templateFileName
      );
      if (templateFileCheck) {
        let templateJson = JSON.parse(
          fs.readFileSync(
            homedir() +
              '/.sweeter/' +
              templateDirectory +
              '/' +
              templateFileName
          )
        );
        return templateJson;
      }
    } else {
      console.log('unable to retrieve template');
      return false;
    }
  } catch (error) {
    console.log({error});
    return false;
  }
}

export function preCheck() {
  try {
    let checkConfig = configExistence();
    if (!checkConfig) {
      bootstrapConfig();
      console.log('BOOTSTRAPPED CONFIG');
    }
    let checkTemplate = templateExistence();
    if (!checkTemplate) {
      bootstrapDefaultTemplate();
      console.log('BOOTSTRAPPED DEFAULT TEMPLATE');
    }
    return true;
  } catch (error) {
    console.log({error});
  }
}

export function dedupeArray(array) {
  var prims = {boolean: {}, number: {}, string: {}},
    objs = [];

  return array.filter(function(item) {
    var type = typeof item;
    if (type in prims)
      return prims[type].hasOwnProperty(item)
        ? false
        : (prims[type][item] = true);
    else return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}

export function utcShellFilename() {
  const dateForFilename = new Date();
  return (
    dateForFilename.getUTCFullYear() +
    '-' +
    dateForFilename.getUTCDate() +
    '-' +
    dateForFilename.getUTCHours() +
    '-' +
    dateForFilename.getUTCMinutes() +
    '-' +
    dateForFilename.getUTCSeconds() +
    '.sh'
  );
}
