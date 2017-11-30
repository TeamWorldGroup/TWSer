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

/* 
 * У меня вопрос: а нафиг он нам вообще нужен?
 * Ведь для этого можно использовать библиотеку....
*/


//extends pocketmine\utils;

// abstract
class Terminal {

	static hasFormattingCodes() {
		if (Terminal.formattingCodes === null) {
			opts = getopt('', ['enable-ansi', 'disable-ansi']);
			if (isset(opts['disable-ansi'])) {
				Terminal.formattingCodes = false;
			} else {
				Terminal.formattingCodes = isset(opts['enable-ansi']) || //user explicitly told us to enable ANSI
					stream_isatty(STDOUT) && //STDOUT isn't being piped
					(
						getenv('TERM') !== false || //Console says it supports colours
						function_exists('sapi_windows_vt100_support') && sapi_windows_vt100_support(STDOUT) //we're on windows && have vt100 support
					);
			}
		}

		return Terminal.formattingCodes;
	}

	static getFallbackEscapeCodes() { //protected
		/*static*/
		this.FORMAT_BOLD = '\x1b[1m';

		/*static*/
		this.FORMAT_OBFUSCATED = '';

		/*static*/
		this.FORMAT_ITALIC = '\x1b[3m';

		/*static*/
		this.FORMAT_UNDERLINE = '\x1b[4m';

		/*static*/
		this.FORMAT_STRIKETHROUGH = '\x1b[9m';

		/*static*/
		this.FORMAT_RESET = '\x1b[m';

		/*static*/
		this.COLOR_BLACK = '\x1b[38;5;16m';

		/*static*/
		this.COLOR_DARK_BLUE = '\x1b[38;5;19m';

		/*static*/
		this.COLOR_DARK_GREEN = '\x1b[38;5;34m';

		/*static*/
		this.COLOR_DARK_AQUA = '\x1b[38;5;37m';

		/*static*/
		this.COLOR_DARK_RED = '\x1b[38;5;124m';

		/*static*/
		this.COLOR_PURPLE = '\x1b[38;5;127m';

		/*static*/
		this.COLOR_GOLD = '\x1b[38;5;214m';

		/*static*/
		this.COLOR_GRAY = '\x1b[38;5;145m';

		/*static*/
		this.COLOR_DARK_GRAY = '\x1b[38;5;59m';

		/*static*/
		this.COLOR_BLUE = '\x1b[38;5;63m';

		/*static*/
		this.COLOR_GREEN = '\x1b[38;5;83m';

		/*static*/
		this.COLOR_AQUA = '\x1b[38;5;87m';

		/*static*/
		this.COLOR_RED = '\x1b[38;5;203m';

		/*static*/
		this.COLOR_LIGHT_PURPLE = '\x1b[38;5;207m';

		/*static*/
		this.COLOR_YELLOW = '\x1b[38;5;227m';

		/*static*/
		this.COLOR_WHITE = '\x1b[38;5;231m';
	}

