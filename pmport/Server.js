'use strict';

const  fs = require('fs');
const path = require('path');

/**
 * PocketMine-MP is the Minecraft: PE multiplayer server software
 * Homepage: http://www.pocketmine.net/
 */

import 'pocketmine\block\BlockFactory';
import 'pocketmine\command\CommandReader';
import 'pocketmine\command\CommandSender';
import 'pocketmine\command\ConsoleCommandSender';
import 'pocketmine\command\PluginIdentifiableCommand';
import 'pocketmine\command\SimpleCommandMap';
import 'pocketmine\entity\Attribute';
import 'pocketmine\entity\Effect';
import 'pocketmine\entity\Entity';
import 'pocketmine\entity\Skin';
import 'pocketmine\event\HandlerList';
import 'pocketmine\event\level\LevelInitEvent';
import 'pocketmine\event\level\LevelLoadEvent';
import 'pocketmine\event\player\PlayerDataSaveEvent';
import 'pocketmine\event\server\QueryRegenerateEvent';
import 'pocketmine\event\server\ServerCommandEvent';
import 'pocketmine\event\TextContainer';
import 'pocketmine\event\Timings';
import 'pocketmine\event\TimingsHandler';
import 'pocketmine\event\TranslationContainer';
import 'pocketmine\inventory\CraftingManager';
import 'pocketmine\inventory\Recipe';
import 'pocketmine\item\enchantment\Enchantment';
import 'pocketmine\item\ItemFactory';
import 'pocketmine\lang\BaseLang';
import 'pocketmine\level\format\io\leveldb\LevelDB';
import 'pocketmine\level\format\io\LevelProvider';
import 'pocketmine\level\format\io\LevelProviderManager';
import 'pocketmine\level\format\io\region\Anvil';
import 'pocketmine\level\format\io\region\McRegion';
import 'pocketmine\level\format\io\region\PMAnvil';
import 'pocketmine\level\generator\biome\Biome';
import 'pocketmine\level\generator\Flat';
import 'pocketmine\level\generator\Generator';
import 'pocketmine\level\generator\hell\Nether';
import 'pocketmine\level\generator\normal\Normal';
import 'pocketmine\level\Level';
import 'pocketmine\level\LevelException';
import 'pocketmine\metadata\EntityMetadataStore';
import 'pocketmine\metadata\LevelMetadataStore';
import 'pocketmine\metadata\PlayerMetadataStore';
import 'pocketmine\nbt\NBT';
import 'pocketmine\nbt\tag\ByteTag';
import 'pocketmine\nbt\tag\CompoundTag';
import 'pocketmine\nbt\tag\DoubleTag';
import 'pocketmine\nbt\tag\FloatTag';
import 'pocketmine\nbt\tag\IntTag';
import 'pocketmine\nbt\tag\ListTag';
import 'pocketmine\nbt\tag\LongTag';
import 'pocketmine\nbt\tag\ShortTag';
import 'pocketmine\nbt\tag\StringTag';
import 'pocketmine\network\CompressBatchedTask';
import 'pocketmine\network\mcpe\protocol\BatchPacket';
import 'pocketmine\network\mcpe\protocol\DataPacket';
import 'pocketmine\network\mcpe\protocol\PlayerListPacket';
import 'pocketmine\network\mcpe\protocol\ProtocolInfo';
import 'pocketmine\network\mcpe\protocol\types\PlayerListE'
ntry;
import 'pocketmine\network\mcpe\RakLibInterface';
import 'pocketmine\network\Network';
import 'pocketmine\network\query\QueryHandler';
import 'pocketmine\network\rcon\RCON';
import 'pocketmine\network\upnp\UPnP';
import 'pocketmine\permission\BanList';
import 'pocketmine\permission\DefaultPermissions';
import 'pocketmine\plugin\PharPluginLoader';
import 'pocketmine\plugin\Plugin';
import 'pocketmine\plugin\PluginLoadOrder';
import 'pocketmine\plugin\PluginManager';
import 'pocketmine\plugin\ScriptPluginLoader';
import 'pocketmine\resourcepacks\ResourcePackManager';
import 'pocketmine\scheduler\FileWriteTask';
import 'pocketmine\scheduler\SendUsageTask';
import 'pocketmine\scheduler\ServerScheduler';
import 'pocketmine\tile\Tile';
import 'pocketmine\updater\AutoUpdater';
import 'pocketmine\utils\Binary';
import 'pocketmine\utils\Config';
import 'pocketmine\utils\MainLogger';
import 'pocketmine\utils\Terminal';
import 'pocketmine\utils\TextFormat';
import 'pocketmine\utils\Utils';
import 'pocketmine\utils\UUID';
import 'pocketmine\utils\VersionString';

/**
 * The class that manages everything
 */
