'use strict';

const nconf = require('nconf');
const fs = require('fs');
const prompt = require('prompt-sync')();
const Logger = require('./utils/logger');
const assert = require('./utils/AntiStupid');

nconf.file('../config.json');

class Config {
	static get(key) {
		assert.testType(key, 'string', 'key');

		return nconf.get(key);
	}

	static set(key, value) {
		assert.testType(key, 'string', 'key');

		nconf.set(key, value);
	}

	static get config() {
		try {
			return fs.readFileSync('../config.json');
		} catch (e) {
			Logger.error(e, {'level': 'error'});
			throw new Error('Unable to read the config file!');
		}
	}

	static init() {
		Logger.info('Добро пожаловать в TWSer!');
		Logger.info('Для начала, нужно создать конфигурационный файл');
		Logger.info('Давайте этим и займёмся:!');

		const name = prompt('Укажите название для вашего сервера: ');

		Logger.log('OK');
		const port = prompt('Укажите порт для вашего сервера: ');

		Logger.log('OK');
		const version = prompt('Укажите версию MCPE: ');

		Logger.log('OK');
		nconf.set('name', name);
		nconf.set('port', port);
		nconf.set('version', version);
		nconf.save();
		Logger.info('Всё ;)');
		Logger.warn('Перезапустите TWSer для запуска сервера');
	}
}

module.exports = Config;