'use strict';

class DiamondSquare {
	constructor(size, roughness, seed) {
		// public fields
		this.size = size;
		this.roughness = roughness;
		this.seed = seed;
		this.opCountN = 0;

		// private field
		this.data = [];
	}

	// public methods
	value(x, y, v) {
		x = Number(x);
		y = Number(y);
		if (typeof v === 'undefined')
			return this.val(x, y);
		this.val(x, y, v);
	}

	// private methods
	val(x, y, v) {
		if (typeof v === 'undefined') {
			if (x <= 0 || x >= this.size || y <= 0 || y >= this.size) return 0.0;

			if (this.data[x + '_' + y] === null) {
				this.opCountN++;
				let base = 1;

				while (((x & base) == 0) && ((y & base) == 0))
					base <<= 1;

				if (((x & base) != 0) && ((y & base) != 0))
					this.squareStep(x, y, base);
				else
					this.diamondStep(x, y, base);
			}
			return this.data[x + '_' + y];
		}

		this.data[x + '_' + y] = Math.max(0.0, Math.min(1.0, v));
	}

	randFromPair(x, y) {
		let xm13, xm1301081, xm7, ym105467, ym105943, ym8461;

		for (let i = 0; i < 80; i++) {
			xm7 = x % 7;
			xm13 = x % 13;
			xm1301081 = x % 1301081;
			ym8461 = y % 8461;
			ym105467 = y % 105467;
			ym105943 = y % 105943;
			// y = (i < 40 ? seed : x);
			y = x + this.seed;
			x += (xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943);
		}

		return (xm7 + xm13 + xm1301081 + ym8461 + ym105467 + ym105943) / 1520972.0;
	}

	displace(v, blockSize, x, y) {
		return (v + (this.randFromPair(x, y, this.seed) - 0.5) * blockSize * 2 / this.size * this.roughness);
	}

	squareStep(x, y, blockSize) {
		if (this.data[x + '_' + y] === null) {
			this.val(x, y,
				this.displace((this.val(x - blockSize, y - blockSize) +
					this.val(x + blockSize, y - blockSize) +
					this.val(x - blockSize, y + blockSize) +
					this.val(x + blockSize, y + blockSize)) / 4, blockSize, x, y));
		}
	}

	diamondStep(x, y, blockSize) {
		if (this.data[x + '_' + y] === null) {
			this.val(x, y,
				this.displace((this.val(x - blockSize, y) +
					this.val(x + blockSize, y) +
					this.val(x, y - blockSize) +
					this.val(x, y + blockSize)) / 4, blockSize, x, y));
		}
	}
}

module.exports = DiamondSquare;