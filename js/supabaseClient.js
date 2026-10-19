const supabaseUrl = 'https://pqshgibkxezqorxeqzmw.supabase.co';
const supabasePublishableKey = 'sb_publishable_mjBmSToEXhygldGf9bPqhQ_j2yxOiI3';

if (!window.supabase) {
  throw new Error('Supabase SDK 未加载。');
}

window.supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);
