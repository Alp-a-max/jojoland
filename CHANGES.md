# Değişiklikler

## Yapılanlar

- `jojosite.html` baştan düzenlendi: SEO/OG/Twitter metaverileri, tema rengi, favicon, canonical placeholder ve erken tema uygulaması eklendi.
- Galeri içeriği statik HTML’de tutuluyor. Bu, stand adı/açıklaması/kullanıcı/yetenek/stat bilgileri için tek kaynak; aynı veriyi tekrar eden `data.js` oluşturulmadı.
- `script.js` tema, filtre, SVG radar, lightbox, scroll kontrolleri, görsel hata durumu ve animasyonları ayrı fonksiyonlarla yönetiyor. Statik içerik CDN/JavaScript olmadan görünür kalıyor.
- Tema localStorage’da saklanıyor; okuma/yazma try/catch içinde. Tercih yoksa işletim sistemi teması kullanılıyor. Safe-area boşlukları yalnızca nav ve footer gibi ihtiyaç duyan öğelerde.
- Hero ve galeri görsellerinde ölçü, async decode ve `<picture>` WebP kaynağı var. Hero yüksek öncelikli; galeri görselleri lazy-load. Dört stand görselinin WebP türevleri oluşturuldu; JPEG kaynaklar geri dönüş olarak duruyor. `images/hero-cover.png` ve WebP türevi, gerçek kapak eklenene kadar şeffaf placeholder.
- Stand kartlarında hata halinde görünen dosya etiketi, Türkçe stat adları/erişilebilir adlar, dereceye göre renkler, altıgen radar SVG, Part filtresi ve klavye ile açılan native dialog var.
- Yukarı çık ve ilerleme kontrolleri, skip link, odak halkaları, dialog içinde odak yönetimi ve reduced-motion desteği eklendi.
- Stand panellerinin gölgesi `filter` yerine kliplenmiş pseudo-element ile yapılıyor. Kullanılmayan `.inset`, `.rv`, `.ph svg`, `.c1` stilleri kaldırıldı. Kalıcı `will-change` kullanılmıyor.
- GSAP ve ScrollTrigger CDN dosyalarına indirilen sabit 3.12.5 sürümlerinin SHA-384 SRI hash'leri ve `crossorigin` eklendi.

## Doğrulanan Stand parametreleri

Sıra: Güç, Hız, Menzil, Dayanıklılık, Hassasiyet, Potansiyel.

- D4C: A, A, C, A, A, A.
- Killer Queen: A, B, D, B, B, A. Önceki dizide Hız, Menzil ve Dayanıklılık değerleri yanlıştı.
- Scary Monsters: B, B, D, A, C, B. Önceki dizide birden fazla değer yanlıştı.
- Whitesnake: ?, D, ?, A, ?, ?. Bilinmeyen değerleri tahmin etmedim.

Kaynaklar: [D4C](https://jojowiki.com/Dirty_Deeds_Done_Dirt_Cheap), [Killer Queen](https://jojowiki.com/Killer_Queen), [Scary Monsters](https://jojowiki.com/Scary_Monsters), [Whitesnake](https://jojowiki.com/Whitesnake), [Stand Parameters](https://jojowiki.com/Stand_Parameters). Wiki parametre tablosundaki sıralamayı esas aldım.

## Tarayıcı kontrolü

Edge headless ile 375×812, 768×1024 ve 1440×900 ölçülerinin her birinde light/dark sistem teması ve reduced-motion açık/kapalı olarak kontrol edildi. 12 görünümün tamamında belge yatay taşmadı; hero yüksekliği viewport ile eşleşti. Filtre, kart tıklaması, dialog dış alan tıklaması, Escape, Enter/Space, odak tuzağı/iadesi, tema kalıcılığı ve tema düğmesi kontrolleri geçti. Son testte konsol/istek hatası görülmedi. Görseller WebP kaynaklarından yüklendi.

## Elle doldurulacak placeholder'lar

- `jojosite.html` içindeki canonical ve `og:url`: gerçek alan adı.
- `og:image`: yayındaki hero kapağının mutlak URL'si.
- GitHub ve Instagram bağlantıları: `TODO` URL'lerini değiştirin.
- Görsel kaynak/lisans satırı: gerçek kaynak bilgilerini girin.
- Gerçek hero kapağı: şeffaf `images/hero-cover.png` dosyasını değiştirin ve `README.md` komutuyla WebP'yi yenileyin.