import { state } from '../state.js';

export function GameScreen({ render }) {
  const screen = document.createElement('section');
  screen.className = 'screen game-screen';

  const starter = document.createElement('p');
  starter.className = 'starter-label';
  starter.innerHTML = `<strong>${state.startingPlayer}</strong> goes first!`;

  const timer = document.createElement('div');
  timer.className = 'timer-wrap';
  timer.innerHTML = `
    <span class="timer-text"></span>
  `;

  const timerText = timer.querySelector('.timer-text');

  const footer = document.createElement('footer');
  footer.className = 'bottom-actions';

  const endButton = document.createElement('button');
  endButton.className = 'end-button';
  endButton.type = 'button';
  endButton.textContent = 'END GAME';

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
    timerText.textContent = formatTime(state.timeLeft);
    if (state.timeLeft <= 10) {
      timerText.style.color = 'var(--s-error)';
    } else {
      timerText.style.color = 'white';
    }
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
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
