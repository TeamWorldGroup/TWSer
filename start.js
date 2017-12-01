#!/usr/bin/env node

'use strict';

/* 
 * Прослойка для управления сервером
 */

const Server = require('./Server');
const Logger = require('./TWSer/utils/logger');

let settings;
try {
  settings = require('./config/settings');
} catch (err) {
  try {
    settings = require('./config/default-settings');
  } catch (e) {
    throw new Error('Unable to load config file!');
  }
}

// module.exports=mcServer.createMCServer(settings);


process.on('unhandledRejection', (err) => {
  Logger.log(err.stack);
});