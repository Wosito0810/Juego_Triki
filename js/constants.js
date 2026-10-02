/**
 * constants.js
 * Valores compartidos por el resto de los módulos: símbolos del juego,
 * combinaciones ganadoras y la metadata de los 5 niveles de dificultad.
 * No contiene lógica, solo datos.
 */
window.TrikiConstants = (function () {
  "use strict";

  const HUMAN = "X";
  const MACHINE = "O";

  // Cada trío de índices representa una fila, columna o diagonal del tablero (0-8)
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6]             // diagonales
  ];

  const LEVELS = [
    { id: 1, name: "Nivel 1 — Muy fácil", desc: "La máquina juega casi al azar." },
    { id: 2, name: "Nivel 2 — Fácil", desc: "Detecta jugadas evidentes, pero comete errores." },
    { id: 3, name: "Nivel 3 — Intermedio", desc: "Estrategia equilibrada con algo de variedad." },
    { id: 4, name: "Nivel 4 — Difícil", desc: "Piensa varios pasos por delante." },
    { id: 5, name: "Nivel 5 — Experto", desc: "Minimax completo. Prácticamente invencible." }
  ];

  return { HUMAN, MACHINE, WIN_LINES, LEVELS };
})();
