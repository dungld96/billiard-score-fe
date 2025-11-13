const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const createGame = (max_players, title) =>
  request('games', { method: 'POST', body: JSON.stringify({ max_players, title }) });

export const addPlayer = (gameId, name) =>
  request(`games/${gameId}/players`, { method: 'POST', body: JSON.stringify({ name }) });

export const getGame = (gameId) => request(`/games/${gameId}`);

export const applyDelta = (gameId, playerId, delta, note='') =>
  request(`games/${gameId}/players/${playerId}/score`, { method: 'POST', body: JSON.stringify({ delta, note }) });

export const undo = (gameId) => request(`/games/${gameId}/undo`, { method: 'POST' });
