/**
 * 12jugadores: el panel de jugadores de la configuracion de partida solo
 * tiene sitio para 8 filas. Con mas de 8 jugadores, agranda el panel superior
 * y baja el resto de la pagina lo necesario. Con 8 o menos se queda como el
 * original. Se hace por codigo (sin reemplazar GameSetupPage.xml) para ser
 * compatible con otros mods de interfaz.
 */
var g_TwelvePlayers = {
	"baseTopBottom": undefined,
	"baseCenterTop": undefined,
	"extra": 0
};

function twelvePlayers_resizeSetup(nbPlayers)
{
	const topPanel = Engine.TryGetGUIObjectByName("topPanel");
	const centerPanel = Engine.TryGetGUIObjectByName("centerPanel");
	if (!topPanel || !centerPanel)
		return;

	if (g_TwelvePlayers.baseTopBottom === undefined)
	{
		g_TwelvePlayers.baseTopBottom = topPanel.size.bottom;
		g_TwelvePlayers.baseCenterTop = centerPanel.size.top;
	}

	const extra = Math.max(0, nbPlayers - 8) * PlayerSettingControls.PlayerFrame.prototype.Height;
	if (extra == g_TwelvePlayers.extra)
		return;
	g_TwelvePlayers.extra = extra;

	topPanel.size.bottom = g_TwelvePlayers.baseTopBottom + extra;
	centerPanel.size.top = g_TwelvePlayers.baseCenterTop + extra;
}

{
	const originalRender = PlayerSettingControls.PlayerFrame.prototype.render;
	PlayerSettingControls.PlayerFrame.prototype.render = function()
	{
		originalRender.call(this);
		if (this.playerIndex == 0)
		{
			twelvePlayers_resizeSetup(g_GameSettings.playerCount.nbPlayers);
			twelvePlayers_updateSizeWarning();
		}
	};
}
