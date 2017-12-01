#!/usr/bin/env node

'use strict';

/*
 * Прослойка для управления сервером
 */

const Server = require('./TWSer/Server');
const Logger = require('./TWSer/utils/logger');
const Lang = require('./TWSer/Lang');
const lang = new Lang('rus');
const chalk = require('chalk');

const util = require('util');

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

Logger.info('');
Logger.info(`Server: ${settings.motd}`);
Logger.info(`Port: ${settings.port}`);
Logger.info(`Max players: ${settings['max-players']}`);
Logger.info('');

const server = new Server(settings).run();
// module.exports=mcServer.createMCServer(settings);


process.on('unhandledRejection', (err) => {
  Logger.log(err.stack);
});

// process.stdin.resume();
process.stdin.setEncoding('utf8');

/* eslint-disable no-console */
/* eslint-disable no-eval */

process.stdin.on('data', (text) => {
  Logger.log(text, {'level': 'stdin'});
  const cmd = text.trim().split(/\s+/);
  const startcmd = cmd.shift();

  switch (startcmd) {
    case 'stop':
      server.stop();
      break;
    case 'help':
      console.log(chalk.cyan(['help', 'stop', 'eval <jscmd>']));
      break;
    case 'eval':
      try {
        console.log(chalk.green(eval(cmd.join(' '))));
      } catch (e) {
        console.log(chalk.red(e));
      }
      break;
    case '':
      break;
    default:
      console.log(chalk.red(lang.translate('stdin-cmdnotfound')));
  }
});