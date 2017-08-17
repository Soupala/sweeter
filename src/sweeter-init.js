#!/usr/bin/env node
import program from 'commander';
import * as Utils from './utils/index.js';

try {
  Utils.preCheck();
} catch (error) {
  console.log({error});
}
