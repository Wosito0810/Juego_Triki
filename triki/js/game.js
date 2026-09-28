/**
 * game.js
 * Estado y reglas del juego: tablero, turnos, detección de victoria/empate.
 * No toca el DOM en ningún momento; ui.js se encarga de reflejar este
 * estado en pantalla. Esta separación permite probar la lógica del juego
 * o reemplazar la interfaz sin tocar las reglas.
 */
window.TrikiGame = (function () {
  "use strict";

  const { HUMAN, MACHINE, WIN_LINES } = window.TrikiConstants;

  function createGame() {
    return {
      board: Array(9).fill(null),
      over: false,
      turn: HUMAN
    };
  }

  function checkWinner(board) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (board[a] && board[a] === board[c] && board[a] === board[d]) {
        return { winner: board[a], line };
      }
    }
    if (board.every((v) => v !== null)) return { winner: "draw", line: null };
    return null;
  }

  // Intenta colocar "symbol" en "index". Devuelve false si la jugada es inválida
  // (casilla ocupada, partida terminada), sin modificar el estado.
  function applyMove(game, index, symbol) {
    if (game.over) return false;
    if (index < 0 || index > 8) return false;
    if (game.board[index] !== null) return false;

    game.board[index] = symbol;
    const result = checkWinner(game.board);
    if (result) {
      game.over = true;
    }
    return true;
  }

  return { HUMAN, MACHINE, createGame, checkWinner, applyMove };
})();
