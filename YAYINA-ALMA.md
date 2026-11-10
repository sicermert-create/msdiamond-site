# Ms. Diamond — Cloudflare ile Yayına Alma

Alan adı: **www.msdiamondnevsehir.com** · Barındırma: **Cloudflare Workers (ücretsiz)**
GitHub deposu: **github.com/sicermert-create/msdiamond-site**

## Proje yapısı
- `public/` — sitenin kendisi (sayfalar, fotoğraflar, içerik, yönetim paneli)
- `src/worker.js` — yönetim paneli için GitHub girişi (`/api/auth`, `/api/callback`)
- `wrangler.jsonc` — Cloudflare ayarları
- Bu `.md` dosyaları sitede yayınlanmaz.

GitHub'a her yükleme (veya panelden her "Yayınla") Cloudflare'de otomatik yeni sürüm başlatır.

## 1. Cloudflare Worker (yapıldı)
- **Workers & Pages → msdiamond-site** projesi GitHub deposuna bağlı.
- Build command: *boş* · Deploy command: `npx wrangler deploy` · Root directory: `/`
- Site önce `msdiamond-site.<hesap>.workers.dev` adresinde açılır.

## 2. Alan adı
1. **Domain Registration → Register Domains** → `msdiamondnevsehir.com` satın alın.
2. **Workers & Pages → msdiamond-site → Settings → Domains & Routes → Add → Custom domain**:
   - `www.msdiamondnevsehir.com` ekleyin.
   - `msdiamondnevsehir.com` (www'siz) adresini de ekleyin.
3. www'siz adresi www'ye yönlendirmek için: alan adının sayfasında
   **Rules → Redirect Rules → Create rule → "Redirect from Root to WWW"** şablonunu seçin.
4. HTTPS sertifikası otomatik gelir (birkaç dakika – 1 saat).

## 3. Yönetim paneli (GitHub ile giriş)
1. GitHub'da (sicermert-create hesabıyla) **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `Ms. Diamond Panel`
   - Homepage URL: `https://www.msdiamondnevsehir.com`
   - Authorization callback URL: `https://www.msdiamondnevsehir.com/api/callback`
2. Oluşan **Client ID**'yi kopyalayın, **Generate a new client secret** ile gizli anahtarı alın.
3. Cloudflare'de **Workers & Pages → msdiamond-site → Settings → Variables and Secrets → Add**:
   - `GITHUB_CLIENT_ID` = Client ID (tür: Text)
   - `GITHUB_CLIENT_SECRET` = Client secret (tür: **Secret**)
4. **Deploy** ile kaydedin.
5. `https://www.msdiamondnevsehir.com/admin` → **GitHub ile giriş**.
6. Salon sahibinin de girebilmesi için GitHub'da depo **Settings → Collaborators** bölümünden
   onun GitHub hesabını ekleyin.

> Panel girişini alan adı bağlanmadan önce denemek isterseniz OAuth App'teki iki adresi geçici olarak
> `workers.dev` adresinize göre yazın (callback: `https://…workers.dev/api/callback`).

## 4. Randevu e-postası (isteğe bağlı)
1. https://web3forms.com adresine salonun e-postasını yazın, gelen **Access Key**'i kopyalayın.
2. Panelde **İletişim ve Çalışma Saatleri → Randevu e-posta anahtarı** alanına yapıştırıp yayınlayın.

## 5. Yayından sonra
- **Google Search Console**'a siteyi ekleyip `https://www.msdiamondnevsehir.com/sitemap.xml` gönderin.
- **Google İşletme Profili**'nde web sitesi alanına yeni adresi yazın.
- Instagram biyografisine site bağlantısını ekleyin.

## Bilgisayarda çalıştırma (geliştirici için)
```bash
npx wrangler dev
```
