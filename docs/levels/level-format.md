# Level JSON Formatı — `tapwords-level/1` (taslak)

- Tarih / sürüm: 2026-11-05 / v1 taslak
- Alan: level-design + prototype; ADR-0005 teslimatı ("Unity yalnızca JSON okur")
- İlk örnek paket: `levels/test-levels-v01.json` (T00–T11, `docs/levels/param-tests-v01.md`)
- Durum: Unity loader yazılmadan önce ekiple gözden geçirilecek; alan adları değişebilir, yapı değişmez.

## İlkeler

- Tahta **tamamen** pakette: harf ızgarası, her yerleşimin hücreleri, dolgu hücreleri. Unity'de generator yok (ADR-0005), yalnızca şema + tutarlılık doğrulaması.
- Bir level tek dil içindir (`lang`); TR ve EN ayrı paket (ADR-0006).
- Mekanik parametreleri (`cols, rows, per, lives, hints`) **level içinde** taşınır; global sabit yok. Zorluk eğrisi parametre tablosu değil, level satırı değiştirir.
- Koordinatlar `[row, col]`, 0 tabanlı, sol üst köşe `[0,0]`. Satır-major.

## Paket

```json
{
  "format": "tapwords-level/1",
  "package": "param-tests-v01",
  "lang": "tr",
  "generatedAt": "2026-11-05",
  "source": "test-levels.js (seed 20261105)",
  "design": "docs/levels/param-tests-v01.md",
  "schema": "docs/levels/level-format.md",
  "constants": { "wordCount": 6, "lives": 5, "hints": 3, "fillAlphabet": "tr-frequency" },
  "levels": [ … ]
}
```

| Alan | Tip | Anlam |
|---|---|---|
| `format` | string | Şema sürümü. Loader tanımadığı sürümü reddeder. |
| `package` | string | Paket adı (ana akış `main-tr-v01`, daily `daily-tr-2026-11`, test `param-tests-v01`). |
| `lang` | `"tr"` \| `"en"` | Paketin dili; level içindeki `lang` ile aynı olmalı. |
| `constants` | object | Bilgi amaçlı; loader **level alanlarını** okur, bunu değil. |
| `levels` | array | Sıralı level listesi. |

## Level

```json
{
  "id": "T00", "index": 51, "lang": "tr", "tier": "test", "series": "taban",
  "cols": 17, "rows": 18, "per": 5, "lives": 5, "hints": 3,
  "words": ["KALEM", "SİLGİ", "KİTAP", "TAHTA", "SINIF", "ÇANTA"],
  "grid": ["TAHTALTYAŞİÖEÖHEÇ", "AKSINIFAĞUİİSKGEÇ", …],
  "placements": [
    { "word": "KALEM", "wordIndex": 0, "row": 5, "col": 7, "dir": "E", "dr": 0, "dc": 1,
      "cells": [[5,7],[5,8],[5,9],[5,10],[5,11]] },
    …
  ],
  "fill": [[0,5],[0,6], …],
  "meta": { "theme": "Okul", "targetCells": 150, "fillCells": 156, "ratio": 0.49,
            "reversedShare": 0.23, "diagonalShare": 0.40, "seed": 20261107 }
}
```

