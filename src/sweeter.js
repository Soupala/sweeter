#!/usr/bin/env node

import program from 'commander';

import updateNotifier from 'update-notifier';
import pkg from '../package.json';
updateNotifier({pkg}).notify();

program
  .description('Tools for concurrent package development.')
  .command('init', 'Adds the default config and template files.')
  .command(
    'connect',
    'Adds package from current working directory to the current template.'
  )
  .command(
    'save-local-dependency <dependency> [moreDependencies...]',
    'Saves one or more inter-dependencies to current template for the package in the current working directory.'
  )
  .command(
    'save-order <order>',
    '<order> Must be numeric value. Saves or updates the `order` property to current template for package in the current working directory.'
  )
  .command(
    'remove-local-dependency <dependency> [moreDependencies...]',
    'Removes one or more inter-dependencies to current template for the package in the current working directory.'
  )
  .command(
    'switch <templateFile>',
    'Switches to the specified template file in the ~/.sweeter/templates directory.'
  )
  .command(
    'exec <command>',
    'Loops through all of the packages and executes the provided command string.'
  )
  .command(
    'link-dependencies',
    'Symlinks local dependencies in the current template to local packages in the current template.'
  )
  .command(
    'update-version-all <version-string>',
    'Loops through all of the packages and local dependencies in the current template and updates the version to the user provided string.'
  )
  .command(
    'remove-lockfiles-all',
    'Removes the package-lock.json introduced in NPM 5+ for all of the packages in the current template.'
  )
  .command(
    'off',
    'Turns off a package in the current template; run the command from the top level directory of that package.'
  )
  .command(
    'on',
    'Turns on a package in the current template; run the command from the top level directory of that package.'
  )
  .command(
    'save-custom <custom-command-key> <custom-command-value>',
    '[NOT AVAILABLE YET] Saves or updates a custom command into the current template.'
  )
  .command(
    '-c <custom-command-key>',
    '[NOT AVAILABLE YET] Executes custom command on each package in the current template.'
  )
  .command(
    'save-origin <url>',
    '[NOT AVAILABLE YET] Saves or updates the origin address of package in the current working directory into current template.'
  )
  .command(
    'clone-all <~/path/to/location>',
    '[NOT AVAILABLE YET] Clones all the remote repos with origins to the specified path and updates path locations in the current template file.'
  )
  .parse(process.argv);
