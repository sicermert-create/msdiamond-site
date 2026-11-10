# Ms. Diamond — Cloudflare ile Yayına Alma

Alan adı: **www.msdiamondnevsehir.com** · Barındırma: **Cloudflare Pages (ücretsiz)**
Toplam süre: yaklaşık 30 dakika.

## 1. Cloudflare hesabı ve alan adı
1. https://dash.cloudflare.com/sign-up adresinden ücretsiz hesap açın, e-postanızı doğrulayın.
2. Sol menü **Domain Registration → Register Domains** bölümüne `msdiamondnevsehir.com` yazın.
3. Satın alın (Cloudflare .com alan adlarını maliyet fiyatına, yıllık yaklaşık 10 $'a satar).
   Alan adı otomatik olarak Cloudflare DNS'ine eklenir, ayrıca DNS ayarı yapmanız gerekmez.

## 2. GitHub
1. https://github.com adresinden ücretsiz hesap açın.
2. **+ → New repository** · Ad: `msdiamond-site` · **Private** · **Create repository**.
3. Depo adresini (ör. `https://github.com/kullaniciadi/msdiamond-site`) Claude'a verin;
   dosyaları o yükleyecek. (İlk yüklemede tarayıcıda bir kez GitHub girişi onayı istenir.)

## 3. Cloudflare Pages
1. Cloudflare'de **Workers & Pages → Create → Pages → Connect to Git**.
2. GitHub hesabını bağlayın, `msdiamond-site` deposunu seçin.
3. Ayarlar:
   - Framework preset: **None**
   - Build command: *(boş bırakın)*
   - Build output directory: `/`
4. **Save and Deploy**. Site `msdiamond-site.pages.dev` adresinde yayına girer.
5. **Custom domains → Set up a custom domain** → `www.msdiamondnevsehir.com` ekleyin.
   Ardından `msdiamondnevsehir.com` (www'siz) adresini de ekleyin.
6. www'siz adresi www'ye yönlendirmek için: alan adının sayfasında
   **Rules → Redirect Rules → Create rule → "Redirect from root to WWW"** şablonunu seçin.

## 4. Yönetim paneli (GitHub ile giriş)
1. GitHub'da **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Application name: `Ms. Diamond Panel`
   - Homepage URL: `https://www.msdiamondnevsehir.com`
   - Authorization callback URL: `https://www.msdiamondnevsehir.com/api/callback`
2. Oluşan **Client ID**'yi kopyalayın, **Generate a new client secret** ile gizli anahtarı alın.
3. Cloudflare Pages projesinde **Settings → Variables and Secrets** bölümüne ekleyin:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client secret (**Encrypt** seçili)
4. **Deployments → en son sürüm → Retry deployment** ile yeniden yayınlayın.
5. `admin/config.yml` içindeki `repo: KULLANICI_ADI/msdiamond-site` satırı gerçek depo adıyla değiştirilir
   (Claude bunu depo adresini verdiğinizde yapar).
6. `https://www.msdiamondnevsehir.com/admin` → **GitHub ile giriş**.
7. Salon sahibinin de girebilmesi için GitHub'da depo **Settings → Collaborators** bölümünden
   onun GitHub hesabını ekleyin.

> Not: Callback adresi gerçek alan adına göre ayarlandığı için panel girişi alan adı bağlandıktan sonra çalışır.
> Önce `pages.dev` adresinde denemek isterseniz OAuth App'teki adresleri geçici olarak `https://msdiamond-site.pages.dev/...` yapın.

## 5. Randevu e-postası (isteğe bağlı)
1. https://web3forms.com adresine salonun e-postasını yazın, gelen **Access Key**'i kopyalayın.
2. Panelde **İletişim ve Çalışma Saatleri → Randevu e-posta anahtarı** alanına yapıştırıp yayınlayın.
   Her randevu bu e-postaya da gelir.

## 6. Yayından sonra
- **Google Search Console**'a siteyi ekleyip `https://www.msdiamondnevsehir.com/sitemap.xml` gönderin.
- **Google İşletme Profili**'nde web sitesi alanına yeni adresi yazın.
- Instagram biyografisine site bağlantısını ekleyin.
