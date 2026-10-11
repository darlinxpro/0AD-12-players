/**
 * 12jugadores: aviso en rojo (zona inferior de la configuracion de partida)
 * cuando hay mas de 8 jugadores y el mapa aleatorio es demasiado pequeno.
 * Minimos: 9-10 jugadores -> Medium (320), 11-12 -> Large (384); los mapas
 * "Balanced" (feldmap) piden un tamano mas.
 *
 * El aviso original del juego (trucos / partida puntuada) solo funciona en
 * red; este se muestra tambien en un jugador y se combina con el original.
 */
function twelvePlayers_minMapSize(nbPlayers, balanced)
{
	if (nbPlayers <= 8)
		return 0;
	const sizes = g_Settings.MapSizes.map(size => size.Tiles).sort((a, b) => a - b);
	let min = nbPlayers <= 10 ? 320 : 384;
	if (balanced)
		min = sizes.find(tiles => tiles > min) || min;
	return min;
}

function twelvePlayers_sizeWarning()
{
	if (!g_GameSettings || g_GameSettings.map.type != "random")
		return "";

	const nbPlayers = g_GameSettings.playerCount.nbPlayers;
	const balanced = /balanced/i.test(g_GameSettings.map.map || "");
	const min = twelvePlayers_minMapSize(nbPlayers, balanced);
	if (!min || g_GameSettings.mapSize.size >= min)
		return "";

	const sizeName = tiles => {
		const size = g_Settings.MapSizes.find(s => s.Tiles == tiles);
		return size ? size.Name : String(tiles);
	};
	return sprintf("%(players)s jugadores: tamaño mínimo %(size)s%(balanced)s.", {
		"players": nbPlayers,
		"size": sizeName(min),
		"balanced": balanced ? " (mapa equilibrado)" : ""
	});
}

/**
 * Compone el aviso del juego (trucos / puntuada, solo en red) y el de tamano,
 * y coloca la etiqueta igual que GameSettingWarning.onSettingsChange.
 */
function twelvePlayers_renderWarning()
{
	const warning = Engine.TryGetGUIObjectByName("gameSettingWarning");
	const savedGameLabel = Engine.TryGetGUIObjectByName("savedGameLabel");
	const bottomRightPanel = Engine.TryGetGUIObjectByName("bottomRightPanel");
	if (!warning || !savedGameLabel || !bottomRightPanel || !g_GameSettings)
		return;

	const captions = [];
	if (g_IsNetworked)
	{
		if (g_GameSettings.cheats.enabled)
			captions.push(GameSettingWarning.prototype.CheatsEnabled);
		else if (g_GameSettings.rating.enabled)
			captions.push(GameSettingWarning.prototype.RatingEnabled);
	}
	const sizeWarning = twelvePlayers_sizeWarning();
	if (sizeWarning)
		captions.push(sizeWarning);

	const caption = captions.join(" ");
	warning.caption = caption;

	const maxWidth = savedGameLabel.hidden ? 420 : 340;
	const marginRight = 8;
	const labelWidth = Math.min(warning.getPreferredTextSize().width + 10, maxWidth);
	const neighborElement = !savedGameLabel.hidden ? savedGameLabel.parent : bottomRightPanel;
	warning.parent.size = {
		"left": neighborElement.size.left - labelWidth - marginRight,
		"top": warning.parent.size.top,
		"right": neighborElement.size.left - marginRight,
		"bottom": warning.parent.size.bottom,
		"rleft": neighborElement.size.rleft,
		"rtop": warning.parent.size.rtop,
		"rright": neighborElement.size.rright,
		"rbottom": warning.parent.size.rbottom
	};
	warning.hidden = !caption;
}

// En red, el aviso original llama a esto cuando cambian trucos/puntuacion.
GameSettingWarning.prototype.onSettingsChange = function()
{
	twelvePlayers_renderWarning();
};

var g_TwelvePlayersWarningWatching = false;

/**
 * Se llama desde PlayerFrame~12jugadores.js (al cambiar el numero de
 * jugadores); la primera vez registra tambien los cambios de mapa y tamano.
 */
function twelvePlayers_updateSizeWarning()
{
	if (!g_TwelvePlayersWarningWatching && g_GameSettings)
	{
		g_TwelvePlayersWarningWatching = true;
		g_GameSettings.mapSize.watch(() => twelvePlayers_renderWarning(), ["size"]);
		g_GameSettings.map.watch(() => twelvePlayers_renderWarning(), ["map", "type"]);
	}
	twelvePlayers_renderWarning();
}
