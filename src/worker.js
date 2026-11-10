// Ms. Diamond Coiffure — Cloudflare Worker
// - /api/auth, /api/callback : yönetim paneli (Decap CMS) için GitHub girişi
// - geri kalan her şey       : public/ klasöründeki site dosyaları
// Gerekli değişkenler (Worker > Settings > Variables and Secrets):
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

const STATE_COOKIE = 'msd_oauth_state';

function authStart(request, env) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID tanımlı değil (Worker > Settings > Variables and Secrets).', { status: 500 });
  }
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', 'repo,user');
  authorize.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store'
    }
  });
}

function resultPage(status, content) {
  const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  return new Response(`<!doctype html><html lang="tr"><body><p>Giriş tamamlanıyor…</p><script>
(function () {
  function receive(e) {
    window.opener.postMessage(${payload}, e.origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function () { window.close(); }, 400);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': `${STATE_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
    }
  });
}

async function authCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const saved = (cookie.match(new RegExp(`(?:^|;\\s*)${STATE_COOKIE}=([^;]+)`)) || [])[1];
  if (!code || !state || !saved || state !== saved) {
    return resultPage('error', { message: 'Geçersiz giriş isteği. Lütfen tekrar deneyin.' });
  }
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'msdiamond-cms' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    return resultPage('error', { message: data.error_description || 'GitHub girişi başarısız oldu.' });
  }
  return resultPage('success', { token: data.access_token, provider: 'github' });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (request.method === 'GET' && pathname === '/api/auth') return authStart(request, env);
    if (request.method === 'GET' && pathname === '/api/callback') return authCallback(request, env);
    return env.ASSETS.fetch(request);
  }
};
