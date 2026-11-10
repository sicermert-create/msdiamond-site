/* Ms. Diamond Coiffure — site script
   İçerik content/site.json dosyasından okunur (admin panelinden düzenlenir).
   Dosya okunamazsa sayfadaki varsayılan metinler kullanılır. */
(async () => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* ================= loader (starts immediately) ================= */
let lenis = null;
const seen = document.documentElement.classList.contains('seen');
try { localStorage.setItem('msd-seen', '1'); } catch (e) {}
const loaderDone = seen ? new Promise(res => setTimeout(res, 60)) : new Promise(res => {
  const c = $('#count'), bar = $('#bar'), t0 = performance.now(), dur = reduce ? 10 : 1700;
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    c.textContent = String(Math.round(e * 100)).padStart(3, '0'); bar.style.width = e * 100 + '%';
    if (p < 1) requestAnimationFrame(tick); else setTimeout(res, 250);
  };
  requestAnimationFrame(tick);
});

/* ================= content ================= */
let C = null;
try {
  const r = await fetch('content/site.json', { cache: 'no-cache' });
  if (r.ok) C = await r.json();
} catch (e) { /* varsayılan içerik kullanılır */ }

const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const md = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
const imgUrl = s => esc(s || '');

let WHATSAPP = "905412761120";
const tokens = [];   // [eski, yeni] metin değişimleri
if (C && C.contact) {
  const k = C.contact;
  if (k.whatsapp) { tokens.push(['905412761120', String(k.whatsapp).replace(/\D/g, '')]); WHATSAPP = String(k.whatsapp).replace(/\D/g, ''); }
  if (k.phone_display) tokens.push(['0541 276 11 20', k.phone_display]);
  if (k.instagram) tokens.push(['msdiamond_sercancevik', String(k.instagram).replace(/^@/, '')]);
  if (k.google_rating) tokens.push(['4,8', String(k.google_rating)]);
  if (k.google_reviews) tokens.push(['258', String(k.google_reviews)]);
}
const swap = s => tokens.reduce((acc, [a, b]) => acc.split(a).join(b), s);
if (tokens.length) {
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) { const v = swap(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  $$('a[href]').forEach(a => { const h = a.getAttribute('href'); const v = swap(h); if (v !== h) a.setAttribute('href', v); });
  const cntEl = $('[data-count]'); if (cntEl) cntEl.dataset.count = swap(cntEl.dataset.count);
  $$('[aria-label]').forEach(el => el.setAttribute('aria-label', swap(el.getAttribute('aria-label'))));
}
if (C && C.images) {
  if (C.images.hero) $('.arch img').src = C.images.hero;
  if (C.images.philosophy) $('.mani .pic img').src = C.images.philosophy;
  if (C.images.salon) $('.salon .ph img').src = C.images.salon;
}

/* ================= i18n (EN; TR is read from the page) ================= */
const EN = {
  skip:"Skip to content", view:"View", nav1:"Services", nav3:"Salon", nav4:"Book", nav5:"FAQ", nav6:"Team",
  heroK:"Haute Coiffure · Cappadocia", h1a:"Your hair,", h1b:"your most precious", h1c:"jewel.",
  heroP:"From cut to colour, from care to bridal styling, a women-only beauty experience where every detail is crafted with the precision of a diamond.",
  book:"Book Now", explore:"Explore Services", gReviews:"Google · 258 Reviews", scroll:"Scroll", heroHours:"Mon – Sat<br>until 19:30",
  marq:'<span class="f">Haircut</span><i>✦</i><span>Balayage</span><i>✦</i><span class="f">Keratin</span><i>✦</i><span>Bridal Hair</span><i>✦</i><span class="f">Make-up</span><i>✦</i><span>Manicure</span><i>✦</i>',
  philo:"Our Philosophy", maniK:"The Ms. Diamond Philosophy",
  maniW:"True beauty is like a <em>diamond</em>. It is revealed when shaped with patience and care, by the right hands. We begin by listening, then design what suits you best, <em>together</em>.",
  maniP1:"Ms. Diamond is a women-only hair and beauty salon in central Nevşehir, gateway to Cappadocia. Personal results tailored to your features, hair type and lifestyle.",
  maniP2:"Professional products, a hygienic space and an experienced team, so you leave feeling renewed, not just restyled.",
  svcK:"Service Menu", svcH:"Touches made <em class=\"gold\">for you</em>", svcP:"Every service begins with a short consultation. Tap a service to see the details.",
  bookThis:"Book This Service", priceNote:"Prices vary with hair length and treatment; ask us on WhatsApp.", askPrice:"Ask for Prices",
  lookH:"Inspiration <em class=\"gold\">gallery</em>", lookEnd:"You could be <em class=\"gold\">next</em>.",
  n1:"Google Rating", n2:"Reviews", n3:"Service Areas", n4:"Open Until",
  salonK:"Our Salon", salonH:"In the heart of the city, <em>a pause</em> of your own.",
  salonP:"We welcome you in a calm, airy and caring space on Milli İrade Avenue. Guests visiting Cappadocia are warmly welcome too.",
  addr:"Address", hours:"Hours", hoursV:"Monday – Saturday · 09:00 – 19:30", dir:"Get Directions",
  ritK:"The Diamond Experience", ritH:"Four steps to a <em class=\"gold\">flawless</em> result",
  r1h:"Consultation", r1p:"We listen to your wishes and suggest what suits your features and style.",
  r2h:"Analysis", r2p:"We assess your hair's structure and needs to choose the right products.",
  r3h:"Application", r3p:"Professional products and current techniques, never rushed.",
  r4h:"Aftercare", r4p:"Personal care tips so you can keep the result at home.",
  revK:"Google Reviews", revP:"Rated by 258 guests, we are one of Nevşehir's most loved beauty addresses. Read their experiences on Google.", revBtn:"Read Reviews",
  faqK:"FAQ", faqH:"Your <em>questions</em>", faqP:"Couldn't find your answer? Message us on WhatsApp.",
  bookK:"Booking", bookH:"Reserve <em class=\"gold\">your spot</em>",
  bookP:"Fill in the form and your request arrives on our WhatsApp as a ready message. Or write to us directly; we reply as soon as possible.",
  waLine:"WhatsApp Booking Line", phone:"Phone",
  fName:"Full Name", fTel:"Phone", fSvc:"Service", fDate:"Date", fTime:"Time", fNote:"Note",
  consent:'I have read the <a href="kvkk.html" target="_blank">Privacy Notice (KVKK)</a> and agree that my details are processed and sent via WhatsApp for this booking request.',
  baK:"Transformations", baH:"Before <em class=\"gold\">&amp; after</em>", baP:"Drag the line to see the difference.",
  send:"Send via WhatsApp", confirm:"Your appointment is confirmed once the salon replies.",
  fLead:"We are here to bring out <em class=\"gold\">your shine.</em>", fVisit:"Visit", fContact:"Contact", fHours:"Monday – Saturday<br>09:00 – 19:30",
  kvkk:"Privacy", top:"Back to Top ↑",
  teamK:"Our Team", teamH:"The hands behind <em class=\"gold\">the shine</em>", teamP:"At Ms. Diamond, every guest is welcomed personally by the salon's own stylists.",
  roleFounder:"Founder", igK:"Find Us on Instagram", igP:"Follow us for our latest work, colour transformations and bridal styles.", igBtn:"Follow"
};
for (const k in EN) EN[k] = swap(EN[k]);
const MSG = {
  tr:{ hi:"Merhaba, randevu almak istiyorum.", name:"Ad Soyad", tel:"Telefon", svc:"Hizmet", date:"Tarih", note:"Not",
       price:"Merhaba, hizmetleriniz ve fiyatlarınız hakkında bilgi almak istiyorum.", fill:"Lütfen ad, telefon, tarih ve saati doldurun.",
       consent:"Devam etmek için KVKK onay kutusunu işaretleyin.", sent:"WhatsApp açılıyor…", openNow:"Şu an açık", closed:"Şu an kapalı", locale:"tr-TR", ph:"İsteğe bağlı",
       pick:"Saat seçin", pickDate:"Önce tarih seçin", closedDay:"Seçtiğiniz gün kapalıyız, lütfen başka bir gün seçin.", full:"Bugün için uygun saat kalmadı, lütfen başka bir gün seçin.", before:"Önce", after:"Sonra" },
  en:{ hi:"Hello, I would like to book an appointment.", name:"Name", tel:"Phone", svc:"Service", date:"Date", note:"Note",
       price:"Hello, I would like information about your services and prices.", fill:"Please fill in name, phone, date and time.",
       consent:"Please tick the privacy consent box to continue.", sent:"Opening WhatsApp…", openNow:"Open now", closed:"Closed now", locale:"en-GB", ph:"Optional",
       pick:"Choose a time", pickDate:"Choose a date first", closedDay:"We are closed on that day, please choose another date.", full:"No times left today, please choose another date.", before:"Before", after:"After" }
};

// CMS: düzenlenebilir metinler ve saatler
if (C && C.texts) {
  const t = C.texts;
  for (const k in (t.tr || {})) { const el = $(`[data-i18n="${k}"]`); if (el && t.tr[k]) $$(`[data-i18n="${k}"]`).forEach(e => e.innerHTML = md(t.tr[k])); }
  for (const k in (t.en || {})) if (t.en[k]) EN[k] = md(t.en[k]);
}
if (C && C.contact) {
  const k = C.contact, br = s => esc(s).replace(/\s·\s/, '<br>');
  if (k.hours_tr) { $$('[data-i18n="hoursV"]').forEach(e => e.textContent = k.hours_tr); $$('[data-i18n="fHours"]').forEach(e => e.innerHTML = br(k.hours_tr)); }
  if (k.hours_en) { EN.hoursV = esc(k.hours_en); EN.fHours = br(k.hours_en); }
  if (k.close_time) {
    $$('[data-i18n="heroHours"]').forEach(e => e.innerHTML = e.innerHTML.replace(/\d{1,2}:\d{2}/, esc(k.close_time)));
    EN.heroHours = EN.heroHours.replace(/\d{1,2}:\d{2}/, esc(k.close_time));
    const nb = $('.ngrid > div:last-child b'); if (nb) nb.textContent = k.close_time;
  }
}

/* ================= lists rendered from content ================= */
const L = (o, f, l) => (o && (o[`${f}_${l}`] || o[`${f}_tr`])) || '';
const ICON_PLUS = '<svg width="20" height="20"><use href="#plus"/></svg>';
function renderServices(l) {
  if (!C || !Array.isArray(C.services) || !C.services.length) return false;
  $('#svc').innerHTML = C.services.map((s, i) => {
    const sub = L(s, 'subtitle', l), tags = (s[`tags_${l}`] && s[`tags_${l}`].length ? s[`tags_${l}`] : s.tags_tr) || [];
    return `<div class="item rv" data-img="${imgUrl(s.image)}">
      <button class="row" aria-expanded="false"><span class="no">${String(i + 1).padStart(2, '0')}</span><h3>${esc(L(s, 'title', l))}${sub ? ` <em>${esc(sub)}</em>` : ''}</h3><p>${esc(L(s, 'short', l))}</p><span class="arr">${ICON_PLUS}</span></button>
      <div class="detail"><div><div class="dgrid"><span></span><div class="dimg"><img loading="lazy" alt="" src="${imgUrl(s.image)}"></div><div class="dtx"><p>${md(L(s, 'detail', l))}</p>${L(s, 'price', l) ? `<span class="price">${esc(L(s, 'price', l))}</span>` : ''}<ul class="tags">${tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul><a class="btn" href="#randevu" data-svc="${i}">${l === 'en' ? EN.bookThis : 'Bu Hizmet İçin Randevu'}</a></div></div></div></div>
    </div>`;
  }).join('');
  $('#hizmet').innerHTML = C.services.map(s => { const sub = L(s, 'subtitle', l); return `<option>${esc(L(s, 'title', l) + (sub ? ' ' + sub : ''))}</option>`; }).join('');
  const n3 = $('.ngrid > div:nth-child(3) b'); if (n3) n3.textContent = String(C.services.length).padStart(2, '0');
  return true;
}
function renderGallery(l) {
  if (!C || !Array.isArray(C.gallery) || !C.gallery.length) return;
  const end = $('#ltrack .card.end');
  $$('#ltrack figure.card').forEach(f => f.remove());
  end.insertAdjacentHTML('beforebegin', C.gallery.map((g, i) =>
    `<figure class="card" data-view><div class="im"><img loading="lazy" src="${imgUrl(g.image)}" alt="${esc(L(g, 'caption', l))}"></div><figcaption class="cap"><b>${esc(L(g, 'caption', l))}</b><span>${String(i + 1).padStart(2, '0')}</span></figcaption></figure>`).join(''));
}
function renderFaq(l) {
  if (!C || !Array.isArray(C.faq) || !C.faq.length) return;
  $('.qa').innerHTML = C.faq.map(q =>
    `<div class="q"><button aria-expanded="false"><span>${esc(L(q, 'q', l))}</span><i></i></button><div class="a"><div><p>${md(L(q, 'a', l))}</p></div></div></div>`).join('');
}
const initials = n => String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toLocaleUpperCase('tr')).join('');
function renderTeam(l) {
  if (!C || !Array.isArray(C.team)) return;
  const sec = $('#ekip');
  if (!C.team.length) { sec.hidden = true; return; }
  sec.hidden = false;
  $('#team').innerHTML = C.team.map((m, i) => `<article class="member rv${i % 3 ? ' d' + (i % 3) : ''}">
    <div class="ph">${m.photo ? `<img loading="lazy" src="${imgUrl(m.photo)}" alt="${esc(m.name)}">` : `<span class="mono">${esc(initials(m.name))}</span>`}</div>
    <h3>${esc(m.name)}</h3>${L(m, 'role', l) ? `<span class="role">${esc(L(m, 'role', l))}</span>` : ''}${L(m, 'bio', l) ? `<p>${md(L(m, 'bio', l))}</p>` : ''}</article>`).join('');
}
let qTimer;
function renderQuotes(l) {
  const box = $('#quotes');
  const list = (C && Array.isArray(C.reviews)) ? C.reviews.filter(r => r && r.text) : [];
  clearInterval(qTimer);
  if (!list.length) { box.hidden = true; return; }
  box.hidden = false;
  $('#qtrack').innerHTML = list.map((r, i) => `<figure class="quote${i ? '' : ' on'}"><blockquote>${esc(r.text)}</blockquote><cite>${esc(r.author || '')}${r.source ? ' · ' + esc(r.source) : ''}</cite></figure>`).join('');
  const nav = $('#qnav');
  nav.innerHTML = list.length > 1 ? list.map((_, i) => `<button aria-label="${i + 1}" aria-current="${!i}"></button>`).join('') : '';
  let cur = 0;
  const show = i => {
    cur = i;
    $$('#qtrack .quote').forEach((q, j) => q.classList.toggle('on', j === i));
    $$('#qnav button').forEach((b, j) => b.setAttribute('aria-current', j === i));
  };
  $$('#qnav button').forEach((b, i) => b.onclick = () => { show(i); restart(); });
  const restart = () => { clearInterval(qTimer); if (list.length > 1 && !reduce) qTimer = setInterval(() => show((cur + 1) % list.length), 6500); };
  restart();
}
// hero video (optional)
if (C && C.images && C.images.hero_video && !reduce) {
  const v = document.createElement('video');
  Object.assign(v, { autoplay: true, muted: true, loop: true, playsInline: true, src: C.images.hero_video });
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
  if (C.images.hero) v.poster = C.images.hero;
  $('.arch .img').append(v);
}
// render once in TR so the page's TR text is captured correctly; mark rendered parts as non-i18n
if (C) {
  $$('#svc [data-i18n], #hizmet, #ltrack figure [data-i18n], .qa [data-i18n], #team [data-i18n]').forEach(e => e.removeAttribute('data-i18n'));
}

