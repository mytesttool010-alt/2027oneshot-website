async function recordVisit() {
  const output = document.querySelector('[data-visit-count]');
  if (!output || !window.supabaseClient) return;

  try {
    const { data, error } = await window.supabaseClient.rpc('increment_page_views');
    if (error) throw error;
    output.textContent = new Intl.NumberFormat('zh-CN').format(data);
  } catch (error) {
    output.textContent = '—';
    console.warn('访问量统计暂不可用：', error.message);
  }
}

recordVisit();
