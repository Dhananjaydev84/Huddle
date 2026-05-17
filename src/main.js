import './style.css';
import { state, loadPlayers } from './state.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { PGSScreen } from './screens/PGSScreen.js';
import { RevealScreen } from './screens/RevealScreen.js';
import { GameScreen } from './screens/GameScreen.js';
import { ResultScreen } from './screens/ResultScreen.js';

const app = document.querySelector('#app');

const screens = {
  home: HomeScreen,
  pgs: PGSScreen,
  reveal: RevealScreen,
  game: GameScreen,
  result: ResultScreen,
};

export function render() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  app.replaceChildren();
  const Screen = screens[state.screen] || HomeScreen;
  app.append(Screen({ render }));
}

loadPlayers();
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
  });
}
