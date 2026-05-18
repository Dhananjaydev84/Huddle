import { state, hasCrown } from '../state.js';

export function ResultScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen result-screen animate';

  const resultIcon = document.createElement('div');
  resultIcon.className = 'result-icon animate-reveal';
  resultIcon.style.animationDelay = '0s';
  resultIcon.innerHTML = '<span class="material-symbols-outlined filled">sports_esports</span>';

  const title = document.createElement('h1');
  title.className = 'result-title animate-reveal';
  title.style.animationDelay = '0.1s';
  title.textContent = 'GAME ENDED';

  const resultBox = document.createElement('div');
  resultBox.className = 'result-box animate-reveal';
  resultBox.style.animationDelay = '0.2s';

  const wordPara = document.createElement('p');
  wordPara.innerHTML = `The word was <br/><span>${state.gameWord || state.selectedWord?.word || '???'}</span>`;

  const impostorPara = document.createElement('p');
  const impLabel = state.impostors.length === 1 ? 'The impostor was' : 'The impostors were';
  const displayNames = state.impostors.map(name => hasCrown(name) ? `${name} 👑` : name);
  impostorPara.innerHTML = `${impLabel} <br/><span>${displayNames.join(', ')}</span>`;

  resultBox.append(wordPara, impostorPara);

  const actions = document.createElement('div');
  actions.className = 'stacked-actions animate-reveal';
  actions.style.animationDelay = '0.3s';

  const playAgain = document.createElement('button');
  playAgain.className = 'primary-button';
  playAgain.type = 'button';
  playAgain.textContent = 'Play Again';
  playAgain.addEventListener('click', () => {
    state.screen = 'pgs';
    render();
  });

  const home = document.createElement('button');
  home.className = 'ghost-button';
  home.type = 'button';
  home.textContent = 'Home Menu';
  home.addEventListener('click', () => {
    state.screen = 'home';
    render();
  });

  actions.append(playAgain, home);
  screen.append(resultIcon, title, resultBox, actions);
  return screen;
}
