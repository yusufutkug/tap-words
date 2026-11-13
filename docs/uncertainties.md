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

## Netleşenler (Utku, 1 Kasım — planlama oturumu; ADR'ye yazıldı)

- **Ekonomi:** coin + shop, WSE kalıbı; booster coin + RV; çıkışta 2–4 booster, mevcut ipucu kalkar → ADR-0003.
- **Can:** genel can/enerji yok; level içi 3 can, her level sıfırlanır; play-on RV + coin; restart reklamsız → ADR-0004 (E1 kapandı).
- **Generator:** offline üretim, Unity yalnızca JSON okur; daily paketi tarih anahtarlı → ADR-0005 (#5 seed sorusu kapandı).
- **Dil:** TR + EN çıkış, altyapı 5 dile hazır → ADR-0006.
- **Çıkış event seti:** Daily Challenge, Daily Goals, Daily Rush (3 aşamalı merdiven, gün sonu sıfırlanır), coin mini-oyunu, haftalık kavanoz koleksiyonu (kelime bulununca +1, obje kalan kelimeye geçer, sınır yok) → ADR-0007.
- **Backend yok;** gerekirse bot/yalancı oyuncu kurgusu kabul. Bot turnuvası soft launch sonrası.
- **SDK:** Atiba. **Congrats/motivation katmanı** isteniyor, detayı sonra.
- **Funnel:** Amaze GO! modeli → ADR-0010 (taslak; playtest sonrası Kabul). **Dizi seçimi açık:** A Ritim (kontrol) / B Kademeli / C Dalgalı — 100'er level, `docs/levels/funnels-v01.md`; prototipte `?funnel=a|b|c`. **Main menu art direction:** karar bekliyor (K1, `docs/planning/execution-plan-v01.md`).

## Açık belirsizlikler

### Gameplay UX

- **Kelime listesi**: tek satır (üstte) — kelime adı ve sayaç gösterilir?
- **Booster'lar**: ~~kaç tane~~ (2–4, ADR-0003); hangileri ve HUD'da nerede — /gameplay önerisi bekleniyor (#20).
- **Banner altı UI**: alt banner varken alt bölge düzeni; referans ekran görüntüsü yok (Amaze GO! L1'den banner, WSE L10–13'ten).

### Gameplay features

- **Göz yormayan / base mod**: dolgu harflerini sönükleştirme bir ayar mı, booster mı? Ayar olursa zorluk çöker; yorumum booster veya "rahat mod". amaze go genel referans
- **Modifier'lar ne zaman başlar** (gizli kelime, tema, zamanlı): WSE ilk 65 level tek tip; yorumum soft launch sonrası.

### Level

- ~~**Funnel modeli**: sabit merdiven (WSE) mi, tier ritmi + havuz (Amaze GO!) mi?~~ → **Amaze GO! modeli** (Utku, 13 Kas): tier dizisi + tier parametre seti + tema havuzu; ADR-0010 taslak, prototip playtest (L1–30, 3 can) sonrası Kabul. `docs/levels/funnel-v01.md`.
- **Board size seti**: WSE 36/42/56/72/90; 
- **Harf gürültüsü / dolgu oranı**: WSE %22–27 (cezasız), prototip %48. Can riskini doğrudan belirler. → p artık tier kaldıracı (ADR-0008, 0,38–0,54); **dolgu alfabesi** de kaldıraç (v03: `disjoint` −50 %, `bigram` +15–24 %) → F `disjoint`, S `bigram` (ADR-0010 taslak).
- **Kelime sayısı ve kopya dağılımı**: chip tek satır sınırıyla kaç kelime; kopya sayısı nasıl dağılır.
- **Tema/association**: tema adı gösterilir mi; gizli tema ileri level kaldıracı mı?
- ~~**Yön oranları**: ters/çapraz ne zaman açılır.~~ → v03: ters yazım kaldıraç değil (±9 %), 0,20 sabit, L1'de 0; çapraz L1–2 kapalı, L3'ten nominal (`funnel-v01.md#kaldıraçların-giriş-sırası`).
- **Tahtada başka kelimelerle zorluk**: kasıtlı yakın kelime (KAR/KART) tuzak mı, bonus mu? Pillar 3 ile gerilimli.

### Ekonomi

- ~~Coin olacak mı?~~ → ADR-0003. ~~Can ekonomisi~~ → ADR-0004.
- **Ödüller ve fiyatlar**: level kazanç ödülü, booster fiyatı, play-on fiyatı, günlük bedava akış — /liveops ekonomi tablosu v1 (#21).

### Monetizasyon

- ~~Booster RV ile mi, coin ile mi~~ → ikisi de (ADR-0003). ~~Fail'de play-on~~ → RV + coin (ADR-0004); kaç kez: /liveops.
- **Interstitial**: başlangıç leveli (Amaze GO! L4–14, WSE L24) ve frekans (Amaze GO! cooldown 30–60 s, oturumla azalan).
- **Banner başlangıç leveli**: Amaze GO! L1, WSE L10–13. Alan L1'den ayrılmış (ADR-0002).
- **Remove Ads** IAP ve fiyatı (WSE 5,99 $).

### LiveOps

- ~~Çıkışta must event seti~~ → ADR-0007.
- **Daily Challenge kuralı**: normal tahta mı, farklı kural mı (tek can, gizli chip); açılış levelı (WSE L27, aday L10–15) — /liveops spec.
- **Meta/ilerleme**: harita (WSE destinasyon) çıkışta yok; level sayacı + event ödül yolları. Harita soft launch sonrası aday.

### Ekranlar

- ~~Ekran envanteri~~ → `docs/planning/execution-plan-v01.md` (Ekranlar epic'i + event ekranları).
- **Ana ekran hiyerarşisi**: Play + 2 event kartı görünür, 3 giriş ikincil şerit (öneri) — /ux (#23). **Art direction** karar bekliyor.

### Eklediklerim

- **Prototipin sınırı**: hangi deneyler HTML'de (PER dağılımı, dolgu oranı, feedback), hangileri doğrudan spec'e.
- **Unity'ye teslim formatı**: level JSON şeması, parametre tablosu, remote config / A/B parametre listesi (iki referans de her kaldıracı uzaktan ayarlıyor).

## Bağımlılık (1 Kasım sonrası kalanlar)

```
booster seti (hangi 2–4) ──► shop içeriği, booster fiyatları, HUD booster barı
funnel/PER/3 can playtest ──► ilk 50 level üretimi ──► Unity loader testi, daily paketi
main menu art direction ──► main menu görselleri ──► implementasyon (S2)
```

## Önerilen sıra

1. Booster seti (K1) — /gameplay öneri + /market-research booster referansı.
2. Funnel kararı (K1) — prototip playtest (3 can) + /level-design.
3. Main menu art direction (K1).
4. Ekonomi tablosu v1 + 5 event spec'i (K2).

