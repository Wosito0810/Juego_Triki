/**
 * main.js
 * Punto de entrada: conecta TrikiGame (reglas), TrikiAI (movimientos de la
 * máquina), TrikiStats (persistencia) y TrikiUI (interfaz). Aquí vive el
 * flujo de la aplicación; ningún otro módulo conoce a los demás.
 */
(function () {
  "use strict";

  const { HUMAN, MACHINE } = window.TrikiConstants;
  const Game = window.TrikiGame;
  const AI = window.TrikiAI;
  const Stats = window.TrikiStats;
  const UI = window.TrikiUI;

  let game = Game.createGame();
  let selectedLevel = Stats.loadDifficulty() || 3;
  let stats = Stats.loadStats();
  let machineThinking = false;

  function init() {
    UI.renderLevels(selectedLevel, onSelectLevel);
    UI.renderScoreboard(stats);
    UI.buildBoardDOM(onCellClick);

    UI.els.btnJugar.addEventListener("click", () => {
      UI.showScreen("game");
      startNewGame();
    });
    UI.els.btnNuevaPartida.addEventListener("click", startNewGame);
    UI.els.btnCambiarDificultad.addEventListener("click", () => {
      UI.renderLevels(selectedLevel, onSelectLevel);
      UI.showScreen("start");
    });
    UI.els.btnReiniciarStats.addEventListener("click", UI.showConfirmOverlay);
    UI.els.btnCancelarReset.addEventListener("click", UI.hideConfirmOverlay);
    UI.els.btnConfirmarReset.addEventListener("click", () => {
      stats = Stats.resetStats();
      UI.renderScoreboard(stats);
      UI.hideConfirmOverlay();
    });
    UI.els.confirmOverlay.addEventListener("click", (e) => {
      if (e.target === UI.els.confirmOverlay) UI.hideConfirmOverlay();
    });
  }

  function onSelectLevel(levelId) {
    selectedLevel = levelId;
    Stats.saveDifficulty(selectedLevel);
    UI.renderLevels(selectedLevel, onSelectLevel);
  }

  function startNewGame() {
    game = Game.createGame();
    machineThinking = false;
    UI.setNivelLabel(window.TrikiConstants.LEVELS.find((l) => l.id === selectedLevel).name);
    UI.buildBoardDOM(onCellClick);
    UI.renderBoard(game.board, false, null);
    UI.setStatus("Tu turno", null);
    UI.renderScoreboard(stats);
  }

  function onCellClick(index) {
    if (game.over || machineThinking) return;

    const moved = Game.applyMove(game, index, HUMAN);
    if (!moved) return; // casilla ocupada u otra jugada inválida: se ignora

    const result = Game.checkWinner(game.board);
    UI.renderBoard(game.board, machineThinking, result ? result.line : null);

    if (result) {
      finishGame(result);
      return;
    }

    UI.setStatus("Turno de la máquina...", "thinking");
    machineThinking = true;
    UI.renderBoard(game.board, true, null);

    // Pequeña espera para que la jugada de la máquina se sienta natural
    const delay = 450 + Math.random() * 350;
    setTimeout(() => {
      const move = AI.getBestMove(game.board, selectedLevel);
      if (move !== null && move !== undefined) {
        Game.applyMove(game, move, MACHINE);
      }
      const result2 = Game.checkWinner(game.board);
      machineThinking = false;
      UI.renderBoard(game.board, false, result2 ? result2.line : null);

      if (result2) {
        finishGame(result2);
      } else {
        UI.setStatus("Tu turno", null);
      }
    }, delay);
  }

  function finishGame(result) {
    if (result.winner === HUMAN) {
      UI.setStatus("¡Ganaste! 🎉", "win");
      stats.wins++;
    } else if (result.winner === MACHINE) {
      UI.setStatus("La máquina ganó.", "lose");
      stats.losses++;
    } else {
      UI.setStatus("¡Empate!", "draw");
      stats.draws++;
    }
    Stats.saveStats(stats);
    UI.renderScoreboard(stats);
    UI.renderBoard(game.board, true, result.line);
  }

  init();
})();
