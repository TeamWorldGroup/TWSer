#!/usr/bin/env node

'use strict';

/* 
 * Прослойка для управления сервером
 */

const Server = require('./TWSer/Server');
const Logger = require('./TWSer/utils/logger');
const Lang = require('./TWSer/Lang');
const lang = new Lang('rus');

let settings;

try {
  settings = require('./config/settings');
} catch (err) {
  try {
    Logger.warn(lang.translate('start-defaultSettings'));
    settings = require('./config/default-settings');
  } catch (e) {
    throw new Error('Unable to load config file!');
  }
}

Logger.info(`Server: ${settings.motd}`);
Logger.info(`Port: ${settings.port}`);
Logger.info(`Max players: ${settings['max-players']}`);

const server = new Server(settings).run();
// module.exports=mcServer.createMCServer(settings);


process.on('unhandledRejection', (err) => {
  Logger.log(err.stack);
});