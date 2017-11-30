import {
	Buffer
} from 'buffer';

//PHP API for JS
const array_sum = x => {
	let sum = 0;
	for (let i = 0; i < x.length; i++) {
		sum += x[i];
	}
	return sum;
};

const stripos = (f_haystack, f_needle, f_offset = 0) => {
	let haystack = f_haystack.toLowerCase();
	let needle = f_needle.toLowerCase();
	let index = 0;
	if ((index = haystack.indexOf(needle, f_offset)) > -1) {
		return index;
	}
	return false;
}

function is_bool(x) {
	try {
		return Boolean(JSON.parse(x)) || true;
	} catch (e) {
		return false
	}
}
// TODO: spl_object_hash
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

"use strict";

/**
 * PocketMine-MP is the Minecraft: PE multiplayer server software
 * Homepage: http://www+pocketmine+net/
 */
//extends pocketmine;

//import pocketmine
const pocketmine = require('./pocketmine');

const fs = require('fs');

//import pocketmine\block\BlockFactory; TODO:
//import pocketmine\command\CommandReader; TODO:
//import pocketmine\command\CommandSender; TODO:
//import pocketmine\command\ConsoleCommandSender; TODO:
//import pocketmine\command\PluginIdentifiableCommand; TODO:
//import pocketmine\command\SimpleCommandMap; TODO:
//import pocketmine\entity\Attribute; TODO:
//import pocketmine\entity\Effect; TODO:
//import pocketmine\entity\Entity; TODO:
//import pocketmine\entity\Skin; TODO:
//import pocketmine\event\HandlerList; TODO:
//import pocketmine\event\level\LevelInitEvent; TODO:
//import pocketmine\event\level\LevelLoadEvent; TODO:
//import pocketmine\event\player\PlayerDataSaveEvent; TODO:
//import pocketmine\event\server\QueryRegenerateEvent; TODO:
//import pocketmine\event\server\ServerCommandEvent; TODO:
//import pocketmine\event\TextContainer;
//import pocketmine\event\Timings; TODO:
//import pocketmine\event\TimingsHandler; TODO:
//import pocketmine\event\TranslationContainer;
//import pocketmine\inventory\CraftingManager; TODO:
//import pocketmine\inventory\Recipe; TODO:
//import pocketmine\item\enchantment\Enchantment; TODO:
//import pocketmine\item\ItemFactory; TODO:
//import pocketmine\lang\BaseLang; TODO:
//import pocketmine\level\format\io\leveldb\LevelDB; TODO:
//import pocketmine\level\format\io\LevelProvider; TODO:
//import pocketmine\level\format\io\LevelProviderManager; TODO:
//import pocketmine\level\format\io\region\Anvil; TODO:
//import pocketmine\level\format\io\region\McRegion; TODO:
//import pocketmine\level\format\io\region\PMAnvil; TODO:
//import pocketmine\level\generator\biome\Biome; TODO:
//import pocketmine\level\generator\Flat; TODO:
//import pocketmine\level\generator\Generator; TODO:
//import pocketmine\level\generator\hell\Nether; TODO:
//import pocketmine\level\generator\normal\Normal; TODO:
//import pocketmine\level\Level; TODO:
//import pocketmine\level\LevelException; TODO:
//import pocketmine\metadata\EntityMetadataStore; TODO:
//import pocketmine\metadata\LevelMetadataStore; TODO:
//import pocketmine\metadata\PlayerMetadataStore; TODO:
//import pocketmine\nbt\NBT; TODO:
//import pocketmine\nbt\tag\ByteTag; TODO:
//import pocketmine\nbt\tag\CompoundTag; TODO:
//import pocketmine\nbt\tag\DoubleTag; TODO:
//import pocketmine\nbt\tag\FloatTag; TODO:
//import pocketmine\nbt\tag\IntTag; TODO:
//import pocketmine\nbt\tag\ListTag; TODO:
//import pocketmine\nbt\tag\LongTag; TODO:
//import pocketmine\nbt\tag\ShortTag; TODO:
//import pocketmine\nbt\tag\StringTag; TODO:
//import pocketmine\network\CompressBatchedTask; TODO:
//import pocketmine\network\mcpe\protocol\BatchPacket; TODO:
//import pocketmine\network\mcpe\protocol\DataPacket; TODO:
//import pocketmine\network\mcpe\protocol\PlayerListPacket; TODO:
//import pocketmine\network\mcpe\protocol\ProtocolInfo; TODO:
//import pocketmine\network\mcpe\protocol\types\PlayerListEntry; TODO:
//import pocketmine\network\mcpe\RakLibInterface; TODO:
//import pocketmine\network\Network; TODO:
//import pocketmine\network\query\QueryHandler; TODO:
//import pocketmine\network\rcon\RCON; TODO:
//import pocketmine\network\upnp\UPnP; TODO:
//import pocketmine\permission\BanList; TODO:
//import pocketmine\permission\DefaultPermissions; TODO:
//import pocketmine\plugin\PharPluginLoader; TODO:
//import pocketmine\plugin\Plugin; TODO:
//import pocketmine\plugin\PluginLoadOrder; TODO:
//import pocketmine\plugin\PluginManager; TODO:
//import pocketmine\plugin\ScriptPluginLoader; TODO:
//import pocketmine\resourcepacks\ResourcePackManager; TODO:
//import pocketmine\scheduler\FileWriteTask; TODO:
//import pocketmine\scheduler\SendUsageTask; TODO:
//import pocketmine\scheduler\ServerScheduler; TODO:
//import pocketmine\tile\Tile; TODO:
//import pocketmine\updater\AutoUpdater; TODO:
//import pocketmine\utils\Binary; TODO:
//import pocketmine\utils\Config; TODO:
//import pocketmine\utils\MainLogger; TODO:
//import pocketmine\utils\Terminal;
//import pocketmine\utils\TextFormat;
//import pocketmine\utils\Utils; TODO:
//import pocketmine\utils\UUID; TODO:
//import pocketmine\utils\VersionString; TODO:

/**
 * The class that manages everything
 */
//TODO: Оберни константы в конструктор!
class Server {
	/**
	 * @return string
	 */
	getName() {
		return pocketmine.NAME;
	}

	/**
	 * @return bool
	 */
	isRunning() {
		return !!this.isRunning;
	}

	/**
	 * @return string
	 */
	getPocketMineVersion() {
		return pocketmine.VERSION;
	}

	/**
	 * @return string
	 */
	getCodename() {
		return pocketmine.CODENAME;
	}

	/**
	 * @return string
	 */
	getVersion() {
		return ProtocolInfo.MINECRAFT_VERSION;
	}

	/**
	 * @return string
	 */
	getApiVersion() {
		return pocketmine.API_VERSION;
	}

	/**
	 * @return string
	 */
	getFilePath() {
		return this.filePath;
	}

	/**
	 * @return string
	 */
	getDataPath() {
		return this.dataPath;
	}

	/**
	 * @return string
	 */
	getPluginPath() {
		return this.pluginPath;
	}

	/**
	 * @return int
	 */
	getMaxPlayers() {
		return this.maxPlayers;
	}

	/**
	 * Returns whether the server requires that players be authenticated to Xbox Live+ If true, connecting players who
	 * are not logged into Xbox Live will be disconnected+
	 *
	 * @return bool
	 */
	getOnlineMode() {
		return this.onlineMode;
	}

	/**
	 * Alias of {@link //getOnlineMode()}+
	 * @return bool
	 */
	requiresAuthentication() {
		return this.getOnlineMode();
	}

	/**
	 * @return int
	 */
	getPort() {
		return this.getConfigInt("server-port", 19132);
	}

	/**
	 * @return int
	 */
	getViewDistance() {
		return Math.max(2, this.getConfigInt("view-distance", 8));
	}

	/**
	 * Returns a view distance up to the currently-allowed limit+
	 *
	 * @param distance
	 *
	 * @return int
	 */
	getAllowedViewDistance(distance) {
		return Math.max(2, Math.min(distance, this.memoryManager.getViewDistance(this.getViewDistance())));
	}

	/**
	 * @return string
	 */
	getIp() {
		return this.getConfigString("server-ip", "0+0+0+0");
	}

	/**
	 * @return UUID
	 */
	getServerUniqueId() {
		return this.serverID;
	}

	/**
	 * @return bool
	 */
	getAutoSave() {
		return this.autoSave;
	}

	/**
	 * @param value
	 */
	setAutoSave(value) {
		this.autoSave = value;
		for (const level of this.getLevels()) {
			level.setAutoSave(this.autoSave);
		}
	}

	/**
	 * @return string
	 */
	getLevelType() {
		return this.getConfigString("level-type", "DEFAULT");
	}

	/**
	 * @return bool
	 */
	getGenerateStructures() {
		return this.getConfigBool("generate-structures", true);
	}

	/**
	 * @return int
	 */
	getGamemode() {
		return this.getConfigInt("gamemode", 0) & 0b11;
	}

	/**
	 * @return bool
	 */
	getForceGamemode() {
		return this.getConfigBool("force-gamemode", false);
	}

