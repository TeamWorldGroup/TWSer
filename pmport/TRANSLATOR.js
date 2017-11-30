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
		const round = (x, y) => x.toFixed(y);`;
	}

	translate(fnc) {
		this.file = fnc(this.file);

		return this;
	}

	save(name) {
		fs.writeFileSync(name, Translator.PHPfuncs+this.file, 'utf8');
	}
}

const F = new Translator('./Translate/server.php');

/* eslint-disable dot-location */

F.translate((x) => x.replace(/\./g, '+')) //Гребанная пхпшная конкатенация строк
	.translate((x) => x.replace(/->/g, '.')) //Параметры
	.translate((x) => x.replace(/::/g, '.')) //Статические параметры
	.translate((x) => x.replace(/\$/g, ''))
	//Бездолларовые переменные
	.translate((x) => x.replace(/use /g,'//import '))
	//Шпора для импортов
	.translate((x) => x.replace(/namespace /g,'//extends '))
	//У нас будет объектная структура, как в JsOS
	.translate((x) => x.replace(/declare\(strict_types=1\);/g,'"use strict";'))
	//Строгий режим
	.translate((x) => x.replace(/ : (int|bool|string|float|array)/g, ''))
	//У нас динамическая типизация
	.translate((x) => x.replace(/(<\?php|\?>|<\?)/g,''))
	//Это уже не PHP
	//Поехали херить классы...
	//TODO: Константы в начале нужно ручками запихнуть в конструктор и под this
	.translate((x) => x.replace(/public /g,''))
	//Нинада
	.translate((x) => x.replace(/private /g,'_'))
	//underscore
	.translate((x) => x.replace(/const /g,''))
	//Тоже нинада
	.translate((x) => x.replace(/function /g,''))
	//Там везде ООП, так что тоже не надобно
	.translate((x) => x.replace(/(int|float|bool|string|array) /g,''))
	//TODO: Увы, кастомные типы я не буду сюда пихать
	//Убираем типизацию
	.translate((x) => x.replace(/min\(/g,'Math.min(')
		.replace(/max\(/g,'Math.max('));
	//Mathermatika

F.save('./Translate/server.js');