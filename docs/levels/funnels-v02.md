# Funnel E / F — Intro + Tarifler + Kelime Rolleri (100 Level)

- Tarih / sürüm: 2026-11-17 / v02 (taslak; K1 "funnel kararı" için playtest adayları, ADR-0011 taslak)
- Alan: level-design (ana sohbet)
- Önceki: `funnels-v01.md` (A/B/C/D). D'nin oynanışından çıkan beş şikâyet bu dokümanın girdisi (`#gerekçe`).
- Veri: `tools/funnel-e.json`, `tools/funnel-f.json` (dizi, tarifler, profiller, roller, zorunlu seçimler) + tema bankası `tools/word-bank.json` (118 tema, 1.103 kelime) → `node tools/bake.js compose tools/funnel-<x>.json > funnel-<x>-levels.js` → `node tools/bake.js pack funnel-<x>-levels.js funnel-<x> > levels/funnel-<x>.json`.
- Prototip: `index.html?funnel=e|f`. Menü etiketi tier · tarif · yön profili · rol · D₂ gösterir.
- A–D çıktıları değişmedi (`cmp` ile birebir).
- Bağlı belirsizlikler: `uncertainties.md#level` (board size seti, dolgu oranı, yön oranları, tarif eşdeğerliği); açık sorular #30 (/ux), #31 (kalibrasyon), #32 (/market-research).
- **Yeniden açma gerekçesi:** ADR-0008 (K tier'a bağlı, PER 5 sabit), ADR-0009 (dört tahta boyutu) ve ADR-0010 (tier parametre seti, ters 0,20 sabit) kapanmış konulara dokunur. Gerekçe: Funnel D bu kurallarla üretildi ve oynanışta "levellar birbirine benziyor, ÇZ çok zor" sonucu çıktı (Utku, 16 Kas; ölçümü `#gerekçe` tablosunda). Ayrıntı ve kapsam ADR-0011 taslak `#yeniden-açma-gerekçesi`; üç ADR'ye de not düşüldü.

Kısaltmalar (tablolarda): tier `I` Giriş · `K` kolay · `O` orta · `Z` zor · `X` = ÇZ (çok zor). Yön profili `kar` karışık · `düz` · `çap` çapraz ağırlıklı · `ters` ters ağırlıklı · `yatay` / `dikey` (karakter leveli). Rol `A` 1 ayrışan · `F` 1 fener · `AA` · `AF` · `FF` · `FFA`. `⫽` = levelda bir tam hizalı aynı kelime çifti var.

## Öneri

Level, tier'ın tek parametre setinden değil **tier'ın D₂ bandına düşen birden fazla tariften** üretilir; her levelda ayrıca yön profili ve kelime rolü seed'li çekilişle seçilir, ilk 10 level ayrı bir intro bloğudur — bu modelle iki 100 levellık funnel: **E "Maze"** (sabit ritim) ve **F "Düzensiz"** (A/B dizisi).

### Ortak kurallar (E ve F)

**1. Tier = D₂ bandı, tarif = o banda düşen (kelime sayısı, uzunluk, grid) kalıbı.** K 3–7 arası; PER 5, can 3, dolgu `freq` (ÇZ dahil; `bigram` yok). Kelime listesi hazır havuzdan gelmez: composer tema bankasından, D₂ hedefine en yakın Σ harfi veren kelimeleri seçer (aynı tema 30, aynı kelime 20 level içinde tekrar etmez; palindrom ve alt dize denetimi).

| Tier | D₂ bandı | Tarif | Kelime | E gridi | E gerçekleşen (Σ · p · D₂ · level) | F gridleri | F gerçekleşen |
|---|---|---|---|---|---|---|---|
| **K** | 4,8–6,0 | `K4` | 4 × 4–6 harf | 12×16 | Σ 20–23 · 0,52–0,60 · 4,81–5,75 · 27 | 11×15 / 12×16 / 13×17 | Σ 17–24 · 0,52–0,60 · 4,81–5,82 · 34 |
| | | `K5` | 5 × 4–5 (sıkı) | 12×16 | Σ 24 · 0,63 · 5,63 · 10 | 11×15 / 12×16 | Σ 20–24 · 0,61–0,63 · 5,63–5,91 · 3 |
| | | `K3` | 3 × 6–8 (uzun) | 14×18 | Σ 18–22 · 0,36–0,44 · 5,07–5,79 · 3 | 13×17 / 14×18 | Σ 19–20 · 0,38–0,45 · 4,93–5,61 · 2 |
| | | `KD` | 1 × 7–8 + 3 × 4–5 (karakter) | 12×16 | Σ 20–23 · 0,52–0,60 · 4,81–5,75 · 9 | 12×16 / 13×17 | Σ 20–23 · 0,52–0,57 · 5,13–5,76 · 9 |
| **O** | 6,5–7,5 | `O5` | 5 × 4–7 | 14×18 | Σ 26–28 · 0,52–0,56 · 6,67–7,26 · 16 | 13×17 / 14×18 / 15×20 | Σ 23–33 · 0,52–0,56 · 6,67–7,26 · 10 |
| | | `O4` | 2 × 6–7 + 2 × 5–6 (uzunca) | 14×18 | Σ 22–23 · 0,44–0,46 · 6,52–6,76 · 9 | 14×18 (15×20 tanımlı, çekilmedi) | Σ 22–23 · 0,44–0,46 · 6,52–6,76 · 4 |
| | | `O6` | 6 × 4–6 (sıkı) | 14×18 | Σ 31 · 0,61 · 6,93 · 3 | 13×17 / 14×18 | Σ 26–31 · 0,59–0,61 · 6,93–7,41 · 5 |
| **Z** | 8,5–9,5 | `Z6` | 6 × 4–6 | 15×20 | Σ 29–31 · 0,48–0,52 · 8,70–9,30 · 5 | 14×18 / 15×20 / 16×21 | Σ 24–35 · 0,48–0,52 · 8,63–9,43 · 13 |
| | | `Z5` | 5 × 4–5 (seyrek) | 15×20 | Σ 22–25 · 0,37–0,42 · 8,75–9,50 · 4 | 15×20 (14×18 tanımlı, çekilmedi) | Σ 24–25 · 0,40–0,42 · 8,75–9,00 · 3 |
| | | `Z7` | 7 × 4–6 (sıkı) | 15×20 | Σ 35 · 0,58 · 8,75 · 1 | 15×20 / 16×21 | Σ 35–39 · 0,56–0,58 · 8,75–9,13 · 4 |
| **ÇZ** | E 9,8–10,85 · F 10,3–11,0 | `X6` | 6 × 4–5 | 15×20 | Σ 25–27 · 0,42–0,45 · 9,90–10,50 · 7 | 15×20 / 16×21 | Σ 24–28 · 0,40–0,42 · 10,50–10,80 · 4 |
| | | `X7` | 7 × 4–5 | 15×20 | Σ 29 · 0,48 · 10,85 · 2 | 15×20 / 16×21 | Σ 30–34 · 0,48–0,51 · 10,38–11,00 · 5 |

Bant alt ucunda 0,05 tolerans (Σ tam sayı), üst uç kesin; p ≤ 0,63 (üretilebilirlik sınırı). **ÇZ tavanı 11 = eski H bandı** (D'de ÇZ 11,3–11,9 + `bigram`'dı); Z bir kademe indi (D'de 10,2–10,8).

**2. Yön profili** — level başına çekiliş. D'deki "ters 0,20 ± 0,07, çapraz 0,27–0,43" seed bandı E/F'de yok.

| Profil | Ağırlık | Eksen ağırlığı [yatay, dikey, ↘, ↙] · ters | Kabul koşulu (gerçekleşen) | E: level · gerçekleşen | F: level · gerçekleşen |
|---|---|---|---|---|---|
| karışık | %40 | [1, 1, 1, 1] · 0,20 | çapraz 0,10–0,40; ters 0,08–0,32 | 43 · çapraz ort. 0,25 | 39 · çapraz ort. 0,22 |
| düz | %20 | [1, 1, 0, 0] · 0,20 | çapraz 0 | 17 | 16 |
| çapraz ağırlıklı | %20 | [0,08, 0,08, 1, 1] · 0,20 | çapraz ≥ 0,45; **yalnız p ≤ 0,53 tahtada** | 8 · çapraz 0,48–0,70 (ort. 0,57) | 12 · 0,45–0,83 (ort. 0,60) |
| ters ağırlıklı | %20 | [1, 1, 1, 1] · 0,50 | ters ≥ 0,40 | 19 · ters 0,40–0,75 (ort. 0,55) | 20 · 0,40–0,67 (ort. 0,52) |
| yalnız yatay / dikey | — (karakter) | [1, 0, 0, 0] / [0, 1, 0, 0] · 0,20 | — | 6 / 3 | 6 / 3 |

**3. Kelime rolleri** — level başına çekiliş, desen yok. **Ayrışan:** dolgu o kelimenin harflerini kullanmaz (kelime, harfleri başka hedef kelimede en az geçen fener-olmayanlardan seçilir). **Fener:** 2+ harfi Ç Ğ Ö Ş Ü olan kelime (İ sayılmaz); rol çekilmeyen levelda fener kelime bulunmaz.

| Kombinasyon | Ağırlık | E (L11–100) | F (L11–100) |
|---|---|---|---|
| rol yok | %35 | 35 | 36 |
| 1 ayrışan (`A`) | %20 | 29 | 24 |
| 1 fener (`F`) | %15 | 16 | 20 |
| 2 ayrışan (`AA`) | %10 | 1 | 3 |
| 1 ayrışan + 1 fener (`AF`) | %10 | 6 | 3 |
| 2 fener (`FF`) | %5 | 2 | 3 |
| 2 fener + 1 ayrışan (`FFA`) | %5 | 1 (L62, elle) | 1 (L67, elle) |

Sınırlar: level başına ≤ 3 rollü kelime ve kelimelerin ≤ yarısı (K4 → 2, K3 → 1); ÇZ'de ≤ 1; aynı kombinasyon art arda 3 kez gelmez; her 10'luk sette rollü level 3–7 (gerçekleşen E 4–7, F 5–7); çift roller L50'den (F: L51) itibaren. Dolgu–hedef harf örtüşmesi: rol yok ort. 0,57, `A` 0,50, `AA` 0,09–0,29 (D'de K/O/Z ort. 0,55–0,63, ÇZ 1,00).

**4. Tam hizalı aynı kelime** (aynı eksende, ters yazım dahil, bir birim yana kaymış birebir kopya) varsayılan üretilmez; 10'luk set başına rastgele **bir** levelda tam **bir** çifte izin verilir (E ve F: 9 level, 9 çift; D'de 39 levelda 46 çift). Bir harf kayık paralel serbest.

