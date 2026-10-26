# Word Search Explorer — APK'dan çıkarılan veri

Kaynak: `in.playsimple.wordsearch` v1.290.0 (versionCode 290), Samsung SM-A515F'ten `adb pull`, 2026-10-26. Motor: Flutter. APK ve ham çıkarım (`../apk/`, `../apk-extract/`) git'e girmez; bu klasördeki türetilmiş CSV/özetler girer.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `wse_en_levels_variant0.csv` | EN ana dizi, 3510 level: `level, cols, rows, cells, words, fill_cells, fill_pct, target_pct, hwp, pt, has_rw` |

## Kaynak dosyalar ve format

- `assets/flutter_assets/assets/puzzles/<lang>/ws_puzzles_N.msgpack` — EN'de 6 varyant (`content` deneyi, 4 kol × %25), TR'de 1 dosya / 100 level; devamı CDN'den (`downloader.json` → `contentLangV2/`).
- Her dosya 3 liste: `[ana leveller (3510), alternatif havuz (500; 72/90 hücre, hwp 25/35), eoc {"eoc":"true","rp":2011}]` — `rp` muhtemelen içerik bitince tekrar başlangıç leveli (tahmin).
- Level alanları: `i` no · `c`,`r` grid · `tw` tema kelimesi · `g` grid harfleri · `aw` cevap kelimeler (`-` ayraçlı) · `dl` dolgu hücre indeksleri (`-` ayraçlı) · `hwp` 0/25/32/35 (muhtemelen "hard word percent": ters/çapraz yerleşim oranı — tahmin) · `pt` puzzle tipi · `rw` ek kelimeler (tp tipinde, 7 adet; ödül/bonus kelimeler — tahmin) · `cc`,`q`,`fn` (cf tipinde: alıntı/quote puzzle).
- Harf içerikleri (`tw`,`g`,`aw`,`rw`,`q`) şifreli (base64); grid boyutu, kelime sayısı, dolgu sayısı, tip ve hwp düz metin. Şifre çözülmedi; gerek de yok.
- `dictionary/<lang>/dictionary.txt` — virgülle ayrılmış tek satır. EN 49.230 kelime (2–10 harf; anagram gruplu → bonus kelime için), TR 47.043 kelime (3–11 harf, alfabetik).
- `configs/` — `store_data.json`, `storeScreen.json` (IAP), `countriesInfoV3.json` (harita metası), `stamp_collection*.json`, `crowns_config.json`, `frames_config.json`, `text_notif_config.json`, `hardCodedExp.json` (44 deney adı).
- Reklam zamanlaması (banner/interstitial unlock leveli) APK'da yok; `libapp.so` string'leri "runtime for Interstitial" diyor → server-side.