const TR = {};
$$('[data-i18n]').forEach(el => { if (!(el.dataset.i18n in TR)) TR[el.dataset.i18n] = el.innerHTML; });
let LANG = 'tr';

/* ================= helpers: split text ================= */
function splitHeading(h) {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.append(' '); return; }
        const o = document.createElement('span'); o.className = 'ch';
        const i = document.createElement('span'); i.textContent = w; o.append(i); frag.append(o);
      });
      n.replaceWith(frag);
    } else walk(n);
  });
  walk(h);
  h.querySelectorAll('.ch > span').forEach((s, i) => s.style.transitionDelay = i * 0.07 + 's');
}
let wEls = [];
function splitWords(el) {
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w || /^\s+$/.test(w)) { frag.append(w); return; }
        const s = document.createElement('span'); s.className = 'w'; s.textContent = w; frag.append(s);
      });
      n.replaceWith(frag);
    } else walk(n);
  });
  walk(el); wEls = [...el.querySelectorAll('.w')];
}
const words = $('#words');
const track = $('#track');

/* ---------- before / after ---------- */
function renderBA(l) {
  const sec = $('#donusum');
  const list = (C && Array.isArray(C.before_after)) ? C.before_after.filter(x => x && x.before && x.after) : [];
  if (!list.length) { sec.hidden = true; return; }
  sec.hidden = false;
  $('#baGrid').innerHTML = list.map((x, i) => `<figure class="cmp rv${i % 3 ? ' d' + (i % 3) : ''}">
    <div class="cmp-box"><img src="${imgUrl(x.after)}" alt="" loading="lazy"><div class="cmp-before"><img src="${imgUrl(x.before)}" alt="" loading="lazy"></div>
    <span class="cmp-tag b">${MSG[l].before}</span><span class="cmp-tag a">${MSG[l].after}</span>
    <span class="cmp-line"><i>‹ ›</i></span><input type="range" min="0" max="100" value="50" aria-label="${MSG[l].before} / ${MSG[l].after}"></div>
    ${L(x, 'caption', l) ? `<figcaption>${esc(L(x, 'caption', l))}</figcaption>` : ''}</figure>`).join('');
  $$('#baGrid .cmp-box input').forEach(inp => inp.addEventListener('input', () => inp.parentElement.style.setProperty('--p', inp.value + '%')));
}

