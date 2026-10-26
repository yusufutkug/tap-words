---
name: analyze-reference-game
description: Bir referans/rakip oyunu Tap Words için standart formatta analiz eder ve docs/references/<oyun>.md dosyasını üretir. Rakip oyun incelemesi, benchmark, "X oyunu nasıl yapıyor" sorularında veya /market-research çalışırken kullanılır.
---

# Referans Oyun Analizi

Çıktı: `docs/references/<oyun-adi>.md` (küçük harf, tire). Aşağıdaki şablonun **tüm başlıkları** dosyada bulunur; bilgi yoksa başlık silinmez, altına "Veri yok" ve ne lazım olduğu yazılır. Diğer agent'lar bu başlıklara `#` ile referans verdiği için başlık adları değiştirilmez.

## Akış

1. `docs/references/raw/<oyun-adi>/` klasörünü oku; yoksa web kaynaklarıyla ilerle ve "Eksik veri"ye not düş.
2. `docs/game/mechanic.md` ve `docs/game/pillars.md`'yi oku (uyarlanabilirlik için).
3. Şablonu doldur. Her iddiaya kaynak ekle.
4. `docs/references/README.md` dizin tablosuna satır ekle.
5. `docs/open-questions.md`'de bu oyunla ilgili soru varsa cevapla ve taşı.

## Şablon

```markdown
# <Oyun Adı>

- Geliştirici / yayıncı:
- Platform, çıkış yılı:
- Tür ve alt tür:
- Neden referans: (Tap Words'ün hangi sorusuna cevap olması bekleniyor)
- Kaynaklar: (raw dosyalar, URL'ler, playtest notu)
- Analiz tarihi:

## Core loop
Tek paragraf + adım listesi. Oyuncu ne yapar, ne alır, ne zaman durur.

## Level yapısı
Level verisi neyi içerir (grid, kelime sayısı, hedef, süre), level nasıl bitiyor, yıldız/puan var mı, tekrar oynama var mı.

## Zorluk eğrisi
İlk 10 / 50 / 200 level nasıl değişiyor; hangi kaldıraçlar oynuyor; "duvar" levellar nerede; bilinen fail rate hedefleri. Sayı ver, mümkünse tablo.

## UX kalıpları
Input (tap/drag), feedback zinciri, HUD, level sonu ekranı, onboarding/FTUE, hata durumu, kamera. Ekran görüntüsü referansı varsa dosya adı.

## Meta ve ilerleme
Harita, dünya, koleksiyon, bina, hikâye; neyin kilidi ne zaman açılıyor.

## Event takvimi
Event tipleri, süreleri, tekrar sıklığı, modifier'ları, ödülleri. Yıllık/haftalık ritim biliniyorsa yaz.

## Ekonomi
Kaynaklar (can, coin, ipucu, booster), kazanım ve harcama noktaları, günlük bedava akış, enerji sistemi.

## Monetizasyon
IAP yapısı, reklam yerleşimleri (rewarded, interstitial), pass/abonelik, agresiflik seviyesi (yumuşak/orta/sert).

## Retention mekanizmaları
Streak, günlük görev, geri çağırma, sosyal.

## Bize uyarlanabilirlik
Tablo: `Kalıp | Aynen / Değiştirerek / Alınmaz | Neden (pillar referansı) | Hangi agent'ı ilgilendirir`

## Eksik veri
Hangi başlık zayıf, hangi malzeme gelirse güçlenir (ör. "level 20–40 arası gameplay videosu", "event config dosyası").
```

## Kalite kontrol

- Her başlık dolu veya "Veri yok + ne lazım".
- "Bize uyarlanabilirlik" tablosunda en az 5 satır.
- Tahmin olan yerler "(tahmin)" ile işaretli.
- README dizini güncellendi.
