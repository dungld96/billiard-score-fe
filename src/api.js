const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const getPlayers = () => request(`players`);

export const createGame = ( title, players) =>
  request('games', { method: 'POST', body: JSON.stringify({ title, players }) });

export const getGame = (gameId) => request(`games/${gameId}`);

export const applyDelta = (gameId, scores, note) =>
  request(`games/${gameId}/round`, { method: 'POST', body: JSON.stringify({ scores, note }) });

export const undo = (gameId) => request(`games/${gameId}/undo`, { method: 'POST' });
