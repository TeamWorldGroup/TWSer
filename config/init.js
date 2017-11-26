const prompt = require('prompt-sync')();
const Log = require('../utils/logger');
const nconf = require('nconf');
// nconf

function init(){
	Log.info('Добро пожаловать в TWSer!');
	Log.info('Для начала, нужно создать конфигурационный файл');
	Log.info('Давайте этим и займёмся:!');

	let name = prompt('Укажите название для вашего сервера: ');
	Log.log('OK');
	let port = prompt('Укажите порт для вашего сервера: ');
	Log.log('OK');
	nconf.set('name', name);
	nconf.set('port', port);
	nconf.save();
	Log.info('Всё ;)');
}

module.exports = init;