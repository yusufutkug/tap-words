# MazeOut

- Geliştirici / yayıncı: Veri yok (Utku'nun çıkardığı level/config dökümü; store sayfası incelenmedi).
- Platform, çıkış yılı: Mobil (Unity; config'lerde iOS kampanya adları). Yıl: veri yok.
- Tür ve alt tür: Casual puzzle — "arrow escape": tahtadaki okları, önü açık olanı seçerek sırayla dışarı çıkar. Kelime oyunu değil.
- Neden referans: **funnel iskeleti.** Tap Words'ün "ilk 100 level nasıl dizilir, intro nasıl kurulur, çeşitlilik nereden gelir, yeni öğe ne zaman tanıtılır" sorusuna cevap. Mekanik alınmaz; dizi, kontrast ve tanıtım ritmi alınır.
- Kaynaklar: `~/Desktop/MazeOut_Levels/` (repo dışı; 17 Kas 2026 dökümü) — `index.csv` (1047 level satırı: set, zorluk, süre, boyut, ok sayısı, ortalama ok uzunluğu, engeller), `1_main_levels` (300), `2_loop_levels` (200), `3_ab_main_levels` (200), `4_ab_loop_levels` (30), `5_daily_levels` (30), `6_legacy_levels`, `configs/` (136 dosya: `LevelsConfig`, `LevelsConfigAb`, `FtueConfig`, `ItemTutorialConfig`, `GameEconomyModel`, `PuzzleAdConfigModel`…), level önizleme PNG'leri.
- Analiz tarihi: 2026-11-17 (ana sohbet; /market-research formatı)

## Core loop

Tahta oklarla doludur; her ok bir yöne bakar ve yalnızca önü boşsa tahtadan çıkabilir. Oyuncu çıkabilecek oka dokunur, ok kayarak çıkar ve arkasındakilerin yolu açılır. Yanlış oka dokunmak (önü kapalı) can götürür. Bütün oklar çıkınca level biter.

1. Tahtayı tara, önü açık oku bul.
2. Dokun → ok çıkar (yanlışsa can −1; `NewMisclickConfig`, `ArrowMisclickAutoEscapeConfig`).
3. Açılan yeni okları bul; engelleri (bant, kilitli perde + anahtar, boru, kutu…) çöz.
4. Süre dolmadan (`durationInSeconds` 90–180) tahtayı boşalt → coin (kolay 20 · zor 60 · çok zor 100).

Tap Words akrabalığı: tek dokunuş, yanlış dokunuş = can, tahta taraması. Fark: sıra bağımlılığı (bizde yok) ve süre sınırı (bizde yok).

## Level yapısı

Level JSON: `width`, `height`, `itemModels[]` (`kind` 1 = ok; `occupiedPositions` hücre zinciri, `direction`, `colorId`, `layer`), `difficulty` (1/2/3), `durationInSec`. İlerleme config'i ayrı: `LevelsConfig.levelConfigModels[] = {levelIndex, levelId, difficulty, durationInSeconds}` — level içeriği (`levelId`, seed'li üretim adı `…-level-N-seed-1`) ile sıradaki yeri ayrıdır; aynı tahta farklı setlerde farklı sıraya konabiliyor.

Setler: ana akış 300 level, bitince **loop** seti (200 level, aynı ritim) döner; A/B için ayrı ana akış (`LevelAbConfig.AbTestName: "1704_1-100"`) ve loop; aylık **daily** seti (30 gün, `health 3`, süre 360 sn).

Yıldız/puan yok; kazanç coin. Fail: can biter veya süre dolar → play-on (900 / 1900 / 2900 coin).

## Zorluk eğrisi

Zorluk etiketi 3 kademe: 1 kolay, 2 zor, 3 çok zor. **Ana akışta L11'den itibaren tek sabit 10'luk desen: `1 1 1 2 1 1 1 1 3 1`** — 300 level ve loop boyunca hiç değişmiyor (%80 / %10 / %10).

### Intro (L1–10)

| L | Zorluk | Tahta | Hücre | Ok | Not |
|---|---|---|---|---|---|
| 1 | 1 | 3×4 | 12 | 3 | Gökkuşağı renkli; tek hamlelik |
| 2 | 1 | 6×6 | 36 | 6 | |
| 3 | 1 | 10×9 | 90 | 8 | Uzun oklar (ort. 11) |
| 4 | 1 | 9×14 | 126 | 8 | |
| 5 | 1 | 12×17 | 204 | 19 | İlk "normal" boy |
| 6 | **2** | 16×24 | 384 | 31 | İlk "zor" — sonraki zorların (54–112 ok) yarısı |
| 7 | 1 | 10×15 | 150 | 18 | **İlk engel (Band)** — zordan hemen sonra, küçük tahta |
| 8 | 1 | 13×18 | 234 | 23 | Band tekrar |
| 9 | **2** | 24×28 | 672 | 50 | `ExtendedFtueLevel: 9` |
| 10 | 1 | 10×18 | 180 | 22 | Band; setin nefesi |

Intro dizisi `1111121121`: iki erken "zor" var ama küçük; her birinin ardından küçük level geliyor.

### L11–100 (ana akış)

| Kademe | n | Hücre (min–maks, medyan) | Ok (min–maks, medyan) | Doluluk (medyan) |
|---|---|---|---|---|
| 1 kolay | 72 | 180–884, 492 | 10–102, 42 | 0,88 (0,40–1,00) |
| 2 zor | 9 | 672–936, 858 | 54–104, 87 | 0,99 |
| 3 çok zor | 9 | 644–1040, 884 | 60–112, 85 | 0,98 |

- **Çeşitlilik kolay kademenin içinde:** 100 levelda 57 farklı tahta boyutu (en/boy 0,9–1,8); ardışık levelların 49/89'unda ok sayısı ≥ 1,5 kat değişiyor.
- **Zor ile çok zor yapısal olarak aynı** (medyan ok 87 / 85); fark etiket, ödül ve setteki konum.
- **Tepe–nefes kontrastı:** zor level öncekinin ≈ 1,65 katı ok; zordan sonraki level zorun ≈ 0,40 katı. Setin en küçük leveli 10. sırada (çok zordan hemen sonra; medyan 34 ok).
- **Tier içi yavaş büyüme:** çok zor 60 ok (L19) → 112 ok (L99); oran sabit, tepe büyüyor.
- **"Karakter" levelları:** L15 (10 uzun okla kale çerçevesi), L30/40/42/56 (seyrek, şekilli; doluluk 0,57–0,69), L1–5 çok renkli.

### Yeni mekanik tanıtımı

`ItemTutorialConfig` + `index.csv`: Band L7 · Perde+Anahtar L20 · Boru L35 · Kutu L50 · Köşe L70 · Asansör L100. Altısı da **zor/çok zor levelın hemen ardındaki küçük levelda** (16–39 ok) tanıtılıyor; sonraki level aynı mekaniği tekrar ediyor. Aralık açılıyor: 13, 15, 15, 20, 30 level. Setteki mekanik türü 1 → 7'ye çıkıyor (ilerleme hissi tier oranından değil, karışımdan).

### A/B ana akışı (`3_ab_main_levels`, ilk 100)

- Dizi düzensiz: `1111121112 1111121112 1211231111 1211111213 1123111122 1112111223 1121211123 1113211113 1111111113 1121211123` → kolay 70 · zor 21 · çok zor 9.
- İlk çok zor **L26** (ana akışta L19); tepe aralıkları 1–10 level; **8 ardışık tepe çifti** (ör. L25–26, L43–44, L49–50) ve bir üçlü (L58–60).
- Çok zor ana akıştan çok büyük: medyan 123 ok / 1457 hücre (ana 85 / 884); zor medyan 84 ok. Kolay kademe aynı (medyan 40 ok) ama erken kolaylar çok küçük (L11–19: 10–32 ok).
- 100 levelda **90 farklı tahta boyutu**; engel yok (yalnızca ok); süre sınırı yok (`duration 0`).
- Tepe sonrası oran aynı (≈ 0,41). Hangi kolun kazandığı veride yok.

## UX kalıpları

Input: tek tap. Yanlış tap: can −1; ok kısa bir kaçış animasyonu yapıp geri döner (`ArrowMisclickAutoEscapeConfig.ArrowMoveDelay 0,3`). Combo penceresi 1,25 sn (`ComboConfig`). Level sonunda "Congrats" metinleri (`CongratsConfig`). Yarım kalan level 24 saat içinde kaldığı yerden devam (`ResumeGameplayConfig`: en fazla 8 kez, ilerleme ≥ %10). FTUE: L1–9 genişletilmiş (`ExtendedFtueLevel 9`); engel tanıtımları ayrı tutorial. Ekran görüntüsü: yalnızca level önizleme PNG'leri (HUD yok) — HUD/kamera için veri yok.

## Meta ve ilerleme

`JourneyConfigModel`: belirli levellarda (10, 15, 25, 30…) coin / sınırsız can süresi / booster ödülü. Arena, lig, turnuva config'leri var (`ArenaConfigModel`, `ChampionsLeagueConfigModel`, `WeeklyTournamentConfigModel`, `StreakTournamentConfigModel`) — ayrıntı incelenmedi.

## Event takvimi

Daily Challenge (`DailyConfigModel`: L30'dan sonra görünür, günlük ödül 10 coin, ilerleme çubuğu ödülleri 100 / 30 dk sınırsız can / 500 / 2500 coin; `DailyLevelsConfig`: aylık 30 level, 3 can, 360 sn). Daily seti ağır: 30 levelın 16'sı zor, medyan 128 ok. Diğer event'ler (Sky Jump, Jetpack Race, UFO Rise, Magic Lab, Tower Win Streak…) config adı olarak var; içerik incelenmedi.

## Ekonomi

`GameEconomyModel`: başlangıç 1000 coin, 5 can, can dolumu 30 dk veya 900 coin; play-on 900 → 1900 → 2900; başlangıçta 3'er booster (grid view, time freeze, hint, tesla); level ödülü kolay 20 · zor 60 · çok zor 100 coin (2× rewarded: 40 / 120 / 200). Booster fiyatları 900–2700 coin.

## Monetizasyon

`PuzzleAdConfigModel`: interstitial açık, en erken 120 sn aralıkla; rewarded açık; 2× ödül rewarded'ı kapalı. IAP kataloğu, No Ads teklifi, özel teklif config'leri var; fiyatlar incelenmedi. Agresiflik: veri yok (oynanış gözlemi gerekir).

## Retention mekanizmaları

Daily Challenge + ilerleme çubuğu, günlük ödül (`DailyRewardConfigModel`), win-streak event'leri, loop seti (içerik bitmez), yarım level'e dönüş. Ayrıntı incelenmedi.

## Bize uyarlanabilirlik

| Kalıp | Aynen / Değiştirerek / Alınmaz | Neden (pillar referansı) | Hangi agent'ı ilgilendirir |
|---|---|---|---|
| Sabit 10'luk desen `1112111131` (%80 kolay) | Değiştirerek — Utku'nun deseni `K O K O Z K O K ÇZ K` (5 K · 3 O · 1 Z · 1 ÇZ) | Aynı iskelet; bizde kolay kademe iki alt tier | /level-design (Funnel E) |
| Ayrı intro bloğu: minik tahtalar, iki küçük erken "zor" | Değiştirerek — L1–4 6×8 → 10×13, 2–3 kopya; L6 O, L9 ilk Z | FTUE: mekanik tek tek açılır; ADR-0008 PER ve ADR-0009 grid istisnası | /level-design, /ux |
| Çeşitlilik tier'ın içinde (boyut, ok sayısı, doluluk) | Değiştirerek — tier = D₂ bandı, bant içinde birden fazla **tarif** (K 3–7, farklı grid) | Utku: "tek tipten yakalamayalım" | /level-design, /gameplay |
| Zor ≈ çok zor (yapı aynı, etiket farklı) | Aynen — ilk 100'de ÇZ = eski H, `bigram` yok | Utku: "süper hard tanımımız hard olsun" | /level-design |
| Tepe sonrası level setin en küçüğü | Aynen | Nefes; "sonraki seviye" oranı | /level-design, /liveops |
| Yeni öğe zordan sonraki küçük levelda, aralığı açılarak | Değiştirerek — bizde öğe = yön profili, kelime rolü (fener / ayrışan), yeni tarif; ilk görünüş planlı, sonrası rastgele | Utku: "pattern olmasın"; yalnızca ilk görünüş planlı | /level-design, /ux |
| Tier içi yavaş büyüme (oran sabit, tepe büyür) | Değiştirerek — Z ve ÇZ'nin D₂ hedefi 100 level boyunca +1,0 kayar | İlerleme hissi; ADR-0008 bantları içinde | /level-design |
| Set başına "karakter" leveli | Değiştirerek — tek eksen, dev kelime + kısalar | Çeşitlilik | /level-design |
| A/B: düzensiz dizi, ardışık tepeler, 90 farklı boyut | Değiştirerek — Funnel F (dizi birebir, tepeler bizim Z/ÇZ, alternatif gridler) | Sabit ritme karşı hipotez | /level-design |
| Süre sınırı | Alınmaz | Pillar: baskısız tarama; fail yalnızca yanlış tap | /gameplay |
| Sıra bağımlılığı, engeller | Alınmaz | Mekanik farklı | — |
| Level ödülü tier'a göre (20 / 60 / 100) | Değiştirerek | ADR-0003 coin ekonomisi; zor level ödül sinyali (#18b) | /liveops |
| Loop seti (içerik bitince döner) | Değiştirerek | 100 level sonrası; backend yok | /liveops, /level-design |

## Eksik veri

- Oynanış videosu / ekran görüntüsü (HUD, level sonu, zor level sinyali, engel tutorial'ı) yok.
- A/B testinin sonucu (hangi dizi kazandı), level bazında fail / drop yok.
- Store sayfası, geliştirici, çıkış tarihi, IAP fiyatları incelenmedi.
- Event config'lerinin içeriği okunmadı (yalnızca adlar).
- Ham döküm repo dışında (`~/Desktop/MazeOut_Levels`); `docs/references/raw/maze-out/` altına `index.csv` ve config özeti kopyalanabilir.
