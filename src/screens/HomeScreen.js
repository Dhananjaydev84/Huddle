import { state } from '../state.js';

export function HomeScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen home-screen';

  const header = document.createElement('header');
  header.className = 'brand-header';

  const title = document.createElement('h1');
  title.className = 'app-title gradient-text';
  title.textContent = 'HUDDLE';

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = 'Party games no mercy';

  header.append(title, tagline);

  const grid = document.createElement('div');
  grid.className = 'game-grid';

  const imposterTile = document.createElement('button');
  imposterTile.className = 'game-tile game-tile-active';
  imposterTile.type = 'button';
  imposterTile.innerHTML = `
    <div class="tile-bg"></div>
    <span>Imposter</span>
    <small>The Social Deception Game</small>
    <span class="material-symbols-outlined tile-icon">masks</span>
  `;
  imposterTile.addEventListener('click', () => {
    state.screen = 'pgs';
    render();
  });

  grid.append(imposterTile);

  for (let index = 0; index < 3; index += 1) {
    const tile = document.createElement('div');
    tile.className = 'game-tile game-tile-locked';
    tile.innerHTML = '<span>?</span>';
    grid.append(tile);
  }

  screen.append(header, grid);
  return screen;
}
