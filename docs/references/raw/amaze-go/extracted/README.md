# Amaze GO! — APK'dan çıkarılan veri

Kaynak: `com.oakever.arrows` v1.35.0 (versionCode 77), Samsung SM-A515F'ten `adb pull`, 2026-10-26. Motor: Unity 6000.3.16f1 (IL2CPP). APK ve ham çıkarım (`../apk/`, `../apk-extract/`, `levelpacks/`, `levelconfigs/`, `config/`) git'e girmez; CSV ve bu özet girer.

## Dosyalar

| Dosya | İçerik |
|---|---|
| `amaze_go_main_levels.csv` | `AllLevel` sabit merdiveni, 964 level: grid, ok sayısı, dolu hücre, ortalama/maks yol uzunluğu |
| `amaze_go_normallevels32.csv` | Güncel normal havuz (3074 kayıt, 2685'inin dosyası pakette) + `firstwinrate` |
| `amaze_go_levels_difficulty_tiers.csv` | L1–300 için tier dizisi, 6 varyant (`LevelsDifficulty`, `1`–`5`) |

## Kaynak dosyalar ve format

- AssetBundle'ların önünde 32 byte prefix var; `UnityFS` imzasından itibaren okununca UnityPy açıyor (fallback sürüm 6000.3.16f1).
- `levelpacks_newuser_*.ab` — 21.763 TextAsset, her biri gzip JSON: `{"XSize","YSize","Arrows":[{"Points":[hücre idx...]}], ("Color","Category")}`. Hücre indeksi = y·XSize + x. Ok = yol; ilk nokta baş.
- `config_core_*.ab` → `LevelCatalog` (gzip; `toplam|grupId:idler;...`, 66 grup; grup 512 = ana havuz 11.742 tahta) ve `config` (18,7 MB, 325 sheet, şemasız binary: `[len][ad][rows][bytes]` + kayıtlar).
- `levelconfigs_*.ab` — 700 tablo: `AllLevel` (964, sabit merdiven), `NormalLevels*`/`HardLevels*`/`SuperHardLevels*`/`NightmareLevels*` (havuzlar), `LevelsDifficulty[1-5]` (level→tier), `LevelAttr*` (tahta → tier, ok sayısı, …), `LevelSequence*`, `DynT*` (dinamik zorluk havuzları), `DCLevels*` (günlük), `GuideLevels*`, `Arrow3DLevels*`, `TimeAttackPool`, `ComeBackLevels`, `ReliefPre*`, `Warmup*`.
- `assets/config/abtest_config.json` (472 KB) — 52 deney, tüm parametre anahtarları düz metin (bkz. referans dosyası "APK analizi").
- `assets/config/ad_config.json` — reklam SDK strateji ağacı (banner/interstitial/rewarded param id'leri; içerik server-side).

## Alan adı notu

`config` sheet'lerinin sütun adları IL2CPP metadata'da; çözülmedi. Yorumlanan alanlar dosya içeriğiyle doğrulandı (ör. `LevelAttr` alan 2 = ok sayısı, 300/300 eşleşme). Diğerleri "tahmin" etiketiyle yazıldı.
