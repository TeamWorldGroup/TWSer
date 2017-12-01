'use strict';

const path = require('path');

class Lang {
	constructor(lang) {
		this.lang = lang;
		this.err = false;
		try {
			const path_ = path.join(__dirname, `locals/${lang}.json`);

			console.log(path_);
			this.file = require(path_); // TODO: normalize 
		} catch (e) {
			this.err = e;
			throw new Error('Failed to open lang file'+e);
		}
	}

	translate(id = null) {
		return this.file[id] || id;
	}

	idExist(id) {
		if (typeof id !== 'string') throw new Error('id must be a string!');

		return Boolean(this.file[id]);
	}

	static translate(id, lang) {
		return (new Lang(lang)).translate(id);
	}

	static idExist(id, lang) {
		if (typeof id !== 'string') throw new Error('id must be a string!');
		if (typeof lang !== 'string') throw new Error('lang must be a string!');

		return (new Lang(lang)).idExist(id);
	}

}

module.exports = Lang;