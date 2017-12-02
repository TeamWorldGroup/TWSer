const colors = {
	'black':		'§0',
	'darkblue':		'§1',
	'darkgreen':	'§2',
	'darkaqua':		'§3',
	'darkred':		'§4',
	'darkpurple':	'§5',
	'gold':			'§6',
	'gray':			'§7',
	'darkgray':		'§8',
	'blue':			'§9',
	'green':		'§a',
	'aqua':			'§b',
	'red':			'§c',
	'lightpurple':	'§d',
	'yellow':		'§e',
	'white':		'§f',
	'bold':			'§l',
	'italic':		'§o'
};

function getColor(color) {
	const mangled = color.replace(/\s/, '').toLowerCase();
	return colors[mangled] || '$7';
}

module.exports = getColor;