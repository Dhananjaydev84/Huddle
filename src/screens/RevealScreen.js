import { state, getPlayerRole } from '../state.js';

export function RevealScreen({ render }) {
  const player = state.players[state.revealIndex];
  const role = getPlayerRole(player);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let touchStart = null;

  const screen = document.createElement('section');
  screen.className = 'screen reveal-screen';

  const progress = document.createElement('p');
  progress.className = 'progress-text';
  progress.textContent = `${state.revealIndex + 1} / ${state.players.length}`;

  const prompt = document.createElement('p');
  prompt.className = 'pass-label';
  prompt.textContent = 'Pass the phone to';

  const name = document.createElement('h1');
  name.className = 'current-player';
  name.textContent = player;

  const card = document.createElement('button');
  card.className = 'flip-card';
  card.type = 'button';
  card.setAttribute('aria-label', 'Reveal card');

  const inner = document.createElement('span');
  inner.className = 'flip-card-inner';

  const front = document.createElement('span');
  front.className = 'flip-card-face flip-card-front';
  front.textContent = isTouchDevice ? 'Swipe to reveal' : 'Tap to reveal';

  const back = document.createElement('span');
  back.className = 'flip-card-face flip-card-back';

  const roleLabel = document.createElement('small');
  roleLabel.className = 'role-label';
  roleLabel.textContent = role.type === 'player' ? '👥 Player' : '🕵️ Impostor';

  const roleText = document.createElement('strong');
  roleText.className = role.type === 'player' ? 'role-word' : 'role-word impostor-word';
  roleText.textContent = role.type === 'impostor' && state.impostorMode === 'nothing'
    ? 'You got nothing. Good luck.'
    : role.text;

  back.append(roleLabel, roleText);
  inner.append(front, back);
  card.append(inner);

  const actionArea = document.createElement('footer');
  actionArea.className = 'bottom-actions reveal-actions';

  const nextButton = document.createElement('button');
  nextButton.className = 'primary-button hidden';
  nextButton.type = 'button';
  nextButton.textContent = state.revealIndex === state.players.length - 1
    ? "Everyone's ready — Start!"
    : 'Next Player →';

  nextButton.addEventListener('click', () => {
    if (state.revealIndex === state.players.length - 1) {
      state.timeLeft = state.timerDuration;
      state.screen = 'game';
    } else {
      state.revealIndex += 1;
      state.revealedCurrent = false;
    }
    render();
  });

  actionArea.append(nextButton);

  function revealCard() {
    if (state.revealedCurrent) return;
    state.revealedCurrent = true;
    card.classList.add('is-flipped');
    nextButton.classList.remove('hidden');
  }

  card.addEventListener('click', revealCard);
  card.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  card.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    touchStart = null;

    if (deltaX > 30 || deltaY > 30) {
      revealCard();
    }
  }, { passive: true });

  screen.append(progress, prompt, name, card, actionArea);
  return screen;
}
