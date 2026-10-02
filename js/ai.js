/**
 * ai.js
 * Módulo de inteligencia artificial, totalmente independiente de la interfaz.
 * Expone TrikiAI.getBestMove(board, difficulty) -> índice (0-8) de la jugada elegida.
 *
 * Los 5 niveles usan lógica realmente distinta (no solo cambios cosméticos):
 *   1 Muy fácil   -> aleatorio, casi nunca bloquea o gana a propósito
 *   2 Fácil       -> siempre gana si puede, bloquea solo la mitad de las veces
 *   3 Intermedio  -> gana/bloquea siempre, prioriza centro/esquinas con variedad
 *   4 Difícil     -> Minimax con profundidad limitada + poda alfa-beta + variación leve
 *   5 Experto     -> Minimax completo (sin límite de profundidad), sin aleatoriedad
 */
window.TrikiAI = (function () {
  "use strict";

  const { HUMAN, MACHINE, WIN_LINES } = window.TrikiConstants;

  function checkWinnerInternal(b) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line };
    }
    if (b.every((v) => v !== null)) return { winner: "draw", line: null };
    return null;
  }

  function emptyIndices(b) {
    const r = [];
    for (let i = 0; i < 9; i++) if (!b[i]) r.push(i);
    return r;
  }

  function randomMove(b) {
    const empties = emptyIndices(b);
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // Devuelve la casilla que completaría una línea para "player", o null si no existe
  function findWinningMove(b, player) {
    for (const line of WIN_LINES) {
      const vals = line.map((i) => b[i]);
      const countP = vals.filter((v) => v === player).length;
      const countEmpty = vals.filter((v) => v === null).length;
      if (countP === 2 && countEmpty === 1) {
        return line[vals.indexOf(null)];
      }
    }
    return null;
  }

  function cornersAvailable(b) {
    return [0, 2, 6, 8].filter((i) => !b[i]);
  }

  // ----- Minimax con poda alfa-beta y profundidad opcionalmente limitada -----
  function minimax(b, depth, isMaximizing, maxDepth, alpha, beta) {
    const result = checkWinnerInternal(b);
    if (result) {
      if (result.winner === MACHINE) return 10 - depth;
      if (result.winner === HUMAN) return depth - 10;
      return 0;
    }
    if (depth >= maxDepth) {
      return evaluateBoardHeuristic(b);
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (const i of emptyIndices(b)) {
        b[i] = MACHINE;
        best = Math.max(best, minimax(b, depth + 1, false, maxDepth, alpha, beta));
        b[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of emptyIndices(b)) {
        b[i] = HUMAN;
        best = Math.min(best, minimax(b, depth + 1, true, maxDepth, alpha, beta));
        b[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  // Heurística simple usada solo cuando el minimax se corta por profundidad (nivel 4)
  function evaluateBoardHeuristic(b) {
    let score = 0;
    for (const line of WIN_LINES) {
      const vals = line.map((i) => b[i]);
      const m = vals.filter((v) => v === MACHINE).length;
      const h = vals.filter((v) => v === HUMAN).length;
      if (m > 0 && h === 0) score += m;
      if (h > 0 && m === 0) score -= h;
    }
    return score;
  }

  function bestMinimaxMove(b, maxDepth) {
    let bestScore = -Infinity;
    let bestMoves = [];
    for (const i of emptyIndices(b)) {
      b[i] = MACHINE;
      const score = minimax(b, 0, false, maxDepth, -Infinity, Infinity);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      } else if (score === bestScore) {
        bestMoves.push(i);
      }
    }
    // Entre varias jugadas igual de óptimas, elige una al azar para variar la partida
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  function getBestMove(board, difficulty) {
    const b = board.slice(); // nunca mutar el tablero original
    const empties = emptyIndices(b);
    if (empties.length === 0) return null;

    switch (difficulty) {
      case 1: {
        if (Math.random() < 0.15) {
          const win = findWinningMove(b, MACHINE);
          if (win !== null) return win;
        }
        return randomMove(b);
      }

      case 2: {
        const win = findWinningMove(b, MACHINE);
        if (win !== null) return win;
        if (Math.random() < 0.5) {
          const block = findWinningMove(b, HUMAN);
          if (block !== null) return block;
        }
        return randomMove(b);
      }

      case 3: {
        const win = findWinningMove(b, MACHINE);
        if (win !== null) return win;
        const block = findWinningMove(b, HUMAN);
        if (block !== null) return block;

        if (Math.random() < 0.65) {
          if (!b[4]) return 4;
          const corners = cornersAvailable(b);
          if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
        }
        return randomMove(b);
      }

      case 4: {
        const win = findWinningMove(b, MACHINE);
        if (win !== null) return win;
        const block = findWinningMove(b, HUMAN);
        if (block !== null) return block;

        if (Math.random() < 0.12) {
          if (!b[4]) return 4;
          const corners = cornersAvailable(b);
          if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
        }
        return bestMinimaxMove(b, 3);
      }

      case 5:
      default: {
        return bestMinimaxMove(b, 9); // profundidad 9 = todo el árbol posible
      }
    }
  }

  return { getBestMove, checkWinner: checkWinnerInternal };
})();
