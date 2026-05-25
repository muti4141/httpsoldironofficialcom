## Mevcut Durum

Site `oldironofficial.com` üzerinde canlı. Şunlar **çalışıyor**:
- Ürün vitrini (`/shop`), ürün detay, sepet, checkout (Stripe Embedded), sipariş onay sayfası
- Auth, hesap sayfası, sipariş tabloları (orders / order_items)
- Stripe **sandbox** modunda (test ödemeleri)

## Eksikler ve Sıralı Plan

Sırayla aşağıdaki adımları yapacağım. Her adım sonrası onay vermen gerekmez — peş peşe ilerlerim, takıldığım yerde sorarım.

### 1. Yasal sayfalar (Almanya/AB zorunlu — bunlar olmadan satış yapmak yasal değil)
- `/impressum` — şirket bilgileri, vergi no, iletişim
- `/agb` — Genel İşlem Koşulları
- `/widerruf` — Cüzdan/iade hakkı (14 gün)
- `/datenschutz` — KVKK/GDPR aydınlatma
- `/versand` — Kargo & ödeme bilgileri
- Footer'a linkler

→ **Senden ihtiyacım:** Impressum için: tam adın/şirket adın, adres, telefon, e-mail, varsa USt-IdNr (vergi no), ticaret sicil no. Bunları verirsen direkt doldururum, vermezsen `[TODO: ...]` placeholder bırakırım.

### 2. Cookie / GDPR banner
Sade bir consent banner (Accept / Reject / Settings). Analytics/pixel eklendiğinde devreye girecek.

### 3. SEO temizliği
- Her route için unique title + meta description (zaten kısmen var, eksikleri tamamlanacak)
- `robots.txt`, `sitemap.xml` (var ama gözden geçirilecek)
- Open Graph/Twitter resimleri ürün sayfalarına

### 4. Sipariş yönetimi (admin)
- `/admin/orders` — sadece sen görebileceksin (user_roles + admin kontrolü)
- Sipariş listesi, detay, durum güncelleme (pending → paid → shipped → delivered)

### 5. Email bildirimleri
- Müşteriye sipariş onay maili (Resend zaten kurulu)
- Sana yeni sipariş bildirimi (`ADMIN_ORDER_EMAIL` zaten secret olarak var)

### 6. Stripe Live'a geçiş
- Şu an sandbox. Lovable Cloud → Payments → Go Live akışını birlikte yapacağız.
- Vergi handling konusunu o aşamada sana soracağım (full compliance +3.5% vs sadece hesaplama +0.5% vs hiç).

### 7. (Opsiyonel) Ürünleri veritabanına taşıma
Şu an ürünler kodda. Kodda kalması da sorun değil (8 ürün için OK). Sürekli ürün ekleyip çıkaracaksan DB'ye taşırız + admin UI.

## Şimdi başlıyorum: **Adım 1 (yasal sayfalar)** ile.

Aşağıdaki bilgileri yaz (eksik olanları placeholder bırakırım, sonra düzenlersin):

1. Şirket/işletme tam adı:
2. Adres (sokak, no, posta kodu, şehir):
3. Telefon:
4. İletişim e-mail (ör. info@oldironofficial.com):
5. USt-IdNr / vergi no (varsa):
6. Handelsregister no (varsa, ticaret sicil):
7. Sorumlu kişi adı (Almanya'da §55 RStV gereği):

Cevabını yazana kadar diğer adımlara (cookie banner, SEO, admin paneli) başlayabilirim. Onları paralel kuracağım, sen Impressum bilgilerini iletince doldururum.