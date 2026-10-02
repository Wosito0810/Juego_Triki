/**
 * ui.js
 * Toda la manipulación del DOM vive aquí: pintar el tablero, el marcador,
 * los niveles de dificultad y los mensajes de estado. No decide reglas del
 * juego ni jugadas de la IA; solo refleja en pantalla lo que le pasan.
 */
window.TrikiUI = (function () {
  "use strict";

  const { LEVELS } = window.TrikiConstants;

  const els = {
    screenStart: document.getElementById("screen-start"),
    screenGame: document.getElementById("screen-game"),
    levelList: document.getElementById("level-list"),
    btnJugar: document.getElementById("btn-jugar"),
    nivelLabel: document.getElementById("nivel-actual-label"),
    statusText: document.getElementById("status-text"),
    thinkingDot: document.getElementById("thinking-dot"),
    board: document.getElementById("board"),
    scoreTu: document.getElementById("score-tu"),
    scoreMaquina: document.getElementById("score-maquina"),
    scoreEmpates: document.getElementById("score-empates"),
    btnNuevaPartida: document.getElementById("btn-nueva-partida"),
    btnCambiarDificultad: document.getElementById("btn-cambiar-dificultad"),
    btnReiniciarStats: document.getElementById("btn-reiniciar-stats"),
    confirmOverlay: document.getElementById("confirm-overlay"),
    btnCancelarReset: document.getElementById("btn-cancelar-reset"),
    btnConfirmarReset: document.getElementById("btn-confirmar-reset")
  };

  function showScreen(name) {
    els.screenStart.classList.toggle("active", name === "start");
    els.screenGame.classList.toggle("active", name === "game");
  }

  function renderLevels(selectedLevel, onSelect) {
    els.levelList.innerHTML = "";
    LEVELS.forEach((lv) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "level-btn";
      btn.setAttribute("role", "radio");
      const checked = lv.id === selectedLevel;
      btn.setAttribute("aria-checked", String(checked));
      btn.setAttribute("aria-pressed", String(checked));
      btn.innerHTML =
        `<span class="level-name">${lv.name}</span>` +
        `<span class="level-desc">${lv.desc}</span>`;
      btn.addEventListener("click", () => onSelect(lv.id));
      els.levelList.appendChild(btn);
    });
  }

  function buildBoardDOM(onCellClick) {
    els.board.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-label", `Casilla ${i + 1}, vacía`);
      cell.dataset.index = i;
      cell.addEventListener("click", () => onCellClick(i));
      els.board.appendChild(cell);
    }
  }

  function renderBoard(board, disabled, winLine) {
    const cells = els.board.children;
    for (let i = 0; i < 9; i++) {
      const cell = cells[i];
      const val = board[i];
      cell.className = "cell" + (val === "X" ? " x" : val === "O" ? " o" : "");
      cell.innerHTML = val ? `<span class="mark">${val}</span>` : "";
      cell.disabled = !!val || disabled;
      const estado = val ? (val === "X" ? "con X" : "con O") : "vacía";
      cell.setAttribute("aria-label", `Casilla ${i + 1}, ${estado}`);
    }
    if (winLine) {
      winLine.forEach((idx) => cells[idx].classList.add("win-cell"));
    }
  }

  function setStatus(text, kind) {
    els.statusText.textContent = text;
    els.statusText.className = "status-text" + (kind ? " " + kind : "");
    els.thinkingDot.hidden = kind !== "thinking";
  }

  function setNivelLabel(text) {
    els.nivelLabel.textContent = text;
  }

  function renderScoreboard(stats) {
    els.scoreTu.textContent = stats.wins;
    els.scoreMaquina.textContent = stats.losses;
    els.scoreEmpates.textContent = stats.draws;
  }

  function showConfirmOverlay() {
    els.confirmOverlay.classList.add("active");
  }
  function hideConfirmOverlay() {
    els.confirmOverlay.classList.remove("active");
  }

  return {
    els,
    showScreen,
    renderLevels,
    buildBoardDOM,
    renderBoard,
    setStatus,
    setNivelLabel,
    renderScoreboard,
    showConfirmOverlay,
    hideConfirmOverlay
  };
})();
