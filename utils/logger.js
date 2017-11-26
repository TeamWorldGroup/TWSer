const chalk = require('chalk');

class Logger {
	constructor(){
		this.log = this.log.bind(this);
		this.print = this.print.bind(this);
		this.warn = this.warn.bind(this);
		this.error = this.error.bind(this);
		this.info = this.info.bind(this);
		this.timestamp = this.timestamp.bind(this);
	}

	log(data){
		let out = this.convert(data);
		console.log(chalk.cyan(out));
		
	}

	warn(data){
		let out = this.convert(data);
		console.log(chalk.yellow(out));
	}

	error(data){
		let out = this.convert(data);
		console.log(chalk.red(out));
	}

	info(data){
		let out = this.convert(data);
		console.log(chalk.blue(out));
	}

	convert(data){
		let out = data;
		if(typeof out === 'object') out = JSON.stringify(out);
		return this.timestamp(out);
		
	}

	timestamp(data){
		return `[${Date.now()}] ${data}`;
	}

}

module.exports = new Logger();