| Alan | Tip | Anlam / kural |
|---|---|---|
| `id` | string | Paket içinde tekil. Ana akışta `"L0001"` biçimi önerilir; testte `T00`. |
| `index` | int | Oyuncuya gösterilen level numarası (1 tabanlı). Prototipte 50 ana level + test → 51…62. |
| `lang` | string | Kelimelerin dili. |
| `tier` | string | Zorluk kademesi (`F R N H S`, `funnel-v01.md` tier seti) veya `"test"`. Loader kullanmaz; analitik ve event seçimi için. Funnel paketinde paket düzeyinde `sequence` (tier dizisi) de bulunur. |
| `series` | string? | Yalnızca test paketlerinde: hangi parametre serisi. |
| `cols`, `rows` | int | Tahta boyutu. `grid.length === rows`, her satır `cols` karakter. |
| `per` | int | Her kelimenin kopya sayısı. `placements` içinde her `wordIndex` tam `per` kez geçer. (Netleşenler'deki "kelimeye göre değişen kopya" gelirse `per` yerine `copies[]` dizisi eklenir; `per` o zaman kaldırılır.) |
| `lives`, `hints` | int | Level içi can ve ipucu. ADR-0004 → 3 can (funnel paketi); test paketinde 5. |
| `noDiagCross` | bool? | `true` → tahtada SE ve SW çaprazlar görsel X yapmaz (generator kuralı, `param-tests-v02.md`). Loader kullanmaz; üretim bilgisi. Yoksa `false`. |
| `fillMode` | string | Dolgu alfabesi modu (`param-tests-v03.md`): `freq` TR harf frekansı (varsayılan) · `disjoint` yalnızca hedef kelimelerde geçmeyen harfler · `target` yalnızca hedef kelimelerin harfleri (hedefteki frekansla) · `bigram` hedef kelimelerde geçen ikililerle zincirlenmiş hedef harfleri. Loader kullanmaz; üretim bilgisi. |
| `reversedWeight` | float? | Generator'a verilen ters yazım olasılığı (0–1). Yoksa 0,20 (ileri 4 : ters 1). Gerçekleşen pay `meta.reversedShare`. |
| `diagonalWeight` | float? | Generator'a verilen çapraz eksen olasılığı (0–1). Yoksa 0,5 (dört eksen eşit). `0` → yalnızca yatay/dikey (FTUE L1–2, `funnel-v01.md`). Gerçekleşen pay `meta.diagonalShare`. |
| `words` | string[] | Chip sırası. Büyük harf, dilin kendi büyük harfleri (`İ`, `I`). Palindrom yok; hiçbir kelime (veya tersi) başka bir kelimenin alt dizisi değil (generator kısıtı, `mechanic.md`). |
| `grid` | string[] | `rows` adet satır; her satır `cols` adet **Unicode karakter** (UTF-16 code unit değil; Unity'de `StringInfo`/`EnumerateRunes` ile sayılmalı). |
| `placements[]` | object[] | Her kopya bir kayıt. `word` ve `wordIndex` ikisi de var (okunabilirlik + hız). `row/col` ilk harf; `dir` 8 yön (`E S SE SW W N NW NE`), `dr/dc` aynı bilginin sayısal hali; `cells` her harfin koordinatı, kelime sırasıyla. **Yerleşimler kesişmez**: bir hücre en fazla bir yerleşime aittir. |
| `fill[]` | [int,int][] | Hiçbir yerleşime ait olmayan hücreler (dokununca can gider). `fill.length + Σ cells.length === cols × rows`. |
| `meta.targetCells` | int | Σ `cells.length`. |
| `meta.fillCells` | int | `fill.length`. |
| `meta.ratio` | float | `targetCells / (cols × rows)` — hedef hücre oranı `p`. |
| `meta.D` | float | İlk zorluk indeksi `Y × (1 − p)`, Y = `placements.length` (ADR-0008 ilk hali). Karşılaştırma için tutulur. |
| `meta.D2` | float | **Geçerli zorluk indeksi** `K × (1 + 0,5·(per − 1)) × (1 − p)` (ADR-0008 rev. 12 Kas). Tier doğrulaması bununla. |
| `meta.xCross` | int | Görsel X yapan çapraz yerleşim çifti sayısı. `noDiagCross: true` ise 0. |
| `meta.reversedShare` | float | Ters yazılı (`W N NW NE`) yerleşim payı. |
| `meta.diagonalShare` | float | Çapraz yerleşim payı. |
| `meta.fillOverlap` | float? | Hedef kelimelerde geçen bir harfi taşıyan dolgu hücresi / tüm dolgu (#23). `disjoint` → 0, `target`/`bigram` → 1. |
| `meta.fillSpecial` | float? | Özel harf (İŞĞÇÖÜ) taşıyan dolgu hücresi payı (#24). |
| `meta.wordSpecial` | float? | Kelime listesindeki özel harf payı (#17). |
| `meta.theme` | string | Tema etiketi (ekranda gösterilen). |
| `meta.seed` | int | Üretim seed'i; yalnızca yeniden üretilebilirlik için. |

## Loader doğrulaması (Unity, yükleme anında)

1. `format` tanınıyor; `lang` paketle eşleşiyor.
2. `grid` boyutu `rows × cols` (karakter bazlı sayım).
3. Her `placements[].cells[i]` tahta içinde; `grid[r][c] === word[i]`.
4. Hücre sahipliği tekil; `fill` ile yerleşim hücreleri ayrık ve birleşimleri tüm tahta.
5. Her `wordIndex` için kopya sayısı `per`.
6. Tahtada hedef kelimeler **yalnızca** planlı yerleşimlerde geçer (8 yön tarama) — generator'ın kaza temizliği bunu garanti eder; loader'da opsiyonel (debug build).

Hata → level atlanmaz, paket reddedilir (üretim hatası, oyuncu hatası değil).

## Prototip ile ilişki

Prototip (`index.html`) hâlâ kompakt formatı okur (`levels.js`, `test-levels.js`: `letters` düz dizi + `p = [wordIdx, startIdx, dr, dc]`). Bu JSON ondan türetilir: `node tools/bake.js pack test-levels.js <paket-adı> > levels/<dosya>.json` (2026-11-11'den itibaren; `tools/bake.js` ADR-0005'in offline generator'ıdır: `validate`, `bake`, `pack`, `check` modları). İki kaynak aynı seed'den geldiği için tahtalar birebir aynıdır. Paketler: `levels/test-levels-v01.json` (T00–T11), `levels/test-levels-v02.json` (T00–T11 + T09X, T12–T15), `levels/test-levels-v03.json` (öncekiler + T00b, T16–T22; `fillMode`, `reversedWeight`, `meta.fillOverlap/fillSpecial/wordSpecial` ile), **`levels/funnel-v01.json`** (ana akış L1–30, `node tools/bake.js funnel tools/funnel-v01.json > funnel-levels.js` → `pack funnel-levels.js funnel-v01`; can 3, `tier`, `diagonalWeight`, paket `sequence`).

## Açık noktalar

- Kopya sayısı kelimeye göre değişince (`uncertainties.md#netleşenler`) `per` → `copies[]`.
- Event/daily alanları (`meta.event`, `meta.date`) /liveops spec'inden sonra eklenir.
- Dosya boyutu: 12 test levelı 114 KB (girintili). Ana akış 50 level ≈ 500 KB; sıkıştırılmış (`.json.gz`) veya `cells` atılıp `row/col/dir`'den türetilen kompakt varyant düşünülebilir — Unity ekibinin tercihi.