**5. Çeşitlilik:** art arda iki level tarif / yön profili / rol kombinasyonundan en az ikisinde farklı (E ve F'de L5–100 boyunca en az 2/3). Tepe (Z, ÇZ) sonrası level `K4`, D₂ hedefi bandın alt ucunda (4,8–5,2), çapraz ağırlıklı profil kapalı — planlı yenilik levelları hariç (E L20 / L30, F L21 / L27). 10'luk set başına bir **karakter leveli**: `KD` (bir dev kelime + üç kısa), tek eksen.

**6. Intro L1–4** (iki funnel'da aynı tahtalar):

| L | Tema | Kelime × kopya | Grid | Yön | Dolgu | p | D₂ |
|---|---|---|---|---|---|---|---|
| 1 | Meyveler | 2 × 2 (KİRAZ, ARMUT) | 6×8 | yalnız yatay, ters yok | `disjoint` | 0,42 | 1,75 |
| 2 | Hayvanlar | 3 × 2 | 7×9 | yatay + dikey | `disjoint` | 0,48 | 2,36 |
| 3 | Okul | 3 × 3 | 8×11 | yatay + dikey | `freq` | 0,51 | 2,93 |
| 4 | Deniz | 4 × 3 | 10×13 | çapraz açılır (0,25) | `freq` | 0,48 | 4,12 |

**7. Yenilikler önce planlı bir levelda görünür, sonra çekilişe girer:**

| Yenilik | E | F |
|---|---|---|
| Çapraz | L4 | L4 |
| PER 5, tam boy tahta | L5 (K4, düz) | L5 |
| Ters ağırlıklı + ilk fener | L7 (küçük K) | L7 (11×15) |
| 5 kısa kelime (`K5`) | L8 | çekilişte (ilk L57) |
| İlk Z | L9 (D₂ 9,0) | L10 (D₂ 8,7) |
| İlk ayrışan | L10 (tepe sonrası) | L11 (tepe sonrası) |
| Çapraz ağırlıklı profil | L20 | L21 |
| 3 uzun kelime (`K3`) | L30 | L27 |
| 7 kelime (`Z7` / `X7`) | kilit L40, ilk L45 | kilit L41, ilk L43 |
| Çift rol | L50 (`AF`) | L51 (`AA`) |

## Gerekçe

Utku'nun D oynanışından şikâyetleri (16 Kas) ve D verisinde ölçümü:

| Şikâyet | D'de ölçülen | E/F kuralı |
|---|---|---|
| "Ters / düz / çapraz oranları her levelda yakın" | L2–100: ters 0,20 ± 0,04 (0,13–0,25), çapraz 0,32 ± 0,05 (seed bandı zorluyordu) | Yön profili (2) |
| "Süper hard'lar çok zor; ilk 100'de süper hard tanımımız hard olsun" | ÇZ D₂ 11,3–11,9, `bigram`, dolgu örtüşmesi 1,00 | ÇZ tavanı 11, `freq` (1) |
| "Leveldaki kelime tipleri çok yakınsıyor; bazı levellarda bir kelime çok rahat bulunabilsin" | level içinde kelimeleri ayıran kural yok: tek dolgu modu, tek uzunluk aralığı | Kelime rolleri (3) |
| "Tam yan yana aynı kelime hoşuma gitmedi" (yasak değil, 10 levelda bir) | 39/100 levelda 46 çift (levelda en çok 2) | Hizalı kopya kuralı (4) |
| "Tier'ı 6 kelime 5 harfli gibi tek tipten yakalamayalım"; "tarifler K 3–K 7" | tier başına tek (K, Σ, grid) | Tarifler (1) |
| "Dolgu harflerin dağılımı D₂'yi ne kadar etkiliyor" | D₂ dolguyu hiç görmüyor; aynı D₂'de `disjoint` −%50, `bigram` +%15–24 süre (v03) | `ka-log`'a `fillOverlap`, roller, profil yazılır; katsayı ölçülür (`#ölçüm`) |
| "Pattern yaratmayalım, sınırlayalım" | — | Rol ve profil çekiliş + sınır; yalnız ilk görünüş planlı (7) |
| "İlk 10 level intro; MazeOut funnel'ına benzesin" | D'de L1 12×16, ilk ÇZ L9 | Intro (6), yenilik takvimi (7) |

## Referans

- `docs/references/maze-out.md#intro-l110` — minik tahtalarla başlayan ayrı intro, iki küçük erken "zor".
- `docs/references/maze-out.md#l11100-ana-akış` — `1112111131`, tepe sonrası en küçük level, tier içi yavaş büyüme, tier içi çeşitlilik.
- `docs/references/maze-out.md#yeni-mekanik-tanıtımı` — yenilik zordan sonraki küçük levelda (L7 / 20 / 35 / 50 / 70 / 100).
- `docs/references/maze-out.md#ab-ana-akışı-3_ab_main_levels-ilk-100` — düzensiz dizi, ardışık tepeler (F).
- `docs/levels/param-tests-v03-results.md` §2, §3, §4 — dolgu modu (−%50 / +%15–24), ters yazım (±%9), özel harf (%40 → −%45: fenerin dayanağı).
- Kelime rolleri ve hizalı kopya kuralı için dış referans yok — **Referans yok — /market-research'e soru düşüldü** (`open-questions.md` #32).

## Trade-off

- **Aynı D₂'li tarifler aynı hissi vermeyebilir** (3 uzun kelime ↔ 5 kısa sıkı hiç karşılaştırılmadı). D₂ bandı tier'ın tek sözleşmesi; tutmazsa tarif banttan çıkar. Pillar 6 ("zorluk parametreyle gelir") korunur, ama parametre sayısı arttı: level 4 eksenle tarif edilir (tarif, profil, rol, hizalı çift).
- **Roller oyuncuya söylenmez.** Ayrışan / fener bir tahta özelliğidir, UI sinyali yoktur (Pillar 5 "tahta sakin"); oyuncu "bu level kolaydı" der, nedenini bilmez. Pillar 3 ile çelişmez (ceza kuralı aynı).
- **Yön artık sabit değil:** v03 "ters yazım kaldıraç değil (±%9), 0,20 sabit" demişti; burada ters ve çapraz zorluk için değil çeşitlilik için oynatılır. Ters ağırlıklı levelda süre +%9'u aşarsa D₂'ye katsayı gerekir.
- **Çapraz ağırlıklı profil sıkı tahtada üretilemiyor** (p > 0,53'te pay 0,30–0,40'ta kalır) → yalnız seyrek tariflerde; çekilişli 87 levelda payı %20 değil E'de %9 (8 level), F'de %14 (12 level).
- **Minik ve alternatif gridler** ADR-0009'un dört boyutunu ve ≈ 1,4 oranını bozar (intro 1,29–1,38; F'de 6 boyut). Hücre boyutu levelden levele değişir (366 px genişlikte hesapla E 22–27 px, F 21–29 px; intro 32–40 px).
- **Tema bankası tek kaynak:** 100 levelda E 97, F 95 tema kullanıldı; 3–5 tema iki kez (≥ 30 level arayla), 10–11 kelime tekrar ediyor. Banka 1.103 kelime ama fener 68, 4 harfli 285 → ÇZ'nin 4–5 harfli 7 kelimesi ve çift fener en dar boğaz.
- **F'de tepe sonrası hep K** olduğu için L11–100'de kolay yuvası K 45 / O 17'ye kaydı (%50 çekilişe rağmen); aynı kolay tier art arda en fazla 3 kuralı eklendi.

## Gerekli görüşler

- **/ux:** minik tahtada hücre tavanı (prototip: sütun ≤ 10 ise 40 px); intro tahtalarının dikey yerleşimi; hücre boyutunun levelden levele değişmesi (F'de 6 grid); rol için sinyal gerekmediği varsayımı (#30).
- **/gameplay:** ayrışan / fener mekaniğin resmi parçası mı (terimler `mechanic.md`'ye eklendi); booster "kelimeyi göster" ile etkileşim (#31).
- **/market-research:** word search oyunlarında "kolay bulunan kelime" (dolgu ayrıştırma, nadir harf) ve aynı kelimenin hizalı kopyası için referans (#32).
- **/liveops:** ÇZ tavanı 11'e indi → play-on RV/coin talebi düşer (ADR-0003/0004); F'nin ardışık tepeleri (L58–60) talep tepesi.
- **/prototype:** kelime başına bulma zamanı (`foundAt[]`) log'a eklenirse rol etkisi doğrudan ölçülür (#31).

## Ölçüm

Prototip `ka-log` (kayıtta `funnel`, `tier`, `recipe`, `dirProfile`, `roles`, `sep`, `fener`, `revShare`, `diagShare`, `fillOverlap`, `stacks`, `D2`).

| Metrik | Hedef | Tutmazsa |
|---|---|---|
| İlk-deneme kazanma | K, O ≥ 0,98 · Z ≥ 0,93 · ÇZ ≥ 0,85 | ÇZ < 0,85 → ÇZ üst ucu 11 → 10,5; Z < 0,93 → Z bandı 8,0–9,0 |
| Intro | L1–4 fail %0; L1 ≤ 0:20, L4 ≤ 0:45; ilk Z (E L9 / F L10) fail ≤ %10 | İlk Z, L15'e ertelenir (L9 → O) |
| Süre medyanı | K ≤ 1:00 · O 1:15–1:30 · Z ≤ 1:45 · ÇZ ≤ 2:15 | Tier D₂ bandı ± 0,5 kayar |
| Tarif eşdeğerliği | Aynı tier'ın tarifleri arasında süre medyanı farkı ≤ %25 | Tarif banttan çıkar veya D₂'ye tarif katsayısı |
| Rol etkisi | Rollü level süresi, aynı tarifin rolsüz levelına göre −%10 … −%30 | < %10 → rol görünmüyor (ayrışan seçimi sıkılaşır); > %30 → rol D₂'ye katsayı |
| Dolgu katsayısı | süre / D₂ ile `fillOverlap` arasında Spearman; \|ρ\| ≥ 0,4 ise D₂'ye `(1 + β·(örtüşme − 0,55))` terimi | ρ zayıfsa dolgu rolü kozmetik |
| Yön profili | Ters ağırlıklı ve çapraz ağırlıklı level süresi, karışık'a göre ± %15 içinde | Dışındaysa profil katsayısı |
| c = yanlış tap / D₂ | 0,08–0,13 | — |
| F: ardışık tepe | Çiftin ikinci levelında fail, tekil tepeye göre ≤ +10 puan; L58–60 sonrası "sonraki seviye" ≥ E'nin L59 sonrası | F'de ardışık tepeler çözülür (araya K) |
| Hizalı çift | Utku / ekip gözlemi: 9 levelda rahatsız etmiyor | Set başına 0'a iner |

---

## Seçenek E — "Maze" (ana set örneği)

### Öneri

L1–10 intro, L11–100 sabit ritim `K O K O Z K O K ÇZ K` × 9; Z ve ÇZ'nin D₂ hedefi 100 level boyunca yavaşça büyür (Z 8,7 → 9,5; ÇZ 9,9 → 10,85). Sayım Giriş 4 · K 49 · O 28 · Z 10 · ÇZ 9; D₂ ortalaması **6,5** (D 7,0); set D₂ toplamı 49 (intro), sonra 65–68. Tahtalar 12×16 / 14×18 / 15×20 (46 / 31 / 19 level) + intro. Seed 20261117.

| Level | Dizi | Leveller: tema (tarif, profil, rol) | Σ D₂ |
|---|---|---|---|
| 1–10 | `IIIIKOKKZK` | Meyveler (I1, yatay) · Hayvanlar (I2, düz) · Okul (I3, düz) · Deniz (I4, kar) · Liman (K4, düz) · Gardırop (O5, kar) · Duygular (K4, ters, F) · Makamlar (K5, düz) · Baharat (Z6, kar) · Eczane (K4, kar, A) | 49 |
| 11–20 | `KOKOZKOKXK` | Kahvaltı (K4, düz, F) · Ahır (O5, kar) · Tonlar (K5, ters, F) · Kiler (O5, ters) · Maç Günü (Z6, kar, ⫽) · Meslekler (K4, kar, F) · Sebzeler (O5, kar) · Oyuncaklar (KD, yatay) · Aile (X6, ters, A) · Vakit (K4, çap) | 66 |
| 21–30 | `KOKOZKOKXK` | Evcil Hayvan (KD, yatay) · Yemekler (O5, kar, A) · Mutfak (K5, ters, ⫽) · Finans (O5, düz, A) · Aletler (Z5, kar) · Salon (K4, düz, F) · Müzik (O5, ters) · Köy (K4, ters, F) · Yönler (X6, kar, F) · Uzay (K3, düz, A) | 67 |
| 31–40 | `KOKOZKOKXK` | Kitap (K5, düz) · Sayılar (O5, ters) · Posta (K4, düz, A) · Bilim (O5, çap, A) · Berber (Z6, ters, F) · Bahçe (K4, ters, A) · İnternet (O4, kar, A) · Pastane (KD, dikey, F) · Takılar (X6, çap, A) · Sirk (K4, kar, ⫽) | 66 |
| 41–50 | `KOKOZKOKXK` | Hisler (K5, düz) · Doğa (O6, kar, A) · Olimpiyat (K4, kar, F) · Aylar (O5, ters) · Okul Günü (Z7, kar) · Çöl (K4, kar, A) · İçecekler (O4, çap, A) · Doğum Günü (KD, yatay) · Arazi (X6, kar, A, ⫽) · Şehir (K4, kar, AF) | 65 |
| 51–60 | `KOKOZKOKXK` | Matematik (K5, kar, F) · Kafe (O4, kar) · Teknoloji (K3, çap) · Sofra (O5, kar, A) · El İşi (Z5, kar, FF) · Çiçekler (K4, düz, F, ⫽) · Türkçe (O4, ters, AA) · Çalgılar (KD, dikey) · Çiftlik (X6, kar, A) · Tiyatro (K4, kar) | 66 |
| 61–70 | `KOKOZKOKXK` | Zaman (K3, düz, A) · Havalimanı (O6, kar, FFA) · Kıyafet (K4, kar) · Kuşlar (O5, kar, F) · Spor Sahası (Z5, çap, AF) · Mahalle (K4, kar, F) · Mobilya (O4, çap, A) · Geometri (KD, dikey, FF) · Bilgisayar (X6, ters) · Oyunlar (K4, düz, ⫽) | 68 |
| 71–80 | `KOKOZKOKXK` | Ağaçlar (K5, kar, A) · Hastane (O5, çap, A) · Düğün (K4, ters) · Konser (O4, kar) · Dağ (Z6, kar, A, ⫽) · Masallar (K4, kar, F) · Gezegenler (O4, kar, A) · Ofis (KD, yatay) · Vücut (X6, ters, F) · Spor (K4, düz, A) | 68 |
| 81–90 | `KOKOZKOKXK` | Araç (K4, ters) · Banyo (O5, kar, A, ⫽) · Şehirler (KD, yatay, A) · Masa Oyunları (O5, ters) · Tatil (Z5, düz, A) · Sahil (K4, kar) · Tatlılar (O5, kar, F) · Fırın (K5, düz, A) · Kent (X7, kar, A) · Tarım (K4, kar) | 68 |
| 91–100 | `KOKOZKOKXK` | Sıfatlar (K5, kar, A) · Piknik (O4, kar, AF) · Hava (KD, yatay) · Market (O4, düz) · Krallık (Z6, kar, AF) · Kanatlılar (K4, ters, ⫽) · Gardırop (O6, kar, AF) · Hisler (K5, ters, AF) · Bilgisayar (X7, düz, A) · Sinema (K4, kar) | 68 |

Tepeler: Z L9 9,0 · L15 8,7 · L25 8,75 · L35 8,7 · L45 8,75 · L55 9,0 · L65 9,25 · L75 9,3 · L85 9,5 · L95 9,3; ÇZ L19 9,9 · L29 9,9 · L39 10,2 · L49 10,2 · L59 10,2 · L69 10,5 · L79 10,5 · L89 10,85 · L99 10,85. Tepe sonrası 19 levelın 17'si `K4` D₂ 4,81–5,13; L20 5,75 (çapraz ağırlıklı ilk görünüş, p ≤ 0,53 gerekir), L30 `K3` 5,07.

### Gerekçe

Utku'nun istediği set deseni (`K O K O Z K O K ÇZ K`) ve MazeOut ana setinin iskeleti (%80 kolay, tek tepe + bir küçük tepe, tepe sonrası nefes) aynı şey; D ile aynı ritim olduğu için D ↔ E farkı yalnızca yeni kuralları (tarif, profil, rol, intro, ÇZ tavanı) ölçer.

### Referans

`docs/references/maze-out.md#l11100-ana-akış`; `funnels-v01.md#d--hafif-16-kas`.

### Trade-off

Ritim tahmin edilebilir: oyuncu setin 9. levelının duvar olduğunu öğrenir. Çeşitlilik tier'ın içinden gelir, diziden değil.

### Gerekli görüşler

Ortak listeyle aynı; ek yok.

### Ölçüm

Ortak tablo. Ek: D ile aynı ritim → D'nin L9 ÇZ fail'i ile E'nin L19 ÇZ fail'i karşılaştırılır (hedef E ≤ D − 10 puan).

## Seçenek F — "Düzensiz" (A/B seti örneği)

### Öneri

L1–10 intro (ilk Z L10), L11–100 MazeOut A/B setinin tepe dizisi birebir (kolay 62 · Z 19 · ÇZ 9; ilk ÇZ L26; 8 ardışık tepe çifti, L58–60 üçlü); kolay yuvası K/O çekilişi (L11–20 K %70, sonra %50; tepe sonrası hep K; aynı kolay tier art arda ≤ 3); tarif başına alternatif gridler. Z 8,5–9,5 ve ÇZ 10,3–11,0 sabit bant; ardışık tepe çiftinde ilkinin hedefi bandın alt %30'u (gerçekleşen 8,63–9,13). Sayım Giriş 4 · K 48 · O 19 · Z 20 · ÇZ 9; D₂ ortalaması **6,8**; set D₂ toplamı 50 (intro), sonra 62–74. Tahtalar 11×15 / 12×16 / 13×17 / 14×18 / 15×20 / 16×21 (12 / 26 / 14 / 16 / 19 / 9 level) + intro. Seed 20261118.

| Level | Dizi | Leveller: tema (tarif [grid], profil, rol) | Σ D₂ |
|---|---|---|---|
| 1–10 | `IIIIKOKKOZ` | Meyveler (I1, yatay) · Hayvanlar (I2, düz) · Okul (I3, düz) · Deniz (I4, kar) · Türkçe (K4, düz) · Renkler (O5, kar) · Köy (K4 11×15, ters, F) · Olimpiyat (K4, kar) · Tatil (O5, düz) · Dağ (Z6, kar) | 50 |
| 11–20 | `KKOKKZKOKZ` | Spor (K4, kar, A, ⫽) · Hisler (K4 11×15, ters) · Tatlılar (O5, kar, F) · Kafe (K4, kar, A) · Oyuncaklar (KD, dikey) · Kiler (Z6, ters) · Trafik (K4, kar, A) · Baharat (O4, düz) · Havalimanı (K4 13×17, kar, F) · Çiçekler (Z6 16×21, düz) | 64 |
| 21–30 | `KZKKZXKOKK` | Şehirler (K4, çap) · Düğün (Z5, çap, A) · Sahil (K4, kar) · Oyunlar (K4 13×17, ters, A) · Kuşlar (Z6, kar, F) · Bilgisayar (X6, ters) · Masallar (K3 13×17, kar, A, ⫽) · Müzik (O5, düz, F) · Finans (K4 11×15, kar) · Bahçe (KD 13×17, yatay) | 68 |
| 31–40 | `KZKOKOOZKX` | Okyanus (K4 13×17, düz, A, ⫽) · El İşi (Z6, kar, F) · Okul Günü (K4 11×15, ters, A) · Sıfatlar (O6 13×17, ters) · Geometri (KD, yatay, F) · Kıyafet (O6 13×17, ters) · İnternet (O4, çap, A) · Kent (Z6 14×18, ters) · Fotoğraf (K4 11×15, kar, A) · Sebzeler (X6 16×21, çap) | 72 |
| 41–50 | `KOZXKKOOZZ` | İçecekler (K4, ters) · Tamirat (O6 13×17, kar, A) · Kahvaltı (Z7 16×21, kar, F) · Vücut (X6, ters, F, ⫽) · Liman (K4, ters) · Hastane (KD 13×17, yatay) · Böcekler (O5 15×20, ters, F) · Aylar (O4, çap) · Zaman (Z6 16×21, çap, A) · Bilim (Z7, kar) | 73 |
| 51–60 | `KKOZKOKZZX` | Kitap (K4, kar, AA) · Matematik (KD, yatay, F) · Çiftlik (O6 13×17, düz) · Maç Günü (Z6 16×21, ters, A, ⫽) · Doğa (K4, düz) · Ev (O5 13×17, kar) · Eylemler (K5 11×15, kar, F) · Mobilya (Z5, ters, F) · Salon (Z7, düz, A) · Aile (X6, düz) | 74 |
| 61–70 | `KKZKZKOOZX` | Sınıf (K4 11×15, kar) · Fırın (KD 13×17, yatay, AA) · Takılar (Z6 14×18, kar, F) · Gardırop (K4, düz, AF) · Posta (Z5, kar, A) · Nitelikler (K4 11×15, ters) · Şehir (O6, kar, FFA) · Vakit (O5, çap, AF, ⫽) · Mahalle (Z7 16×21, düz) · Mutfak (X7 16×21, düz, A) | 73 |
| 71–80 | `KKKXZKKOKX` | Banyo (K4, ters) · Masa Oyunları (K5, ters, AA, ⫽) · Arazi (K4 11×15, düz, A) · Renk Paleti (X7, kar, A) · Aletler (Z6, kar, F) · Çöl (K4, kar, A) · Sinema (K3, çap) · Böcekler (O5 15×20, ters, F) · Pastane (KD 13×17, dikey, A) · Yönler (X7, çap) | 69 |
| 81–90 | `KOKKKOKKKX` | Eczane (K4, kar) · Berber (O4, düz, AF, ⫽) · Kanatlılar (K4 13×17, kar) · Araç (K4 11×15, çap, A) · Sıfatlar (K4 11×15, kar, FF) · Hava (O5 15×20, kar, F) · Krallık (KD, yatay, F) · Ahır (K4 11×15, ters) · Matematik (K5, kar, FF) · Kış (X7 16×21, kar) | 62 |
| 91–100 | `KKZKZKOKZX` | Duygular (K4, kar, A) · Olimpiyat (KD, dikey, F) · El İşi (Z6, çap, FF) · Piknik (K4, kar, F, ⫽) · Evcil Hayvan (Z6 14×18, çap, A) · Tarım (K4, kar) · Ağaçlar (O5, kar, A) · Gezegenler (K4, kar) · Makamlar (Z6 14×18, kar, F) · Beden (X7 16×21, düz) | 71 |

Grid yazılmayan tarif E'deki gridindedir (K4/K5/KD 12×16, K3/O 14×18, Z/ÇZ 15×20). Ardışık tepeler: L25 Z 8,7 → L26 ÇZ 10,8 · L43 Z 9,13 → L44 ÇZ 10,5 · L49 Z 8,63 → L50 Z 8,75 · **L58 Z 8,75 → L59 Z 8,75 → L60 ÇZ 10,8** · L69 Z 8,81 → L70 ÇZ 11,0 · L74 ÇZ 10,5 → L75 Z 8,7 · L99 Z 8,71 → L100 ÇZ 11,0.

### Gerekçe

MazeOut aynı oyunda sabit ritmin karşısına düzensiz diziyi A/B'ye koymuş (`LevelAbConfig`); sonucu bilinmiyor. Bizde de "tahmin edilemeyen tepe + daha çok boyut" hipotezinin ayrı ölçülmesi gerekiyor; kurallar E ile aynı olduğu için E ↔ F farkı yalnızca dizi ve grid çeşitliliğidir.

### Referans

`docs/references/maze-out.md#ab-ana-akışı-3_ab_main_levels-ilk-100`.

### Trade-off

Z sayısı iki katı (20) ve ardışık tepeler var: L58–60'ta 3 levelda D₂ toplamı 28,3 (E'de en yoğun 3 level L87–89: 23,7). Altı farklı hücre boyutu "küçük tahta = büyük hücre" kuralını (ADR-0009) okunmaz kılabilir. Uzun kolay bölgeler (L81–89: 9 kolay) sıkabilir.

### Gerekli görüşler

Ortak liste + **/ux:** altı grid arasında hücre boyutu sıçraması (21 ↔ 29 px) rahatsız eder mi.

### Ölçüm

Ortak tablo + "F: ardışık tepe" satırı. Ek: L81–89 kolay bölgesinde oturum bırakma E'nin L81–89'una göre ≤ +5 puan.

## Karşılaştırma

| | D Hafif | E Maze | F Düzensiz |
|---|---|---|---|
| Dizi | `KOKOZKOKXK` × 10 | intro + `KOKOZKOKXK` × 9 | intro + A/B dizisi |
| Tier sayımı | K 50 · O 30 · Z 10 · ÇZ 10 | Giriş 4 · K 49 · O 28 · Z 10 · ÇZ 9 | Giriş 4 · K 48 · O 19 · Z 20 · ÇZ 9 |
| İlk Z / ilk ÇZ | L5 / L9 | L9 / L19 | L10 / L26 |
| Z D₂ | 10,2–10,8 | 8,7–9,5 | 8,6–9,4 |
| ÇZ D₂ · dolgu | 11,3–11,9 · `bigram` | 9,9–10,85 · `freq` | 10,4–11,0 · `freq` |
| D₂ ortalaması | 7,0 | 6,5 | 6,8 |
| Set D₂ toplamı | ≈ 70 (69–71) | 49 → 65–68 | 50 → 62–74 |
| L1 | 12×16, 4 kelime × 5 | 6×8, 2 kelime × 2 | aynı |
| Tarif / tier | 1 | 2–4 | 2–4 + alternatif grid |
| Tahta boyutu | 4 | 3 + 4 intro | 6 + 4 intro |
| Yön | her levelda ≈ aynı | 4 profil + karakter | aynı |
| Rollü level | 0 | 55 / 90 | 54 / 90 |
| Tam hizalı çiftli level | 39 (46 çift) | 9 (9 çift) | 9 (9 çift) |
| Ardışık tepe | yok | yok | 8 çift |

## Plandan sapmalar (üretimde ortaya çıkanlar)

1. **"L40'ta 7 kelime tarifi":** 7 kelime K bandına sığmaz (D₂ ≤ 6 için p ≥ 0,71). Kilit L40'ta (F: L41) açılır, ilk görünüş bir sonraki Z'de: E L45, F L43.
2. **Çapraz ağırlıklı profil yalnız p ≤ 0,53 tahtada, kabul eşiği çapraz payı ≥ 0,45** (0,55 denendi, tutmadı): sıkı tahtada (p ≥ 0,57) çapraz payı en çok 0,30–0,40'a çıkıyor (komşu çapraz şerit kuralı). Bu yüzden ilk görünüşü (E L20, F L21) Σ 20 / D₂ 5,75 — "setin en küçüğü" değil, K bandının üst ucu.
3. **`FFA` çekilişte çıkmadı** (6+ kelimeli ve ÇZ olmayan tarif + iki fenerli tema gerekir) → her funnel'da bir kez elle yerleştirildi (E L62, F L67).
4. **`O4` "4 uzunca kelime":** 4 kelimede O bandı 14×18'de Σ ≤ 23 ister (Σ 24 → D₂ 6,29); serbest bırakılınca dört 5 harfli seçiliyordu → tarif 2 × 6–7 + 2 × 5–6 harfe sabitlendi (Σ 22–23).
5. **`K5` tek noktada:** 12×16'da yalnız Σ 24 (p 0,63, D₂ 5,63) banda ve üretilebilirlik sınırına sığıyor.
6. **F'de ilk Z 8,5 yerine 8,7** (Z6 15×20'de en yakın Σ); E'de ÇZ kayması 9,8 → 10,8 yerine 9,9 → 10,85 (`X6` Σ 27, `X7` Σ 29), Z kayması 8,7 → 9,5 (L85; L95 9,3).
7. **Karakter leveli F'ye de kondu** (plan yalnız E için söylüyordu); **L5 düz profil** (çeşitlilik kuralı; L4'te açılan çapraz L6'da döner).
8. **Tema bankası** 118 tema, tema başına 7–16 kelime (plan 8–14); fener 68, uzun (7–8 harf) 179.
9. Composer 4 levelda ilk çekilişi üretemeyip sıradakine geçti (E L71, L75; F L34, L67 — hepsi sıkı tarif + çapraz ağırlıklı); çeşitlilik kuralı hiç gevşetilmedi.

## Önerilen

**E** birincil aday: Utku'nun istediği ritim, D ile birebir karşılaştırılabilir, yeni kuralların (tarif / profil / rol / intro) etkisini yalıtır. **F** hipotez kolu: E kabul görürse dizi sorusu (sabit ↔ düzensiz, ardışık tepe) F ile ayrıca ölçülür. Önerilen oynanış sırası: E L1–30 tam → F L1–11 (intro farkı) + L21–30 + L41–50 + L56–61. Karar ana sohbette; kabul edilirse ADR-0011 Taslak → Kabul, ADR-0010'a kazanan dizi yazılır.
