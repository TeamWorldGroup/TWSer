/*
 _____  __        __  ____                
|_   _| \ \      / / / ___|    ___   _ __ 
  | |    \ \ /\ / /  \___ \   / _ \ | '__|
  | |     \ V  V /    ___) | |  __/ | |   
  |_|      \_/\_/    |____/   \___| |_|    
*/

'use strict';

Error.stackTraceLimit = Infinity;

const Logger = require('./TWSer/utils/logger');

Logger.setLevels(['Command']);

const Server = require('./TWSer/Server');
const Config = require('./TWSer/Config');

const PORT = Config.get('port');
const NAME = Config.get('name');
const VERSION = Config.get('version');

if (!PORT || !NAME || !VERSION) {
	Config.init();
	process.exit(0);
}

Logger.log(
	` _____  __        __  ____                
|_   _| \\ \\      / / / ___|    ___   _ __ 
  | |    \\ \\ /\\ / /  \\___ \\   / _ \\ | '__|
  | |     \\ V  V /    ___) | |  __/ | |   
  |_|      \\_/\\_/    |____/   \\___| |_|    
`, {'noconvert': true});

Logger.info(`Сервер: ${NAME}`);
Logger.info(`Порт: ${PORT}`);
Logger.info(`Версия MCPE: ${VERSION}`);

Logger.log('Запускаем...');

const server = new Server();

server.run();