import { state } from '../state.js';

export function HomeScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen home-screen';

  const header = document.createElement('header');
  header.className = 'brand-header';

  const title = document.createElement('h1');
  title.className = 'app-title';
  title.textContent = 'Huddle';

  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = 'party games, no mercy';

  header.append(title, tagline);

  const grid = document.createElement('div');
  grid.className = 'game-grid';

  const imposterTile = document.createElement('button');
  imposterTile.className = 'game-tile game-tile-active';
  imposterTile.type = 'button';
  imposterTile.innerHTML = '<span>Imposter</span><small>Who\'s the spy?</small>';
  imposterTile.addEventListener('click', () => {
    state.screen = 'pgs';
    render();
  });

  grid.append(imposterTile);

  for (let index = 0; index < 3; index += 1) {
    const tile = document.createElement('div');
    tile.className = 'game-tile game-tile-locked';
    tile.innerHTML = '<span>?</span><small>Coming soon</small>';
    grid.append(tile);
  }

  screen.append(header, grid);
  return screen;
}
