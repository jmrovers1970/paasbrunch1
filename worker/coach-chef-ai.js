// Coach & Chef — AI-tussenstation (Cloudflare Worker).
// De app stuurt AI-vragen hierheen met een uitnodigingscode; de Worker controleert de code en de maandlimiet
// en geeft de vraag door aan Anthropic met de sleutel die als geheim in Cloudflare staat.
// Nodig in Cloudflare (Settings › Variables and Secrets / Bindings):
//   geheim ANTHROPIC_KEY   = je Anthropic-sleutel
//   geheim ADMIN_PASSWORD  = wachtwoord voor de beheerpagina (/admin, inlogpagina)
//   KV-binding CODES       = opslag voor codes en gebruik
// Er staan geen sleutels in dit bestand.

const ORIGINS = ['https://jmrovers1970.github.io'];
const MODELS = /^claude-(sonnet|haiku|opus)-/;
const MAX_TOKENS = 16000;
const DEFAULT_LIMIT = 300; // aanvragen per code per maand

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return admin(req, env, url);
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, x-cc-code',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (url.pathname !== '/v1/messages' || req.method !== 'POST') return fail('Niet gevonden', 404, cors);
    if (!ORIGINS.includes(origin)) return fail('Niet toegestaan', 403, cors);

    const code = (req.headers.get('x-cc-code') || '').trim().toUpperCase();
    const rec = code ? await env.CODES.get('code:' + code, 'json') : null;
    if (!rec || !rec.actief) return fail('Ongeldige uitnodigingscode', 401, cors);
    const useKey = `use:${code}:${new Date().toISOString().slice(0, 7)}`;
    const used = Number(await env.CODES.get(useKey)) || 0;
    if (used >= (rec.limiet || DEFAULT_LIMIT)) return fail('Maandlimiet bereikt', 429, cors);

    let body;
    try { body = await req.json(); } catch { return fail('Ongeldig verzoek', 400, cors); }
    if (!MODELS.test(String(body.model || ''))) return fail('Model niet toegestaan', 400, cors);
    body.max_tokens = Math.min(Number(body.max_tokens) || 1000, MAX_TOKENS);
    await env.CODES.put(useKey, String(used + 1), { expirationTtl: 60 * 60 * 24 * 70 });

    const up = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body)
    });
    const headers = new Headers(cors);
    headers.set('content-type', up.headers.get('content-type') || 'application/json');
    return new Response(up.body, { status: up.status, headers });
  }
};

function fail(message, status, cors) {
  return new Response(JSON.stringify({ type: 'error', error: { message } }), { status, headers: { ...cors, 'content-type': 'application/json' } });
}

