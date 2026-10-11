/**
 * 12jugadores: groupPlayersByArea (rmgen-common/player.js, tambien copiado
 * por feldmap) prueba TODAS las permutaciones de posiciones para juntar a los
 * aliados: 8! = 40.320, pero 12! = 479.001.600, y el generador del mapa se
 * queda colgado (p. ej. con la colocacion "rio").
 *
 * Con mas de 8 jugadores se usa una busqueda local (intercambios de 2
 * posiciones desde varios puntos de partida aleatorios) que minimiza la misma
 * funcion de coste. Con 8 o menos, el metodo original sin cambios.
 *
 * Este archivo se carga despues de player.js (orden alfabetico del directorio).
 */
var twelvePlayers_groupPlayersByArea_original = groupPlayersByArea;

// Puntos de partida aleatorios de la busqueda local.
var TWELVE_PLAYERS_PLACEMENT_RESTARTS = 40;

/**
 * Misma funcion de coste que el original: suma, por equipo, de las distancias
 * entre aliados consecutivos dividida por el tamano del equipo.
 */
function twelvePlayers_groupingCost(playerIDs, positions)
{
	let dist = 0;
	let teamDist = 0;
	let teamSize = 0;

	for (let i = 1; i < playerIDs.length; ++i)
	{
		const team1 = getPlayerTeam(playerIDs[i - 1]);
		const team2 = getPlayerTeam(playerIDs[i]);
		++teamSize;
		if (team1 != -1 && team1 == team2)
			teamDist += positions[i - 1].distanceTo(positions[i]);
		else
		{
			dist += teamDist / teamSize;
			teamDist = 0;
			teamSize = 0;
		}
	}

	if (teamSize)
		dist += teamDist / teamSize;

	return dist;
}

groupPlayersByArea = function(playerIDs, locations)
{
	if (playerIDs.length <= 8)
		return twelvePlayers_groupPlayersByArea_original(playerIDs, locations);

	playerIDs = sortPlayers(playerIDs);

	let minDist = Infinity;
	let minLocations;

	for (let restart = 0; restart < TWELVE_PLAYERS_PLACEMENT_RESTARTS; ++restart)
	{
		const positions = shuffleArray(locations).slice(0, playerIDs.length).map(v => v.clone());
		let cost = twelvePlayers_groupingCost(playerIDs, positions);

		// Intercambiar pares mientras alguno mejore el coste.
		let improved = true;
		while (improved)
		{
			improved = false;
			for (let i = 0; i < positions.length; ++i)
				for (let j = i + 1; j < positions.length; ++j)
				{
					[positions[i], positions[j]] = [positions[j], positions[i]];
					const newCost = twelvePlayers_groupingCost(playerIDs, positions);
					if (newCost < cost - 1e-9)
					{
						cost = newCost;
						improved = true;
					}
					else
						[positions[i], positions[j]] = [positions[j], positions[i]];
				}
		}

		if (cost < minDist)
		{
			minDist = cost;
			minLocations = positions;
		}
	}

	return {
		"playerIDs": g_MapSettings.Shuffle ? sortAllPlayers() : playerIDs,
		"playerPosition": minLocations
	};
};