class Server {
	constructor() {
		this.BROADCAST_CHANNEL_ADMINISTRATIVE() = "pocketmine.broadcast.admin";
		this.BROADCAST_CHANNEL_USERS => "pocketmine.broadcast.user";

		/** @var Server */
		this.instance = null;

		/** @var \Threaded */
		this.sleeper = null;

		/** @var BanList */
		this.banByName = null;

		/** @var BanList */
		this.banByIP = null;

		/** @var Config */
		this.operators = null;

		/** @var Config */
		this.whitelist = null;

		/** @var bool */
		this.isRunning = true;

		this.hasStopped = false;

		/** @var PluginManager */
		this.pluginManager = null;

		this.profilingTickRate = 20;

		/** @var AutoUpdater */
		this.updater = null;

		/** @var ServerScheduler */
		this.scheduler = null;

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

		/** @var bool */
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

		/** @var int */
		this._maxPlayers;

		/** @var bool */
		this._onlineMode = true;

		/** @var bool */
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
	/**
	 * @return string
	 */
	getName(){
		return pocketmine.NAME;
	}

	/**
	 * @return bool
	 */
	isRunning(){
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
	 * Returns whether the server requires that players be authenticated to Xbox Live. If true, connecting players who
	 * are not logged into Xbox Live will be disconnected.
	 *
	 * @return bool
	 */
	

	getOnlineMode() {
		return this.onlineMode;
	}

	/**
	 * Alias of {@link #getOnlineMode()}.
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
	 * Returns a view distance up to the currently-allowed limit.
	 *
	 * @param int distance
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
		return this.getConfigString("server-ip", "0.0.0.0");
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
	 * @param bool value
	 */
	

	setAutoSave(value) {
		this.autoSave = value;
		for(const level of this.getLevels()) {
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
	 * @param int mode
	 *
	 * @return string
	 */
	 static getGamemodeString(mode) {
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

	 static getGamemodeName(mode) {
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
	 * Parses a string and returns a gamemode integer, -1 if not found
	 *
	 * @param string str
	 *
	 * @return int
	 */
	 static getGamemodeFromString(str) {
		switch (str.trim().toLowerCase()) {
			case Player.SURVIVAL.toString():
			case "survival":
			case "s":
				return Player.SURVIVAL;

			case Player.CREATIVE.toString():
			case "creative":
			case "c":
				return Player.CREATIVE;

			case Player.ADVENTURE.toString():
			case "adventure":
			case "a":
				return Player.ADVENTURE;

			case Player.SPECTATOR.toString():
			case "spectator":
			case "view":
			case "v":
				return Player.SPECTATOR;
			default:
				return -1;
		}
	}

	/**
	 * @deprecated Moved to {@link Level#getDifficultyFromString}
	 *
	 * @param string str
	 * @return int
	 */
	static getDifficultyFromString(str) {
		return Level.getDifficultyFromString(str);
	}

	/**
	 * Returns Server global difficulty. Note that this may be overridden in individual Levels.
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
		return this.getConfigString("motd", `${pocketmine.NAME} Server`);
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
		return this.resourceManager;
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
		return round(this.currentTPS, 2);
	}

	/**
	 * Returns the last server TPS average measure
	 *
	 * @return float
	 */
	

	getTicksPerSecondAverage() {
		function array_sum(arr){
			let sum = 0;
			for(let i = 0; i < arr.length; i++) sum += arr[i];
			return sum;
		}
		return (array_sum(this.tickAverage) / this.tickAverage.length).toFixed(2);
	}

	/**
	 * Returns the TPS usage/load in %
	 *
	 * @return float
	 */
	

	getTickUsage() {
		return (this.currentUse * 100).toFixed(2);
	}

	/**
	 * Returns the TPS usage/load average in %
	 *
	 * @return float
	 */
	

	getTickUsageAverage() {
		function array_sum(arr){
			let sum = 0;
			for(let i = 0; i < arr.length; i++) sum += arr[i];
			return sum;
		}
		return ((array_sum(this.useAverage) / this.useAverage.length) * 100).toFixed(2);
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

	

	addRecipe(recipe) {//new Recipe
		this.craftingManager.registerRecipe(recipe);
	}

	

	shouldSavePlayerData() {
		return !!this.getProperty("player.save-player-data", true);
	}

	/**
	 * @param string name
	 *
	 * @return OfflinePlayer|Player
	 */
	

	getOfflinePlayer(name) {
		name = name.toLowerCase();
		result = this.getPlayerExact(name);

		if (result === null) {
			result = new OfflinePlayer(this, name);
		}

		return result;
	}

	/**
	 * @param string name
	 *
	 * @return CompoundTag
	 */
	

	getOfflinePlayerData(name) {
		name = name.toLowerCase();
		path = this.getDataPath()["players/"];
		if (this.shouldSavePlayerData()) {
			if (fs.existsSync(path.normalize("name.dat"))) {
				try {
					// nbt = new NBT(NBT.BIG_ENDIAN);
					// nbt.readCompressed(file_get_contents(path.
					// 	"name.dat"));

					// return nbt.getData();
					return fs.readFileSync('name.dat');
				} catch (e) { //zlib decode error / corrupt data
					fs.renameSync(path.normalize(
						"name.dat"), path.
						normalize("name.dat.bak"));
					this.logger.notice(this.getLanguage().translateString("pocketmine.data.playerCorrupted", [name]));
				}
			} else {
				this.logger.notice(this.getLanguage().translateString("pocketmine.data.playerNotFound", [name]));
			}
		}
		spawn = this.getDefaultLevel().getSafeSpawn();
		currentTimeMillis = Number((microtime(true)) * 1000);

		nbt = new CompoundTag("", [
			new LongTag("firstPlayed", currentTimeMillis),
			new LongTag("lastPlayed", currentTimeMillis),
			new ListTag("Pos", [
				new DoubleTag("", spawn.x),
				new DoubleTag("", spawn.y),
				new DoubleTag("", spawn.z)
			], NBT.TAG_Double),
			new StringTag("Level", this.getDefaultLevel().getName()),
			//new StringTag("SpawnLevel", this->getDefaultLevel()->getName()),
			//new IntTag("SpawnX", (int) spawn->x),
			//new IntTag("SpawnY", (int) spawn->y),
			//new IntTag("SpawnZ", (int) spawn->z),
			//new ByteTag("SpawnForced", 1), //TODO
			new ListTag("Inventory", [], NBT.TAG_Compound),
			new ListTag("EnderChestInventory", [], NBT.TAG_Compound),
			new CompoundTag("Achievements", []),
			new IntTag("playerGameType", this.getGamemode()),
			new ListTag("Motion", [
				new DoubleTag("", 0.0),
				new DoubleTag("", 0.0),
				new DoubleTag("", 0.0)
			], NBT.TAG_Double),
			new ListTag("Rotation", [
				new FloatTag("", 0.0),
				new FloatTag("", 0.0)
			], NBT.TAG_Float),
			new FloatTag("FallDistance", 0.0),
			new ShortTag("Fire", 0),
			new ShortTag("Air", 300),
			new ByteTag("OnGround", 1),
			new ByteTag("Invulnerable", 0),
			new StringTag("NameTag", name)
		]);

		return nbt;

	}

	/**
	 * @param string      name
	 * @param CompoundTag nbtTag
	 * @param bool        async
	 */
	

	saveOfflinePlayerData(name, nbtTag, async = false) {
		ev = new PlayerDataSaveEvent(nbtTag, name);
		ev.setCancelled(!this.shouldSavePlayerData());

		this.pluginManager.callEvent(ev);

		if (!ev.isCancelled()) {
			nbt = new NBT(NBT.BIG_ENDIAN);
			try {
				nbt.setData(ev.getSaveData());

				if (async) {
					this.getScheduler().scheduleAsyncTask(new FileWriteTask(this.getDataPath().
						`players/${name.toLowerCase()}.dat`, nbt.writeCompressed()));
				} else {
					file_put_contents(this.getDataPath().
						`players/${name.toLowerCase()}.dat`, nbt.writeCompressed());
				}
			} catch (e) {
				this.logger.critical(this.getLanguage().translateString("pocketmine.data.saveError", [name, e.getMessage()]));
				this.logger.logException(e);
			}
		}
	}

	/**
	 * @param string name
	 *
	 * @return Player|null
	 */
	

	getPlayer(name) {
		found = null;
		name = name.toLowerCase();
		delta = PHP_INT_MAX; //FIXME:
		for(const player of this.getOnlinePlayers()) {
			if (player.getName().indexOf(name) < 0) { //FIXME: ?
				curDelta = player.getName().length - name.lenght;
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
	 * @param string name
	 *
	 * @return Player|null
	 */
	

	getPlayerExact(name) {
		name = name.toLowerCase();
		for(const player of this.getOnlinePlayers()) {
			if (player.getLowerCaseName() === name) {
				return player;
			}
		}

		return null;
	}

	/**
	 * @param string partialName
	 *
	 * @return Player[]
	 */
//TODO: Я остановился здесь	

	matchPlayer(string partialName) {
		partialName = strtolower(partialName);
		matchedPlayers = [];
		foreach(this.getOnlinePlayers() as player) {
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
	

	removePlayer(Player player) {
		if (isset(this.identifiers[hash = spl_object_hash(player)])) {
			identifier = this.identifiers[hash];
			unset(this.players[identifier]);
			unset(this.identifiers[hash]);
			return;
		}

		foreach(this.players as identifier => p) {
			if (player === p) {
				unset(this.players[identifier]);
				unset(this.identifiers[spl_object_hash(player)]);
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
	

	getDefaultLevel(): ? Level {
		return this.levelDefault;
	}

	/**
	 * Sets the default level to a different level
	 * This won't change the level-name property,
	 * it only affects the server on runtime
	 *
	 * @param Level|null level
	 */
	

	setDefaultLevel( ? Level level) : void {
		if (level === null or(this.isLevelLoaded(level.getFolderName()) and level !== this.levelDefault)) {
			this.levelDefault = level;
		}
	}

	/**
	 * @param string name
	 *
	 * @return bool
	 */
	

	isLevelLoaded(string name) {
		return this.getLevelByName(name) instanceof Level;
	}

	/**
	 * @param int levelId
	 *
	 * @return Level|null
	 */
	

	getLevel(int levelId): ? Level {
		return this.levels[levelId] ? ? null;
	}

	/**
	 * NOTE: This matches levels based on the FOLDER name, NOT the display name.
	 *
	 * @param string name
	 *
	 * @return Level|null
	 */
	

	getLevelByName(string name) : ? Level {
		foreach(this.getLevels() as level) {
			if (level.getFolderName() === name) {
				return level;
			}
		}

		return null;
	}

	/**
	 * @param Level level
	 * @param bool  forceUnload
	 *
	 * @return bool
	 *
	 * @throws \InvalidStateException
	 */
	

	unloadLevel(Level level, bool forceUnload = false)  {
		if (level === this.getDefaultLevel() and!forceUnload) {
			throw new\ InvalidStateException("The default level cannot be unloaded while running, please switch levels.");
		}

		return level.unload(forceUnload);
	}

	/**
	 * @internal
	 * @param Level level
	 */
	

	removeLevel(Level level): void {
		unset(this.levels[level.getId()]);
	}

	/**
	 * Loads a level from the data directory
	 *
	 * @param string name
	 *
	 * @return bool
	 *
	 * @throws LevelException
	 */
	

	loadLevel(string name) {
		if (trim(name) === "") {
			throw new LevelException("Invalid empty level name");
		}
		if (this.isLevelLoaded(name)) {
			return true;
		}
		elseif(!this.isLevelGenerated(name)) {
			this.logger.notice(this.getLanguage().translateString("pocketmine.level.notFound", [name]));

			return false;
		}

		path = this.getDataPath().
		"worlds/".name.
		"/";

		provider = LevelProviderManager.getProvider(path);

		if (provider === null) {
			this.logger.error(this.getLanguage().translateString("pocketmine.level.loadError", [name, "Unknown provider"]));

			return false;
		}

		try {
			level = new Level(this, name, path, provider);
		} catch (\Throwable e) {

			this.logger.error(this.getLanguage().translateString("pocketmine.level.loadError", [name, e.getMessage()]));
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
	 * @param string      name
	 * @param int|null    seed
	 * @param string|null generator Class name that extends pocketmine\level\generator\Noise
	 * @param array       options
	 *
	 * @return bool
	 */
	

	generateLevel(string name, int seed = null, generator = null, array options = []) {
		if (trim(name) === ""
			or this.isLevelGenerated(name)) {
			return false;
		}

		seed = seed ? ? Binary.readInt(random_bytes(4));

		if (!isset(options["preset"])) {
			options["preset"] = this.getConfigString("generator-settings", "");
		}

		if (!(generator !== null and class_exists(generator, true) and is_subclass_of(generator, Generator.class))) {
			generator = Generator.getGenerator(this.getLevelType());
		}

		if ((provider = LevelProviderManager.getProviderByName(providerName = this.getProperty("level-settings.default-format", "pmanvil"))) === null) {
			provider = LevelProviderManager.getProviderByName(providerName = "pmanvil");
		}

		try {
			path = this.getDataPath().
			"worlds/".name.
			"/";
			/** @var LevelProvider provider */
			provider.generate(path, name, seed, generator, options);

			level = new Level(this, name, path, (string) provider);
			this.levels[level.getId()] = level;

			level.initLevel();

			level.setTickRate(this.baseTickRate);
		} catch (\Throwable e) {
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

		foreach(order as index => distance) {
			Level.getXZ(index, chunkX, chunkZ);
			level.populateChunk(chunkX, chunkZ, true);
		}

		return true;
	}

	/**
	 * @param string name
	 *
	 * @return bool
	 */
	

	isLevelGenerated(string name) {
		if (trim(name) === "") {
			return false;
		}
		path = this.getDataPath().
		"worlds/".name.
		"/";
		if (!(this.getLevelByName(name) instanceof Level)) {

			if (LevelProviderManager.getProvider(path) === null) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Searches all levels for the entity with the specified ID.
	 * Useful for tracking entities across multiple worlds without needing strong references.
	 *
	 * @param int        entityId
	 * @param Level|null expectedLevel Level to look in first for the target
	 *
	 * @return Entity|null
	 */
	

	findEntity(int entityId, Level expectedLevel = null) {
		levels = this.levels;
		if (expectedLevel !== null) {
			array_unshift(levels, expectedLevel);
		}

		foreach(levels as level) {
			assert(!level.isClosed());
			if ((entity = level.getEntity(entityId)) instanceof Entity) {
				return entity;
			}
		}

		return null;
	}

	/**
	 * @param string variable
	 * @param mixed  defaultValue
	 *
	 * @return mixed
	 */
	

	getProperty(string variable, defaultValue = null) {
		if (!array_key_exists(variable, this.propertyCache)) {
			v = getopt("", ["variable."]);
			if (isset(v[variable])) {
				this.propertyCache[variable] = v[variable];
			} else {
				this.propertyCache[variable] = this.config.getNested(variable);
			}
		}

		return this.propertyCache[variable] ? ? defaultValue;
	}

	/**
	 * @param string variable
	 * @param string defaultValue
	 *
	 * @return string
	 */
	

	getConfigString(string variable, string defaultValue = "") {
		v = getopt("", ["variable."]);
		if (isset(v[variable])) {
			return (string) v[variable];
		}

		return this.properties.exists(variable) ? (string) this.properties.get(variable) : defaultValue;
	}

	/**
	 * @param string variable
	 * @param string value
	 */
	

	setConfigString(string variable, string value) {
		this.properties.set(variable, value);
	}

	/**
	 * @param string variable
	 * @param int    defaultValue
	 *
	 * @return int
	 */
	

	getConfigInt(string variable, int defaultValue = 0) {
		v = getopt("", ["variable."]);
		if (isset(v[variable])) {
			return (int) v[variable];
		}

		return this.properties.exists(variable) ? (int) this.properties.get(variable) : defaultValue;
	}

	/**
	 * @param string variable
	 * @param int    value
	 */
	

	setConfigInt(string variable, int value) {
		this.properties.set(variable, value);
	}

	/**
	 * @param string variable
	 * @param bool   defaultValue
	 *
	 * @return bool
	 */
	

	getConfigBool(string variable, bool defaultValue = false) {
		v = getopt("", ["variable."]);
		if (isset(v[variable])) {
			value = v[variable];
		} else {
			value = this.properties.exists(variable) ? this.properties.get(variable) : defaultValue;
		}

		if (is_bool(value)) {
			return value;
		}
		switch (strtolower(value)) {
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
	 * @param string variable
	 * @param bool   defaultValue
	 *
	 * @return bool
	 */
	

	getConfigBoolean(string variable, bool defaultValue = false) {
		return this.getConfigBool(variable, defaultValue);
	}

	/**
	 * @param string variable
	 * @param bool   value
	 */
	

	setConfigBool(string variable, bool value) {
		this.properties.set(variable, value == true ? "1" : "0");
	}

	/**
	 * @param string name
	 *
	 * @return PluginIdentifiableCommand|null
	 */
	

	getPluginCommand(string name) {
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
	 * @param string name
	 */
	

	addOp(string name) {
		this.operators.set(strtolower(name), true);

		if ((player = this.getPlayerExact(name)) !== null) {
			player.recalculatePermissions();
		}
		this.operators.save(true);
	}

	/**
	 * @param string name
	 */
	

	removeOp(string name) {
		this.operators.remove(strtolower(name));

		if ((player = this.getPlayerExact(name)) !== null) {
			player.recalculatePermissions();
		}
		this.operators.save();
	}

	/**
	 * @param string name
	 */
	

	addWhitelist(string name) {
		this.whitelist.set(strtolower(name), true);
		this.whitelist.save(true);
	}

	/**
	 * @param string name
	 */
	

	removeWhitelist(string name) {
		this.whitelist.remove(strtolower(name));
		this.whitelist.save();
	}

	/**
	 * @param string name
	 *
	 * @return bool
	 */
	

	isWhitelisted(string name) {
		return !this.hasWhitelist() or this.operators.exists(name, true) or this.whitelist.exists(name, true);
	}

	/**
	 * @param string name
	 *
	 * @return bool
	 */
	

	isOp(string name) {
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
		section = this.getProperty("aliases");
		result = [];
		if (is_array(section)) {
			foreach(section as key => value) {
				commands = [];
				if (is_array(value)) {
					commands = value;
				} else {
					commands[] = (string) value;
				}

				result[key] = commands;
			}
		}

		return result;
	}

	/**
	 * @return Server
	 */
	 static

	getInstance(): Server {
		if (self.instance === null) {
			throw new\ RuntimeException("Attempt to retrieve Server instance outside server thread");
		}
		return self.instance;
	}

	 static

	microSleep(int microseconds) {
		Server.sleeper.synchronized((int ms) {
			Server.sleeper.wait(ms);
		}, microseconds);
	}

	/**
	 * @param \ClassLoader    autoloader
	 * @param \ThreadedLogger logger
	 * @param string          filePath
	 * @param string          dataPath
	 * @param string          pluginPath
	 */
	

	__construct(\ClassLoader autoloader, \ThreadedLogger logger, string filePath, string dataPath, string pluginPath) {
		self.instance = this;
		self.sleeper = new\ Threaded;
		this.autoloader = autoloader;
		this.logger = logger;

		try {

			this.filePath = filePath;
			if (!file_exists(dataPath.
					"worlds/")) {
				mkdir(dataPath.
					"worlds/", 0777);
			}

			if (!file_exists(dataPath.
					"players/")) {
				mkdir(dataPath.
					"players/", 0777);
			}

			if (!file_exists(pluginPath)) {
				mkdir(pluginPath, 0777);
			}

			this.dataPath = realpath(dataPath).DIRECTORY_SEPARATOR;
			this.pluginPath = realpath(pluginPath).DIRECTORY_SEPARATOR;

			this.console = new CommandReader();

			version = new VersionString(this.getPocketMineVersion());

			this.logger.info("Loading pocketmine.yml...");
			if (!file_exists(this.dataPath.
					"pocketmine.yml")) {
				content = file_get_contents(this.filePath.
					"src/pocketmine/resources/pocketmine.yml");
				if (version.isDev()) {
					content = str_replace("preferred-channel: stable", "preferred-channel: beta", content);
				}
				@file_put_contents(this.dataPath.
					"pocketmine.yml", content);
			}
			this.config = new Config(this.dataPath.
				"pocketmine.yml", Config.YAML, []);

			define('pocketmine\DEBUG', (int) this.getProperty("debug.level", 1));

			if (((int) ini_get('zend.assertions')) > 0 and((bool) this.getProperty("debug.assertions.warn-if-enabled", true)) !== false) {
				this.logger.warning("Debugging assertions are enabled, this may impact on performance. To disable them, set `zend.assertions = -1` in php.ini.");
			}

			ini_set('assert.exception', '1');

			if (this.logger instanceof MainLogger) {
				this.logger.setLogDebug(\pocketmine\ DEBUG > 1);
			}

			this.logger.info("Loading server properties...");
			this.properties = new Config(this.dataPath.
				"server.properties", Config.PROPERTIES, [
					"motd" => \pocketmine\ NAME.
					" Server",
					"server-port" => 19132,
					"white-list" => false,
					"announce-player-achievements" => true,
					"spawn-protection" => 16,
					"max-players" => 20,
					"allow-flight" => false,
					"spawn-animals" => true,
					"spawn-mobs" => true,
					"gamemode" => 0,
					"force-gamemode" => false,
					"hardcore" => false,
					"pvp" => true,
					"difficulty" => 1,
					"generator-settings" => "",
					"level-name" => "world",
					"level-seed" => "",
					"level-type" => "DEFAULT",
					"enable-query" => true,
					"enable-rcon" => false,
					"rcon.password" => substr(base64_encode(random_bytes(20)), 3, 10),
					"auto-save" => true,
					"view-distance" => 8,
					"xbox-auth" => true
				]);

			this.forceLanguage = (bool) this.getProperty("settings.force-language", false);
			this.baseLang = new BaseLang(this.getProperty("settings.language", BaseLang.FALLBACK_LANGUAGE));
			this.logger.info(this.getLanguage().translateString("language.selected", [this.getLanguage().getName(), this.getLanguage().getLang()]));

			this.memoryManager = new MemoryManager(this);

			this.logger.info(this.getLanguage().translateString("pocketmine.server.start", [TextFormat.AQUA.this.getVersion().TextFormat.RESET]));

			if ((poolSize = this.getProperty("settings.async-workers", "auto")) === "auto") {
				poolSize = ServerScheduler.WORKERS;
				processors = Utils.getCoreCount() - 2;

				if (processors > 0) {
					poolSize = max(1, processors);
				}
			}

			ServerScheduler.WORKERS = poolSize;

			if (this.getProperty("network.batch-threshold", 256) >= 0) {
				Network.BATCH_THRESHOLD = (int) this.getProperty("network.batch-threshold", 256);
			} else {
				Network.BATCH_THRESHOLD = -1;
			}

			this.networkCompressionLevel = this.getProperty("network.compression-level", 7);
			if (this.networkCompressionLevel < 1 or this.networkCompressionLevel > 9) {
				this.logger.warning("Invalid network compression level this->networkCompressionLevel set, setting to default 7");
				this.networkCompressionLevel = 7;
			}
			this.networkCompressionAsync = this.getProperty("network.async-compression", true);

			this.autoTickRate = (bool) this.getProperty("level-settings.auto-tick-rate", true);
			this.autoTickRateLimit = (int) this.getProperty("level-settings.auto-tick-rate-limit", 20);
			this.alwaysTickPlayers = (int) this.getProperty("level-settings.always-tick-players", false);
			this.baseTickRate = (int) this.getProperty("level-settings.base-tick-rate", 1);

			this.doTitleTick = (bool) this.getProperty("console.title-tick", true);

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
				} catch (\Throwable e) {
					this.getLogger().critical("RCON can't be started: ".e.getMessage());
				}
			}

			this.entityMetadata = new EntityMetadataStore();
			this.playerMetadata = new PlayerMetadataStore();
			this.levelMetadata = new LevelMetadataStore();

			this.operators = new Config(this.dataPath.
				"ops.txt", Config.ENUM);
			this.whitelist = new Config(this.dataPath.
				"white-list.txt", Config.ENUM);
			if (file_exists(this.dataPath.
					"banned.txt") and!file_exists(this.dataPath.
					"banned-players.txt")) {
				@rename(this.dataPath.
					"banned.txt", this.dataPath.
					"banned-players.txt");
			}
			@touch(this.dataPath.
				"banned-players.txt");
			this.banByName = new BanList(this.dataPath.
				"banned-players.txt");
			this.banByName.load();
			@touch(this.dataPath.
				"banned-ips.txt");
			this.banByIP = new BanList(this.dataPath.
				"banned-ips.txt");
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

			if (this.getConfigBool("hardcore", false) === true and this.getDifficulty() < Level.DIFFICULTY_HARD) {
				this.setConfigInt("difficulty", Level.DIFFICULTY_HARD);
			}

			if (\pocketmine\ DEBUG >= 0) {
				@cli_set_process_title(this.getName().
					" ".this.getPocketMineVersion());
			}

			this.logger.info(this.getLanguage().translateString("pocketmine.server.networkStart", [this.getIp() === "" ? "*" : this.getIp(), this.getPort()]));
			define("BOOTUP_RANDOM", random_bytes(16));
			this.serverID = Utils.getMachineUniqueId(this.getIp().this.getPort());

			this.getLogger().debug("Server unique id: ".this.getServerUniqueId());
			this.getLogger().debug("Machine unique id: ".Utils.getMachineUniqueId());

			this.network = new Network(this);
			this.network.setName(this.getMotd());


			this.logger.info(this.getLanguage().translateString("pocketmine.server.info", [
				this.getName(),
				(version.isDev() ? TextFormat.YELLOW : "").version.get(true).TextFormat.RESET,
				this.getCodename(),
				this.getApiVersion()
			]));
			this.logger.info(this.getLanguage().translateString("pocketmine.server.license", [this.getName()]));


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

			this.resourceManager = new ResourcePackManager(this, this.getDataPath().
				"resource_packs".DIRECTORY_SEPARATOR);

			this.pluginManager = new PluginManager(this, this.commandMap);
			this.pluginManager.subscribeToPermission(Server.BROADCAST_CHANNEL_ADMINISTRATIVE, this.consoleSender);
			this.pluginManager.setUseTimings(this.getProperty("settings.enable-profiling", false));
			this.profilingTickRate = (float) this.getProperty("settings.profile-report-trigger", 20);
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
				this.logger.debug(this.getLanguage().translateString("pocketmine.debug.enable"));
			}

			Generator.addGenerator(Flat.class, "flat");
			Generator.addGenerator(Normal.class, "normal");
			Generator.addGenerator(Normal.class, "default");
			Generator.addGenerator(Nether.class, "hell");
			Generator.addGenerator(Nether.class, "nether");

			foreach((array) this.getProperty("worlds", []) as name => options) {
				if (!is_array(options)) {
					continue;
				}
				if (this.loadLevel(name) === false) {
					seed = options["seed"] ? ? time();
					if (is_string(seed) and!is_numeric(seed)) {
						seed = Utils.javaStringHash(seed);
					}
					elseif(!is_int(seed)) {
						seed = (int) seed;
					}

					if (isset(options["generator"])) {
						generatorOptions = explode(":", options["generator"]);
						generator = Generator.getGenerator(array_shift(generatorOptions));
						if (count(options) > 0) {
							options["preset"] = implode(":", generatorOptions);
						}
					} else {
						generator = Generator.getGenerator("default");
					}

					this.generateLevel(name, seed, generator, options);
				}
			}

			if (this.getDefaultLevel() === null) {
				default = this.getConfigString("level-name", "world");
				if (trim(default) == "") {
					this.getLogger().warning("level-name cannot be null, using default");
					default = "world";
					this.setConfigString("level-name", "world");
				}
				if (this.loadLevel(default) === false) {
					seed = getopt("", ["level-seed."])["level-seed"] ? ? this.properties.get("level-seed", time());
					if (!is_numeric(seed) or bccomp(seed, "9223372036854775807") > 0) {
						seed = Utils.javaStringHash(seed);
					}
					elseif(PHP_INT_SIZE === 8) {
						seed = (int) seed;
					}
					this.generateLevel(default, seed === 0 ? time() : seed);
				}

				this.setDefaultLevel(this.getLevelByName(default));
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
				this.autoSaveTicks = (int) this.getProperty("ticks-per.autosave", 6000);
			}

			this.enablePlugins(PluginLoadOrder.POSTWORLD);

			this.start();
		} catch (\Throwable e) {
			this.exceptionHandler(e);
		}
	}

	/**
	 * @param TextContainer|string message
	 * @param Player[]             recipients
	 *
	 * @return int
	 */
	

	broadcastMessage(message, array recipients = null) {
		if (!is_array(recipients)) {
			return this.broadcast(message, self.BROADCAST_CHANNEL_USERS);
		}

		/** @var Player[] recipients */
		foreach(recipients as recipient) {
			recipient.sendMessage(message);
		}

		return count(recipients);
	}

	/**
	 * @param string   tip
	 * @param Player[] recipients
	 *
	 * @return int
	 */
	

	broadcastTip(string tip, array recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];
			foreach(this.pluginManager.getPermissionSubscriptions(self.BROADCAST_CHANNEL_USERS) as permissible) {
				if (permissible instanceof Player and permissible.hasPermission(self.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, or some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		foreach(recipients as recipient) {
			recipient.sendTip(tip);
		}

		return count(recipients);
	}

	/**
	 * @param string   popup
	 * @param Player[] recipients
	 *
	 * @return int
	 */
	

	broadcastPopup(string popup, array recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];

			foreach(this.pluginManager.getPermissionSubscriptions(self.BROADCAST_CHANNEL_USERS) as permissible) {
				if (permissible instanceof Player and permissible.hasPermission(self.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, or some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		foreach(recipients as recipient) {
			recipient.sendPopup(popup);
		}

		return count(recipients);
	}

	/**
	 * @param string title
	 * @param string subtitle
	 * @param int    fadeIn Duration in ticks for fade-in. If -1 is given, client-sided defaults will be used.
	 * @param int    stay Duration in ticks to stay on screen for
	 * @param int    fadeOut Duration in ticks for fade-out.
	 * @param Player[]|null recipients
	 *
	 * @return int
	 */
	

	broadcastTitle(string title, string subtitle = "", int fadeIn = -1, int stay = -1, int fadeOut = -1, array recipients = null) {
		if (!is_array(recipients)) {
			/** @var Player[] recipients */
			recipients = [];

			foreach(this.pluginManager.getPermissionSubscriptions(self.BROADCAST_CHANNEL_USERS) as permissible) {
				if (permissible instanceof Player and permissible.hasPermission(self.BROADCAST_CHANNEL_USERS)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, or some might be repeated
				}
			}
		}

		/** @var Player[] recipients */
		foreach(recipients as recipient) {
			recipient.addTitle(title, subtitle, fadeIn, stay, fadeOut);
		}

		return count(recipients);
	}

	/**
	 * @param TextContainer|string message
	 * @param string               permissions
	 *
	 * @return int
	 */
	

	broadcast(message, string permissions) {
		/** @var CommandSender[] recipients */
		recipients = [];
		foreach(explode(";", permissions) as permission) {
			foreach(this.pluginManager.getPermissionSubscriptions(permission) as permissible) {
				if (permissible instanceof CommandSender and permissible.hasPermission(permission)) {
					recipients[spl_object_hash(permissible)] = permissible; // do not send messages directly, or some might be repeated
				}
			}
		}

		foreach(recipients as recipient) {
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
	

	broadcastPacket(array players, DataPacket packet) {
		packet.encode();
		this.batchPackets(players, [packet], false);
	}

	/**
	 * Broadcasts a list of packets in a batch to a list of players
	 *
	 * @param Player[]     players
	 * @param DataPacket[] packets
	 * @param bool         forceSync
	 * @param bool         immediate
	 */
	

	batchPackets(array players, array packets, bool forceSync = false, bool immediate = false) {
		Timings.playerNetworkTimer.startTiming();

		targets = [];
		foreach(players as p) {
			if (p.isConnected()) {
				targets[] = this.identifiers[spl_object_hash(p)];
			}
		}

		if (count(targets) > 0) {
			pk = new BatchPacket();

			foreach(packets as p) {
				pk.addPacket(p);
			}

			if (Network.BATCH_THRESHOLD >= 0 and strlen(pk.payload) >= Network.BATCH_THRESHOLD) {
				pk.setCompressionLevel(this.networkCompressionLevel);
			} else {
				pk.setCompressionLevel(0); //Do not compress packets under the threshold
				forceSync = true;
			}

			if (!forceSync and!immediate and this.networkCompressionAsync) {
				task = new CompressBatchedTask(pk, targets);
				this.getScheduler().scheduleAsyncTask(task);
			} else {
				this.broadcastPacketsCallback(pk, targets, immediate);
			}
		}

		Timings.playerNetworkTimer.stopTiming();
	}

	

	broadcastPacketsCallback(BatchPacket pk, array identifiers, bool immediate = false) {
		if (!pk.isEncoded) {
			pk.encode();
		}

		foreach(identifiers as i) {
			if (isset(this.players[i])) {
				this.players[i].sendDataPacket(pk, false, immediate);
			}
		}

	}


	/**
	 * @param int type
	 */
	

	enablePlugins(int type) {
		foreach(this.pluginManager.getPlugins() as plugin) {
			if (!plugin.isEnabled() and plugin.getDescription().getOrder() === type) {
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
	

	enablePlugin(Plugin plugin) {
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
	 * @param string        commandLine
	 *
	 * @return bool
	 */
	

	dispatchCommand(CommandSender sender, string commandLine) {
		if (this.commandMap.dispatch(sender, commandLine)) {
			return true;
		}


		sender.sendMessage(this.getLanguage().translateString(TextFormat.RED.
			"%commands.generic.notFound"));

		return false;
	}

	

	reload() {
		this.logger.info("Saving levels...");

		foreach(this.levels as level) {
			level.save();
		}

		this.pluginManager.disablePlugins();
		this.pluginManager.clearPlugins();
		this.commandMap.clearCommands();

		this.logger.info("Reloading properties...");
		this.properties.reload();
		this.maxPlayers = this.getConfigInt("max-players", 20);

		if (this.getConfigBool("hardcore", false) === true and this.getDifficulty() < Level.DIFFICULTY_HARD) {
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

			if (this.getProperty("network.upnp-forwarding", false) === true) {
				this.logger.info("[UPnP] Removing port forward...");
				UPnP.RemovePortForward(this.getPort());
			}

			if (this.pluginManager instanceof PluginManager) {
				this.getLogger().debug("Disabling all plugins");
				this.pluginManager.disablePlugins();
			}

			foreach(this.players as player) {
				player.close(player.getLeaveMessage(), this.getProperty("settings.shutdown-message", "Server closed"));
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
		} catch (\Throwable e) {
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
	 * Starts the PocketMine-MP server and starts processing ticks and packets
	 */
	

	start() {
		if (this.getConfigBool("enable-query", true) === true) {
			this.queryHandler = new QueryHandler();
		}

		foreach(this.getIPBans().getEntries() as entry) {
			this.network.blockAddress(entry.getName(), -1);
		}

		if (this.getProperty("settings.send-usage", true)) {
			this.sendUsageTicker = 6000;
			this.sendUsage(SendUsageTask.TYPE_OPEN);
		}


		if (this.getProperty("network.upnp-forwarding", false)) {
			this.logger.info("[UPnP] Trying to port forward...");
			UPnP.PortForward(this.getPort());
		}

		this.tickCounter = 0;

		if (function_exists("pcntl_signal")) {
			pcntl_signal(SIGTERM, [this, "handleSignal"]);
			pcntl_signal(SIGINT, [this, "handleSignal"]);
			pcntl_signal(SIGHUP, [this, "handleSignal"]);
			this.dispatchSignals = true;
		}

		this.logger.info(this.getLanguage().translateString("pocketmine.server.defaultGameMode", [self.getGamemodeString(this.getGamemode())]));

		this.logger.info(this.getLanguage().translateString("pocketmine.server.startFinished", [round(microtime(true) - \pocketmine\ START_TIME, 3)]));

		this.tickProcessor();
		this.forceShutdown();
	}

	

	handleSignal(signo) {
		if (signo === SIGTERM or signo === SIGINT or signo === SIGHUP) {
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

		type = (errno === E_ERROR or errno === E_USER_ERROR) ? \LogLevel.ERROR : ((errno === E_USER_WARNING or errno === E_WARNING) ? \LogLevel.WARNING : \LogLevel.NOTICE);

		errstr = preg_replace('/\s+/', ' ', trim(errstr));

		errfile = cleanPath(errfile);

		this.logger.logException(e, trace);

		lastError = [
			"type" => type,
			"message" => errstr,
			"fullFile" => e.getFile(),
			"file" => errfile,
			"line" => errline,
			"trace" => getTrace(0, trace)
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
		this.logger.emergency(this.getLanguage().translateString("pocketmine.crash.create"));
		try {
			dump = new CrashDump(this);

			this.logger.emergency(this.getLanguage().translateString("pocketmine.crash.submit", [dump.getPath()]));

			if (this.getProperty("auto-report.enabled", true) !== false) {
				report = true;
				plugin = dump.getData()["plugin"];
				if (is_string(plugin)) {
					p = this.pluginManager.getPlugin(plugin);
					if (p instanceof Plugin and!(p.getPluginLoader() instanceof PharPluginLoader)) {
						report = false;
					}
				}

				if (dump.getData()["error"]["type"] === "E_PARSE"
					or dump.getData()["error"]["type"] === "E_COMPILE_ERROR") {
					report = false;
				}

				if (strrpos(\pocketmine\ GIT_COMMIT, "-dirty") !== false or\ pocketmine\ GIT_COMMIT === str_repeat("00", 20)) {
					this.logger.debug("Not sending crashdump due to locally modified");
					report = false; //Don't send crashdumps for locally modified builds
				}

				if (report) {
					url = (this.getProperty("auto-report.use-https", true) ? "https" : "http").
					"://".this.getProperty("auto-report.host", "crash.pmmp.io").
					"/submit/api";
					reply = Utils.postURL(url, [
						"report" => "yes",
						"name" => this.getName().
						" ".this.getPocketMineVersion(),
						"email" => "crash@pocketmine.net",
						"reportPaste" => base64_encode(dump.getEncodedData())
					]);

					if (reply !== false and(data = json_decode(reply)) !== null and isset(data.crashId) and isset(data.crashUrl)) {
						reportId = data.crashId;
						reportUrl = data.crashUrl;
						this.logger.emergency(this.getLanguage().translateString("pocketmine.crash.archive", [reportUrl, reportId]));
					}
				}
			}
		} catch (\Throwable e) {
			this.logger.logException(e);
			this.logger.critical(this.getLanguage().translateString("pocketmine.crash.error", [e.getMessage()]));
		}

		//this->checkMemory();
		//dump .= "Memory Usage Tracking: \r\n" . chunk_split(base64_encode(gzdeflate(implode(";", this->memoryStats), 9))) . "\r\n";

		this.forceShutdown();
		this.isRunning = false;
		@kill(getmypid());
		exit(1);
	}

	

	__debugInfo() {
		return [];
	}

	_

	tickProcessor() {
		this.nextTick = microtime(true);
		while (this.isRunning) {
			this.tick();
			next = this.nextTick - 0.0001;
			if (next > microtime(true)) {
				try {
					@time_sleep_until(next);
				} catch (\Throwable e) {
					//Sometimes next is less than the current time. High load?
				}
			}
		}
	}

	

	onPlayerLogin(Player player) {
		if (this.sendUsageTicker > 0) {
			this.uniquePlayers[player.getRawUniqueId()] = player.getRawUniqueId();
		}

		this.loggedInPlayers[player.getRawUniqueId()] = player;
	}

	

	onPlayerCompleteLoginSequence(Player player) {
		this.sendFullPlayerListData(player);
		player.dataPacket(this.craftingManager.getCraftingDataPacket());
	}

	

	onPlayerLogout(Player player) {
		unset(this.loggedInPlayers[player.getRawUniqueId()]);
	}

	

	addPlayer(identifier, Player player) {
		this.players[identifier] = player;
		this.identifiers[spl_object_hash(player)] = identifier;
	}

	

	addOnlinePlayer(Player player) {
		this.updatePlayerListData(player.getUniqueId(), player.getId(), player.getDisplayName(), player.getSkin());

		this.playerList[player.getRawUniqueId()] = player;
	}

	

	removeOnlinePlayer(Player player) {
		if (isset(this.playerList[player.getRawUniqueId()])) {
			unset(this.playerList[player.getRawUniqueId()]);

			this.removePlayerListData(player.getUniqueId());
		}
	}

	/**
	 * @param UUID          uuid
	 * @param int           entityId
	 * @param string        name
	 * @param Skin          skin
	 * @param Player[]|null players
	 */
	

	updatePlayerListData(UUID uuid, int entityId, string name, Skin skin, array players = null) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_ADD;

		pk.entries[] = PlayerListEntry.createAdditionEntry(uuid, entityId, name, skin);
		this.broadcastPacket(players ? ? this.playerList, pk);
	}

	/**
	 * @param UUID          uuid
	 * @param Player[]|null players
	 */
	

	removePlayerListData(UUID uuid, array players = null) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_REMOVE;
		pk.entries[] = PlayerListEntry.createRemovalEntry(uuid);
		this.broadcastPacket(players ? ? this.playerList, pk);
	}

	/**
	 * @param Player p
	 */
	

	sendFullPlayerListData(Player p) {
		pk = new PlayerListPacket();
		pk.type = PlayerListPacket.TYPE_ADD;
		foreach(this.playerList as player) {
			pk.entries[] = PlayerListEntry.createAdditionEntry(player.getUniqueId(), player.getId(), player.getDisplayName(), player.getSkin());
		}

		p.dataPacket(pk);
	}

	_

	checkTickUpdates(currentTick, tickTime) {
		foreach(this.players as p) {
			if (!p.loggedIn and(tickTime - p.creationTime) >= 10) {
				p.close("", "Login timeout");
			}
			elseif(this.alwaysTickPlayers and p.spawned) {
				p.onUpdate(currentTick);
			}
		}

		//Do level ticks
		foreach(this.getLevels() as level) {
			if (level.getTickRate() > this.baseTickRate and--level.tickRateCounter > 0) {
				continue;
			}
			try {
				levelTime = microtime(true);
				level.doTick(currentTick);
				tickMs = (microtime(true) - levelTime) * 1000;
				level.tickRateTime = tickMs;

				if (this.autoTickRate) {
					if (tickMs < 50 and level.getTickRate() > this.baseTickRate) {
						level.setTickRate(r = level.getTickRate() - 1);
						if (r > this.baseTickRate) {
							level.tickRateCounter = level.getTickRate();
						}
						this.getLogger().debug("Raising level \"{level->getName()}\" tick rate to {level->getTickRate()} ticks");
					}
					elseif(tickMs >= 50) {
						if (level.getTickRate() === this.baseTickRate) {
							level.setTickRate(max(this.baseTickRate + 1, min(this.autoTickRateLimit, (int) floor(tickMs / 50))));
							this.getLogger().debug(sprintf("Level \"%s\" took %gms, setting tick rate to %d ticks", level.getName(), (int) round(tickMs, 2), level.getTickRate()));
						}
						elseif((tickMs / level.getTickRate()) >= 50 and level.getTickRate() < this.autoTickRateLimit) {
							level.setTickRate(level.getTickRate() + 1);
							this.getLogger().debug(sprintf("Level \"%s\" took %gms, setting tick rate to %d ticks", level.getName(), (int) round(tickMs, 2), level.getTickRate()));
						}
						level.tickRateCounter = level.getTickRate();
					}
				}
			} catch (\Throwable e) {
				this.logger.critical(this.getLanguage().translateString("pocketmine.level.tickError", [level.getName(), e.getMessage()]));
				this.logger.logException(e);
			}
		}
	}

	

	doAutoSave() {
		if (this.getAutoSave()) {
			Timings.worldSaveTimer.startTiming();
			foreach(this.players as index => player) {
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
		if ((bool) this.getProperty("anonymous-statistics.enabled", true)) {
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

	_

	titleTick() {
		Timings.titleTickTimer.startTiming();
		d = Utils.getRealMemoryUsage();

		u = Utils.getMemoryUsage(true);
		usage = sprintf("%g/%g/%g/%g MB @ %d threads", round((u[0] / 1024) / 1024, 2), round((d[0] / 1024) / 1024, 2), round((u[1] / 1024) / 1024, 2), round((u[2] / 1024) / 1024, 2), Utils.getThreadCount());

		echo "\x1b]0;".this.getName().
		" ".
		this.getPocketMineVersion().
		" | Online ".count(this.players).
		"/".this.getMaxPlayers().
		" | Memory ".usage.
		" | U ".round(this.network.getUpload() / 1024, 2).
		" D ".round(this.network.getDownload() / 1024, 2).
		" kB/s | TPS ".this.getTicksPerSecondAverage().
		" | Load ".this.getTickUsageAverage().
		"%\x07";

		Timings.titleTickTimer.stopTiming();
	}

	/**
	 * @param string address
	 * @param int    port
	 * @param string payload
	 *
	 * TODO: move this to Network
	 */
	

	handlePacket(string address, int port, string payload) {
		try {
			if (strlen(payload) > 2 and substr(payload, 0, 2) === "\xfe\xfd"
				and this.queryHandler instanceof QueryHandler) {
				this.queryHandler.handle(address, port, payload);
			}
		} catch (\Throwable e) {
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
	_

	tick() {
		tickTime = microtime(true);
		if ((tickTime - this.nextTick) < -0.025) { //Allow half a tick of diff
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
			if (this.doTitleTick and Terminal.hasFormattingCodes()) {
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
			} catch (\Throwable e) {
				this.logger.logException(e);
			}
		}

		if (this.autoSave and++this.autoSaveTicker >= this.autoSaveTicks) {
			this.autoSaveTicker = 0;
			this.doAutoSave();
		}

		if (this.sendUsageTicker > 0 and--this.sendUsageTicker === 0) {
			this.sendUsageTicker = 6000;
			this.sendUsage(SendUsageTask.TYPE_STATUS);
		}

		if ((this.tickCounter % 100) === 0) {
			foreach(this.levels as level) {
				level.clearCache();
			}

			if (this.getTicksPerSecondAverage() < 12) {
				this.logger.warning(this.getLanguage().translateString("pocketmine.server.tickOverload"));
			}
		}

		if (this.dispatchSignals and this.tickCounter % 5 === 0) {
			pcntl_signal_dispatch();
		}

		this.getMemoryManager().check();

		Timings.serverTickTimer.stopTiming();

		now = microtime(true);
		this.currentTPS = min(20, 1 / max(0.001, now - tickTime));
		this.currentUse = min(1, (now - tickTime) / 0.05);

		TimingsHandler.tick(this.currentTPS <= this.profilingTickRate);

		array_shift(this.tickAverage);
		this.tickAverage[] = this.currentTPS;
		array_shift(this.useAverage);
		this.useAverage[] = this.currentUse;

		if ((this.nextTick - tickTime) < -1) {
			this.nextTick = tickTime;
		} else {
			this.nextTick += 0.05;
		}

		return true;
	}

	/**
	 * Called when something attempts to serialize the server instance.
	 *
	 * @throws \BadMethodCallException because Server instances cannot be serialized
	 */
	

	__sleep() {
		throw new\ BadMethodCallException("Cannot serialize Server instance");
	}
}