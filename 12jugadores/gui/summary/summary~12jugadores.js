/**
 * 12jugadores: en el resumen final, con mas de 8 jugadores, las filas de
 * jugador se hacen mas bajas para que quepan todas. Con 8 o menos, igual que
 * el original.
 */
{
	const originalInitPlayerBoxPositions = initPlayerBoxPositions;
	initPlayerBoxPositions = function(...args)
	{
		const playerStates = g_GameData && g_GameData.sim && g_GameData.sim.playerStates;
		if (playerStates && playerStates.length - 1 > 8)
		{
			g_PlayerBoxYSize = 30;
			g_PlayerBoxGap = 1;
		}
		return originalInitPlayerBoxPositions(...args);
	};
}