// Beheer: codes aanmaken, limiet zetten, intrekken, gebruik zien. Inloggen met ADMIN_PASSWORD via een gewone inlogpagina (cookie, alleen voor /admin).
const LOGIN_PAGE = (fout) => `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coach & Chef · inloggen</title>
<style>body{font:16px -apple-system,system-ui,sans-serif;margin:32px 16px;color:#22312a;background:#f6f6f1}form{max-width:360px;display:grid;gap:12px}input,button{font:inherit;padding:12px;border-radius:12px;border:1px solid #e3e8df}button{background:#d7f653;border:0;font-weight:600}</style>
<h1>Beheer</h1><form method="post" action="/admin/login"><input type="password" name="pw" placeholder="Wachtwoord" autocomplete="current-password" autofocus><button>Inloggen</button>${fout ? '<p>Wachtwoord klopt niet.</p>' : ''}</form>`;
async function admin(req, env, url) {
  if (!env.ADMIN_PASSWORD) return new Response('ADMIN_PASSWORD ontbreekt in de Worker (Settings › Variables and Secrets).', { status: 500 });
  const token = await sha(env.ADMIN_PASSWORD);
  if (url.pathname === '/admin/login' && req.method === 'POST') {
    const pw = String((await req.formData()).get('pw') || '');
    if (!(await same(pw, env.ADMIN_PASSWORD))) return new Response(LOGIN_PAGE(true), { status: 401, headers: { 'content-type': 'text/html; charset=utf-8' } });
    return new Response(null, { status: 303, headers: { Location: '/admin', 'Set-Cookie': `cc_admin=${token}; Path=/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000` } });
  }
  const cookie = (req.headers.get('Cookie') || '').match(/(?:^|;\s*)cc_admin=([a-f0-9]+)/)?.[1] || '';
  if (!(await same(cookie, token))) return new Response(LOGIN_PAGE(false), { status: 401, headers: { 'content-type': 'text/html; charset=utf-8' } });
  const month = new Date().toISOString().slice(0, 7);
  if (req.method === 'POST') {
    const form = await req.formData(), action = form.get('action');
    if (action === 'nieuw') {
      const code = makeCode();
      await env.CODES.put('code:' + code, JSON.stringify({ naam: String(form.get('naam') || '').slice(0, 60), limiet: Math.max(1, Number(form.get('limiet')) || DEFAULT_LIMIT), actief: true, gemaakt: new Date().toISOString().slice(0, 10) }));
    } else {
      const code = String(form.get('code') || '').toUpperCase(), rec = await env.CODES.get('code:' + code, 'json');
      if (rec && action === 'aan') { rec.actief = !rec.actief; await env.CODES.put('code:' + code, JSON.stringify(rec)); }
      if (rec && action === 'limiet') { rec.limiet = Math.max(1, Number(form.get('limiet')) || rec.limiet); await env.CODES.put('code:' + code, JSON.stringify(rec)); }
      if (rec && action === 'weg') await env.CODES.delete('code:' + code);
    }
    return new Response(null, { status: 303, headers: { Location: '/admin' } });
  }
  const list = await env.CODES.list({ prefix: 'code:' });
  const rows = [];
  for (const k of list.keys) {
    const code = k.name.slice(5), rec = await env.CODES.get(k.name, 'json') || {}, used = Number(await env.CODES.get(`use:${code}:${month}`)) || 0;
    rows.push(`<tr><td><b>${esc(code)}</b><br><small>${esc(rec.naam || '')}</small></td><td>${used} / ${rec.limiet}</td><td>${rec.actief ? 'Actief' : 'Uit'}</td><td>
      <form method="post"><input type="hidden" name="code" value="${esc(code)}"><input name="limiet" type="number" min="1" value="${rec.limiet}"><button name="action" value="limiet">Limiet</button>
      <button name="action" value="aan">${rec.actief ? 'Zet uit' : 'Zet aan'}</button><button name="action" value="weg" onclick="return confirm('Code ${esc(code)} verwijderen?')">Verwijder</button></form></td></tr>`);
  }
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coach & Chef · codes</title>
<style>body{font:16px -apple-system,system-ui,sans-serif;margin:16px;color:#22312a;background:#f6f6f1}table{border-collapse:collapse;width:100%;background:#fffffd}td,th{border-bottom:1px solid #e3e8df;padding:8px;text-align:left;vertical-align:top}input{font:inherit;padding:6px;width:110px}button{font:inherit;padding:6px 10px;margin:2px;border-radius:999px;border:1px solid #e3e8df;background:#fff}form.new{margin:16px 0;display:flex;gap:8px;flex-wrap:wrap}form.new button{background:#d7f653}</style>
<h1>Uitnodigingscodes</h1><p>Gebruik deze maand (${month}): aantal AI-aanvragen per code. Elke vraag aan Coach of Chef telt als één of enkele aanvragen.</p>
<form method="post" class="new"><input name="naam" placeholder="Voor wie?" style="width:180px"><input name="limiet" type="number" min="1" value="${DEFAULT_LIMIT}"><button name="action" value="nieuw">Nieuwe code</button></form>
<table><tr><th>Code</th><th>Gebruik</th><th>Status</th><th></th></tr>${rows.join('') || '<tr><td colspan="4">Nog geen codes.</td></tr>'}</table>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

function makeCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = crypto.getRandomValues(new Uint8Array(8));
  return [...b].map(x => abc[x % abc.length]).join('');
}
async function sha(s) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('cc-admin:' + s)))].map(b => b.toString(16).padStart(2, '0')).join(''); }
async function same(a, b) {
  const enc = new TextEncoder(), [x, y] = await Promise.all([a, b].map(s => crypto.subtle.digest('SHA-256', enc.encode(String(s)))));
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
