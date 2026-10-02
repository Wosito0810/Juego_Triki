/**
 * stats.js
 * Gestión de estadísticas y preferencias del usuario mediante localStorage.
 * Aislado del resto del juego: si mañana se cambia a otro mecanismo de
 * almacenamiento, solo este archivo necesita modificarse.
 */
window.TrikiStats = (function () {
  "use strict";

  const STATS_KEY = "triki_stats";
  const DIFFICULTY_KEY = "triki_difficulty";

  function loadStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { wins: 0, losses: 0, draws: 0 };
      const parsed = JSON.parse(raw);
      return {
        wins: Number(parsed.wins) || 0,
        losses: Number(parsed.losses) || 0,
        draws: Number(parsed.draws) || 0
      };
    } catch (e) {
      return { wins: 0, losses: 0, draws: 0 };
    }
  }

  function saveStats(stats) {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      // localStorage no disponible (modo privado, cuota excedida, etc.)
      // El juego sigue funcionando; solo no persiste entre sesiones.
    }
  }

  function resetStats() {
    const empty = { wins: 0, losses: 0, draws: 0 };
    saveStats(empty);
    return empty;
  }

  function loadDifficulty() {
    try {
      const v = Number(localStorage.getItem(DIFFICULTY_KEY));
      return v >= 1 && v <= 5 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function saveDifficulty(level) {
    try {
      localStorage.setItem(DIFFICULTY_KEY, String(level));
    } catch (e) {
      // Ignorado a propósito: la dificultad simplemente no se recordará.
    }
  }

  return { loadStats, saveStats, resetStats, loadDifficulty, saveDifficulty };
})();
