const pad = (value) => String(value).padStart(2, '0');

function startCountdown() {
  const countdown = document.querySelector('[data-countdown]');
  if (!countdown) return;
  const target = new Date(countdown.dataset.countdown).getTime();
  const message = document.querySelector('[data-countdown-message]');
  const update = () => {
    const remaining = Math.max(0, target - Date.now());
    const values = { days: Math.floor(remaining / 86_400_000), hours: Math.floor((remaining % 86_400_000) / 3_600_000), minutes: Math.floor((remaining % 3_600_000) / 60_000), seconds: Math.floor((remaining % 60_000) / 1_000) };
    Object.entries(values).forEach(([unit, value]) => { countdown.querySelector(`[data-unit="${unit}"]`).textContent = pad(value); });
    if (remaining === 0 && message) message.textContent = '拜年纪正在进行中，欢迎来到现场！';
  };
  update();
  window.setInterval(update, 1_000);
}

function bindCharacterCounter() {
  const content = document.querySelector('#content');
  const counter = document.querySelector('[data-character-count]');
  if (!content || !counter) return;
  const update = () => { counter.textContent = content.value.length; };
  content.addEventListener('input', update);
  update();
}

startCountdown();
bindCharacterCounter();
if (window.initComments) window.initComments();