	/**
	 * Returns the gamemode text name
	 *
	 * @param mode
	 *
	 * @return string
	 */
	/* static */
	getGamemodeString(mode) {
		switch (mode) {
			case Player.SURVIVAL:
				return "%gameMode.survival";
			case Player.CREATIVE:
				return "%gameMode.creative";
			case Player.ADVENTURE:
				return "%gameMode.adventure";
			case Player.SPECTATOR:
				return "%gameMode.spectator";
			default:
				return "UNKNOWN";
		}
	}

	/* static */
	getGamemodeName(mode) {
		switch (mode) {
			case Player.SURVIVAL:
				return "Survival";
			case Player.CREATIVE:
				return "Creative";
			case Player.ADVENTURE:
				return "Adventure";
			case Player.SPECTATOR:
				return "Spectator";
			default:
				throw new Error("Invalid gamemode mode");
		}
	}

	/**
	 * Parses a && returns a gamemode integer, -1 if not found
	 *
	 * @param str
	 *
	 * @return int
	 */
	/* static */
	getGamemodeFromString(str) {
		switch (strtolower(trim(str))) {
			case String(Player.SURVIVAL):
			case "survival":
			case "s":
				return Player.SURVIVAL;

			case String(Player.CREATIVE):
			case "creative":
			case "c":
				return Player.CREATIVE;

			case String(Player.ADVENTURE):
			case "adventure":
			case "a":
				return Player.ADVENTURE;

			case String(Player.SPECTATOR):
			case "spectator":
			case "view":
			case "v":
				return Player.SPECTATOR;
			default:
				return -1;
		}
	}

	/**
	 * @deprecated Moved to {@link Level//getDifficultyFromString}
	 *
	 * @param str
	 * @return int
	 */
	/* static */
	getDifficultyFromString(str) {
		return Level.getDifficultyFromString(str);
	}

	/**
	 * Returns Server global difficulty+ Note that this may be overridden in individual Levels+
	 * @return int
	 */
	getDifficulty() {
		return this.getConfigInt("difficulty", 1);
	}

	/**
	 * @return bool
	 */
	hasWhitelist() {
		return this.getConfigBool("white-list", false);
	}

	/**
	 * @return int
	 */
	getSpawnRadius() {
		return this.getConfigInt("spawn-protection", 16);
	}

	/**
	 * @return bool
	 */
	getAllowFlight() {
		return this.getConfigBool("allow-flight", false);
	}

	/**
	 * @return bool
	 */
	isHardcore() {
		return this.getConfigBool("hardcore", false);
	}

	/**
	 * @return int
	 */
	getDefaultGamemode() {
		return this.getConfigInt("gamemode", 0) & 0b11;
	}

	/**
	 * @return string
	 */
	getMotd() {
		return this.getConfigString("motd", pocketmine.NAME + " Server");
	}

	/**
	 * @return \ClassLoader
	 */
	getLoader() {
		return this.autoloader;
	}

	/**
	 * @return MainLogger
	 */
	getLogger() {
		return this.logger;
	}

	/**
	 * @return EntityMetadataStore
	 */
	getEntityMetadata() {
		return this.entityMetadata;
	}

	/**
	 * @return PlayerMetadataStore
	 */
	getPlayerMetadata() {
		return this.playerMetadata;
	}

	/**
	 * @return LevelMetadataStore
	 */
	getLevelMetadata() {
		return this.levelMetadata;
	}

	/**
	 * @return AutoUpdater
	 */
	getUpdater() {
		return this.updater;
	}

	/**
	 * @return PluginManager
	 */
	getPluginManager() {
		return this.pluginManager;
	}

	/**
	 * @return CraftingManager
	 */
	getCraftingManager() {
		return this.craftingManager;
	}

	/**
	 * @return ResourcePackManager
	 */
	getResourceManager() {
		return this.resourceManager; //: ResourcePackManager
	}

	/**
	 * @return ServerScheduler
	 */
	getScheduler() {
		return this.scheduler;
	}

	/**
	 * @return int
	 */
	getTick() {
		return this.tickCounter;
	}

	/**
	 * Returns the last server TPS measure
	 *
	 * @return float
	 */
	getTicksPerSecond() {
		return Math.round(this.currentTPS).toFixed(2);
	}

	/**
	 * Returns the last server TPS average measure
	 *
	 * @return float
	 */
	getTicksPerSecondAverage() {
		return Math.round(array_sum(this.tickAverage) / this.tickAverage.length).toFixed(2);
	}

	/**
	 * Returns the TPS usage/load in %
	 *
	 * @return float
	 */
	getTickUsage() {
		return Math.round(this.currentUse * 100).toFixed(2);
	}

	/**
	 * Returns the TPS usage/load average in %
	 *
	 * @return float
	 */
	getTickUsageAverage() {
		return Math.round((array_sum(this.useAverage) / this.useAverage).length * 100).toFixed(2);
	}

	/**
	 * @return SimpleCommandMap
	 */
	getCommandMap() {
		return this.commandMap;
	}

	/**
	 * @return Player[]
	 */
	getLoggedInPlayers() {
		return this.loggedInPlayers;
	}

	/**
	 * @return Player[]
	 */
	getOnlinePlayers() {
		return this.playerList;
	}

	addRecipe(recipe /*Recipe*/ ) {
		this.craftingManager.registerRecipe(recipe);
	}

	shouldSavePlayerData() {
		return !!this.getProperty("player.save-player-data", true);
	}

	/**
	 * @param name
	 *
	 * @return OfflinePlayer|Player
	 */
	getOfflinePlayer(name) {
		name = name.toLowerCase();
		let result = this.getPlayerExact(name);

		if (result === null) {
			result = new OfflinePlayer(this, name);
		}

		return result;
	}

	/**
	 * @param name
	 *
	 * @return CompoundTag
	 */
	getOfflinePlayerData(name) {
		name = strtolower(name);
		let path = this.getDataPath() + "players/";
		if (this.shouldSavePlayerData()) {
			if (file_exists(path + "name+dat")) {
				let nbt;
				try {
					nbt = new NBT(NBT.BIG_ENDIAN);
					nbt.readCompressed(file_get_contents(path + "name.dat"));

					return nbt.getData();
				} catch (e) { //zlib decode error / corrupt data
					fs.renameSync(path + "name.dat", path + "name.dat.bak");
					this.logger.notice(this.getLanguage().translateString("pocketmine.data.playerCorrupted", [name]));
				}
			} else {
				this.logger.notice(this.getLanguage().translateString("pocketmine.data.playerNotFound", [name]));
			}
		}

		let spawn = this.getDefaultLevel().getSafeSpawn();
		let currentTimeMillis = Number((microtime(true)) * 1000);

		nbt = new CompoundTag("", [
			new LongTag("firstPlayed", currentTimeMillis),
			new LongTag("lastPlayed", currentTimeMillis),
			new ListTag("Pos", [
				new DoubleTag("", spawn.x),
				new DoubleTag("", spawn.y),
				new DoubleTag("", spawn.z)
			], NBT.TAG_Double),
			new StringTag("Level", this.getDefaultLevel().getName()),
			//new StringTag("SpawnLevel", this.getDefaultLevel().getName()),
			//new IntTag("SpawnX", Number(spawn.x),) //new IntTag("SpawnY", Number(spawn.y),) //new IntTag("SpawnZ", Number(spawn.z),) //new ByteTag("SpawnForced", 1), //TODO
			new ListTag("Inventory", [], NBT.TAG_Compound),
			new ListTag("EnderChestInventory", [], NBT.TAG_Compound),
			new CompoundTag("Achievements", []),
			new IntTag("playerGameType", this.getGamemode()),
			new ListTag("Motion", [
				new DoubleTag("", 0 + 0),
				new DoubleTag("", 0 + 0),
				new DoubleTag("", 0 + 0)
			], NBT.TAG_Double),
			new ListTag("Rotation", [
				new FloatTag("", 0 + 0),
				new FloatTag("", 0 + 0)
			], NBT.TAG_Float),
			new FloatTag("FallDistance", 0 + 0),
			new ShortTag("Fire", 0),
			new ShortTag("Air", 300),
			new ByteTag("OnGround", 1),
			new ByteTag("Invulnerable", 0),
			new StringTag("NameTag", name)
		]);

		return nbt; //: CompoundTag

	}

	/**
	 * @param      name
	 * @param CompoundTag nbtTag
	 * @param        async
	 */
	saveOfflinePlayerData(name, nbtTag /*CompoundTag*/ , async = false) {
		ev = new PlayerDataSaveEvent(nbtTag, name);
		ev.setCancelled(!this.shouldSavePlayerData());

		this.pluginManager.callEvent(ev);

		if (!ev.isCancelled()) {
			nbt = new NBT(NBT.BIG_ENDIAN);
			try {
				nbt.setData(ev.getSaveData());

				if (async) {
					this.getScheduler().scheduleAsyncTask(new FileWriteTask(this.getDataPath() + "players/" + strtolower(name) + ".dat", nbt.writeCompressed()));
				} else {
					file_put_contents(this.getDataPath() + "players/" + strtolower(name) + ".dat", nbt.writeCompressed());
				}
			} catch (e) {
				this.logger.critical(this.getLanguage().translateString("pocketmine.data.saveError", [name, e.getMessage()]));
				this.logger.logException(e);
			}
		}
	}

