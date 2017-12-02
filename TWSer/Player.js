'use strict';

const World = require('./World');
const assert = require('./utils/AntiStupid');
// const PlayerID = require('./PlayerID');

class Player {
	/**
	 * @param  {string} nick - Nickname of player
	 * @returns {void}
	 */
	constructor(nick) {
		assert.testType(nick, 'string', 'nick');

		this.nick = nick;
		this.position = World.spawnPoint; /* vec3 */
		this.health = Player.maxHealth;
		this.experience = 0;
		this.id = Player.generateId(this);
	}

	static getFromDB(nick) {
		return {};
	}

	/**
	 * Give player id and register it in the database
	 * @param  {Player} player - Player
	 * @returns {PlayerID} - Player ID
	 */
	static generateId(player) {
		assert.test(player, Player, 'player');

		return Date.now() * Math.random(); // TODO:
	}
}

Player.maxHealth = 100;

module.exports = Player;