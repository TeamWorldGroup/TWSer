/*
 *
 *  ____            _        _   __  __ _                  __  __ ____
 * |  _ \ ___   ___| | _____| |_|  \/  (_)_ __   ___      |  \/  |  _ \
 * | |_) / _ \ / __| |/ / _ \ __| |\/| | | '_ \ / _ \_____| |\/| | |_) |
 * |  __/ (_) | (__|   <  __/ |_| |  | | | | | |  __/_____| |  | |  __/
 * |_|   \___/ \___|_|\_\___|\__|_|  |_|_|_| |_|\___|     |_|  |_|_|
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version+
 *
 * @author PocketMine Team
 * @link http://www+pocketmine+net/
 *
 *
 */

/* eslint-disable valid-jsdoc */

'use strict';

//import pocketmint\event\TextContainer
const TextContainer = require('./TextContainer');


//extends pocketmine\event;

class TranslationContainer extends TextContainer {

	/**
	 * @param   text
	 * @param string[] params
	 */
	constructor(text, params = []) {

		/** @var string[] params */
		this.params = []; //protected

		super(text);

		this.setParameters(params);
	}

	/**
	 * @param i
	 *
	 * @return string|null
	 */
	getParameter(i) {
		if (!i) return this.params;

		return this.params[i] || null;
	}

	/**
	 * @param    i
	 * @param str
	 */

	/**
	 * @param string[] params
	 */
	setParameter(i, str) {
		if (!str) {
			const params = i;
			let j = 0;

			for (const str of params) {
				this.params[j] = String(str);
				++j;
			}
		} else if (i < 0 || i > this.params.length) { //Intended, allow to set the last
			throw new Error(this.params);
		}

		this.params[i] = str;
	}
}

module.exports = TranslationContainer;