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
  backButton.className = 'back-button';
  backButton.type = 'button';
  backButton.innerHTML = '<span class="material-symbols-outlined">arrow_back</span>';
  backButton.addEventListener('click', () => {
    state.screen = 'home';
    render();
  });

  const title = document.createElement('span');
  title.className = 'screen-header-center gradient-text';
  title.textContent = 'HUDDLE';

  const menuButton = document.createElement('button');
  menuButton.className = 'menu-button';
  menuButton.type = 'button';
  menuButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';

  header.append(backButton, title, menuButton);

  const main = document.createElement('div');
  main.className = 'pgs-main';

  const titleSection = document.createElement('section');
  titleSection.innerHTML = '<h2 class="screen-title text-on-surface">Imposter <span class="gradient-text">setup</span></h2>';

  const grid = document.createElement('div');
  grid.className = 'setup-grid';

  const playersSection = document.createElement('section');
  playersSection.className = 'setup-section';

  const playersTitle = document.createElement('span');
  playersTitle.className = 'section-label';
  playersTitle.textContent = 'Add players';

  const addForm = document.createElement('form');
  addForm.className = 'add-player';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 20;
  input.placeholder = 'Enter name...';
  input.autocomplete = 'off';

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'ADD';

  addForm.append(input, addButton);
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(input.value.trim()) {
        addPlayer(input.value);
        render();
    }
  });

  const playerList = document.createElement('div');
  playerList.className = 'player-list';

  state.players.forEach((player) => {
    const row = document.createElement('div');
    row.className = 'player-row';

    const name = document.createElement('span');
    name.textContent = player;

    const remove = document.createElement('button');
    remove.className = 'icon-button';
    remove.type = 'button';
    remove.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">close</span>';
    remove.addEventListener('click', () => {
      deletePlayer(player);
      render();
    });

    row.append(name, remove);
    playerList.append(row);
  });

  playersSection.append(playersTitle, addForm, playerList);
  if (state.players.length < 3) {
    const warning = document.createElement('p');
    warning.className = 'player-warning';
    warning.textContent = 'Minimum of 3 players required';
    playersSection.append(warning);
  }

  const settingsRight = document.createElement('div');
  settingsRight.style.display = 'flex';
  settingsRight.style.flexDirection = 'column';
  settingsRight.style.gap = '12px';

  const impostorField = document.createElement('section');
  impostorField.className = 'setup-section';
  
  const impostorLabel = document.createElement('span');
  impostorLabel.className = 'section-label';
  impostorLabel.textContent = 'Number of Imposters';

  const impostorControl = document.createElement('div');
  impostorControl.className = 'field-row';

  const minusI = document.createElement('button');
  minusI.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">remove</span>';
  minusI.addEventListener('click', () => {
      state.impostorCount = Math.max(1, state.impostorCount - 1);
      render();
  });

  const valI = document.createElement('span');
  valI.className = 'val';
  valI.textContent = state.impostorCount;

  const plusI = document.createElement('button');
  plusI.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">add</span>';
  plusI.addEventListener('click', () => {
      const max = getMaxImpostors();
      state.impostorCount = Math.min(max, state.impostorCount + 1);
      render();
  });

  impostorControl.append(minusI, valI, plusI);
  impostorField.append(impostorLabel, impostorControl);

  const timerField = document.createElement('section');
  timerField.className = 'setup-section';
  
  const timerLabelContainer = document.createElement('div');
  timerLabelContainer.style.display = 'flex';
  timerLabelContainer.style.justifyContent = 'space-between';
  timerLabelContainer.innerHTML = '<span class="section-label">Time duration</span>';

  const disableTimerBtn = document.createElement('button');
  disableTimerBtn.style.fontSize = '10px';
  disableTimerBtn.style.color = state.timerEnabled ? '#e3beb8' : 'var(--s-primary)';
  disableTimerBtn.style.display = 'flex';
  disableTimerBtn.style.alignItems = 'center';
  disableTimerBtn.style.gap = '4px';
  disableTimerBtn.style.border = '1px solid var(--s-outline-variant)';
  disableTimerBtn.style.padding = '2px 6px';
  disableTimerBtn.style.borderRadius = '8px';
  disableTimerBtn.innerHTML = state.timerEnabled
    ? '<span class="material-symbols-outlined" style="font-size: 12px;">timer_off</span> Disable'
    : '<span class="material-symbols-outlined" style="font-size: 12px;">timer</span> Enable';
  
  disableTimerBtn.addEventListener('click', () => {
    state.timerEnabled = !state.timerEnabled;
    render();
  });
  timerLabelContainer.append(disableTimerBtn);

  const timerControl = document.createElement('div');
  timerControl.className = 'field-row';

  const minusT = document.createElement('button');
  minusT.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">keyboard_arrow_left</span>';
  minusT.disabled = !state.timerEnabled || state.timerDuration <= 60;
  minusT.addEventListener('click', () => {
      state.timerDuration = Math.max(60, state.timerDuration - 60);
      render();
  });

  const valTWrapper = document.createElement('div');
  valTWrapper.style.display = 'flex';
  valTWrapper.style.flexDirection = 'column';
  valTWrapper.style.alignItems = 'center';
  const valT = document.createElement('span');
  valT.className = 'val';
  const minutes = Math.floor(state.timerDuration / 60);
  const seconds = String(state.timerDuration % 60).padStart(2, '0');
  
  const unitT = document.createElement('span');
  unitT.style.fontSize = '9px';
  unitT.style.color = '#e3beb8';
  unitT.textContent = 'MINUTES';

  if (!state.timerEnabled) {
    valT.textContent = '--:--';
    valT.style.opacity = '0.3';
    unitT.style.opacity = '0.3';
  } else {
    valT.textContent = `${minutes}:${seconds}`;
  }

  valTWrapper.append(valT, unitT);

  const plusT = document.createElement('button');
  plusT.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px;">keyboard_arrow_right</span>';
  plusT.disabled = !state.timerEnabled || state.timerDuration >= 3600;
  plusT.addEventListener('click', () => {
      state.timerDuration = Math.min(3600, state.timerDuration + 60);
      render();
  });

  timerControl.append(minusT, valTWrapper, plusT);
  timerField.append(timerLabelContainer, timerControl);

  settingsRight.append(impostorField, timerField);

  const modeSection = document.createElement('section');
  modeSection.className = 'setup-section';

  const modeLabel = document.createElement('span');
  modeLabel.className = 'section-label';
  modeLabel.textContent = 'Imposter gets';

  const modes = document.createElement('div');
  modes.className = 'segmented-control';

  [
    ['hint', 'Hint', 'lightbulb'],
    ['similar', 'Similar Word', 'record_voice_over'],
    ['nothing', 'None', 'block']
  ].forEach(([value, label, icon]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = value === state.impostorMode ? 'active' : '';
    button.innerHTML = `
      <span class="material-symbols-outlined ${value === state.impostorMode ? 'filled' : ''}">${icon}</span>
      <span class="label">${label}</span>
    `;
    button.addEventListener('click', () => {
      state.impostorMode = value;
      render();
    });
    modes.append(button);
  });

  modeSection.append(modeLabel, modes);

  grid.append(playersSection, settingsRight, modeSection);

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
  
  main.append(titleSection, grid, footer);
  screen.append(header, main);
  return screen;
}
