# Ms. Diamond — Yönetim Paneli Kullanımı

## Panele giriş
Sitenin adresinin sonuna `/admin` yazın: **https://www.msdiamondnevsehir.com/admin**
"GitHub ile giriş" düğmesine basın.

## Neler değiştirilebilir?
Panelde tek bir sayfa vardır: **Site İçeriği → Tüm Site İçeriği**

| Bölüm | Ne yapılır |
|---|---|
| Duyuru Şeridi | Sitenin en üstünde kampanya / tatil duyurusu (aç-kapa) |
| İletişim ve Çalışma Saatleri | WhatsApp, telefon, Instagram, saatler, açık günler, Google puanı ve yorum sayısı |
| Ana Fotoğraflar | Giriş, felsefe ve salon fotoğrafları; isteğe bağlı giriş videosu |
| Metinler | Ana başlık ve paragraflar (Türkçe + İngilizce) |
| Hizmetler | Hizmet ekleme, silme, sıralama, fotoğraf, açıklama ve isteğe bağlı fiyat |
| Önce / Sonra | Kaydırmalı karşılaştırma fotoğrafları (liste boşsa bölüm görünmez) |
| Ekibimiz | Ekip üyesi ekleme, fotoğraf, ünvan ve kısa tanıtım |
| Müşteri Yorumları | Sadece gerçek, izinli yorumlar (liste boşsa bölüm görünmez) |
| Lookbook Galerisi | Galeri fotoğrafları ekleme / silme |
| Sıkça Sorulan Sorular | Soru ekleme / düzenleme |

## Randevular nereye gelir?
- Form doldurulunca müşterinin telefonunda WhatsApp mesajı hazır açılır, müşteri gönderir.
- Panelde **İletişim > Randevu e-posta anahtarı** alanı doluysa aynı randevu salonun e-postasına da gönderilir.
  Anahtarı almak için https://web3forms.com adresine salonun e-postasını yazın; gelen anahtarı bu alana yapıştırın.
  (Ücretsiz plan ayda 250 randevuya kadar yeterli.)
- Randevu saatleri çalışma saatlerine göre otomatik oluşur; kapalı günler seçilemez.

## İpuçları
- Bir kelimeyi altın/italik yapmak için yıldız içine alın: `*elmas*`
- İngilizce alanları boş bırakırsanız sitede Türkçe metin gösterilir.
- Fotoğraf yüklerken dikey (portre) fotoğraflar en iyi sonucu verir.
- Değişiklikten sonra sağ üstteki **Yayınla → Şimdi yayımla** düğmesine basın.
  Site 1-2 dakika içinde güncellenir.

## Bilgisayarda deneme (geliştirici için)
```bash
npx decap-server
```
Ardından siteyi yerel bir sunucuyla açıp `/admin` adresine gidin.
