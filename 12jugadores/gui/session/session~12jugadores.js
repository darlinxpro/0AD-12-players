/**
 * 12jugadores: si se carga DESPUES de ModernGUI (y sin el complemento
 * 12jugadores_moderngui), los paneles del juego base de este mod sustituyen a
 * los de ModernGUI y aparecen errores (p. ej. "killCount not found"). Con
 * ModernGUI, 12jugadores debe ir ANTES de ModernGUI (si ModernGUI ya trae los
 * paneles de 12) o activar el complemento despues de ambos. Avisa en el chat.
 */
function twelvePlayers_checkModernGUI()
{
	const mods = Engine.GetEngineInfo().mods.map(mod => mod.name);
	const modernGUI = mods.indexOf("ModernGUI");
	if (modernGUI == -1 || mods.indexOf("12jugadores_moderngui") != -1 || mods.indexOf("12jugadores") < modernGUI)
		return;

	g_Chat.ChatMessageHandler.handleMessage({
		"type": "system",
		"text": "[12 jugadores] Con ModernGUI, pon 12jugadores ANTES de ModernGUI en Selección de mods (o activa el complemento 12jugadores_moderngui después de ambos) para evitar errores en los paneles."
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
