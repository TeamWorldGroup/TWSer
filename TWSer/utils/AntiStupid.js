'use strict';

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

class AntiStupid {
	/**
	 * Check type of value
	 * @param  {string} val - Value for test
	 * @param  {string} type - Type for test
	 * @param  {string} [name] - Name of Value
	 * @returns {void}
	 */
	static testType(val, type, name) {
		if (typeof val !== 'string' || typeof type !== 'string') throw new Error('val and type must be a Strings');

		if (typeof val !== type) throw new Error(`${name||'value'} must be a ${capitalize(type)}`);
	}
	/**
	 * @param  {object} val - Value for test
	 * @param  {object} object - Prototype for test (Class)
	 * @param  {string} [name] - Name of Value
	 * @returns {void}
	 */
	static test(val, object, name) {
		AntiStupid.testType(val, 'object', 'val');
		AntiStupid.testType(object, 'object', 'object');
		
		if (!(val instanceof object)) throw new Error(`${name||'value'} must be a ${capitalize(object.name)}`);
	}
}

module.exports = AntiStupid;