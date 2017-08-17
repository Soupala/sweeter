#!/usr/bin/env node
import program from 'commander';
import fse from 'fs-extra';
import * as Utils from './utils/index.js';

program.parse(process.argv);

function updateVersionAll(versionString) {
  try {
    let templateJson = Utils.retrieveCurrentLoadedTemplate();
    if (!templateJson) {
      console.log('template missing');
    }
    for (let key in templateJson) {
      if (templateJson[key].packageName && ( !templateJson[key].status || templateJson[key].status !== 'off')) {
        console.log('templateJson[key]', templateJson[key]);
        let packageToLookFor = templateJson[key].packageName;
        let pathToDir = templateJson[key].pathToDir;
        let packageJsonPath = pathToDir + '/package.json';
        let packageJsonExistence = Utils.checkIfPathExists(packageJsonPath);
        if (packageJsonExistence) {
          let packageJson = JSON.parse(fse.readFileSync(packageJsonPath));
          let name = packageJson.name;
          if (name === packageToLookFor) {
            console.log('updating ' + name + ' to version ' + versionString);
            Utils.setKeyValue(packageJson, 'version', versionString);
          } else {
            console.log(
              packageToLookFor +
                ' was not found in the package.json name property'
            );
            console.log(
              'Please check ' +
                packageToLookFor +
                's for a valid name or fix it in the template, then rerun the command'
            );
            return;
          }
          // loop through all the packages in the current template and compare in dependencies, peerDependencies, devDependencies, and optionalDependencies
          let dependencies = packageJson['dependencies'];
          if (dependencies) {
            console.log('---looping through dependencies---');
            for (let dependency in dependencies) {
              for (let key in templateJson) {
                let name = templateJson[key].packageName;
                if (dependency === name && ( !templateJson[key].status || templateJson[key].status !== 'off')) {
                  console.log(
                    'updating ' + name + ' to version ' + versionString
                  );
                  dependencies[name] = versionString;
                  packageJson['dependencies'] = dependencies;
                }
              }
            }
          }
          let peerDependencies = packageJson['peerDependencies'];
          if (peerDependencies) {
            console.log('---looping through peerDependencies---');
            for (let peerDependency in peerDependencies) {
              for (let key in templateJson) {
                let name = templateJson[key].name;
                if (peerDependency === name && ( !templateJson[key].status || templateJson[key].status !== 'off')) {
                  console.log(
                    'updating ' + name + ' to version ' + versionString
                  );
                  peerDependencies[name] = versionString;
                  packageJson['peerDependencies'] = peerDependencies;
                }
              }
            }
          }
          let devDependencies = packageJson['devDependencies'];
          if (devDependencies) {
            console.log('---looping through devDependencies ---');
            for (let devDependency in devDependencies) {
              for (let key in templateJson) {
                let name = templateJson[key].name;
                if (devDependency === name && ( !templateJson[key].status || templateJson[key].status !== 'off')) {
                  console.log(
                    'updating ' + name + ' to version ' + versionString
                  );
                  devDependencies[name] = versionString;
                  packageJson['devDependencies'] = devDependencies;
                }
              }
            }
          }
          let optionalDependencies = packageJson['optionalDependencies'];
          if (optionalDependencies) {
            for (let optionalDependency in optionalDependencies) {
              for (let key in templateJson) {
                let name = templateJson[key].name;
                if (optionalDependency === name && ( !templateJson[key].status || templateJson[key].status !== 'off')) {
                  console.log(
                    'updating ' + name + ' to version ' + versionString
                  );
                  optionalDependencies[name] = versionString;
                  packageJson['optionalDependencies'] = optionalDependencies;
                }
              }
            }
          }
          Utils.writeJsonToFile(pathToDir, 'package.json', packageJson);
        }
      }
    }
  } catch (error) {
    console.log({error});
  }
}

try {
  updateVersionAll(program.args[0]);
  console.log('FINISHED');
} catch (error) {
  console.log({error});
}
