import { wordBank } from './data/words.js';

const PLAYERS_KEY = 'huddle_players';

export const state = {
  screen: 'home',
  players: [],
  impostorCount: 1,
  impostorMode: 'hint',
  timerDuration: 600,
  timerEnabled: true,
  impostors: [],
  selectedWord: null,
  startingPlayer: null,
  revealIndex: 0,
  revealedCurrent: false,
  timeLeft: 0,
  timerInterval: null,
};

export function loadPlayers() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAYERS_KEY) || '[]');
    state.players = Array.isArray(saved) ? saved.filter((name) => typeof name === 'string') : [];
  } catch {
    state.players = [];
  }
}

export function savePlayers() {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(state.players));
}

export function addPlayer(name) {
  const trimmed = name.trim().slice(0, 20);
  if (!trimmed) return false;

  const exists = state.players.some((player) => player.toLowerCase() === trimmed.toLowerCase());
  if (exists) return false;

  state.players.push(trimmed);
  clampImpostorCount();
  savePlayers();
  return true;
}

export function deletePlayer(name) {
  state.players = state.players.filter((player) => player !== name);
  clampImpostorCount();
  savePlayers();
}

export function getMaxImpostors() {
  return Math.max(1, Math.min(4, Math.floor(state.players.length / 2)));
}

export function clampImpostorCount() {
  state.impostorCount = Math.min(state.impostorCount, getMaxImpostors());
  state.impostorCount = Math.max(1, state.impostorCount);
}

export function pickGame() {
  const selectedWord = randomItem(wordBank);
  const similarWord = randomItem(wordBank.filter((item) => item.word !== selectedWord.word));
  const shuffledPlayers = shuffle([...state.players]);

  state.selectedWord = { ...selectedWord, similar: similarWord.word };
  state.impostors = shuffledPlayers.slice(0, state.impostorCount);
  state.startingPlayer = randomItem(state.players);
  state.revealIndex = 0;
  state.revealedCurrent = false;
}

export function getPlayerRole(playerName) {
  const isImpostor = state.impostors.includes(playerName);

  if (!isImpostor) {
    return { type: 'player', text: state.selectedWord.word };
  }

  if (state.impostorMode === 'hint') {
    return { type: 'impostor', text: randomItem(state.selectedWord.hints) };
  }

  if (state.impostorMode === 'similar') {
    return { type: 'impostor', text: state.selectedWord.similar };
  }

  return { type: 'impostor', text: '???' };
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

export function hasCrown(name) {
  const crowned = ['dj', 'devan', 'dhananjay'];
  return crowned.includes(name.trim().toLowerCase());
}
