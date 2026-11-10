// Yönetim paneli (Decap CMS) — GitHub'dan dönen kodu erişim anahtarına çevirir
// ve paneli açan pencereye iletir.
const page = (status, content) => {
  const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  return new Response(`<!doctype html><html><body><p>Giriş tamamlanıyor…</p><script>
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
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'msd_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    }
  });
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const saved = (cookie.match(/(?:^|;\s*)msd_oauth_state=([^;]+)/) || [])[1];

  if (!code || !state || !saved || state !== saved) {
    return page('error', { message: 'Geçersiz giriş isteği. Lütfen tekrar deneyin.' });
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
    return page('error', { message: data.error_description || 'GitHub girişi başarısız oldu.' });
  }
  return page('success', { token: data.access_token, provider: 'github' });
}
