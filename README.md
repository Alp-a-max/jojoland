# JoJo's Bizarre Gallery görselleri

Galeri JPEG görsellerini kullanır; `picture` içindeki WebP kaynakları tarayıcı desteklediğinde tercih edilir. Mevcut JPEG/PNG dosyaları için WebP türevleri oluşturuldu. Görselleri değiştirir veya yenilerini eklerseniz ImageMagick kuruluysa proje kökünde PowerShell ile türevleri yeniden oluşturabilirsiniz:

```powershell
Get-ChildItem .\images -File | Where-Object { $_.Extension -in '.jpg', '.png' } | ForEach-Object {
  magick $_.FullName -quality 82 (Join-Path $_.DirectoryName ($_.BaseName + '.webp'))
}
```

Daha sonra mevcut `<source srcset="images/ad.webp" type="image/webp">` satırları çıktıları otomatik kullanır; JPEG/PNG dosyaları geri dönüş olarak kalır. İsteğe bağlı AVIF üretimi için `magick input.jpg -quality 55 output.avif` kullanıp AVIF'i WebP kaynağından önce ekleyin.

Hero kapağı `images/hero-cover.png` yolunu bekler. Şu an dosya, CSS zemini ve halftone dokusunu görünür tutan 1×1 şeffaf PNG yer tutucusudur. Gerçek kapak görseliyle değiştirdiğinizde komutu yeniden çalıştırarak `hero-cover.webp` dosyasını da güncelleyin; yerleşim yüksekliği değişmez.