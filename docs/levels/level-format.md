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
| `tier` | string | Zorluk kademesi (`F R N H S`, `curve-v02.md`) veya `"test"`. Loader kullanmaz; analitik ve event seçimi için. |
| `series` | string? | Yalnızca test paketlerinde: hangi parametre serisi. |
| `cols`, `rows` | int | Tahta boyutu. `grid.length === rows`, her satır `cols` karakter. |
| `per` | int | Her kelimenin kopya sayısı. `placements` içinde her `wordIndex` tam `per` kez geçer. (Netleşenler'deki "kelimeye göre değişen kopya" gelirse `per` yerine `copies[]` dizisi eklenir; `per` o zaman kaldırılır.) |
| `lives`, `hints` | int | Level içi can ve ipucu. ADR-0004 → 3 can; test paketinde 5. |
| `words` | string[] | Chip sırası. Büyük harf, dilin kendi büyük harfleri (`İ`, `I`). Palindrom yok; hiçbir kelime (veya tersi) başka bir kelimenin alt dizisi değil (generator kısıtı, `mechanic.md`). |
| `grid` | string[] | `rows` adet satır; her satır `cols` adet **Unicode karakter** (UTF-16 code unit değil; Unity'de `StringInfo`/`EnumerateRunes` ile sayılmalı). |
| `placements[]` | object[] | Her kopya bir kayıt. `word` ve `wordIndex` ikisi de var (okunabilirlik + hız). `row/col` ilk harf; `dir` 8 yön (`E S SE SW W N NW NE`), `dr/dc` aynı bilginin sayısal hali; `cells` her harfin koordinatı, kelime sırasıyla. **Yerleşimler kesişmez**: bir hücre en fazla bir yerleşime aittir. |
| `fill[]` | [int,int][] | Hiçbir yerleşime ait olmayan hücreler (dokununca can gider). `fill.length + Σ cells.length === cols × rows`. |
| `meta.targetCells` | int | Σ `cells.length`. |
| `meta.fillCells` | int | `fill.length`. |
| `meta.ratio` | float | `targetCells / (cols × rows)` — hedef hücre oranı `p`. |
| `meta.reversedShare` | float | Ters yazılı (`W N NW NE`) yerleşim payı. |
| `meta.diagonalShare` | float | Çapraz yerleşim payı. |
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

Prototip (`index.html`) hâlâ kompakt formatı okur (`levels.js`, `test-levels.js`: `letters` düz dizi + `p = [wordIdx, startIdx, dr, dc]`). Bu JSON ondan türetilir (`/tmp` script, 2026-11-05); iki kaynak aynı seed'den geldiği için tahtalar birebir aynıdır. ADR-0005'teki `tools/` generator'ı yazıldığında **doğrudan bu formatı** üretecek, kompakt format prototipe özel kalacak.

## Açık noktalar

- Kopya sayısı kelimeye göre değişince (`uncertainties.md#netleşenler`) `per` → `copies[]`.
- Event/daily alanları (`meta.event`, `meta.date`) /liveops spec'inden sonra eklenir.
- Dosya boyutu: 12 test levelı 114 KB (girintili). Ana akış 50 level ≈ 500 KB; sıkıştırılmış (`.json.gz`) veya `cells` atılıp `row/col/dir`'den türetilen kompakt varyant düşünülebilir — Unity ekibinin tercihi.
