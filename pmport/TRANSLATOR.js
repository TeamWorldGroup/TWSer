/* 
 * Самописный переводчик с PHP на JS
 * Для PocketMine-MP
 */

'use strict';

const fs = require('fs');

class Translator {
	constructor(file) {
		this.file = fs.readFileSync(file, 'utf8');
	}

	static get PHPfuncs() {
		return ` //PHP API for JS
const array_sum = x => {
	let sum=0;
	for(let i = 0; i < x.length; i++){
		sum+=x[i];
	}
	return sum;
};
const count = x => x.length;
const round = (x, y) => x.toFixed(y);
const strtolower = x => x.toLowerCase();
		
const stripos = ( f_haystack, f_needle, f_offset=0){
	let haystack = f_haystack.toLowerCase();
	let needle = f_needle.toLowerCase();
	let index = 0;
	if((index = haystack.indexOf(needle, f_offset)) > -1) {
		return index;
	}
	return false;
}`;
	}

	translate(fnc) {
		this.file = fnc(this.file);

		return this;
	}

	save(name) {
		fs.writeFileSync(name, Translator.PHPfuncs + this.file, 'utf8');
	}
}

const F = new Translator('./Translate/server.php');

/* eslint-disable dot-location */

F.translate((x) => x.replace(/\./g, '+')) //Гребанная пхпшная конкатенация строк
	.translate((x) => x.replace(/->/g, '.')) //Параметры
	.translate((x) => x.replace(/::/g, '.')) //Статические параметры
	.translate((x) => x.replace(/\$/g, ''))
	//Бездолларовые переменные
	.translate((x) => x.replace(/use /g, '//import '))
	//Шпора для импортов
	.translate((x) => x.replace(/namespace /g, '//extends '))
	//У нас будет объектная структура, как в JsOS
	.translate((x) => x.replace(/declare\(strict_types=1\);/g, '"use strict";'))
	//Строгий режим
	.translate((x) => x.replace(/ : (int|bool|string|float|array|void|\?\w*)/g, ''))
	//У нас динамическая типизация
	.translate((x) => x.replace(/(<\?php|\?>|<\?)/g, ''))
	//Это уже не PHP
	//Поехали херить классы...
	//TODO: Константы в начале нужно ручками запихнуть в конструктор и под this
	.translate((x) => x.replace(/public /g, ''))
	//Нинада
	.translate((x) => x.replace(/private /g, '_'))
	//underscore
	.translate((x) => x.replace(/const /g, ''))
	//Тоже нинада
	.translate((x) => x.replace(/function /g, ''))
	//Там везде ООП, так что тоже не надобно
	.translate((x) => x.replace(/(int|float|bool|string|array) /g, ''))
	//TODO: Увы, кастомные типы я не буду сюда пихать
	//Убираем типизацию
	.translate((x) => x.replace(/min\(/g, 'Math.min(')
		.replace(/max\(/g, 'Math.max('))
	//Mathermatika
	.translate((x) => x.replace(/class /g, '//TODO: Оберни константы в конструктор!\nclass '))
	//Лучше ещё раз напомнить
	.translate((x) => x.replace(/foreach\((.+) as (.+) => (.+)\){/g, 'for(let $2 in $1){\nconst $3 = $1[$2]'))
	.translate((x) => x.replace(/foreach\((.+) as (.+)\)/g, 'for(const $2 of $1)'))
	//Переработка циклов
	.translate((x) => x.replace(/throw new .+\(/g, 'throw new Error('))
	//Нам и одного типа ошибок хватит
	.translate((x) => x.replace(/\((int|float)\) (.+)\s+([:|;?<>=!,.^%+-/*&~])/g, 'Number($2) $3'))
	//По-любому какой-то символ не доглядел
	//Заменяет (int) her на Number(her)
	.translate((x) => x.replace(/\((string)\) (.+)\s+([:|;?<>=!,.^%+-/*&~])/g, 'String($2) $3'))
	//(string) her -> String(her)
	.translate((x) => x.replace(/\(bool\) /g, '!!'))
	//(bool) her -> !!her
	.translate((x) => x.replace(/ or /g, ' || ')
		.replace(/ and /g, ' && ')
		.replace(/ \?\? /g, ' || ')); // her || null
//Логические операторы прямиком из Basic'а

F.save('./Translate/server.js');