	static getEscapeCodes() { //protected
		/*static*/
		this.FORMAT_BOLD = 'tput bold';

		/*static*/
		this.FORMAT_OBFUSCATED = 'tput smacs';

		/*static*/
		this.FORMAT_ITALIC = 'tput sitm';

		/*static*/
		this.FORMAT_UNDERLINE = 'tput smul';

		/*static*/
		this.FORMAT_STRIKETHROUGH = '\x1b[9m'; //`tput `;

		/*static*/
		this.FORMAT_RESET = 'tput sgr0';

		colors = (int)`tput colors`;
		if (colors > 8) {

			/*static*/
			this.COLOR_BLACK = colors >= 256 ? 'tput setaf 16' : 'tput setaf 0';

			/*static*/
			this.COLOR_DARK_BLUE = colors >= 256 ? 'tput setaf 19' : 'tput setaf 4';

			/*static*/
			this.COLOR_DARK_GREEN = colors >= 256 ? 'tput setaf 34' : 'tput setaf 2';

			/*static*/
			this.COLOR_DARK_AQUA = colors >= 256 ? 'tput setaf 37' : 'tput setaf 6';

			/*static*/
			this.COLOR_DARK_RED = colors >= 256 ? 'tput setaf 124' : 'tput setaf 1';

			/*static*/
			this.COLOR_PURPLE = colors >= 256 ? 'tput setaf 127' : 'tput setaf 5';

			/*static*/
			this.COLOR_GOLD = colors >= 256 ? 'tput setaf 214' : 'tput setaf 3';

			/*static*/
			this.COLOR_GRAY = colors >= 256 ? 'tput setaf 145' : 'tput setaf 7';

			/*static*/
			this.COLOR_DARK_GRAY = colors >= 256 ? 'tput setaf 59' : 'tput setaf 8';

			/*static*/
			this.COLOR_BLUE = colors >= 256 ? 'tput setaf 63' : 'tput setaf 12';

			/*static*/
			this.COLOR_GREEN = colors >= 256 ? 'tput setaf 83' : 'tput setaf 10';

			/*static*/
			this.COLOR_AQUA = colors >= 256 ? 'tput setaf 87' : 'tput setaf 14';

			/*static*/
			this.COLOR_RED = colors >= 256 ? 'tput setaf 203' : 'tput setaf 9';

			/*static*/
			this.COLOR_LIGHT_PURPLE = colors >= 256 ? 'tput setaf 207' : 'tput setaf 13';

			/*static*/
			this.COLOR_YELLOW = colors >= 256 ? 'tput setaf 227' : 'tput setaf 11';

			/*static*/
			this.COLOR_WHITE = colors >= 256 ? 'tput setaf 231' : 'tput setaf 15';
		} else {

			/*static*/
			this.COLOR_BLACK = /*static*/ this.COLOR_DARK_GRAY = 'tput setaf 0';
			/*static*/
			this.COLOR_RED = /*static*/ this.COLOR_DARK_RED = 'tput setaf 1';
			/*static*/
			this.COLOR_GREEN = /*static*/ this.COLOR_DARK_GREEN = 'tput setaf 2';
			/*static*/
			this.COLOR_YELLOW = /*static*/ this.COLOR_GOLD = 'tput setaf 3';
			/*static*/
			this.COLOR_BLUE = /*static*/ this.COLOR_DARK_BLUE = 'tput setaf 4';
			/*static*/
			this.COLOR_LIGHT_PURPLE = /*static*/ this.COLOR_PURPLE = 'tput setaf 5';
			/*static*/
			this.COLOR_AQUA = /*static*/ this.COLOR_DARK_AQUA = 'tput setaf 6';
			/*static*/
			this.COLOR_GRAY = /*static*/ this.COLOR_WHITE = 'tput setaf 7';
		}
	}

	static init() {
		if (!Terminal.hasFormattingCodes()) {
			return;
		}

		switch (Utils.getOS()) {
		case 'linux':
		case 'mac':
		case 'bsd':

			/*static*/
			this.getEscapeCodes();

			return;

		case 'win':
		case 'android':

			/*static*/
			this.getFallbackEscapeCodes();
			break;
		default:
			//Fuck that
		}

		//TODO: iOS
	}

}

Terminal.FORMAT_BOLD = '';
Terminal.FORMAT_OBFUSCATED = '';
Terminal.FORMAT_ITALIC = '';
Terminal.FORMAT_UNDERLINE = '';
Terminal.FORMAT_STRIKETHROUGH = '';
Terminal.FORMAT_RESET = '';
Terminal.COLOR_BLACK = '';
Terminal.COLOR_DARK_BLUE = '';
Terminal.COLOR_DARK_GREEN = '';
Terminal.COLOR_DARK_AQUA = '';
Terminal.COLOR_DARK_RED = '';
Terminal.COLOR_PURPLE = '';
Terminal.COLOR_GOLD = '';
Terminal.COLOR_GRAY = '';
Terminal.COLOR_DARK_GRAY = '';
Terminal.COLOR_BLUE = '';
Terminal.COLOR_GREEN = '';
Terminal.COLOR_AQUA = '';
Terminal.COLOR_RED = '';
Terminal.COLOR_LIGHT_PURPLE = '';
Terminal.COLOR_YELLOW = '';
Terminal.COLOR_WHITE = '';
Terminal._formattingCodes = null;

module.exports = Terminal;