/* ---------- announcement bar ---------- */
let annH = 0;
function renderAnn(l) {
  const a = C && C.announcement, bar = $('#ann');
  const text = a && a.enabled ? L(a, 'text', l) : '';
  let key = '';
  if (text) { let h = 0; for (const ch of (a.text_tr || text)) h = (h * 31 + ch.charCodeAt(0)) | 0; key = 'msd-ann-' + h; }
  let closed = false; try { closed = !!(key && localStorage.getItem(key)); } catch (e) {}
  if (!text || closed) { bar.hidden = true; annH = 0; document.documentElement.classList.remove('has-ann'); return; }
  const link = $('#annLink');
  link.textContent = text;
  link.href = a.link || '#randevu';
  if (/^https?:/.test(link.href) && !link.href.startsWith(location.origin)) { link.target = '_blank'; link.rel = 'noopener'; }
  bar.hidden = false; annH = 42; document.documentElement.classList.add('has-ann');
  $('#annX').onclick = () => {
    try { localStorage.setItem(key, '1'); } catch (e) {}
    bar.hidden = true; annH = 0; document.documentElement.classList.remove('has-ann'); onScroll();
  };
}

/* ---------- smart time slots ---------- */
function buildSlots() {
  const M = MSG[LANG], k = (C && C.contact) || {}, sel = $('#saat'), dateStr = $('#tarih').value;
  const toMin = (s, d) => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : d; };
  const open = toMin(k.open_time, 540), close = toMin(k.close_time, 1170);
  const days = (k.open_days || ['1', '2', '3', '4', '5', '6']).map(Number);
  const prev = sel.value;
  if (!dateStr) { sel.innerHTML = `<option value="">${M.pickDate}</option>`; return; }
  const d = new Date(dateStr + 'T12:00'), wd = d.getDay() === 0 ? 7 : d.getDay();
  if (!days.includes(wd)) { sel.innerHTML = `<option value="">${M.pickDate}</option>`; $('#tarih').value = ''; say(M.closedDay); return; }
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const today = now.toISOString ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` : '';
  const minStart = dateStr === today ? now.getHours() * 60 + now.getMinutes() + 30 : 0;
  const opts = [];
  for (let t = open; t <= close - 30; t += 30) if (t >= minStart) opts.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  if (!opts.length) { sel.innerHTML = `<option value="">${M.pickDate}</option>`; $('#tarih').value = ''; say(M.full); return; }
  sel.innerHTML = `<option value="">${M.pick}</option>` + opts.map(o => `<option${o === prev ? ' selected' : ''}>${o}</option>`).join('');
}

function setLang(l, first) {
  LANG = l;
  document.documentElement.lang = l;
  $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === l));
  const dict = l === 'en' ? EN : TR;
  if (!first || l !== 'tr') $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v !== undefined) el.innerHTML = v; });
  $('#not').placeholder = MSG[l].ph;
  const sel = $('#hizmet').selectedIndex;
  const hasSvc = renderServices(l); renderGallery(l); renderFaq(l); renderTeam(l); renderQuotes(l); renderBA(l); renderAnn(l);
  $('#dil').value = l;
  if (typeof say === 'function') buildSlots();
  if (hasSvc && sel > 0) $('#hizmet').selectedIndex = sel;
  if (!hasSvc && l === 'en') {
    // içerik dosyası yoksa sabit hizmet seçenekleri
    $('#hizmet').innerHTML = '<option>Cut &amp; Styling</option><option>Colour</option><option>Hair Care</option><option>Bridal &amp; Occasions</option><option>Make-up</option><option>Hands &amp; Feet</option>';
  }
  bindServices();
  if (!first) $$('#svc .rv, .qa .rv, #team .rv, #baGrid .rv').forEach(e => e.classList.add('in'));
  $$('[data-split]').forEach(h => { splitHeading(h); if (!first) h.classList.add('in'); });
  splitWords(words);
  track.innerHTML += track.innerHTML;
  document.title = l === 'en' ? 'Ms. Diamond Coiffure | Hair & Beauty Salon in Nevşehir, Cappadocia' : 'Ms. Diamond Coiffure | Nevşehir Kuaför & Güzellik Merkezi';
  $('#priceLink').href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG[l].price)}`;
  const hi = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG[l].hi)}`;
  $('#waCard').href = hi; $('#fab').href = hi;
  updateOpen();
  try { localStorage.setItem('msd-lang', l); } catch (e) {}
  if (!first) { sizeLook(); onScroll(); lenis && lenis.resize(); }
}
$$('[data-lang]').forEach(b => b.addEventListener('click', () => b.dataset.lang !== LANG && setLang(b.dataset.lang)));

/* ================= open now ================= */
function updateOpen() {
  const k = (C && C.contact) || {};
  const days = (k.open_days || ['1', '2', '3', '4', '5', '6']).map(Number);
  const toMin = (s, d) => { const m = /^(\d{1,2}):(\d{2})$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : d; };
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const d = now.getDay() === 0 ? 7 : now.getDay(), m = now.getHours() * 60 + now.getMinutes();
  const open = days.includes(d) && m >= toMin(k.open_time, 540) && m < toMin(k.close_time, 1170);
  const el = $('#openNow'); el.classList.toggle('on', open);
  el.querySelector('span').textContent = open ? MSG[LANG].openNow : MSG[LANG].closed;
}

/* ================= smooth scroll ================= */
if (!reduce && window.Lenis) {
  lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.stop();
  const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
function go(id) {
  const el = id === '#top' ? 0 : $(id); if (el === null) return;
  closeMenu();
  lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -40 }) : (el === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : el.scrollIntoView({ behavior: 'smooth' }));
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  e.preventDefault();
  if (a.dataset.svc) $('#hizmet').selectedIndex = +a.dataset.svc;
  go(a.getAttribute('href'));
});

/* ================= reveal ================= */
const pending = [];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12, rootMargin: '0px 0px -50px 0px' });

/* ================= counter ================= */
const cnt = $('[data-count]');
if (!reduce) {
  cnt.textContent = '0';
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    const end = +cnt.dataset.count, t0 = performance.now();
    const step = t => { const p = Math.min((t - t0) / 1800, 1); cnt.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }).observe(cnt);
}

/* ================= scroll-driven ================= */
const hdr = $('#hdr'), fab = $('#fab'), sprog = $('#sprog');
const lookSec = $('#lookbook'), ltrack = $('#ltrack'), lprog = $('#lprog');
const para = $$('[data-speed]');
let lastY = 0;
const isMobile = () => innerWidth <= 760;
function sizeLook() {
  if (isMobile()) { lookSec.style.height = ''; ltrack.style.transform = ''; return; }
  lookSec.style.height = (innerHeight + Math.max(ltrack.scrollWidth - innerWidth, 0)) + 'px';
}
function onScroll() {
  const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
  sprog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  document.documentElement.style.setProperty('--annt', Math.max(0, annH - y) + 'px');
  hdr.classList.toggle('scrolled', y > 40);
  hdr.classList.toggle('hide', y > lastY && y > 600 && !document.body.classList.contains('open'));
  fab.classList.toggle('on', y > vh * .6);
  lastY = y;

  for (let i = pending.length - 1; i >= 0; i--) {
    const el = pending[i], b = el.getBoundingClientRect();
    if (b.top < vh * .92 && b.bottom > 0) { el.classList.add('in'); io.unobserve(el); pending.splice(i, 1); }
    else if (el.classList.contains('in')) pending.splice(i, 1);
  }

  const r = words.getBoundingClientRect();
  const p = Math.min(Math.max((vh * .85 - r.top) / (r.height + vh * .35), 0), 1);
  const n = reduce ? wEls.length : Math.floor(p * wEls.length * 1.05);
  wEls.forEach((w, i) => w.classList.toggle('on', i < n));

  if (!isMobile()) {
    const sr = lookSec.getBoundingClientRect();
    const dist = ltrack.scrollWidth - innerWidth;
    const lp = Math.min(Math.max(-sr.top / (sr.height - vh), 0), 1);
    ltrack.style.transform = `translate3d(${-lp * dist}px,0,0)`;
    lprog.style.transform = `scaleX(${lp})`;
  }

  if (!reduce) para.forEach(img => {
    const b = img.parentElement.getBoundingClientRect();
    if (b.bottom < 0 || b.top > vh) return;
    img.style.translate = `0 ${(b.top + b.height / 2 - vh / 2) * +img.dataset.speed - b.height * .08}px`;
  });
}

/* ================= accordions (delegated) ================= */
const relayout = () => setTimeout(() => { lenis && lenis.resize(); sizeLook(); }, 950);
$('#svc').addEventListener('click', e => {
  const btn = e.target.closest('.row'); if (!btn) return;
  const item = btn.parentElement, open = !item.classList.contains('open');
  $$('#svc .item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.row').setAttribute('aria-expanded', 'false'); });
  item.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
  himg && himg.classList.remove('on');
  relayout();
});
$('.qa').addEventListener('click', e => {
  const b = e.target.closest('.q button'); if (!b) return;
  const q = b.parentElement, open = !q.classList.contains('open');
  q.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  relayout();
});

/* ================= cursor + hover image ================= */
const himg = $('#himg');
let hoverOn = false;
function bindServices() {
  if (!(fine && !reduce)) return;
  himg.innerHTML = '';
  const imgs = [];
  $$('#svc .item').forEach(item => {
    const im = new Image(); im.src = item.dataset.img; im.alt = ''; himg.append(im); imgs.push(im);
    const row = item.querySelector('.row');
    row.addEventListener('mouseenter', () => { if (item.classList.contains('open')) return; himg.classList.add('on'); imgs.forEach(i => i.classList.toggle('on', i === im)); });
    row.addEventListener('mouseleave', () => himg.classList.remove('on'));
  });
}
if (fine) {
  // Özel imleç yalnızca JS çalışınca görünür; sistem imleci her zaman görünür kalır.
  const root = document.documentElement;
  const cur = $('#cursor'), dot = $('#cdot');
  let mx = -100, my = -100, cx = mx, cy = my, hx = mx, hy = my;
  const k1 = reduce ? 1 : .18, k2 = reduce ? 1 : .1;
  root.classList.add('cc', 'cout');
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; root.classList.remove('cout'); dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
  document.addEventListener('mouseleave', () => root.classList.add('cout'));
  document.addEventListener('mouseenter', () => root.classList.remove('cout'));
  (function loop() {
    cx += (mx - cx) * k1; cy += (my - cy) * k1; hx += (mx - hx) * k2; hy += (my - hy) * k2;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    himg.style.left = hx + 'px'; himg.style.top = hy + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    cur.classList.toggle('hov', !!e.target.closest('a,button,input,select,textarea,label'));
    cur.classList.toggle('view', !!e.target.closest('[data-view]'));
  });
}

/* ================= menu ================= */
const burger = $('#burger');
function closeMenu() { document.body.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); }
burger.onclick = () => {
  const o = document.body.classList.toggle('open');
  burger.setAttribute('aria-expanded', o);
  lenis && (o ? lenis.stop() : lenis.start());
};
addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

/* ================= form -> WhatsApp ================= */
const toast = $('#toast'); let tt;
function say(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 3200); }
$('#yil').textContent = new Date().getFullYear();
{
  const n = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  $('#tarih').min = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}
$('#tarih').addEventListener('change', buildSlots);
buildSlots();
const isLocal = /^(localhost|127\.|\[::1\])/.test(location.hostname);
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target), M = MSG[LANG];
  if (f.get('bot-field')) return;
  if (!f.get('ad') || !f.get('tel') || !f.get('tarih') || !f.get('saat')) return say(M.fill);
  if (!$('#kvkk').checked) return say(M.consent);
  const gun = new Date(f.get('tarih') + 'T12:00').toLocaleDateString(M.locale, { day: 'numeric', month: 'long', weekday: 'long' });
  const lines = [M.hi, '', `${M.name}: ${f.get('ad')}`, `${M.tel}: ${f.get('tel')}`, `${M.svc}: ${f.get('hizmet')}`, `${M.date}: ${gun} · ${f.get('saat')}`];
  if (f.get('not')) lines.push(`${M.note}: ${f.get('not')}`);
  say(M.sent);
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  // Yedek kayıt: randevu salonun e-postasına da gönderilir (Web3Forms).
  // Anahtar panelden girilir (İletişim > Randevu e-posta anahtarı). Yerel testte gönderilmez.
  const formKey = C && C.contact && C.contact.form_key;
  if (formKey && !isLocal) {
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: formKey,
        subject: `Yeni randevu talebi: ${f.get('ad')} · ${gun} ${f.get('saat')}`,
        from_name: 'Ms. Diamond Web Sitesi',
        'Ad Soyad': f.get('ad'), 'Telefon': f.get('tel'), 'Hizmet': f.get('hizmet'),
        'Tarih': `${gun} · ${f.get('saat')}`, 'Not': f.get('not') || '-', 'Dil': LANG.toUpperCase()
      })
    }).catch(() => {});
  }
});

/* ================= PWA ================= */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

/* ================= init ================= */
let startLang = 'tr';
try { startLang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('msd-lang') || 'tr'; } catch (e) {}
setLang(startLang === 'en' ? 'en' : 'tr', true);
pending.push(...$$('.rv,.mask,.split'));
pending.forEach(el => io.observe(el));
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { sizeLook(); onScroll(); });
addEventListener('load', () => { sizeLook(); onScroll(); lenis && lenis.resize(); });
sizeLook(); onScroll();
setInterval(updateOpen, 60000);

await loaderDone;
document.body.classList.add('ready'); document.body.classList.remove('loading'); lenis && lenis.start();
})();
