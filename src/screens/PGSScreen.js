import {
  state,
  addPlayer,
  deletePlayer,
  getMaxImpostors,
  clampImpostorCount,
  pickGame
} from '../state.js';

export function PGSScreen({ render }) {
  clampImpostorCount();

  const screen = document.createElement('section');
  screen.className = 'screen pgs-screen';

  const header = document.createElement('header');
  header.className = 'screen-header';

  const backButton = document.createElement('button');
  backButton.className = 'ghost-button back-button';
  backButton.type = 'button';
  backButton.textContent = '← Back';
  backButton.addEventListener('click', () => {
    state.screen = 'home';
    render();
  });

  const title = document.createElement('h1');
  title.textContent = 'Imposter Setup';

  header.append(backButton, title);

  const playersSection = document.createElement('section');
  playersSection.className = 'setup-section';

  const playersTitle = document.createElement('h2');
  playersTitle.textContent = 'Players';

  const playerList = document.createElement('div');
  playerList.className = 'player-list';

  if (state.players.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Add players to start a huddle.';
    playerList.append(empty);
  } else {
    state.players.forEach((player) => {
      const row = document.createElement('div');
      row.className = 'player-row';

      const name = document.createElement('span');
      name.textContent = player;

      const remove = document.createElement('button');
      remove.className = 'icon-button';
      remove.type = 'button';
      remove.setAttribute('aria-label', `Remove ${player}`);
      remove.textContent = '✕';
      remove.addEventListener('click', () => {
        deletePlayer(player);
        render();
      });

      row.append(name, remove);
      playerList.append(row);
    });
  }

  const addForm = document.createElement('form');
  addForm.className = 'add-player';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 20;
  input.placeholder = 'Player name';
  input.autocomplete = 'off';

  const addButton = document.createElement('button');
  addButton.className = 'secondary-button';
  addButton.type = 'submit';
  addButton.textContent = 'Add';

  addForm.append(input, addButton);
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addPlayer(input.value);
    render();
  });

  if (state.players.length < 3) {
    const warning = document.createElement('p');
    warning.className = 'warning-text';
    warning.textContent = 'Need at least 3 players';
    playersSection.append(playersTitle, playerList, addForm, warning);
  } else {
    playersSection.append(playersTitle, playerList, addForm);
  }

  const settingsSection = document.createElement('section');
  settingsSection.className = 'setup-section';

  const settingsTitle = document.createElement('h2');
  settingsTitle.textContent = 'Impostor Settings';

  const impostorField = document.createElement('label');
  impostorField.className = 'field-row';

  const impostorLabel = document.createElement('span');
  impostorLabel.textContent = 'Number of Impostors';

  const select = document.createElement('select');
  const maxImpostors = getMaxImpostors();
  for (let count = 1; count <= maxImpostors; count += 1) {
    const option = document.createElement('option');
    option.value = String(count);
    option.textContent = String(count);
    option.selected = count === state.impostorCount;
    select.append(option);
  }
  select.addEventListener('change', () => {
    state.impostorCount = Number(select.value);
  });

  impostorField.append(impostorLabel, select);

  const modeBlock = document.createElement('div');
  modeBlock.className = 'field-stack';

  const modeLabel = document.createElement('span');
  modeLabel.textContent = 'Impostor Gets';

  const modes = document.createElement('div');
  modes.className = 'segmented-control';

  [
    ['hint', 'Hint'],
    ['similar', 'Similar Word'],
    ['nothing', 'Nothing']
  ].forEach(([value, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = value === state.impostorMode ? 'active' : '';
    button.textContent = label;
    button.addEventListener('click', () => {
      state.impostorMode = value;
      Array.from(modes.children).forEach((b) => {
        b.className = '';
      });
      button.className = 'active';
    });
    modes.append(button);
  });

  modeBlock.append(modeLabel, modes);

  const timerBlock = document.createElement('div');
  timerBlock.className = 'field-stack';

  const timerLabel = document.createElement('span');
  timerLabel.textContent = 'Timer Duration';

  const timerStepper = document.createElement('div');
  timerStepper.className = 'timer-stepper';

  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.disabled = state.timerDuration <= 15;

  const duration = document.createElement('strong');
  duration.textContent = `${state.timerDuration}s`;

  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.disabled = state.timerDuration >= 300;

  const updateTimerDOM = () => {
    duration.textContent = `${state.timerDuration}s`;
    minus.disabled = state.timerDuration <= 15;
    plus.disabled = state.timerDuration >= 300;
  };

  minus.addEventListener('click', () => {
    state.timerDuration = Math.max(15, state.timerDuration - 15);
    updateTimerDOM();
  });

  plus.addEventListener('click', () => {
    state.timerDuration = Math.min(300, state.timerDuration + 15);
    updateTimerDOM();
  });

  timerStepper.append(minus, duration, plus);
  timerBlock.append(timerLabel, timerStepper);

  settingsSection.append(settingsTitle, impostorField, modeBlock, timerBlock);

  const footer = document.createElement('footer');
  footer.className = 'bottom-actions';

  const startButton = document.createElement('button');
  startButton.className = 'primary-button';
  startButton.type = 'button';
  startButton.textContent = 'Start Game';
  startButton.disabled = state.players.length < 3;
  startButton.addEventListener('click', () => {
    if (state.players.length < 3) return;
    pickGame();
    state.screen = 'reveal';
    render();
  });

  footer.append(startButton);
  screen.append(header, playersSection, settingsSection, footer);
  return screen;
}
