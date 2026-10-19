const DEFAULT_NICKNAME = 'TheWorldMa';
const COOLDOWN_MS = 10_000;

function createMessageCard({ nickname, content, created_at: createdAt }) {
  const card = document.createElement('article');
  card.className = 'glass-card p-5 sm:p-6';
  const header = document.createElement('div');
  header.className = 'flex flex-wrap items-center justify-between gap-2';
  const name = document.createElement('h3');
  name.className = 'font-bold text-lamp';
  name.textContent = nickname || DEFAULT_NICKNAME;
  const time = document.createElement('time');
  time.className = 'text-xs text-slate-400';
  time.dateTime = createdAt;
  time.textContent = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai' }).format(new Date(createdAt));
  const text = document.createElement('p');
  text.className = 'mt-4 whitespace-pre-wrap break-words leading-7 text-slate-100';
  text.textContent = content;
  header.append(name, time);
  card.append(header, text);
  return card;
}

function setFormMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.remove('hidden', 'text-emerald-300', 'text-rose-300');
  element.classList.add(isError ? 'text-rose-300' : 'text-emerald-300');
}

function setButtonCooldown(button) {
  const expiresAt = Date.now() + COOLDOWN_MS;
  button.disabled = true;
  const tick = () => {
    const seconds = Math.ceil((expiresAt - Date.now()) / 1_000);
    if (seconds <= 0) { button.disabled = false; button.textContent = '点亮留言'; return; }
    button.textContent = `${seconds} 秒后可再次留言`;
    window.setTimeout(tick, 250);
  };
  tick();
}

async function fetchComments() {
  const { data, error } = await window.supabaseClient.from('comments').select('id, nickname, content, created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function submitComment({ nickname, content }) {
  const cleanContent = content.trim();
  const cleanNickname = nickname.trim() || DEFAULT_NICKNAME;
  if (!cleanContent) throw new Error('请先写下留言内容。');
  if (cleanContent.length > 200) throw new Error('留言不能超过 200 个字符。');
  const { error } = await window.supabaseClient.from('comments').insert({ nickname: cleanNickname.slice(0, 50), content: cleanContent });
  if (error) throw error;
}

window.initComments = async function initComments() {
  const form = document.querySelector('[data-comment-form]');
  const list = document.querySelector('[data-comment-list]');
  if (!form || !list) return;
  const button = form.querySelector('button[type="submit"]');
  const message = form.querySelector('[data-form-message]');
  const showComments = async () => {
    list.replaceChildren();
    try {
      const comments = await fetchComments();
      if (!comments.length) {
        const empty = document.createElement('div');
        empty.className = 'rounded-2xl border border-dashed border-white/20 bg-slate-950/20 px-6 py-10 text-center text-slate-400';
        empty.textContent = '还没有留言，来点亮第一盏灯吧。';
        list.append(empty);
        return;
      }
      comments.forEach((comment) => list.append(createMessageCard(comment)));
    } catch (error) {
      const failure = document.createElement('div');
      failure.className = 'rounded-2xl border border-rose-300/30 bg-rose-950/20 px-6 py-6 text-center text-rose-200';
      failure.textContent = `暂时无法加载留言：${error.message}`;
      list.append(failure);
    }
  };
  await showComments();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    const formData = new FormData(form);
    button.disabled = true;
    button.textContent = '正在点亮…';
    try {
      await submitComment({ nickname: String(formData.get('nickname') || ''), content: String(formData.get('content') || '') });
      form.reset();
      document.querySelector('[data-character-count]').textContent = '0';
      await showComments();
      setFormMessage(message, '留言已点亮，感谢你的祝福！');
      setButtonCooldown(button);
    } catch (error) {
      setFormMessage(message, error.message || '提交失败，请稍后重试。', true);
      button.disabled = false;
      button.textContent = '点亮留言';
    }
  });
};
