import { Server } from 'net';

/*
 _____  __        __  ____                
|_   _| \ \      / / / ___|    ___   _ __ 
  | |    \ \ /\ / /  \___ \   / _ \ | '__|
  | |     \ V  V /    ___) | |  __/ | |   
  |_|      \_/\_/    |____/   \___| |_|    
*/

'use strict';

const Log = require('./utils/logger');
const nconf = require('nconf');

nconf.file('config.json');

Log.setLevels(['debug', 'packet']);

Error.stackTraceLimit = Infinity;

const PORT = nconf.get('port');
const NAME = nconf.get('name');
const VERSION = nconf.get('version');

if (!PORT || !NAME || !VERSION){
	require('./config/init')();
	process.exit(0);
}

Log.log(
	` _____  __        __  ____                
|_   _| \\ \\      / / / ___|    ___   _ __ 
  | |    \\ \\ /\\ / /  \\___ \\   / _ \\ | '__|
  | |     \\ V  V /    ___) | |  __/ | |   
  |_|      \\_/\\_/    |____/   \\___| |_|    
`, {'noconvert': true});

Log.info(`Сервер: ${NAME}`);
Log.info(`Порт: ${PORT}`);
Log.info(`Версия MCPE: ${VERSION}`);

Log.log('Запускаем...');

const server = new Server();

server.run();