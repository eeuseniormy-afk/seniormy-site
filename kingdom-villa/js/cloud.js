/* Conta online (Supabase Auth + tabela kv_saves). Ativa só quando KV_CONFIG.supabaseUrl existe. */
const Nuvem = (() => {
  const cfg = window.KV_CONFIG || {};
  const ativo = !!(cfg.supabaseUrl && cfg.anonKey);
  let sessao = null;
  try { sessao = JSON.parse(localStorage.getItem('kv_sessao') || 'null'); } catch (e) {}

  const h = (auth) => ({ 'apikey': cfg.anonKey, 'Content-Type': 'application/json', ...(auth ? { 'Authorization': 'Bearer ' + sessao.access_token } : {}) });
  function guardar(s) { sessao = s; localStorage.setItem('kv_sessao', JSON.stringify(s)); }

  async function auth(caminho, corpo) {
    const r = await fetch(cfg.supabaseUrl + '/auth/v1/' + caminho, { method: 'POST', headers: h(false), body: JSON.stringify(corpo) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(traduzir(j.error_description || j.msg || j.message || 'Erro ' + r.status));
    return j;
  }
  function traduzir(m) {
    const t = {
      'Invalid login credentials': 'E-mail ou senha incorretos.',
      'User already registered': 'Este e-mail já tem conta. Entre com sua senha.',
      'Password should be at least 6 characters.': 'A senha precisa ter pelo menos 6 caracteres.',
      'Unable to validate email address: invalid format': 'E-mail inválido.',
      'Email not confirmed': 'Confirme seu e-mail antes de entrar.'
    };
    return t[m] || m;
  }
  async function entrar(email, senha) {
    const j = await auth('token?grant_type=password', { email, password: senha });
    guardar({ ...j, expira: Date.now() + j.expires_in * 1000 });
    return j.user;
  }
  async function criarConta(email, senha) {
    const j = await auth('signup', { email, password: senha });
    if (j.access_token) { guardar({ ...j, expira: Date.now() + j.expires_in * 1000 }); return j.user; }
    return entrar(email, senha);
  }
  async function renovar() {
    if (!sessao) return false;
    if (sessao.expira - Date.now() > 60000) return true;
    try { const j = await auth('token?grant_type=refresh_token', { refresh_token: sessao.refresh_token }); guardar({ ...j, expira: Date.now() + j.expires_in * 1000 }); return true; }
    catch (e) { sair(); return false; }
  }
  async function recuperar(email) { await auth('recover', { email }); }
  function sair() { sessao = null; localStorage.removeItem('kv_sessao'); }

  async function baixarSaves() {
    if (!ativo || !(await renovar())) return null;
    const r = await fetch(cfg.supabaseUrl + '/rest/v1/kv_saves?select=slot,data,updated_at', { headers: h(true) });
    if (!r.ok) return null;
    return r.json();
  }
  async function enviarSave(slot, data) {
    if (!ativo || !(await renovar())) return false;
    const r = await fetch(cfg.supabaseUrl + '/rest/v1/kv_saves?on_conflict=user_id,slot', {
      method: 'POST', headers: { ...h(true), 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ user_id: sessao.user.id, slot, data, updated_at: new Date().toISOString() })
    });
    return r.ok;
  }
  async function apagarSave(slot) {
    if (!ativo || !(await renovar())) return false;
    const r = await fetch(cfg.supabaseUrl + '/rest/v1/kv_saves?slot=eq.' + slot, { method: 'DELETE', headers: h(true) });
    return r.ok;
  }

  return { ativo, exigeLogin: ativo && cfg.requireLogin !== false, get logado() { return !!sessao; }, get email() { return sessao?.user?.email; },
    entrar, criarConta, recuperar, sair, renovar, baixarSaves, enviarSave, apagarSave };
})();
