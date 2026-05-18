import { state, getPlayerRole } from '../state.js';

export function RevealScreen({ render }) {
  const player = state.players[state.revealIndex];
  const role = getPlayerRole(player);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let touchStart = null;

  // Local state for the 4-state logic: 'init', 'word', 'hint', 'hidden'
  let cardState = 'init';

  const screen = document.createElement('section');
  screen.className = 'screen reveal-screen';

  const progress = document.createElement('div');
  progress.className = 'pass-label';
  progress.textContent = 'Pass the phone to';

  const name = document.createElement('h1');
  name.className = 'current-player gradient-text';
  name.textContent = player;

  const card = document.createElement('button');
  card.className = 'flip-card';
  card.type = 'button';
  card.setAttribute('aria-label', 'Reveal card');

  const inner = document.createElement('div');
  inner.className = 'flip-card-inner';

  const front = document.createElement('div');
  front.className = 'flip-card-face flip-card-front';

  const frontContent = document.createElement('div');
  frontContent.className = 'card-content';
  frontContent.innerHTML = `
    <div class="card-corner-tl"></div>
    <div class="card-corner-br"></div>
    <div class="card-scanlines"></div>
    <span class="material-symbols-outlined front-icon" style="font-size: 64px; color: var(--s-primary);">visibility</span>
    <p class="instruction-text front-text">TAP TO REVEAL YOUR ROLE</p>
  `;

  const frontGlow = document.createElement('div');
  frontGlow.className = 'card-glow';
  front.append(frontGlow, frontContent);

  const back = document.createElement('div');
  back.className = 'flip-card-face flip-card-back';

  const backContent = document.createElement('div');
  backContent.className = 'card-content';
  backContent.style.borderColor = 'var(--s-primary)';
  
  const backLabel = document.createElement('span');
  backLabel.className = 'role-label pass-label';

  const hintLabel = document.createElement('span');
  hintLabel.className = 'role-label pass-label';
  hintLabel.style.marginTop = '16px';
  hintLabel.style.display = 'none';

  const backWord = document.createElement('h2');
  backWord.className = 'font-archivo';
  backWord.style.cssText = 'font-size: 32px; color: var(--s-primary); text-transform: uppercase; margin: 16px 0;';

  const backInstruction = document.createElement('p');
  backInstruction.className = 'instruction-text';

  backContent.innerHTML = `
    <div class="card-corner-tl"></div>
    <div class="card-corner-br"></div>
    <div class="card-scanlines"></div>
  `;
  backContent.append(backLabel, hintLabel, backWord, backInstruction);

  const backGlow = document.createElement('div');
  backGlow.className = 'card-glow';
  back.append(backGlow, backContent);

  inner.append(front, back);
  card.append(inner);

  const actionArea = document.createElement('footer');
  actionArea.className = 'reveal-actions';

  const nextButton = document.createElement('button');
  nextButton.className = 'primary-button hidden';
  nextButton.type = 'button';
  nextButton.textContent = state.revealIndex === state.players.length - 1
    ? "START GAME"
    : 'NEXT PLAYER';

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

  const updateCardDOM = () => {
    const frontIcon = front.querySelector('.front-icon');
    const frontText = front.querySelector('.front-text');

    if (cardState === 'init') {
      card.classList.remove('is-flipped');
      frontIcon.textContent = 'visibility';
      frontText.textContent = 'TAP TO REVEAL YOUR ROLE';
      nextButton.classList.add('hidden');
    } else if (cardState === 'word') {
      card.classList.add('is-flipped');
      if (role.type === 'impostor') {
        backLabel.classList.remove('pass-label');
        backLabel.innerHTML = '<div class="font-archivo" style="text-align: center; line-height: 1.1; text-transform: uppercase;"><span style="font-size: 24px; opacity: 1;">YOU ARE THE</span><br><span style="color: #ef4647; font-size: 44px; letter-spacing: 2px;">IMPOSTER</span></div>';
        if (state.impostorMode === 'hint') {
          hintLabel.style.display = 'block';
          hintLabel.textContent = 'YOUR HINT IS';
          backWord.textContent = role.text;
          backWord.className = 'font-archivo';
        } else if (state.impostorMode === 'similar') {
          hintLabel.style.display = 'block';
          hintLabel.textContent = 'SIMILAR WORD';
          backWord.textContent = role.text;
          backWord.className = 'font-archivo';
        } else {
          hintLabel.style.display = 'none';
          backWord.textContent = 'YOU GOT NOTHING';
          backWord.className = 'font-archivo impostor-word';
        }
        backInstruction.textContent = 'TAP TO HIDE';
      } else {
        backLabel.classList.add('pass-label');
        backLabel.textContent = 'THE WORD IS';
        hintLabel.style.display = 'none';
        backWord.textContent = role.text;
        backWord.className = 'font-archivo';
        backInstruction.textContent = 'TAP TO HIDE';
      }
      nextButton.classList.add('hidden');
    } else if (cardState === 'hidden') {
      card.classList.remove('is-flipped');
      frontIcon.textContent = 'check_circle';
      frontText.textContent = 'STATUS: HIDDEN / TAP TO PASS';
      nextButton.classList.remove('hidden');
    }
  };

  function handleInteraction() {
    if (cardState === 'init') {
      cardState = 'word';
    } else if (cardState === 'word') {
      cardState = 'hidden';
    } else if (cardState === 'hidden') {
      // reveal again
      cardState = 'word';
    }
    state.revealedCurrent = true;
    updateCardDOM();
  }

  card.addEventListener('click', handleInteraction);
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
      handleInteraction();
    }
  }, { passive: true });

  updateCardDOM();
  screen.append(progress, name, card, actionArea);
  return screen;
}