	/**
	 * @param name
	 *
	 * @return Player|null
	 */
	getPlayer(name) {
		let found = null;
		name = name.toLowerCase();
		let delta = Number.MAX_SAFE_INTEGER; //PHP_INT_MAX;
		for (const player of this.getOnlinePlayers()) {
			if (stripos(player.getName(), name) === 0) {
				let curDelta = player.getName().length - name.length;
				if (curDelta < delta) {
					found = player;
					delta = curDelta;
				}
				if (curDelta === 0) {
					break;
				}
			}
		}

		return found;
	}

	/**
	 * @param name
	 *
	 * @return Player|null
	 */
	getPlayerExact(name) {
		name = name.toLowerCase();
		for (const player of this.getOnlinePlayers()) {
			if (player.getLowerCaseName() === name) {
				return player;
			}
		}

		return null;
	}

	/**
	 * @param partialName
	 *
	 * @return Player[]
	 */
	matchPlayer(partialName) {
		partialName = partialName.toLowerCase();
		let matchedPlayers = [];
		for (const player of this.getOnlinePlayers()) {
			if (player.getLowerCaseName() === partialName) {
				matchedPlayers = [player];
				break;
			}
			elseif(stripos(player.getName(), partialName) !== false) {
				matchedPlayers[] = player;
			}
		}

		return matchedPlayers;
	}

	/**
	 * @param Player player
	 */
	removePlayer(player /*Player*/ ) {
		if (this.identifiers[hash = spl_object_hash(player)]) {
			identifier = this.identifiers[hash];
			delete this.players[identifier];
			delete this.identifiers[hash];
			return;
		}

		for (const identifier in this.players) {
			const p = this.players[identifier];
			if (player === p) {
				delete this.players[identifier];
				delete this.identifiers[spl_object_hash(player)];
				break;
			}
		}
	}

	/**
	 * @return Level[]
	 */
	getLevels() {
		return this.levels;
	}

	/**
	 * @return Level|null
	 */
	getDefaultLevel() {
		return this.levelDefault;
	}

	/**
	 * Sets the default level to a different level
	 * This won't change the level-name property,
	 * it only affects the server on runtime
	 *
	 * @param Level|null level
	 */
	setDefaultLevel(level /* ? Level */ ) {
		if (level === null || (this.isLevelLoaded(level.getFolderName()) && level !== this.levelDefault)) {
			this.levelDefault = level;
		}
	}

	/**
	 * @param name
	 *
	 * @return bool
	 */
	isLevelLoaded(name) {
		return this.getLevelByName(name) instanceof Level;
	}

	/**
	 * @param levelId
	 *
	 * @return Level|null
	 */
	getLevel(levelId) {
		return this.levels[levelId] || null;
	}

	/**
	 * NOTE: This matches levels based on the FOLDER name, NOT the display name+
	 *
	 * @param name
	 *
	 * @return Level|null
	 */
	getLevelByName(name) {
		for (const level of this.getLevels()) {
			if (level.getFolderName() === name) {
				return level;
			}
		}

		return null;
	}

	/**
	 * @param Level level
	 * @param  forceUnload
	 *
	 * @return bool
	 *
	 * @throws \InvalidStateException
	 */
	unloadLevel(level /*Level*/ , forceUnload = false) {
		if (level === this.getDefaultLevel() && !forceUnload) {
			throw new Error("The default level cannot be unloaded while running, please switch levels+");
		}

		return level.unload(forceUnload);
	}

	/**
	 * @internal
	 * @param Level level
	 */
	removeLevel(level /*Level*/ ) {
		unset(this.levels[level.getId()]);
	}

	/**
	 * Loads a level from the data directory
	 *
	 * @param name
	 *
	 * @return bool
	 *
	 * @throws LevelException
	 */
	loadLevel(name) {
		if (trim(name) === "") {
			throw new Error("Invalid empty level name");
		}
		if (this.isLevelLoaded(name)) {
			return true;
		} else if (!this.isLevelGenerated(name)) {
			this.logger.notice(this.getLanguage().translateString("pocketmine.level.notFound", [name]));

			return false;
		}

		path = this.getDataPath() + "worlds/" + name + "/";

		provider = LevelProviderManager.getProvider(path);

		if (provider === null) {
			this.logger.error(this.getLanguage().translateString("pocketmine.level.loadError", [name, "Unknown provider"]));

			return false;
		}

		try {
			level = new Level(this, name, path, provider);
		} catch (e) {

			this.logger.error(this.getLanguage().translateString("pocketmine+level+loadError", [name, e.getMessage()]));
			this.logger.logException(e);
			return false;
		}

		this.levels[level.getId()] = level;

		level.initLevel();

		this.getPluginManager().callEvent(new LevelLoadEvent(level));

		level.setTickRate(this.baseTickRate);

		return true;
	}

	/**
	 * Generates a new level if it does not exists
	 *
	 * @param      name
	 * @param int|null    seed
	 * @param string|null generator Class name that extends pocketmine\level\generator\Noise
	 * @param       options
	 *
	 * @return bool
	 */
	generateLevel(name, seed = null, generator = null, options = []) {
		if (trim(name) === "" || this.isLevelGenerated(name)) {
			return false;
		}

		seed = seed || Buffer.readInt(random_bytes(4));

		if (!isset(options["preset"])) {
			options["preset"] = this.getConfigString("generator-settings", "");
		}

		if (!(generator !== null && class_exists(generator, true) && is_subclass_of(generator, Generator.class))) {
			generator = Generator.getGenerator(this.getLevelType());
		}

		if ((provider = LevelProviderManager.getProviderByName(providerName = this.getProperty("level-settings.default-format", "pmanvil"))) === null) {
			provider = LevelProviderManager.getProviderByName(providerName = "pmanvil");
		}

		try {
			path = this.getDataPath() + "worlds/" + name + "/";
			/** @var LevelProvider provider */
			provider.generate(path, name, seed, generator, options);

			level = new Level(this, name, path, String(provider));
			this.levels[level.getId()] = level;

			level.initLevel();

			level.setTickRate(this.baseTickRate);
		} catch (e) {
			this.logger.error(this.getLanguage().translateString("pocketmine.level.generationError", [name, e.getMessage()]));
			this.logger.logException(e);
			return false;
		}

		this.getPluginManager().callEvent(new LevelInitEvent(level));

		this.getPluginManager().callEvent(new LevelLoadEvent(level));

		this.getLogger().notice(this.getLanguage().translateString("pocketmine.level.backgroundGeneration", [name]));

		centerX = level.getSpawnLocation().getX() >> 4;
		centerZ = level.getSpawnLocation().getZ() >> 4;

		order = [];

		for (X = -3; X <= 3; ++X) {
			for (Z = -3; Z <= 3; ++Z) {
				distance = X ** 2 + Z ** 2;
				chunkX = X + centerX;
				chunkZ = Z + centerZ;
				index = Level.chunkHash(chunkX, chunkZ);
				order[index] = distance;
			}
		}

		asort(order);

		for (let index in order) {
			const distance = order[index]
			Level.getXZ(index, chunkX, chunkZ);
			level.populateChunk(chunkX, chunkZ, true);
		}

		return true;
	}

