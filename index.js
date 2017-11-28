/*
 _____  __        __  ____                
|_   _| \ \      / / / ___|    ___   _ __ 
  | |    \ \ /\ / /  \___ \   / _ \ | '__|
  | |     \ V  V /    ___) | |  __/ | |   
  |_|      \_/\_/    |____/   \___| |_|    
*/

'use strict';

const pmp = require('./protocol');
const fs = require('fs');
const Log = require('./utils/logger');
const nconf = require('nconf');

nconf.file('config/config.json');

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

const server = pmp.createServer({
	'name': `MCPE;${NAME.replace(/;/g,'')};141 141;${VERSION};20;2000000`,
	'port': PORT
}, true);

server.on('connection', function (client) {
	Log.log('Сервер запущен!');

	//client.on('mcpe', (packet) => Log.log(packet, {'level': 'packet'}));

	/*client.writeMCPE('server_to_client_handshake', {
		'server_public_key': 'MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAE8ELkixyLcwlZryUQcu1TvPOmI2B7vX83ndnWRUaXm74wFfa5f/lwQNTfrLVHa2PmenpGI6JhIMUJaWZrjmMj90NoKNFSNBuKdm8rYiXsfaz3K36x/1U26HpG0ZxK/V1V',
		'token_length': 1,
		'token': Buffer.allocUnsafe(1)
	});*/

	client.on(/* 'login_mcpe' */'game_login', (packet) => {
		Log.log('Новая аутентификация');
		client.writeMCPE('play_status', {'status': 0});

		client.writeMCPE('move_player', {
			'entityId': [0, 0],
			'x': 1,
			'y': 64 + 1.62,
			'z': 1,
			'yaw': 0,
			'headYaw': 0,
			'pitch': 0,
			'mode': 0,
			'onGround': 1
		});

		client.writeMCPE('start_game', {
			'seed': -1,
			'dimension': 0,
			'generator': 1,
			'gamemode': 1,
			'entityId': [0, 0],
			'spawnX': 1,
			'spawnY': 1,
			'spawnZ': 1,
			'x': 0,
			'y': 1 + 1.62,
			'z': 0,
			'isLoadedInCreative': 0,
			'dayCycleStopTime': 0,
			'eduMode': 0,
			'worldName': ''
		});

		client.writeMCPE('set_spawn_position', {
			'x': 1,
			'y': 64,
			'z': 1
		});
		client.writeMCPE('set_time', {
			'time': 0,
			'started': 1
		});

		client.writeMCPE('respawn', {
			'x': 1,
			'y': 64,
			'z': 1
		});
	});

	client.on('chunk_radius_update', () => {
		Log.log('chunk_radius_update');
		client.writeMCPE('chunk_radius_update', {'chunk_radius': 1});

		for (let x = -1; x <= 1; x++) {
			for (let z = -1; z <= 1; z++) {
				client.writeBatch([
					{
						'name': 'full_chunk_data',
						'params': {
							'chunkX': x,
							'chunkZ': z,
							'order': 1,
							'chunkData': fs.readFileSync(`${__dirname}/chunk_test.nbt`)
						}
					}
				]);
			}
		}

		client.writeMCPE('play_status', {'status': 3});

		client.writeMCPE('set_time', {
			'time': 0,
			'started': 1
		});

	});

	client.on('error', function (err) {
		Log.error(err.stack);
	});

	client.on('end', function () {
		Log.log('Клиент отключился');
	});
});