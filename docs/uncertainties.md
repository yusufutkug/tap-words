# Belirsizlikler

Tarih: 2026-10-26 · Durum: Utku ile üzerinden geçiliyor. Karar verilen satır buradan düşer, ADR'ye gider.

## Netleşenler (Utku notları, 26 Ekim)

- **Fail state var.** Can mekaniği olacak; sayısı/ekonomisi sonra (E1).
- **Leveller önceden üretilmiş** (pre-baked), runtime generator değil.
- **PER sabit değil:** chip alanına tek satırda sığacak kadar kelime; her kelimenin kaç kopyası olduğu kelimeye göre değişir. Prototipte denenir.
- **Harfler gider:** bulunan kelimenin harfleri tahtadan kalkar.
- **Pan/zoom kalır.**
- **Yanlış dokunuş kalıcı işaretlenir** (Amaze GO! kalıbı).
- Dil/pazar: Utku halleder. Oturum/level süresi: yolda deneyerek.
- FTUE, level sonu ekranı detayı, kutlama/ses detayı: şimdinin konusu değil.

## Açık belirsizlikler

### Gameplay UX

- **Kelime listesi**: tek satır (üstte) — kelime adı ve sayaç gösterilir?
- **Booster'lar**: kaç tane, hangileri, HUD'da nerede.-rüzgar vb other word games
- **Banner altı UI**: alt banner varken alt bölge düzeni; referans ekran görüntüsü yok (Amaze GO! L1'den banner, WSE L10–13'ten).

### Gameplay features

- **Göz yormayan / base mod**: dolgu harflerini sönükleştirme bir ayar mı, booster mı? Ayar olursa zorluk çöker; yorumum booster veya "rahat mod". amaze go genel referans
- **Modifier'lar ne zaman başlar** (gizli kelime, tema, zamanlı): WSE ilk 65 level tek tip; yorumum soft launch sonrası.

### Level

- **Funnel modeli**: sabit merdiven (WSE) mi, tier ritmi + havuz (Amaze GO!) mi? curve-v02 tier modelini öneriyor. search it?
- **Board size seti**: WSE 36/42/56/72/90; 
- **Harf gürültüsü / dolgu oranı**: WSE %22–27 (cezasız), prototip %48. Can riskini doğrudan belirler.
- **Kelime sayısı ve kopya dağılımı**: chip tek satır sınırıyla kaç kelime; kopya sayısı nasıl dağılır.
- **Tema/association**: tema adı gösterilir mi; gizli tema ileri level kaldıracı mı?
- **Yön oranları**: ters/çapraz ne zaman açılır. WSE verisi net (L35'e kadar yok, sonra dönüşümlü). Ters yazım TR'de hiç olsun mu?
- **Tahtada başka kelimelerle zorluk**: kasıtlı yakın kelime (KAR/KART) tuzak mı, bonus mu? Pillar 3 ile gerilimli.

### Ekonomi

- **Coin olacak mı?** WSE coin'li, Amaze GO! coin'siz (hint sayaç + RV). Booster sayısı ve "RV ile mi" kararından türemeli.
- **Can ekonomisi**: level başına sıfırlanır mı (Amaze GO!), enerji gibi dolar mı, satın alınır mı?
- **Ödüller ve fiyatlar**: level kazanç ödülü, booster fiyatı, günlük bedava akış — coin kararından sonra.

### Monetizasyon

- **Booster RV ile mi, coin ile mi, ikisi de mi?**
- **Fail'de play-on**: RV mi coin mi, kaç kez. Amaze GO! RV revive.
- **Interstitial**: başlangıç leveli (Amaze GO! L4–14, WSE L24) ve frekans (Amaze GO! cooldown 30–60 s, oturumla azalan).
- **Banner başlangıç leveli**: Amaze GO! L1, WSE L10–13. Alan L1'den ayrılmış (ADR-0002).
- **Remove Ads** IAP ve fiyatı (WSE 5,99 $).

### LiveOps

- **Çıkışta must event seti**: yorumum minimum Daily + streak, bir ilerleme metası (harita/albüm), bir periyodik yarış.-wheel-rewarded box- 
- **Daily konsepti**: ayrı tahta mı, farklı kural mı (tek can, gizli kelime), ödül.
- **Meta/ilerleme**: harita (WSE destinasyon), koleksiyon, galeri?

### Ekranlar

- **Ekran envanteri**: ana, harita/level seçimi, gameplay, sonuç, fail, shop (coin'e bağlı), daily, event, ayarlar.
- **Ana ekran yoğunluğu**: tek Play mi, event kartları mı (Amaze GO! "quiet" ana ekran).

### Eklediklerim

- **Prototipin sınırı**: hangi deneyler HTML'de (PER dağılımı, dolgu oranı, feedback), hangileri doğrudan spec'e.
- **Unity'ye teslim formatı**: level JSON şeması, parametre tablosu, remote config / A/B parametre listesi (iki referans de her kaldıracı uzaktan ayarlıyor).

## Bağımlılık

```
booster sayısı ──► RV mi coin mi ──► coin var mı ──► shop ekranı, ödüller
can sayısı (E1) ──► can ekonomisi ──► play-on
pre-baked ──► funnel modeli, daily, teslim formatı
```

## Önerilen sıra

1. Booster sayısı → RV/coin → coin (üçü bir oturum).
2. Can sayısı ve ekonomisi (E1).
3. Funnel modeli + board size (pan/zoom kaldığına göre revize).
4. Must event seti + ekran envanteri.

