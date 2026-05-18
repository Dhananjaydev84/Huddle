import { state } from '../state.js';

export function HomeScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen home-screen';

  const header = document.createElement('header');
  header.className = 'brand-header';

  const title = document.createElement('h1');
  title.className = 'app-title gradient-text animate-reveal';
  title.style.animationDelay = '0s';
  title.textContent = 'HUDDLE';

  const tagline = document.createElement('p');
  tagline.className = 'tagline animate-reveal';
  tagline.style.animationDelay = '0.1s';
  tagline.textContent = 'Party games no mercy';

  header.append(title, tagline);

  const grid = document.createElement('div');
  grid.className = 'game-grid';

  const imposterTile = document.createElement('button');
  imposterTile.className = 'game-tile game-tile-active animate-reveal';
  imposterTile.style.animationDelay = '0.2s';
  imposterTile.type = 'button';
  imposterTile.innerHTML = `
    <div class="tile-bg"></div>
    <span>Imposter</span>
    <small>The Social Deception Game</small>
  `;
  imposterTile.addEventListener('click', () => {
    state.screen = 'pgs';
    render();
  });

  grid.append(imposterTile);

  for (let index = 0; index < 3; index += 1) {
    const tile = document.createElement('div');
    tile.className = 'game-tile game-tile-locked animate-reveal';
    tile.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    tile.innerHTML = '<span>?</span>';
    grid.append(tile);
  }

  screen.append(header, grid);
  return screen;
}
