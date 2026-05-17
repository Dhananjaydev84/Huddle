import { state } from '../state.js';

export function ResultScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen result-screen';

  const resultIcon = document.createElement('div');
  resultIcon.className = 'result-icon';
  resultIcon.innerHTML = '<span class="material-symbols-outlined filled">sports_esports</span>';

  const title = document.createElement('h1');
  title.className = 'result-title';
  title.textContent = 'GAME ENDED';

  const resultBox = document.createElement('div');
  resultBox.className = 'result-box';

  const wordPara = document.createElement('p');
  wordPara.innerHTML = `The word was <br/><span>${state.gameWord || state.selectedWord?.word || '???'}</span>`;

  const impostorPara = document.createElement('p');
  const impLabel = state.impostors.length === 1 ? 'The impostor was' : 'The impostors were';
  impostorPara.innerHTML = `${impLabel} <br/><span>${state.impostors.join(', ')}</span>`;

  resultBox.append(wordPara, impostorPara);

  const actions = document.createElement('div');
  actions.className = 'stacked-actions';

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
