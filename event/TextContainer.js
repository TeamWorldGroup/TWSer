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

'use strict';

/* eslint-disable valid-jsdoc */

//extends pocketmine\event;

//TODO: Оберни константы в конструктор!
class TextContainer {

	/**
	 * @param text
	 */
	constructor(text) {
		this.text = text;
	}

	/**
	 * @param text
	 */
	setText(text) {
		this.text = text;
	}

	/**
	 * @return string
	 */
	getText() {
		return this.text;
	}

	/**
	 * @return string
	 */
	__toString() {
		return this.getText();
	}
}

module.exports = TextContainer;