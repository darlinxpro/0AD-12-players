/**
 * 12jugadores: creditos en la consola al empezar la partida y, con ModernGUI,
 * aviso si el orden de mods no permite partidas de mas de 8 jugadores.
 *
 * El mod ya no sustituye los paneles de seleccion (las barras de captura extra
 * se anaden en capture_bars_12jugadores.xml), asi que con ModernGUI no da
 * errores en ningun orden. Pero para MAS DE 8 jugadores, 12jugadores debe ir
 * DESPUES de ModernGUI, para que se usen sus listas de 12 filas (jugadores,
 * diplomacia, resumen) en lugar de las de 8 de ModernGUI.
 */
function twelvePlayers_checkModernGUI()
{
	const mods = Engine.GetEngineInfo().mods.map(mod => mod.name);
	const modernGUI = mods.indexOf("ModernGUI");
	if (modernGUI == -1 || mods.indexOf("12jugadores") > modernGUI || g_Players.length - 1 <= 8)
		return;

	g_Chat.ChatMessageHandler.handleMessage({
		"type": "system",
		"text": "[12 jugadores] Con ModernGUI y más de 8 jugadores, pon 12jugadores DESPUÉS de ModernGUI en Selección de mods para evitar errores en los paneles."
	});
}

{
	const twelvePlayers_originalInit = init;
	init = function(...args)
	{
		twelvePlayers_originalInit(...args);
		// Creditos en la consola (amarillo) y en el log, al empezar la partida.
		warn("12 jugadores — Made by Darlinxpro");
		twelvePlayers_checkModernGUI();
	};
}
