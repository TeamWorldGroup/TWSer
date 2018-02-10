"use strict";

const TextFormat = require("./utils/TextFormat");

class Achievement {

	constructor(/*String*/ message, /* String*/ ...requires) {
		this.message = message;
		this.requires = requires;
	}

	static /*boolean*/ broadcast(/*Player*/ player, /*String*/ achievementId) {
		if (!Achievement.achievements.containsKey(achievementId)) {
			return false;
		}
		let /*String*/ translation = Server.getInstance().getLanguage()
			.translateString(
				"chat.type.achievement",
				player.getDisplayName(),
				TextFormat.GREEN + Achievement.achievements.get(achievementId).getMessage());

		if (Server.getInstance().getPropertyBoolean("announce-player-achievements", true)) {
			Server.getInstance().broadcastMessage(translation);
		} else {
			player.sendMessage(translation);
		}

		return true;
	}

	static /*boolean*/ add(/*String*/ name, /*Achievement*/ achievement) {
		if (Achievement.achievements.containsKey(name)) {
			return false;
		}

		Achievement.achievements[name] = achievement;

		return true;
	}

	/*String*/ getMessage() {
		return this.message;
	}

	/*void*/ broadcast(/*Player*/ player) {
		let /*String*/ translation = Server.getInstance().getLanguage().
			translateString("chat.type.achievement", player.getDisplayName(), TextFormat.GREEN + this.getMessage(), null);

		if (Server.getInstance().getPropertyBoolean("announce-player-achievements", true)) {
			Server.getInstance().broadcastMessage(translation);
		} else {
			player.sendMessage(translation);
		}
	}
}

Achievement.achievements = {
	"mineWood": new Achievement("Getting Wood"),
	"buildWorkBench": new Achievement("Benchmarking", "mineWood"),
	"buildPickaxe": new Achievement("Time to Mine!", "buildWorkBench"),
	"buildFurnace": new Achievement("Hot Topic", "buildPickaxe"),
	"acquireIron": new Achievement("Acquire hardware", "buildFurnace"),
	"buildHoe": new Achievement("Time to Farm!", "buildWorkBench"),
	"makeBread": new Achievement("Bake Bread", "buildHoe"),
	"bakeCake": new Achievement("The Lie", "buildHoe"),
	"buildBetterPickaxe": new Achievement("Getting an Upgrade", "buildPickaxe"),
	"buildSword": new Achievement("Time to Strike!", "buildWorkBench"),
	"diamonds": new Achievement("DIAMONDS!", "acquireIron")
};