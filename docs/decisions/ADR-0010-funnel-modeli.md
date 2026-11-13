# ADR-0010: Funnel modeli — Amaze GO! kalıbı: tier dizisi + tier parametre seti + tema havuzu; elle level tablosu yok

- Tarih: 2026-11-13
- Durum: **Taslak** (prototip playtest L1–30, 3 can sonrası Kabul; K1 "funnel kararı")
- Alan: levels, prototype, liveops
- Kaynak öneri: `docs/levels/funnel-v01.md`; `docs/levels/curve-v03.md`; `docs/levels/param-tests-v03-results.md`; Utku: "kafamda direkt Amaze GO modeli vardı"

## Karar

Level dizisi üç veriden üretilir, level numarasına içerik elle yazılmaz: **(1)** periyodik tier dizisi — ilk 10 `F R N N H R H R N S`, sonra `R N H R N H R N N S` döngüsü; **(2)** tier parametre seti — F 12×17 K4 p 0,54 `disjoint` · R 14×19 K5 p 0,49–0,53 · N 15×21 K6 p 0,46–0,48 · H 15×21 K6 4–5 harf p 0,38–0,41 özel ≤ %10 · S 16×23 K7 4–5 harf p 0,38–0,42 `bigram` özel ≤ %10; PER 5, can 3 (ADR-0004), ters 0,20 sabit (band yok), çapraz nominal %50; **(3)** tier etiketli kelime listesi havuzu — level kendi tier'ının havuzundan sıradaki listeyi alır. FTUE override: L1 çapraz 0 + ters 0, L2 çapraz 0. Üretim offline (`tools/bake.js funnel`, ADR-0005); Unity sıralı paketi okur, runtime tier seçimi yapmaz.

## Gerekçe

- Amaze GO! (ADR-0001 sadelik referansı) 21.763 tahtayı level → tier → havuz ile dağıtıyor; sabit merdiveni yok; her 50 levelda hard+ sayısı sabit. İçerik (havuz) ve ritim (dizi) ayrıldığı için funnel uzatmak kürasyon işidir, tasarım işi değil.
- Keşif setleri (v01–v03) hangi parametrelerin tier'a bağlanacağını kanıtladı: p ve K (ADR-0008), grid (ADR-0009), dolgu modu (v03: `disjoint` −50 %, `bigram` +15–24 %) ve özel harf oranı (v03: %40 → −45 %). Ters yazım (v03: ±9 %), PER ≤ 3 ve X kesişme (v02) bağlanmaz.
- curve-v03'ün 30 levelı bu kurallarla birebir yeniden üretildi (aynı tier dizisi, aynı listeler) — elle tablo kaybolmadı, kuralın ilk çıktısı oldu.

## Reddedilen seçenekler

- **Sabit merdiven (WSE):** her level elle, kademeli zorlaşma. 100+ level için her levelda karar; WSE'nin kendisi de tier içi parametreleri (`hwp`) kalıpla açıyor. Ölçeklenmez.
- **İlk 50 elle, sonrası havuz:** iki üretim yolu, iki doğrulama; "elle" kısım zaten dizi + havuzla aynı çıktıyı veriyor.
- **Dinamik zorluk havuzları (Amaze Dyn T1–T4):** backend yok; RC ile tier bant ucu seçimi yeterli (soft launch sonrası).
- **Ters yazımı tier kaldıracı yapmak (WSE `hwp`):** v03'te etkisiz.

## Sonuçlar

- `/prototype` (yapıldı, 13 Kas): `funnel-levels.js` ana akış (L1–30, can 3), eski 50 level "Arşiv", `diag`/`lives`/`tier` level alanları, log'a `tier`, `D2`, `lives`, `diag`.
- `levels/funnel-v01.json` Unity paketi; `level-format.md`'ye `tier` (F/R/N/H/S), `diagonalWeight`, `lives` 3.
- `/level-design`: 100 level için 70 yeni liste (R 21, N 29, H 14, S 7); Çiftlik ve Masallar özel harf ≤ %10'a kürate edilir.
- `/liveops`: ComeBack kuralı, RC alanları, Daily Challenge D₂ hedefi (`funnel-v01.md#özel-havuzlar`).
- `/ux`: L3 çapraz coach'u, L1 `disjoint` görünümü, tier sinyali (#18b).
- Ölçüm: `funnel-v01.md#ölçüm` — c 0,08–0,13; ilk-deneme kazanma F/R ≥ 0,98 · N ≥ 0,93 · H ≥ 0,85 · S ≥ 0,78; L10 fail ≤ %25. Playtest sonucu bu ADR'yi Kabul'e çevirir veya tier setini revize eder.
- `curve-v03.md` artık funnel'ın ilk 30 levelının referans tablosudur; yeni level oraya eklenmez, havuza eklenir.
