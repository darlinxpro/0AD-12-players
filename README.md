# 0AD-12-players

**Partidas de hasta 12 jugadores (5v5, 6v6) en 0 A.D.** — Made by **Darlinxpro**

Mod para [0 A.D.](https://play0ad.com) **0.28.0** que sube el límite de jugadores de 8 a 12 y adapta la interfaz del juego para que todo funcione con más jugadores.

> *English summary: allows up to 12 players (5v5, 6v6) in 0 A.D. 0.28.0 random maps. Install the `12jugadores` folder into your 0 A.D. `mods` folder and enable it in Mod Selection. All players in a match need the same version.*

---

## Qué incluye

- **Hasta 12 jugadores** en mapas aleatorios (el motor del juego admite hasta 16; el límite de 8 estaba solo en la interfaz).
- **4 jugadores nuevos** con colores fáciles de distinguir: rosa, celeste, marrón y verde oscuro.
- **Interfaz adaptada a 12 jugadores**: lista de jugadores al configurar la partida, ventana de diplomacia, resumen final y barras de captura de edificios.
  - Con más de 8 jugadores, el panel de jugadores crece y el resumen usa filas más bajas para que quepan todos. Con 8 o menos, todo se ve como siempre.
- **Corrección de la carga colgada**: la colocación de jugadores del juego (`groupPlayersByArea`) probaba todas las permutaciones posibles (con 12 jugadores, 479 millones) y la carga se quedaba parada, por ejemplo con la colocación "río". El mod usa una búsqueda rápida para más de 8 jugadores (unos milisegundos) y deja el método original para 8 o menos.
- **Aviso de tamaño mínimo** (en rojo, en la configuración de la partida) si el mapa es demasiado pequeño para tantos jugadores.

## Requisitos

- **0 A.D. 0.28.0**
- **Todos los jugadores de la partida** deben tener el mod, **en la misma versión**. El juego lo comprueba al entrar en la partida.

---

## Instalación

### Opción 1: archivo `.pyromod` (la más fácil)

1. Descarga el archivo `12jugadores-<versión>.pyromod` desde la página de [**Releases**](../../releases).
2. Haz **doble clic** en el archivo (o arrástralo a la ventana del juego). 0 A.D. lo instala solo.
3. Sigue con [Activar el mod](#activar-el-mod).

### Opción 2: copiar la carpeta manualmente

1. Descarga el repositorio: botón verde **Code → Download ZIP**, y descomprímelo.
2. Copia la carpeta **`12jugadores`** (la que contiene `mod.json`) dentro de la carpeta `mods` de 0 A.D.:

| Sistema | Carpeta `mods` |
|---|---|
| **Windows** | `Documentos\My Games\0ad\mods\` (`C:\Users\<tu usuario>\Documents\My Games\0ad\mods\`) |
| **Linux** | `~/.local/share/0ad/mods/` |
| **macOS** | `~/Library/Application Support/0ad/mods/` |

   Debe quedar así:
   ```
   mods/
   └── 12jugadores/
       ├── mod.json
       ├── gui/
       ├── maps/
       └── simulation/
   ```
   > Si la carpeta `mods` no existe, créala. Si acabas con `mods/0AD-12-players-main/12jugadores/...`, mueve `12jugadores` un nivel arriba: tiene que estar directamente dentro de `mods`.

### Activar el mod

1. Abre 0 A.D. → **Configuración** → **Selección de mods**.
2. Selecciona **12 jugadores** → **Activar** → **Guardar configuración** → **Iniciar mods**.

---

## Cómo jugar 5v5 / 6v6

1. Crea una partida y elige un **mapa aleatorio** (por ejemplo, *Mainland*).
2. En **Número de jugadores** ya puedes elegir hasta **12**.
3. Usa un tamaño de mapa suficiente:

| Jugadores | Tamaño mínimo | Mapas "Balanced" (mod feldmap) |
|---|---|---|
| 9–10 (5v5) | **Medium** | Large |
| 11–12 (6v6) | **Large** | Very Large |

Si el mapa es más pequeño, aparece un aviso en rojo en la parte de abajo.

### Limitaciones

- **Solo mapas aleatorios.** Los mapas de escaramuza y escenario tienen sus 8 huecos fijos.
- **Rendimiento:** con 12 ejércitos, la partida va al ritmo del ordenador más lento.
- **ModernGUI:** ModernGUI reemplaza varios de los mismos paneles. Pon **12jugadores antes de ModernGUI** en la lista de mods; aun así, los paneles propios de ModernGUI solo tienen 8 filas y pueden dar errores con más de 8 jugadores. Al empezar la partida, el mod avisa en el chat si el orden no es el correcto.

---

## Archivos modificados

El mod contiene copias modificadas de estos archivos de 0 A.D.:

| Archivo | Cambio |
|---|---|
| `gui/common/settings.js` | `g_MaxPlayers` de 8 a 12 |
| `simulation/data/settings/player_defaults.json` | 4 jugadores más |
| `gui/gamesetup/.../PerPlayer/PlayersPanel.xml` | 12 filas de jugador |
| `gui/session/diplomacy/DiplomacyDialog.xml` | 12 filas |
| `gui/summary/summary.xml` | 12 filas por equipo |
| `gui/session/selection_panels_middle/*_details_area.xml`, `gui/session/PanelEntities.xml` | 13 segmentos en las barras de captura (Gaia + 12) |

Y estos scripts propios:

| Archivo | Función |
|---|---|
| `maps/random/rmgen-common/player~12jugadores.js` | Colocación rápida de jugadores (evita la carga colgada) |
| `gui/gamesetup/.../PlayerFrame~12jugadores.js` | Agranda el panel de jugadores con más de 8 |
| `gui/gamesetup/.../GameSettingWarning~12jugadores.js` | Aviso de tamaño mínimo de mapa |
| `gui/summary/summary~12jugadores.js` | Filas más bajas en el resumen con más de 8 |
| `gui/session/session~12jugadores.js` | Créditos en la consola y aviso de orden con ModernGUI |

---

## Créditos y licencia

- Mod hecho por **Darlinxpro**.
- Basado en archivos de **0 A.D.** © Wildfire Games.
- Distribuido bajo la licencia **GNU GPL v2 o posterior**, la misma que el código de 0 A.D. Ver [`LICENSE`](LICENSE).
