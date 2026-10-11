/**
 * 12jugadores: el mod ignora la comprobacion de compatibilidad (cualquiera
 * puede entrar en la sala), pero una partida de MAS DE 8 jugadores solo
 * funciona si todos lo tienen: a quien no lo tenga se le colgaria la carga.
 *
 * - Cada cliente con el mod lo anuncia una vez en el chat de la sala con un
 *   mensaje marcado (los que tienen el mod no lo ven; ver ClientChat~zz...).
 * - El anfitrion apunta quien lo ha anunciado y, con mas de 8 jugadores,
 *   bloquea "Empezar partida" mientras alguien de la sala no lo tenga.
 */
var TWELVE_PLAYERS_VERSION = "0.3.0";
var TWELVE_PLAYERS_ANNOUNCE = "[12jugadores] mod instalado";

var g_TwelvePlayersNet = {
	"setupWindow": undefined,
	"startButton": undefined,
	// GUIDs de los clientes que han anunciado el mod
	"withMod": new Set(),
	"announced": false
};

function twelvePlayers_isAnnouncement(text)
{
	return typeof text == "string" && text.startsWith(TWELVE_PLAYERS_ANNOUNCE);
}

/**
 * Nombres de los clientes de la sala (jugadores u observadores) que no han
 * anunciado el mod. Solo importa en red y con mas de 8 jugadores.
 */
function twelvePlayers_playersWithoutMod()
{
	if (!g_IsNetworked || !g_GameSettings || g_GameSettings.playerCount.nbPlayers <= 8)
		return [];
	const ownGUID = Engine.GetPlayerGUID ? Engine.GetPlayerGUID() : undefined;
	return Object.keys(g_PlayerAssignments)
		.filter(guid => guid != ownGUID && !g_TwelvePlayersNet.withMod.has(guid))
		.map(guid => g_PlayerAssignments[guid].name);
}

function twelvePlayers_refreshNet()
{
	if (g_TwelvePlayersNet.startButton)
		g_TwelvePlayersNet.startButton.update();
	if (typeof twelvePlayers_renderWarning == "function")
		twelvePlayers_renderWarning();
}

function twelvePlayers_onChat(message)
{
	if (!twelvePlayers_isAnnouncement(message.text))
		return;
	g_TwelvePlayersNet.withMod.add(message.guid);
	twelvePlayers_refreshNet();
}

function twelvePlayers_announce()
{
	if (!g_IsNetworked || g_TwelvePlayersNet.announced)
		return;
	g_TwelvePlayersNet.announced = true;
	Engine.SendNetworkChat(TWELVE_PLAYERS_ANNOUNCE + " (" + TWELVE_PLAYERS_VERSION + ") — Made by Darlinxpro");
}

{
	const originalOnLoad = StartGameButton.prototype.onLoad;
	StartGameButton.prototype.onLoad = function(...args)
	{
		originalOnLoad.apply(this, args);

		g_TwelvePlayersNet.startButton = this;
		const setupWindow = this.setupWindow;
		g_TwelvePlayersNet.setupWindow = setupWindow;
		if (!g_IsNetworked)
			return;

		setupWindow.controls.netMessages.registerNetMessageHandler("chat", twelvePlayers_onChat);
		// Al recibir las asignaciones de jugadores ya estamos conectados: anunciar.
		setupWindow.controls.playerAssignmentsController.registerPlayerAssignmentsChangeHandler(() => {
			twelvePlayers_announce();
			twelvePlayers_refreshNet();
		});
		g_GameSettings.playerCount.watch(() => twelvePlayers_refreshNet(), ["nbPlayers"]);
	};

	const originalIsEveryoneReady = StartGameButton.prototype.isEveryoneReady;
	StartGameButton.prototype.isEveryoneReady = function(...args)
	{
		return originalIsEveryoneReady.apply(this, args) && !twelvePlayers_playersWithoutMod().length;
	};

	// Por si otro mod (p. ej. la cuenta atras de autociv) pulsa el boton directamente.
	const originalOnPress = StartGameButton.prototype.onPress;
	StartGameButton.prototype.onPress = function(...args)
	{
		if (twelvePlayers_playersWithoutMod().length)
		{
			this.update();
			return;
		}
		return originalOnPress.apply(this, args);
	};

	const originalUpdate = StartGameButton.prototype.update;
	StartGameButton.prototype.update = function(...args)
	{
		originalUpdate.apply(this, args);
		const missing = twelvePlayers_playersWithoutMod();
		if (missing.length)
			this.startGameButton.tooltip = "Partida de más de 8 jugadores: todos deben tener el mod 12jugadores.\nFalta en: " + missing.join(", ");
	};
}
