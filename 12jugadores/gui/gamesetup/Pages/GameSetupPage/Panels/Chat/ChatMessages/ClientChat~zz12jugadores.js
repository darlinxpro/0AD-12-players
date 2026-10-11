/**
 * 12jugadores: oculta en el chat de la sala los anuncios automaticos del mod
 * ("[12jugadores] mod instalado ...") para quien tiene el mod. Quien no lo
 * tiene si los ve, y asi sabe que existe. El nombre "~zz" hace que se cargue
 * despues de otros mods que cambian este archivo (p. ej. ModernGUI).
 */
{
	const originalOnClientChat = ChatMessageEvents.ClientChat.prototype.onClientChat;
	ChatMessageEvents.ClientChat.prototype.onClientChat = function(message, ...args)
	{
		if (message && typeof twelvePlayers_isAnnouncement == "function" && twelvePlayers_isAnnouncement(message.text))
			return undefined;
		return originalOnClientChat.call(this, message, ...args);
	};
}
