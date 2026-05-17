import { state } from '../state.js';

const RADIUS = 112;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function GameScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen game-screen';

  const starter = document.createElement('p');
  starter.className = 'starter-label';
  starter.innerHTML = `🎲 <strong>${state.startingPlayer}</strong> goes first!`;

  const timer = document.createElement('div');
  timer.className = 'timer-wrap';
  timer.innerHTML = `
    <svg class="timer-ring" viewBox="0 0 260 260" aria-hidden="true">
      <circle class="timer-ring-bg" cx="130" cy="130" r="${RADIUS}"></circle>
      <circle class="timer-ring-fg" cx="130" cy="130" r="${RADIUS}"></circle>
    </svg>
    <span class="timer-text"></span>
  `;

  const timerText = timer.querySelector('.timer-text');
  const timerArc = timer.querySelector('.timer-ring-fg');
  timerArc.style.strokeDasharray = `${CIRCUMFERENCE}`;

  const footer = document.createElement('footer');
  footer.className = 'bottom-actions';

  const endButton = document.createElement('button');
  endButton.className = 'ghost-button end-button';
  endButton.type = 'button';
  endButton.textContent = 'End Game';

  const confirmPanel = document.createElement('div');
  confirmPanel.className = 'confirm-panel hidden';

  const confirmText = document.createElement('p');
  confirmText.textContent = 'Are you sure?';

  const confirmActions = document.createElement('div');
  confirmActions.className = 'confirm-actions';

  const yesButton = document.createElement('button');
  yesButton.className = 'danger-button';
  yesButton.type = 'button';
  yesButton.textContent = 'Yes, reveal';
  yesButton.addEventListener('click', () => {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    state.screen = 'result';
    render();
  });

  const cancelButton = document.createElement('button');
  cancelButton.className = 'secondary-button';
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    confirmPanel.classList.add('hidden');
    endButton.classList.remove('hidden');
  });

  confirmActions.append(yesButton, cancelButton);
  confirmPanel.append(confirmText, confirmActions);

  endButton.addEventListener('click', () => {
    endButton.classList.add('hidden');
    confirmPanel.classList.remove('hidden');
  });

  footer.append(endButton, confirmPanel);
  screen.append(starter, timer, footer);

  function updateTimer() {
    const progress = state.timerDuration > 0 ? state.timeLeft / state.timerDuration : 0;
    timerText.textContent = formatTime(state.timeLeft);
    timerArc.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - progress)}`;
    timer.classList.toggle('is-danger', state.timeLeft <= 10);
  }

  updateTimer();
  state.timerInterval = setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
      state.screen = 'result';
      render();
    }
  }, 1000);

  return screen;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}
