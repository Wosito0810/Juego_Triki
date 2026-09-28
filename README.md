# Triki (Tres en línea)

Juego de Triki completamente funcional, jugable desde cualquier navegador, sin necesidad de instalar nada, crear cuenta ni tener conexión a internet una vez descargado.

## Estructura del proyecto

```
triki/
├── index.html          Estructura HTML de las dos pantallas (inicio y juego)
├── css/
│   └── style.css       Todos los estilos: paleta, layout, animaciones, responsive
└── js/
    ├── constants.js     Datos compartidos: símbolos, líneas ganadoras, niveles
    ├── ai.js             Inteligencia artificial (getBestMove) — 5 niveles reales
    ├── stats.js          Persistencia en localStorage (marcador y dificultad)
    ├── game.js           Reglas y estado del tablero (sin tocar el DOM)
    ├── ui.js              Toda la manipulación del DOM (sin reglas del juego)
    └── main.js            Punto de entrada: conecta los módulos anteriores
```

## Cómo funciona el juego

1. **Pantalla inicial**: eliges uno de los 5 niveles de dificultad y pulsas
   "Jugar". La dificultad elegida se guarda en `localStorage`, así que la
   próxima vez que abras el juego aparecerá preseleccionada.
2. **Tablero**: tú siempre juegas con **X** y empiezas primero; la máquina
   juega con **O**. Haces clic en una casilla vacía para colocar tu ficha.
3. **Turno de la máquina**: mientras la máquina "piensa" (una pequeña
   pausa de ~0.5 s para que se sienta natural), el tablero se bloquea y
   aparece el indicador "Turno de la máquina...". No puedes hacer doble
   movimiento ni jugar fuera de tu turno.
4. **Fin de la partida**: en cuanto hay tres en línea (horizontal, vertical
   o diagonal) o se llenan las 9 casillas sin ganador, la partida termina:
   se resaltan las casillas ganadoras (si las hay), se muestra el mensaje
   correspondiente y el tablero deja de aceptar clics.
5. **Marcador**: victorias, derrotas y empates de la sesión se guardan
   automáticamente en `localStorage` y persisten aunque recargues la
   página. El botón "Reiniciar estadísticas" pide confirmación antes de
   borrarlas.
6. **Controles**: "Nueva partida" reinicia el tablero manteniendo el nivel
   actual; "Cambiar dificultad" te devuelve a la pantalla de selección.

## Los 5 niveles de dificultad

Cada nivel usa una lógica de decisión distinta, no solo un cambio de
velocidad o de texto:

| Nivel | Nombre       | Cómo decide su jugada |
|-------|--------------|------------------------|
| 1 | Muy fácil    | Movimiento aleatorio la mayoría de las veces; solo un 15% de probabilidad de aprovechar una victoria inmediata si la tiene disponible. No bloquea al jugador de forma consistente. |
| 2 | Fácil        | Siempre completa una línea ganadora si puede. Bloquea una amenaza evidente del jugador solo el 50% de las veces. El resto de sus movimientos son aleatorios. |
| 3 | Intermedio   | Siempre gana o bloquea cuando puede. Además, prioriza el centro y luego las esquinas (posiciones estratégicamente más fuertes en el Triki) el 65% de las veces; el resto son movimientos válidos aleatorios, para que no todas las partidas sean iguales. |
| 4 | Difícil      | Gana/bloquea siempre que puede. Para el resto de jugadas usa **Minimax con poda alfa-beta y profundidad limitada a 3 niveles**, con una pequeña probabilidad (12%) de preferir centro/esquina en vez del óptimo estricto, para no ser 100% predecible. |
| 5 | Experto      | **Minimax completo** (sin límite de profundidad) con poda alfa-beta. Siempre elige la jugada matemáticamente óptima; nunca comete un error aleatorio. Jugando de forma óptima, el resultado máximo posible para el jugador humano es un empate. |

El algoritmo de Minimax (usado en los niveles 4 y 5) simula todas las
partidas posibles desde la posición actual, asignando una puntuación
positiva a los estados donde gana la máquina, negativa a los que gana el
humano y cero a los empates —favoreciendo además las victorias más rápidas
y las derrotas más lentas— y elige la jugada que maximiza el peor caso
para el jugador humano.

## Accesibilidad

- Todas las casillas y botones son elementos semánticos (`<button>`),
  navegables con teclado (Tab / Enter / Espacio) y con foco visible.
- El tablero usa `role="grid"`/`role="gridcell"` y cada casilla tiene una
  etiqueta `aria-label` que describe su contenido ("Casilla 3, con X").
- El estado del juego se anuncia mediante una región `aria-live`, por lo
  que un lector de pantalla informa automáticamente cambios de turno,
  victorias, derrotas y empates.
- El resultado nunca depende solo del color: siempre va acompañado de
  texto ("¡Ganaste! 🎉", "La máquina ganó.", "¡Empate!").
- El diseño respeta el modo oscuro del sistema (`prefers-color-scheme`).

## Diseño responsive

El layout usa un contenedor centrado de ancho máximo con unidades
relativas y un tablero en `grid` cuyo tamaño de fuente se adapta con
`clamp()`, por lo que se ve bien tanto en móvil como en escritorio, sin
scroll horizontal y con casillas suficientemente grandes para tocar con
el dedo.