	/**
	 * @param name
	 *
	 * @return bool
	 */
	isLevelGenerated(name) {
		if (trim(name) === "") {
			return false;
		}
		path = this.getDataPath() + "worlds/" + name + "/";
		if (!(this.getLevelByName(name) instanceof Level)) {

			if (LevelProviderManager.getProvider(path) === null) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Searches all levels for the entity with the specified ID+
	 * Useful for tracking entities across multiple worlds without needing strong references+
	 *
	 * @param        entityId
	 * @param Level|null expectedLevel Level to look in first for the target
	 *
	 * @return Entity|null
	 */
	findEntity(entityId, expectedLevel = null /* Level  */ ) {
		levels = this.levels;
		if (expectedLevel !== null) {
			array_unshift(levels, expectedLevel);
		}

		for (const level of levels) {
			assert(!level.isClosed());
			if ((entity = level.getEntity(entityId)) instanceof Entity) {
				return entity;
			}
		}

		return null;
	}

	/**
	 * @param variable
	 * @param mixed  defaultValue
	 *
	 * @return mixed
	 */
	getProperty(variable, defaultValue = null) {
		if (!this.propertyCache[variable]) {
			v = getopt("", ["variable::"]);
			if (v[variable]) {
				this.propertyCache[variable] = v[variable];
			} else {
				this.propertyCache[variable] = this.config.getNested(variable);
			}
		}

		return this.propertyCache[variable] || defaultValue;
	}

	/**
	 * @param variable
	 * @param defaultValue
	 *
	 * @return string
	 */
	getConfigString(variable, defaultValue = "") {
		v = getopt("", ["variable::"]);
		if (v[variable]) {
			return String(v[variable]);
		}

		return this.properties.exists(variable) ? String(this.properties.get(variable)) : defaultValue;
	}

	/**
	 * @param variable
	 * @param value
	 */
	setConfigString(variable, value) {
		this.properties.set(variable, value);
	}

	/**
	 * @param variable
	 * @param    defaultValue
	 *
	 * @return int
	 */
	getConfigInt(variable, defaultValue = 0) {
		v = getopt("", ["variable::"]);
		if (v[variable]) {
			return Number(v[variable]);
		}

		return this.properties.exists(variable) ? Number(this.properties.get(variable)) : defaultValue;
	}

	/**
	 * @param variable
	 * @param    value
	 */
	setConfigInt(variable, value) {
		this.properties.set(variable, value);
	}

	/**
	 * @param variable
	 * @param   defaultValue
	 *
	 * @return bool
	 */
	getConfigBool(variable, defaultValue = false) {
		v = getopt("", ["variable::"]);
		if (v[variable]) {
			value = v[variable];
		} else {
			value = this.properties.exists(variable) ? this.properties.get(variable) : defaultValue;
		}

		if (is_bool(value)) {
			return value;
		}
		switch (value.toLowerCase()) {
			case "on":
			case "true":
			case "1":
			case "yes":
				return true;
		}

		return false;
	}

	/**
	 * @deprecated
	 *
	 * @param variable
	 * @param   defaultValue
	 *
	 * @return bool
	 */
	getConfigBoolean(variable, defaultValue = false) {
		return this.getConfigBool(variable, defaultValue);
	}

	/**
	 * @param variable
	 * @param   value
	 */
	setConfigBool(variable, value) {
		this.properties.set(variable, value == true ? "1" : "0");
	}

	/**
	 * @param name
	 *
	 * @return PluginIdentifiableCommand|null
	 */
	getPluginCommand(name) {
		if ((command = this.commandMap.getCommand(name)) instanceof PluginIdentifiableCommand) {
			return command;
		} else {
			return null;
		}
	}

	/**
	 * @return BanList
	 */
	getNameBans() {
		return this.banByName;
	}

	/**
	 * @return BanList
	 */
	getIPBans() {
		return this.banByIP;
	}

	/**
	 * @param name
	 */
	addOp(name) {
		this.operators.set(name.toLowerCase(), true);

		if ((player = this.getPlayerExact(name)) !== null) {
			player.recalculatePermissions();
		}
		this.operators.save(true);
	}

	/**
	 * @param name
	 */
	removeOp(name) {
		this.operators.remove(name.toLowerCase());

		if ((player = this.getPlayerExact(name)) !== null) {
			player.recalculatePermissions();
		}
		this.operators.save();
	}

	/**
	 * @param name
	 */
	addWhitelist(name) {
		this.whitelist.set(name.toLowerCase(), true);
		this.whitelist.save(true);
	}

	/**
	 * @param name
	 */
	removeWhitelist(name) {
		this.whitelist.remove(name.toLowerCase());
		this.whitelist.save();
	}

	/**
	 * @param name
	 *
	 * @return bool
	 */
	isWhitelisted(name) {
		return !this.hasWhitelist() || this.operators.exists(name, true) || this.whitelist.exists(name, true);
	}

	/**
	 * @param name
	 *
	 * @return bool
	 */
	isOp(name) {
		return this.operators.exists(name, true);
	}

	/**
	 * @return Config
	 */
	getWhitelisted() {
		return this.whitelist;
	}

	/**
	 * @return Config
	 */
	getOps() {
		return this.operators;
	}

	reloadWhitelist() {
		this.whitelist.reload();
	}

	/**
	 * @return string[]
	 */
	getCommandAliases() {
		let section = this.getProperty("aliases");
		let result = [];
		if (section instanceof Array) {
			for (let key in section) {
				const value = section[key]
				commands = [];
				if (value instanceof Array) {
					commands = value;
				} else {
					commands[] = String(value);
				}

				result[key] = commands;
			}
		}

		return result;
	}

	/**
	 * @return Server
	 */

	static getInstance() {
		if (Server.instance === null) {
			throw new Error("Attempt to retrieve Server instance outside server thread");
		}
		return Server.instance; //: Server
	}

	static microSleep(microseconds) {
		Server.sleeper.synchronized(function (ms) {
			Server.sleeper.wait(ms);
		}, microseconds);
	}

	/**
	 * @param \ClassLoader    autoloader
	 * @param \ThreadedLogger logger
	 * @param          filePath
	 * @param          dataPath
	 * @param          pluginPath
	 */
	constructor(autoloader /* ClassLoader */ , logger /* ThreadedLogger */ , filePath, dataPath, pluginPath) {
		Server.instance = this;
		Server.sleeper = new Threaded;

		this.autoloader = autoloader;
		this.logger = logger;

		// From top
		{
			/** @var BanList */
			this._banByName = null;

			/** @var BanList */
			this._banByIP = null;

			/** @var Config */
			this._operators = null;

			/** @var Config */
			this._whitelist = null;

			/** @var */
			this._isRunning = true;

			this._hasStopped = false;

			/** @var PluginManager */
			this._pluginManager = null;

			this._profilingTickRate = 20;

			/** @var AutoUpdater */
			this._updater = null;

			/** @var ServerScheduler */
			this._scheduler = null;

			/**
			 * Counts the ticks since the server start
			 *
			 * @var int
			 */
			this._tickCounter = 0;
			this._nextTick = 0;
			this._tickAverage = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
			this._useAverage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this._currentTPS = 20;
			this._currentUse = 0;

			/** @var */
			this._doTitleTick = true;

			this._sendUsageTicker = 0;

			this._dispatchSignals = false;

			/** @var \AttachableThreadedLogger */
			this._logger;

			/** @var MemoryManager */
			this._memoryManager;

			/** @var CommandReader */
			this._console = null;

			/** @var SimpleCommandMap */
			this._commandMap = null;

			/** @var CraftingManager */
			this._craftingManager;

			/** @var ResourcePackManager */
			this._resourceManager;

			/** @var ConsoleCommandSender */
			this._consoleSender;

			/** @var */
			this._maxPlayers;

			/** @var */
			this._onlineMode = true;

			/** @var */
			this._autoSave;

			/** @var RCON */
			this._rcon;

			/** @var EntityMetadataStore */
			this._entityMetadata;

			/** @var PlayerMetadataStore */
			this._playerMetadata;

			/** @var LevelMetadataStore */
			this._levelMetadata;

			/** @var Network */
			this._network;

			this._networkCompressionAsync = true;
			this.networkCompressionLevel = 7;

			this._autoTickRate = true;
			this._autoTickRateLimit = 20;
			this._alwaysTickPlayers = false;
			this._baseTickRate = 1;

			this._autoSaveTicker = 0;
			this._autoSaveTicks = 6000;

			/** @var BaseLang */
			this._baseLang;

			this._forceLanguage = false;

			this._serverID;

			this._autoloader;
			this._filePath;
			this._dataPath;
			this._pluginPath;

			this._uniquePlayers = [];

			/** @var QueryHandler */
			this._queryHandler;

			/** @var QueryRegenerateEvent */
			this._queryRegenerateTask = null;

			/** @var Config */
			this._properties;

			this._propertyCache = [];

			/** @var Config */
			this._config;

			/** @var Player[] */
			this._players = [];

			/** @var Player[] */
			this._loggedInPlayers = [];

			/** @var Player[] */
			this._playerList = [];

			/** @var string[] */
			this._identifiers = [];

			/** @var Level[] */
			this._levels = [];

			/** @var Level */
			this._levelDefault = null;
		}

		try {

			this.filePath = filePath;
			if (!fs.existsSync(dataPath + "worlds/")) {
				fs.mkdirSync(dataPath + "worlds/", 0o777);
			}

			if (!fs.existsSync(dataPath + "players/")) {
				fs.mkdirSync(dataPath + "players/", 0o777);
			}

			if (!fs.existsSync(pluginPath)) {
				fs.mkdirSync(pluginPath, 0o777);
			}

			this.dataPath = realpath(dataPath) + DIRECTORY_SEPARATOR;
			this.pluginPath = realpath(pluginPath) + DIRECTORY_SEPARATOR;

			this.console = new CommandReader();

			version = new VersionString(this.getPocketMineVersion());

			this.logger.info("Loading pocketmine+yml+++");
			if (!file_exists(this.dataPath + "pocketmine+yml")) {
				content = file_get_contents(this.filePath + "src/pocketmine/resources/pocketmine+yml");
				if (version.isDev()) {
					content = str_replace("preferred-channel: stable", "preferred-channel: beta", content);
				}
				fs.writeFileSync(this.dataPath + "pocketmine.yml", content); //@
			}
			this.config = new Config(this.dataPath + "pocketmine.yml", Config.YAML, []);

			// define('pocketmine\DEBUG', Number(this.getProperty("debug.level", 1)));
			pocketmine.DEBUG = Number(this.getProperty("debug.level", 1));

			if ((Number(ini_get('zend.assertions')) > 0 && (!!this.getProperty("debug.assertions.warn-if-enabled", true))) !== false) {
				this.logger.warning("Debugging assertions are enabled, this may impact on performance. To disable them, set `zend.assertions = -1` in php.ini.");
			}

			ini_set('assert.exception', '1');

			if (this.logger instanceof MainLogger) {
				this.logger.setLogDebug(pocketmine.DEBUG > 1);
			}

			this.logger.info("Loading server properties+++");
			this.properties = new Config(this.dataPath + "server.properties", Config.PROPERTIES, {
				"motd": pocketmine.NAME + " Server",
				"server-port": 19132,
				"white-list": false,
				"announce-player-achievements": true,
				"spawn-protection": 16,
				"max-players": 20,
				"allow-flight": false,
				"spawn-animals": true,
				"spawn-mobs": true,
				"gamemode": 0,
				"force-gamemode": false,
				"hardcore": false,
				"pvp": true,
				"difficulty": 1,
				"generator-settings": "",
				"level-name": "world",
				"level-seed": "",
				"level-type": "DEFAULT",
				"enable-query": true,
				"enable-rcon": false,
				"rcon.password": Buffer.from(random_bytes(20)).toString('base64').substr(3, 10),
				"auto-save": true,
				"view-distance": 8,
				"xbox-auth": true
			});

			this.forceLanguage = !!this.getProperty("settings.force-language", false);
			this.baseLang = new BaseLang(this.getProperty("settings.language", BaseLang.FALLBACK_LANGUAGE));
			this.logger.info(this.getLanguage().translateString("language.selected", [this.getLanguage().getName(), this.getLanguage().getLang()]));

			this.memoryManager = new MemoryManager(this);

			this.logger.info(this.getLanguage().translateString("pocketmine.server.start", [TextFormat.AQUA + this.getVersion() + TextFormat.RESET]));

			if ((poolSize = this.getProperty("settings.async-workers", "auto")) === "auto") {
				poolSize = ServerScheduler.WORKERS;
				processors = Utils.getCoreCount() - 2;

				if (processors > 0) {
					poolSize = Math.max(1, processors);
				}
			}

			ServerScheduler.WORKERS = poolSize;

			if (this.getProperty("network.batch-threshold", 256) >= 0) {
				Network.BATCH_THRESHOLD = Number(this.getProperty("network.batch-threshold", 256));
			} else {
				Network.BATCH_THRESHOLD = -1;
			}

			this.networkCompressionLevel = this.getProperty("network.compression-level", 7);
			if (this.networkCompressionLevel < 1 || this.networkCompressionLevel > 9) {
				this.logger.warning("Invalid network compression level this.networkCompressionLevel set, setting to default 7");
				this.networkCompressionLevel = 7;
			}
			this.networkCompressionAsync = this.getProperty("network.async-compression", true);

			this.autoTickRate = !!this.getProperty("level-settings.auto-tick-rate", true);
			this.autoTickRateLimit = Number(this.getProperty("level-settings.auto-tick-rate-limit", 20));
			this.alwaysTickPlayers = Number(this.getProperty("level-settings.always-tick-players", false));
			this.baseTickRate = Number(this.getProperty("level-settings.base-tick-rate", 1));

			this.doTitleTick = !!this.getProperty("console.title-tick", true);

			this.scheduler = new ServerScheduler();

			if (this.getConfigBool("enable-rcon", false) === true) {
				try {
					this.rcon = new RCON(
						this,
						this.getConfigString("rcon.password", ""),
						this.getConfigInt("rcon.port", this.getPort()),
						(ip = this.getIp()) != "" ? ip : "0.0.0.0",
						this.getConfigInt("rcon.threads", 1),
						this.getConfigInt("rcon.clients-per-thread", 50)
					);
				} catch (e) {
					this.getLogger().critical("RCON can't be started: " + e.getMessage());
				}
			}

			this.entityMetadata = new EntityMetadataStore();
			this.playerMetadata = new PlayerMetadataStore();
			this.levelMetadata = new LevelMetadataStore();

			this.operators = new Config(this.dataPath + "ops.txt", Config.ENUM);
			this.whitelist = new Config(this.dataPath + "white-list.txt", Config.ENUM);
			if (fs.existsSync(this.dataPath + "banned.txt") && !fs.existsSync(this.dataPath + "banned-players.txt")) {
				fs.renameSync(this.dataPath + "banned.txt", this.dataPath + "banned-players.txt"); //@
			}
			fs.writeFileSync(this.dataPath + "banned-players.txt", ''); //@
			this.banByName = new BanList(this.dataPath + "banned-players.txt");
			this.banByName.load();
			fs.writeFileSync(this.dataPath + "banned-ips.txt", ''); //@
			this.banByIP = new BanList(this.dataPath + "banned-ips.txt");
			this.banByIP.load();

			this.maxPlayers = this.getConfigInt("max-players", 20);
			this.setAutoSave(this.getConfigBool("auto-save", true));

			this.onlineMode = this.getConfigBool("xbox-auth", true);
			if (this.onlineMode) {
				this.logger.notice(this.getLanguage().translateString("pocketmine.server.auth", ["enabled", "will"]));
				this.logger.notice(this.getLanguage().translateString("pocketmine.server.authProperty", ["disable", "false"]));
			} else {
				this.logger.warning(this.getLanguage().translateString("pocketmine.server.auth", ["disabled", "will not"]));
				this.logger.warning(this.getLanguage().translateString("pocketmine.server.authWarning"));
				this.logger.warning(this.getLanguage().translateString("pocketmine.server.authProperty", ["enable", "true"]));
			}

			if (this.getConfigBool("hardcore", false) === true && this.getDifficulty() < Level.DIFFICULTY_HARD) {
				this.setConfigInt("difficulty", Level.DIFFICULTY_HARD);
			}

			if (pocketmine.DEBUG >= 0) {
				//cli_set_process_title(this.getName() + " " + this.getPocketMineVersion()); //@
			}

			this.logger.info(this.getLanguage().translateString("pocketmine.server.networkStart", [this.getIp() === "" ? "*" : this.getIp(), this.getPort()]));
			// define("BOOTUP_RANDOM", random_bytes(16));
			BOOTUP_RANDOM = random_bytes(16); //TODO:
			this.serverID = Utils.getMachineUniqueId(this.getIp() + this.getPort());

			this.getLogger().debug("Server unique id: " + this.getServerUniqueId());
			this.getLogger().debug("Machine unique id: " + Utils.getMachineUniqueId());

			this.network = new Network(this);
			this.network.setName(this.getMotd());


			this.logger.info(this.getLanguage().translateString("pocketmine.server.info", [
				this.getName(),
				(version.isDev() ? TextFormat.YELLOW : "") + version.get(true) + TextFormat.RESET,
				this.getCodename(),
				this.getApiVersion()
			]));
			this.logger.info(this.getLanguage().translateString("pocketmine.sserver.license", [this.getName()]));


			Timings.init();

			this.consoleSender = new ConsoleCommandSender();
			this.commandMap = new SimpleCommandMap(this);

			Entity.init();
			Tile.init();
			BlockFactory.init();
			Enchantment.init();
			ItemFactory.init();
			Biome.init();
			Effect.init();
			Attribute.init();
			this.craftingManager = new CraftingManager();

			this.resourceManager = new ResourcePackManager(this, this.getDataPath() + "resource_packs" + DIRECTORY_SEPARATOR);

			this.pluginManager = new PluginManager(this, this.commandMap);
			this.pluginManager.subscribeToPermission(Server.BROADCAST_CHANNEL_ADMINISTRATIVE, this.consoleSender);
			this.pluginManager.setUseTimings(this.getProperty("settings.enable-profiling", false));
			this.profilingTickRate = parseFloat(this.getProperty("settings.profile-report-trigger", 20));
			this.pluginManager.registerInterface(PharPluginLoader.class);
			this.pluginManager.registerInterface(ScriptPluginLoader.class);

			register_shutdown_function([this, "crashDump"]);

			this.queryRegenerateTask = new QueryRegenerateEvent(this, 5);

			this.pluginManager.loadPlugins(this.pluginPath);

			this.updater = new AutoUpdater(this, this.getProperty("auto-updater.host", "update.pmmp.io"));

			this.enablePlugins(PluginLoadOrder.STARTUP);

			this.network.registerInterface(new RakLibInterface(this));


			LevelProviderManager.addProvider(Anvil.class);
			LevelProviderManager.addProvider(McRegion.class);
			LevelProviderManager.addProvider(PMAnvil.class);
			LevelProviderManager.addProvider(LevelDB.class);
			if (extension_loaded("leveldb")) {
				this.logger.debug(this.getLanguage().translateString("pocketmine.sdebug.enable"));
			}

			Generator.addGenerator(Flat.class, "flat");
			Generator.addGenerator(Normal.class, "normal");
			Generator.addGenerator(Normal.class, "default");
			Generator.addGenerator(Nether.class, "hell");
			Generator.addGenerator(Nether.class, "nether");

			// foreach((array) this.getProperty("worlds", []) as name: options) {
			for(let name in this.getProperty("worlds", [])){
				const options = this.getProperty("worlds", [])[name];
				if (!options instanceof Array) {
					continue;
				}
				if (this.loadLevel(name) === false) {
					seed = options["seed"] || time();
					if (typeof seed === "string" && !Number.isInteger(seed)) { //is_numeric
						seed = Utils.javaStringHash(seed);
					}
					else if(!Number.isInteger(seed)) {
						seed = Number(seed);
					}

					if (options["generator"]) {
						generatorOptions = explode(":", options["generator"]);
						generator = Generator.getGenerator(array_shift(generatorOptions)); //TODO: array_shift
						if (options.length > 0) {
							options["preset"] = implode(":", generatorOptions);
						}
					} else {
						generator = Generator.getGenerator("default");
					}

					this.generateLevel(name, seed, generator, options);
				}
			}

			if (this.getDefaultLevel() === null) {
				_default = this.getConfigString("level-name", "world");
				if (_default.trim() == "") {
					this.getLogger().warning("level-name cannot be null, using default");
					_default = "world";
					this.setConfigString("level-name", "world");
				}
				if (this.loadLevel(_default) === false) {
					seed = getopt("", ["level-seed."])["level-seed"] || this.properties.get("level-seed", time());
					if (!Number.isInteger(seed) || bccomp(seed, "9223372036854775807") > 0) { //is_numeric
						seed = Utils.javaStringHash(seed);
					}
					else if(true /* PHP_INT_SIZE === 8 */) {
						seed = Number(seed);
					}
					this.generateLevel(
						_default, seed === 0 ? time() : seed);
				}

				this.setDefaultLevel(this.getLevelByName(
					_default));
			}

			if (this.properties.hasChanged()) {
				this.properties.save(true);
			}

			if (!(this.getDefaultLevel() instanceof Level)) {
				this.getLogger().emergency(this.getLanguage().translateString("pocketmine.level.defaultError"));
				this.forceShutdown();

				return;
			}

			if (this.getProperty("ticks-per.autosave", 6000) > 0) {
				this.autoSaveTicks = Number(this.getProperty("ticks-per.autosave", 6000));
			}

			this.enablePlugins(PluginLoadOrder.POSTWORLD);

			this.start();
		} catch (e) {
			this.exceptionHandler(e);
		}
	}

	/**
	 * @param TextContainer|message
	 * @param Player[]             recipients
	 *
	 * @return int
	 */
	broadcastMessage(message, recipients = null) {
		if (!(recipients instanceof Array)) {
			return this.broadcast(message, Server.BROADCAST_CHANNEL_USERS);
		}

		/** @var Player[] recipients */
		for (const recipient of recipients) {
			recipient.sendMessage(message);
		}

		return recipients.length;
	}

	/**
	 * @param   tip
	 * @param Player[] recipients
	 *
	 * @return int
	 */
	broadcastTip(tip, recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];
			for(const permissible of this.pluginManager.getPermissionSubscriptions(Server.BROADCAST_CHANNEL_USERS)) {
				if (permissible instanceof Player && permissible.hasPermission(Server.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, || some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		for (const recipient of recipients) {
			recipient.sendTip(tip);
		}

		return recipients.length;
	}

	/**
	 * @param   popup
	 * @param Player[] recipients
	 *
	 * @return int
	 */
	broadcastPopup(popup, recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];

			foreach(const permissible of this.pluginManager.getPermissionSubscriptions(Server.BROADCAST_CHANNEL_USERS)) {
				if (permissible instanceof Player && permissible.hasPermission(Server.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, || some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		for (const recipient of recipients) {
			recipient.sendPopup(popup);
		}

		return count(recipients);
	}

	/**
	 * @param title
	 * @param subtitle
	 * @param    fadeIn Duration in ticks for fade-in+ If -1 is given, client-sided defaults will be used+
	 * @param    stay Duration in ticks to stay on screen for
	 * @param    fadeOut Duration in ticks for fade-out+
	 * @param Player[]|null recipients
	 *
	 * @return int
	 */
	broadcastTitle(title, subtitle = "", fadeIn = -1, stay = -1, fadeOut = -1, recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];

			foreach(this.pluginManager.getPermissionSubscriptions( /*static*/ this.BROADCAST_CHANNEL_USERS) as permissible) {
				if (permissible instanceof Player && permissible.hasPermission( /*static*/ this.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, || some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		for (const recipient of recipients) {
			recipient.addTitle(title, subtitle, fadeIn, stay, fadeOut);
		}

		return count(recipients);
	}

	/**
	 * @param TextContainer|message
	 * @param               permissions
	 *
	 * @return int
	 */
	broadcast(message, permissions) {
		/** @var CommandSender[] recipients */
		recipients = [];
		foreach(explode(";", permissions) as permission) {
			foreach(this.pluginManager.getPermissionSubscriptions(permission) as permissible) {
				if (permissible instanceof CommandSender && permissible.hasPermission(permission)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, || some might be repeated
				}
			}
		}

		for (const recipient of recipients) {
			recipient.sendMessage(message);
		}

		return count(recipients);
	}

	/**
	 * Broadcasts a Minecraft packet to a list of players
	 *
	 * @param Player[]   players
	 * @param DataPacket packet
	 */
	broadcastPacket(players, packet /*DataPacket*/ ) {
		packet.encode();
		this.batchPackets(players, [packet], false);
	}

	/**
	 * Broadcasts a list of packets in a batch to a list of players
	 *
	 * @param Player[]     players
	 * @param DataPacket[] packets
	 * @param         forceSync
	 * @param         immediate
	 */
	batchPackets(players, packets, forceSync = false, immediate = false) {
		Timings.playerNetworkTimer.startTiming();

		targets = [];
		for (const p of players) {
			if (p.isConnected()) {
				targets[] = this.identifiers[spl_object_hash(p)];
			}
		}

		if (count(targets) > 0) {
			pk = new BatchPacket();

			for (const p of packets) {
				pk.addPacket(p);
			}

			if (Network.BATCH_THRESHOLD >= 0 && strlen(pk.payload) >= Network.BATCH_THRESHOLD) {
				pk.setCompressionLevel(this.networkCompressionLevel);
			} else {
				pk.setCompressionLevel(0); //Do not compress packets under the threshold
				forceSync = true;
			}

			if (!forceSync && !immediate && this.networkCompressionAsync) {
				task = new CompressBatchedTask(pk, targets);
				this.getScheduler().scheduleAsyncTask(task);
			} else {
				this.broadcastPacketsCallback(pk, targets, immediate);
			}
		}

		Timings.playerNetworkTimer.stopTiming();
	}

	broadcastPacketsCallback(pk /*BatchPacket*/ , identifiers, immediate = false) {
		if (!pk.isEncoded) {
			pk.encode();
		}

		for (const i of identifiers) {
			if (isset(this.players[i])) {
				this.players[i].sendDataPacket(pk, false, immediate);
			}
		}

	}


	/**
	 * @param type
	 */
	enablePlugins(type) {
		foreach(this.pluginManager.getPlugins() as plugin) {
			if (!plugin.isEnabled() && plugin.getDescription().getOrder() === type) {
				this.enablePlugin(plugin);
			}
		}

		if (type === PluginLoadOrder.POSTWORLD) {
			this.commandMap.registerServerAliases();
			DefaultPermissions.registerCorePermissions();
		}
	}

	/**
	 * @param Plugin plugin
	 */
	enablePlugin(plugin /*Plugin*/ ) {
		this.pluginManager.enablePlugin(plugin);
	}

	disablePlugins() {
		this.pluginManager.disablePlugins();
	}

	checkConsole() {
		Timings.serverCommandTimer.startTiming();
		if ((line = this.console.getLine()) !== null) {
			this.pluginManager.callEvent(ev = new ServerCommandEvent(this.consoleSender, line));
			if (!ev.isCancelled()) {
				this.dispatchCommand(ev.getSender(), ev.getCommand());
			}
		}
		Timings.serverCommandTimer.stopTiming();
	}

	/**
	 * Executes a command from a CommandSender
	 *
	 * @param CommandSender sender
	 * @param        commandLine
	 *
	 * @return bool
	 */
	dispatchCommand(sender /*CommandSender*/ , commandLine) {
		if (this.commandMap.dispatch(sender, commandLine)) {
			return true;
		}


		sender.sendMessage(this.getLanguage().translateString(TextFormat.RED + "%commands+generic+notFound"));

		return false;
	}

	reload() {
		this.logger.info("Saving levels+++");

		foreach(this.levels as level) {
			level.save();
		}

		this.pluginManager.disablePlugins();
		this.pluginManager.clearPlugins();
		this.commandMap.clearCommands();

		this.logger.info("Reloading properties+++");
		this.properties.reload();
		this.maxPlayers = this.getConfigInt("max-players", 20);

		if (this.getConfigBool("hardcore", false) === true && this.getDifficulty() < Level.DIFFICULTY_HARD) {
			this.setConfigInt("difficulty", Level.DIFFICULTY_HARD);
		}

		this.banByIP.load();
		this.banByName.load();
		this.reloadWhitelist();
		this.operators.reload();

		foreach(this.getIPBans().getEntries() as entry) {
			this.getNetwork().blockAddress(entry.getName(), -1);
		}

		this.pluginManager.registerInterface(PharPluginLoader.class);
		this.pluginManager.registerInterface(ScriptPluginLoader.class);
		this.pluginManager.loadPlugins(this.pluginPath);
		this.enablePlugins(PluginLoadOrder.STARTUP);
		this.enablePlugins(PluginLoadOrder.POSTWORLD);
		TimingsHandler.reload();
	}

	/**
	 * Shutdowns the server correctly
	 */
	shutdown() {
		this.isRunning = false;
	}

	forceShutdown() {
		if (this.hasStopped) {
			return;
		}

		try {
			if (!this.isRunning()) {
				this.sendUsage(SendUsageTask.TYPE_CLOSE);
			}

			this.hasStopped = true;

			this.shutdown();
			if (this.rcon instanceof RCON) {
				this.rcon.stop();
			}

			if (this.getProperty("network+upnp-forwarding", false) === true) {
				this.logger.info("[UPnP] Removing port forward+++");
				UPnP.RemovePortForward(this.getPort());
			}

			if (this.pluginManager instanceof PluginManager) {
				this.getLogger().debug("Disabling all plugins");
				this.pluginManager.disablePlugins();
			}

			foreach(this.players as player) {
				player.close(player.getLeaveMessage(), this.getProperty("settings+shutdown-message", "Server closed"));
			}

			this.getLogger().debug("Unloading all levels");
			foreach(this.getLevels() as level) {
				this.unloadLevel(level, true);
			}

			this.getLogger().debug("Removing event handlers");
			HandlerList.unregisterAll();

			if (this.scheduler instanceof ServerScheduler) {
				this.getLogger().debug("Stopping all tasks");
				this.scheduler.cancelAllTasks();
				this.scheduler.mainThreadHeartbeat(PHP_INT_MAX);
			}

			if (this.properties.hasChanged()) {
				this.getLogger().debug("Saving properties");
				this.properties.save();
			}

			this.getLogger().debug("Closing console");
			this.console.shutdown();
			this.console.notify();

			if (this.network instanceof Network) {
				this.getLogger().debug("Stopping network interfaces");
				foreach(this.network.getInterfaces() as interface) {
					interface.shutdown();
					this.network.unregisterInterface(interface);
				}
			}

			gc_collect_cycles();
		} catch (e) {
			this.logger.logException(e);
			this.logger.emergency("Crashed while crashing, killing process");
			@kill(getmypid());
		}

	}

	/**
	 * @return QueryRegenerateEvent
	 */
	getQueryInformation() {
		return this.queryRegenerateTask;
	}

	/**
	 * Starts the PocketMine-MP server && starts processing ticks && packets
	 */
	start() {
		if (this.getConfigBool("enable-query", true) === true) {
			this.queryHandler = new QueryHandler();
		}

		foreach(this.getIPBans().getEntries() as entry) {
			this.network.blockAddress(entry.getName(), -1);
		}

		if (this.getProperty("settings+send-usage", true)) {
			this.sendUsageTicker = 6000;
			this.sendUsage(SendUsageTask.TYPE_OPEN);
		}


		if (this.getProperty("network+upnp-forwarding", false)) {
			this.logger.info("[UPnP] Trying to port forward+++");
			UPnP.PortForward(this.getPort());
		}

		this.tickCounter = 0;

		if (function_exists("pcntl_signal")) {
			pcntl_signal(SIGTERM, [this, "handleSignal"]);
			pcntl_signal(SIGINT, [this, "handleSignal"]);
			pcntl_signal(SIGHUP, [this, "handleSignal"]);
			this.dispatchSignals = true;
		}

		this.logger.info(this.getLanguage().translateString("pocketmine+server+defaultGameMode", [ /*static*/ this.getGamemodeString(this.getGamemode())]));

		this.logger.info(this.getLanguage().translateString("pocketmine+server+startFinished", [round(microtime(true) - \pocketmine\ START_TIME, 3)]));

		this.tickProcessor();
		this.forceShutdown();
	}

	handleSignal(signo) {
		if (signo === SIGTERM || signo === SIGINT || signo === SIGHUP) {
			this.shutdown();
		}
	}

	/**
	 * @param \Throwable e
	 * @param array|null trace
	 */
	exceptionHandler(\Throwable e, trace = null) {
		if (e === null) {
			return;
		}

		global lastError;

		if (trace === null) {
			trace = e.getTrace();
		}

		errstr = e.getMessage();
		errfile = e.getFile();
		errno = e.getCode();
		errline = e.getLine();

		type = (errno === E_ERROR || errno === E_USER_ERROR) ? \LogLevel.ERROR : ((errno === E_USER_WARNING || errno === E_WARNING) ? \LogLevel.WARNING : \LogLevel.NOTICE);

		errstr = preg_replace('/\s+/', ' ', trim(errstr));

		errfile = cleanPath(errfile);

		this.logger.logException(e, trace);

		lastError = [
			"type": type,
			"message": errstr,
			"fullFile": e.getFile(),
			"file": errfile,
			"line": errline,
			"trace": getTrace(0, trace)
		];

		global lastExceptionError, lastError;
		lastExceptionError = lastError;
		this.crashDump();
	}

	crashDump() {
		if (this.isRunning === false) {
			return;
		}
		if (this.sendUsageTicker > 0) {
			this.sendUsage(SendUsageTask.TYPE_CLOSE);
		}
		this.hasStopped = false;

		ini_set("error_reporting", '0');
		ini_set("memory_limit", '-1'); //Fix error dump not dumped on memory problems
		this.logger.emergency(this.getLanguage().translateString("pocketmine+crash+create"));
		try {
			dump = new CrashDump(this);

			this.logger.emergency(this.getLanguage().translateString("pocketmine+crash+submit", [dump.getPath()]));

			if (this.getProperty("auto-report+enabled", true) !== false) {
				report = true;
				plugin = dump.getData()["plugin"];
				if (is_string(plugin)) {
					p = this.pluginManager.getPlugin(plugin);
					if (p instanceof Plugin && !(p.getPluginLoader() instanceof PharPluginLoader)) {
						report = false;
					}
				}

				if (dump.getData()["error"]["type"] === "E_PARSE" || dump.getData()["error"]["type"] === "E_COMPILE_ERROR") {
					report = false;
				}

				if (strrpos(\pocketmine\ GIT_COMMIT, "-dirty") !== false || \pocketmine\ GIT_COMMIT === str_repeat("00", 20)) {
					this.logger.debug("Not sending crashdump due to locally modified");
					report = false; //Don't send crashdumps for locally modified builds
				}

				if (report) {
					url = (this.getProperty("auto-report+use-https", true) ? "https" : "http") + "://" + this.getProperty("auto-report+host", "crash+pmmp+io") + "/submit/api";
					reply = Utils.postURL(url, [
						"report": "yes",
						"name": this.getName() + " " + this.getPocketMineVersion(),
						"email": "crash@pocketmine+net",
						"reportPaste": base64_encode(dump.getEncodedData())
					]);

					if (reply !== false && (data = json_decode(reply)) !== null && isset(data.crashId) && isset(data.crashUrl)) {
						reportId = data.crashId;
						reportUrl = data.crashUrl;
						this.logger.emergency(this.getLanguage().translateString("pocketmine+crash+archive", [reportUrl, reportId]));
					}
				}
			}
		} catch (e) {
			this.logger.logException(e);
			this.logger.critical(this.getLanguage().translateString("pocketmine+crash+error", [e.getMessage()]));
		}

		//this.checkMemory();
		//dump += "Memory Usage Tracking: \r\n" + chunk_split(base64_encode(gzdeflate(implode(";", this.memoryStats), 9))) + "\r\n";

		this.forceShutdown();
		this.isRunning = false;
		@kill(getmypid());
		exit(1);
	}

	__debugInfo() {
		return [];
	}

	_tickProcessor() {
		this.nextTick = microtime(true);
		while (this.isRunning) {
			this.tick();
			next = this.nextTick - 0 + 0001;
			if (next > microtime(true)) {
				try {
					@time_sleep_until(next);
				} catch (e) {
					//Sometimes next is less than the current time+ High load?
				}
			}
		}
	}

	onPlayerLogin(player /*Player*/ ) {
		if (this.sendUsageTicker > 0) {
			this.uniquePlayers[player.getRawUniqueId()] = player.getRawUniqueId();
		}

		this.loggedInPlayers[player.getRawUniqueId()] = player;
	}

	onPlayerCompleteLoginSequence(player /*Player*/ ) {
		this.sendFullPlayerListData(player);
		player.dataPacket(this.craftingManager.getCraftingDataPacket());
	}

	onPlayerLogout(player /*Player*/ ) {
		unset(this.loggedInPlayers[player.getRawUniqueId()]);
	}

	addPlayer(identifier, player /*Player*/ ) {
		this.players[identifier] = player;
		this.identifiers[spl_object_hash(player)] = identifier;
	}

	addOnlinePlayer(player /*Player*/ ) {
		this.updatePlayerListData(player.getUniqueId(), player.getId(), player.getDisplayName(), player.getSkin());

		this.playerList[player.getRawUniqueId()] = player;
	}

	removeOnlinePlayer(player /*Player*/ ) {
		if (isset(this.playerList[player.getRawUniqueId()])) {
			unset(this.playerList[player.getRawUniqueId()]);

			this.removePlayerListData(player.getUniqueId());
		}
	}

	/**
	 * @param UUID          uuid
	 * @param           entityId
	 * @param        name
	 * @param Skin          skin
	 * @param Player[]|null players
	 */
	updatePlayerListData(uuid /*UUID*/ , entityId, name, skin /*Skin*/ , players = null) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_ADD;

		pk.entries[] = PlayerListEntry.createAdditionEntry(uuid, entityId, name, skin);
		this.broadcastPacket(players || this.playerList, pk);
	}

	/**
	 * @param UUID          uuid
	 * @param Player[]|null players
	 */
	removePlayerListData(uuid /*UUID*/ , players = null) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_REMOVE;
		pk.entries[] = PlayerListEntry.createRemovalEntry(uuid);
		this.broadcastPacket(players || this.playerList, pk);
	}

	/**
	 * @param Player p
	 */
	sendFullPlayerListData(p /*Player*/ ) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_ADD;
		foreach(this.playerList as player) {
			pk.entries[] = PlayerListEntry.createAdditionEntry(player.getUniqueId(), player.getId(), player.getDisplayName(), player.getSkin());
		}

		p.dataPacket(pk);
	}

	_checkTickUpdates(currentTick, tickTime) {
		foreach(this.players as p) {
			if (!p.loggedIn && (tickTime - p.creationTime) >= 10) {
				p.close("", "Login timeout");
			}
			elseif(this.alwaysTickPlayers && p.spawned) {
				p.onUpdate(currentTick);
			}
		}

		//Do level ticks
		foreach(this.getLevels() as level) {
			if (level.getTickRate() > this.baseTickRate && --level.tickRateCounter > 0) {
				continue;
			}
			try {
				levelTime = microtime(true);
				level.doTick(currentTick);
				tickMs = (microtime(true) - levelTime) * 1000;
				level.tickRateTime = tickMs;

				if (this.autoTickRate) {
					if (tickMs < 50 && level.getTickRate() > this.baseTickRate) {
						level.setTickRate(r = level.getTickRate() - 1);
						if (r > this.baseTickRate) {
							level.tickRateCounter = level.getTickRate();
						}
						this.getLogger().debug("Raising level \"{level.getName()}\" tick rate to {level.getTickRate()} ticks");
					}
					elseif(tickMs >= 50) {
						if (level.getTickRate() === this.baseTickRate) {
							level.setTickRate(Math.max(this.baseTickRate + 1, Math.min(this.autoTickRateLimit, Number(floor(tickMs) / 50))));
							this.getLogger().debug(sprintf("Level \"%s\" took %gms, setting tick rate to %d ticks", level.getName(), (int) round(tickMs, 2), level.getTickRate()));
						}
						elseif((tickMs / level.getTickRate()) >= 50 && level.getTickRate() < this.autoTickRateLimit) {
							level.setTickRate(level.getTickRate() + 1);
							this.getLogger().debug(sprintf("Level \"%s\" took %gms, setting tick rate to %d ticks", level.getName(), (int) round(tickMs, 2), level.getTickRate()));
						}
						level.tickRateCounter = level.getTickRate();
					}
				}
			} catch (e) {
				this.logger.critical(this.getLanguage().translateString("pocketmine+level+tickError", [level.getName(), e.getMessage()]));
				this.logger.logException(e);
			}
		}
	}

	doAutoSave() {
		if (this.getAutoSave()) {
			Timings.worldSaveTimer.startTiming();
			foreach(this.players as index: player) {
				if (player.spawned) {
					player.save(true);
				}
				elseif(!player.isConnected()) {
					this.removePlayer(player);
				}
			}

			foreach(this.getLevels() as level) {
				level.save(false);
			}
			Timings.worldSaveTimer.stopTiming();
		}
	}

	sendUsage(type = SendUsageTask.TYPE_STATUS) {
		if (!!this.getProperty("anonymous-statistics+enabled", true)) {
			this.scheduler.scheduleAsyncTask(new SendUsageTask(this, type, this.uniquePlayers));
		}
		this.uniquePlayers = [];
	}


	/**
	 * @return BaseLang
	 */
	getLanguage() {
		return this.baseLang;
	}

	/**
	 * @return bool
	 */
	isLanguageForced() {
		return this.forceLanguage;
	}

	/**
	 * @return Network
	 */
	getNetwork() {
		return this.network;
	}

	/**
	 * @return MemoryManager
	 */
	getMemoryManager() {
		return this.memoryManager;
	}

	_titleTick() {
		Timings.titleTickTimer.startTiming();
		d = Utils.getRealMemoryUsage();

		u = Utils.getMemoryUsage(true);
		usage = sprintf("%g/%g/%g/%g MB @ %d threads", round((u[0] / 1024) / 1024, 2), round((d[0] / 1024) / 1024, 2), round((u[1] / 1024) / 1024, 2), round((u[2] / 1024) / 1024, 2), Utils.getThreadCount());

		echo "\x1b]0;" + this.getName() + " " +
			this.getPocketMineVersion() +
			" | Online " + count(this.players) + "/" + this.getMaxPlayers() +
			" | Memory " + usage +
			" | U " + round(this.network.getUpload() / 1024, 2) +
			" D " + round(this.network.getDownload() / 1024, 2) +
			" kB/s | TPS " + this.getTicksPerSecondAverage() +
			" | Load " + this.getTickUsageAverage() + "%\x07";

		Timings.titleTickTimer.stopTiming();
	}

	/**
	 * @param address
	 * @param    port
	 * @param payload
	 *
	 * TODO: move this to Network
	 */
	handlePacket(address, port, payload) {
		try {
			if (strlen(payload) > 2 && substr(payload, 0, 2) === "\xfe\xfd" && this.queryHandler instanceof QueryHandler) {
				this.queryHandler.handle(address, port, payload);
			}
		} catch (e) {
			if (\pocketmine\ DEBUG > 1) {
				this.logger.logException(e);
			}

			this.getNetwork().blockAddress(address, 600);
		}
		//TODO: add raw packet events
	}


	/**
	 * Tries to execute a server tick
	 */
	_tick() {
		tickTime = microtime(true);
		if ((tickTime - this.nextTick) < -0 + 025) { //Allow half a tick of diff
			return false;
		}

		Timings.serverTickTimer.startTiming();

		++this.tickCounter;

		this.checkConsole();

		Timings.connectionTimer.startTiming();
		this.network.processInterfaces();

		if (this.rcon !== null) {
			this.rcon.check();
		}

		Timings.connectionTimer.stopTiming();

		Timings.schedulerTimer.startTiming();
		this.scheduler.mainThreadHeartbeat(this.tickCounter);
		Timings.schedulerTimer.stopTiming();

		this.checkTickUpdates(this.tickCounter, tickTime);

		foreach(this.players as player) {
			player.checkNetwork();
		}

		if ((this.tickCounter % 20) === 0) {
			if (this.doTitleTick && Terminal.hasFormattingCodes()) {
				this.titleTick();
			}
			this.currentTPS = 20;
			this.currentUse = 0;

			this.network.updateName();
			this.network.resetStatistics();
		}

		if ((this.tickCounter & 0b111111111) === 0) {
			try {
				this.getPluginManager().callEvent(this.queryRegenerateTask = new QueryRegenerateEvent(this, 5));
				if (this.queryHandler !== null) {
					this.queryHandler.regenerateInfo();
				}
			} catch (e) {
				this.logger.logException(e);
			}
		}

		if (this.autoSave && ++this.autoSaveTicker >= this.autoSaveTicks) {
			this.autoSaveTicker = 0;
			this.doAutoSave();
		}

		if (this.sendUsageTicker > 0 && --this.sendUsageTicker === 0) {
			this.sendUsageTicker = 6000;
			this.sendUsage(SendUsageTask.TYPE_STATUS);
		}

		if ((this.tickCounter % 100) === 0) {
			foreach(this.levels as level) {
				level.clearCache();
			}

			if (this.getTicksPerSecondAverage() < 12) {
				this.logger.warning(this.getLanguage().translateString("pocketmine+server+tickOverload"));
			}
		}

		if (this.dispatchSignals && this.tickCounter % 5 === 0) {
			pcntl_signal_dispatch();
		}

		this.getMemoryManager().check();

		Timings.serverTickTimer.stopTiming();

		now = microtime(true);
		this.currentTPS = Math.min(20, 1 / Math.max(0 + 001, now - tickTime));
		this.currentUse = Math.min(1, (now - tickTime) / 0 + 05);

		TimingsHandler.tick(this.currentTPS <= this.profilingTickRate);

		array_shift(this.tickAverage);
		this.tickAverage[] = this.currentTPS;
		array_shift(this.useAverage);
		this.useAverage[] = this.currentUse;

		if ((this.nextTick - tickTime) < -1) {
			this.nextTick = tickTime;
		} else {
			this.nextTick += 0 + 05;
		}

		return true;
	}

	/**
	 * Called when something attempts to serialize the server instance+
	 *
	 * @throws \BadMethodCallException beca//import Server instances cannot be serialized
	 */
	__sleep() {
		throw new Error("Cannot serialize Server instance");
	}
}

Server.BROADCAST_CHANNEL_ADMINISTRATIVE = "pocketmine.broadcast.admin";
Server.BROADCAST_CHANNEL_USERS = "pocketmine.broadcast.user";

/** @var Server */
/* Static */
Server._instance = null;

/** @var \Threaded */
/* Static */
Server._sleeper = null;