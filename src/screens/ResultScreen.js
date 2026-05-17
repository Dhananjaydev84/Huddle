import { state } from '../state.js';

export function ResultScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen result-screen';

  const wordLabel = document.createElement('p');
  wordLabel.className = 'result-label';
  wordLabel.textContent = 'The word was';

  const word = document.createElement('h1');
  word.className = 'result-word';
  word.textContent = state.selectedWord?.word || '';

  const divider = document.createElement('div');
  divider.className = 'result-divider';

  const impostorLabel = document.createElement('p');
  impostorLabel.className = 'result-label';
  impostorLabel.textContent = state.impostors.length === 1 ? 'The impostor was' : 'The impostors were';

  const impostors = document.createElement('h2');
  impostors.className = 'result-impostors';
  impostors.textContent = state.impostors.join(', ');

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
  home.textContent = 'Home';
  home.addEventListener('click', () => {
    state.screen = 'home';
    render();
  });

  actions.append(playAgain, home);
  screen.append(wordLabel, word, divider, impostorLabel, impostors, actions);
  return screen;
}
