'use strict';

const path = require('path');
const assert = require('./utils/AntiStupid');

class Lang {
	constructor(lang) {
		this.lang = lang;
		this.err = false;
		this.name = 'Lang';
		try {
			const path_ = path.join(__dirname, `locales/${lang}.json`);

			this.file = require(path_);
		} catch (e) {
			this.err = e;
			throw new Error(`Failed to open lang file: ${e}`);
		}
	}

	translate(id) {
		assert.testType(id, 'string', 'id');

		return this.file[id] || id;
	}

	idExist(id) {
		assert.testType(id, 'string', 'id');

		return Boolean(this.file[id]);
	}

	static translate(id, lang) {
		return (new Lang(lang)).translate(id);
	}

	static idExist(id, lang) {
		assert.testType(id, 'string', 'id');
		assert.testType(lang, 'string', 'lang');

		return (new Lang(lang)).idExist(id);
	}

}

module.exports = Lang;