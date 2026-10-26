# ADR-0002: Gameplay ekranında banner reklam

- Tarih: 2026-10-26
- Durum: Kabul
- Alan: ux, liveops, prototype
- Kaynak öneri: ana sohbet (Utku)

## Karar

Gameplay ekranında bir **banner reklam alanı** olacaktır. Bu bir ürün kısıtıdır; UX, HUD, tahta boyutu ve kamera tasarımı bu alan ayrılmış kabul edilerek yapılır.

Henüz kararlaştırılmayanlar (sonraki ADR'ler): bannerın konumu (alt/üst), yüksekliği, hangi levelden itibaren göründüğü, interstitial ile ilişkisi.

## Gerekçe

Word Search Explorer gibi uzun seanslı word search oyunlarının ana gelir modeli banner; bu alan sonradan eklenirse tahta/HUD yeniden tasarlanır. Baştan ayrılması daha ucuz.

## Reddedilen seçenekler

- Bannersız, sadece interstitial/rewarded — Utku'nun kararı banner yönünde; gerekçe LiveOps turunda detaylandırılır.

## Sonuçlar

- `/ux`: tüm ekran akışı ve HUD önerilerinde banner alanı varsayılan; mobil yerleşim hesaplarında standart banner yüksekliği (50 pt / adaptif ~50–90 pt) düşülür. Tahtanın görünür alanı buna göre küçülür; okunabilirlik analizi bu kısıtla yapılır.
- `/prototype`: prototipe banner yüksekliğinde bir placeholder eklenmesi önerilir ki tahta sığdırma (`fit()`) gerçek alanla test edilsin. Görev `docs/open-questions.md`'de.
- `/liveops`: bannerın hangi levelde başlayacağı ve interstitial zamanlaması Word Search Explorer referansıyla (banner ~L11–13, interstitial ~L24) önerilir.
- `/level-design`: tahta boyutu üst sınırı, banner düşülmüş ekran alanına göre hesaplanır.
