# Zorluk Eğrisi v02 — İlk 30 Level, Tier Modeli

- Tarih / sürüm: 2026-10-26 / v02 (taslak; `curve-v01.md`'yi günceller, v01 arşiv olarak kalır)
- Alan: level-design
- Problem: v01, 20 sütun varsayımıyla kuruldu; /ux zoom'suz okunabilir üst sınırı **sütun ≤ 17, satır ≤ 26** verdi (open-questions #11). Ayrıca iki referans oyunun APK verisi geldi: WSE gerçek grid seti ve `hwp` kalıbı, Amaze GO! tier ritmi ve hedef ilk-deneme kazanma oranları. Eğri bu üç veriyle yeniden kuruluyor.
- İlgili ADR: ADR-0001 (referanslar), ADR-0002 (banner alanı). Can mekaniği E1 ile ertelenmiş → **can 5 sabit, PER 5 sabit; bu dokümanda ikisine de öneri yok.**

## v01'den farklar

| Konu | v01 | v02 | Neden |
|---|---|---|---|
| Sütun | 20 sabit | **17 sabit** | /ux #11: 17 sütun = 20 pt hücre / 14,4 pt harf, zoom'suz; 20 sütun alt sınırda (17,6 pt), zoom beklenir |
| Tahta boyutları | 2 (+2 FTUE): 20×25 / 20×18 | **3 (+1 FTUE): 17×26 / 17×21 / 17×16, FTUE 17×12** | WSE APK: 5 boyutlu set, komşu adımlar 1,25–1,33× (42→56→72→90); iki boyut değil üç kademe |
| Ritim | Katı büyük↔küçük (WSE 56/42 web iddiası) | **Tier dizisi** (Amaze GO! `LevelsDifficulty`) + her zor levelı Relief tahtası izler | Amaze GO! APK: zorluk level numarasına atanan periyodik tier; WSE APK: küçükten sonra büyük %99, büyükten sonra küçük yalnızca %62 → katı A-B gerçek değil |
| Zorluk kaldıracı | Yalnızca süre (satır + kelime) | Süre (yerleşim sayısı) **+** kelime uzunluğu (S tier 4–5 harf) **+** L31'den itibaren ters oranı (yalnızca zor tier'larda) | WSE `hwp`: L1–34'te 0, sonra yalnızca dönüşümlü levellarda 25–35 |
| Ters / çapraz | Ters %20 global (prototip) | **Ters %0 L1–30**; çapraz %0 L1–2, %50 L3+; L31+ ters yalnızca H (%20) ve S (%33) | WSE `hwp` kalıbı; /ux #8 FTUE'de ters kapatma |
| Duvar | Yok | **S tier L10, 20, 30** (daha uzun + kısa kelimeler; risk kaldıracı yok) | Amaze GO! v1 ve v3 varyantlarında tier 3 L10/L20'de |
| Fail hedefi | Tek band (%2–8) | **Tier başına ilk-deneme kazanma hedefi** + Poisson fail modeli | Amaze GO! `firstwinrate` 0,69 / 0,58 / 0,55 / 0,51 |
| Level sayısı | 20 | 30 | Tier periyodu 10; 3 periyot |
| Kelime sayısı türetimi | WSE 10↔7 çevirisi | **K ≈ hücre / 52** (p=0,50, PER 5, ort. 5,2 harf) | WSE'nin hücre/6–7'si p≈0,75 + kesişim + tek kopya içindir; PER 5 ve kesişimsiz yerleşimde kelime başına 26 hücre düşer |
| Toplam süre | 20 level ≈ 47 dk | 30 level ≈ 61 dk (tahmin) | — |

v01'in kelime listeleri korunup tier boyutlarına göre kırpıldı/uzatıldı; 10 yeni tema eklendi.

## Sabitler ve varsayımlar

| Parametre | Değer | Not |
|---|---|---|
| `COLS` | **17** (tüm levellar) | /ux #11. Sütun sabit → hücre 20 pt ve harf 14,4 pt her levelda aynı; satır sayısı yalnızca tahtanın ekranda kapladığı yüksekliği değiştirir (WSE "küçük tahta = kolay" yanılsamasının görsel taşıyıcısı, /ux #8 cevabı) |
| `PER` | 5 | E1; risk kaldıracı, oynatılmaz |
| `MAXL` | 5 | E1 |
| `MAXH` | 3 / level, tüm tier'lar | Sayı sabit; ipucu/yerleşim oranı tier'la doğal düşer (F %15 → S %6). Sayıyı tier'a bağlamak /gameplay konusu (#17) |
| Çapraz ağırlığı | L1–2: **%0**; L3+: %50 (prototip `DIRS` nominal) | FTUE: sadece sağa ve aşağı. L3'te çapraz tanıtımı gerekir (/ux, #18); WSE FTUE'de "Some words are placed diagonally!" ayrı adım |
| Ters ağırlığı | **L1–30: %0** tüm tier'lar; L31+: N/R %0, H %20 (ileri 4 : geri 1), S %33 (2 : 1) | WSE `hwp` L1–34 = 0, sonra yalnızca dönüşümlü levellarda. Prototipin bugünkü %20'si "H tier, L31+" değeri olur |
| Dolgu alfabesi | `FILL` | sabit |
| Hedef hücre oranı bandı | **p = 0,45–0,55**, gerçekleşen 0,478–0,520 | prototip 0,52 |
| Ekran | 390×844 pt, HUD 108 pt, chip 48 pt sabit (/ux Seçenek C), banner 50–90 → viewport 366×593/553 | `docs/ux/gameplay-layout-v01.md#12-hedef-yerleşim`. 17×26 = 352×536 pt → 90 pt bannerla da sığar |
| Süre modeli | \( T \approx 10 + 16K \) s (ilk kopya 6 s, sonraki 4 kopya 2,5 s, açılış/kapanış 10 s) | v01 ile aynı; kalibre edilmedi (#9 log) |
| Yanlış tap oranı ε | yerleşim başına yanlış tap; **ölçülmedi**; modelde 0,033 / 0,05 / 0,08 | Amaze GO! normal tier: 59 ok, 3 can, kazanma 0,69 → Poisson λ≈1,95 → ε≈0,033/ok. Tap Words değeri #9 logundan gelir |

### Kelime sayısı türetimi

\( p = \dfrac{K \cdot PER \cdot \bar L}{R \cdot C} \Rightarrow K = \dfrac{p \cdot R \cdot C}{PER \cdot \bar L} = \dfrac{0{,}50 \cdot \text{hücre}}{26} \approx \dfrac{\text{hücre}}{52} \)

| Tahta | Hücre | K = hücre/52 | Seçilen K | Σ harf hedefi (p 0,48–0,52) | Yerleşim |
|---|---|---|---|---|---|
| 17×12 (FTUE) | 204 | 3,9 | 4 | 20 | 20 |
| 17×16 | 272 | 5,2 | 5 | 26–28 | 25 |
| 17×21 | 357 | 6,9 | 7 | 35–37 | 35 |
| 17×26 | 442 | 8,5 | 9 (5–6 harf) / 10 (4–5 harf) | 44–46 | 45 / 50 |

WSE'de kelime ≈ hücre/6,5; Tap Words'te hücre/52 — fark 8×, çünkü WSE p≈0,75 (dolgu %22–27), kesişim var ve her kelime 1 kopya; Tap Words p≈0,50, kesişim yok, 5 kopya. Hücre adımları: 272 → 357 (**1,31×**) → 442 (**1,24×**); uçtan uca 1,63×. WSE APK komşu adımları 1,17–1,33× (36→42→56→72→90), "1,3–1,6×" özeti iki adımlık farkı kapsıyor; v02 komşu adımları WSE'ninkiyle örtüşüyor.

## Tier parametre seti (iki ritim seçeneğinde ortak)

Amaze GO! modeli: level numarası → tier; tier → havuz. Tap Words'te generator parametrik olduğu için havuz yerine **tier → parametre seti** yeter. Tier 4 (nightmare) **tanımsız**: Tap Words'te süre dışında kalan tek sert kaldıraçlar PER ve can, ikisi de E1'de. E1 açılana kadar dizideki 4'ler S olarak oynanır.

| Tier | Ad | Grid | Kelime | Uzunluk | Yerleşim | p | İpucu (oran) | Ters (L1–30 / L31+) | Süre (tahmin) | Rol |
|---|---|---|---|---|---|---|---|---|---|---|
| **F** | FTUE | 17×12 | 4 | 4–6 | 20 | 0,49 | 3 (%15) | %0 / — | 1:14 | Yalnızca L1; çapraz da %0 |
| **R** | Relief (nefes) | 17×16 | 5 | 4–7 | 25 | 0,48–0,52 | 3 (%12) | %0 / %0 | 1:30 | Her H ve S'den sonra; L2 (FTUE) |
| **N** | Normal | 17×21 | 7 | 4–7 | 35 | 0,49–0,52 | 3 (%8,6) | %0 / %0 | 2:02 | Taban |
| **H** | Hard | 17×26 | 9 | 4–7 | 45 | 0,50–0,52 | 3 (%6,7) | %0 / %20 | 2:34 | Uzun level |
| **S** | Super hard | 17×26 | 10 | **4–5** | 50 | 0,52 | 3 (%6) | %0 / %33 | 2:50 | L10/20/30; kısa kelime (mechanic.md: "kısa kelime fark edilmesi zor") + prototipin 50 yerleşimi |

Tier'lar arası fark **risk değil hacim**: p sabit kaldığı için dokunuş başına can kaybı olasılığı aynı; yerleşim sayısı arttıkça birikimli yanlış tap artar ve 5 can daha sık biter. Bu, Amaze GO!'nun "tier = daha fazla ok, aynı hata oranı" mantığıyla birebir aynı (normal 59 → nightmare 172 ok, dolu hücre oranı sabit %47–49).

## Seçenek A — Yumuşak ritim (5'te 1 zor; Amaze GO! varyant 3)

### Öneri
Tier dizisi periyot 10: `1111211113` (Amaze GO! `LevelsDifficulty3`, en yumuşak A/B kolu); her hard+ levelı R izler; L1 F, L2 R. L1–30: `F R N N H R N N N S | R N N N H R N N N S | R N N N H R N N N S` → hard+ 6/30 (%20).

### Gerekçe
Amaze GO!'nun en yumuşak kolu; ilk zor level L5, tier 3 L10/L20. Fail state'li oyunda ilk 30 levelda en az kayıp üretir. Her 50 levelda 10 hard+ (Amaze GO! "her 50 levelda sabit sayı").

### Referans
`docs/references/amaze-go.md#apk-analizi` → "Tier ritmi" tablosu, varyant 3: 240/30/15/15, hard+ aralığı tam 5, ilk hard L5.

### Trade-off
- WSE'nin boyut dönüşümü kaybolur: 3 ardışık N (aynı 17×21 tahta üst üste), oturum içinde "küçük → büyük" kontrastı 10 levelda 2 kez. WSE APK'da küçükten sonra büyük gelme %99 — bu seçenek o kalıbı taşımıyor.
- Büyük tahta (45–50 yerleşim) 30 levelda 6 kez → prototipin "50 yerleşim topla" hissi (Pillar 4) seyrek.
- Pillar 7 (level hissi): 17 N levelı tek tip hissettirebilir; WSE bunu 65 level tek tiple yapıyor ama fail'siz.

### Gerekli görüşler
Yok (B ile aynı agent'lar).

### Ölçüm
B ile aynı metrikler; ayrıca N levellarında "sonraki seviye" tıklama oranı L3→L4→… ardışık N'lerde ≥ 3 puan düşerse tek tiplik sinyali.

## Seçenek B — Orta ritim (3'te 1 zor; Amaze GO! varyant 1) — Önerilen

### Öneri
Tier dizisi periyot 10: `1121121113` (Amaze GO! `LevelsDifficulty1`); hard+ sonrası level her zaman R; L1 F, L2 R; ilk periyot FTUE için `11 2R 2R 3` olarak sıkıştırılır. L1–30: `F R N N H R H R N S | R N H R N H R N N S | R N H R N H R N N S` → hard+ 9/30 (%30); dağılım R 9, N 11, H 6, S 3, F 1.

### Gerekçe
- İki referansı aynı anda karşılar: Amaze GO!'nun düzenli 3–4 aralığı (varyant 1: 210/60/24/6, hard+ aralığı 3–4, "hard+ ardışık gelmez") ve WSE'nin "küçükten sonra büyük" kuralı (her R'yi N veya H izler: 9/9; her H/S'yi R izler: 9/9).
- Toplam risk A ile aynı, dağılımı farklı: ε=0,05 modeliyle 10 levelda beklenen fail A 0,40, B 0,39 (hesap aşağıda). B riski 3 büyük levelda toplar, karşılığında 3 R verir; A riski 6 orta levela yayar. Kontrast = ritim (Pillar 7).
- Büyük tahta 30 levelda 9 kez (A'da 6): koleksiyon hissi (Pillar 4) daha sık.
- Tier 3 L10/L20/L30'a oturur: "her 10 levelda duvar" kalıbı risk kaldıracı açmadan, kısa kelime + 50 yerleşimle sağlanır.

### Referans
- `docs/references/amaze-go.md#apk-analizi` → "Tier ritmi" varyant 1 (`11211211131121121113`), "hard+ ardışık gelmiyor", Relief havuzu; `firstwinrate`.
- `docs/references/word-search-explorer.md#apk-analizi` → küçükten sonra büyük %99; grid seti ve komşu adım oranları; `hwp` L35+ yalnızca dönüşümlü levellarda.

### Trade-off
- L5 H ve L7 H arasına tek R giriyor; oyuncu L3–L7'de 5 levelda 2 kez 45 yerleşimlik tahta görür. Amaze GO! varyant 1'de ilk hard L3; biz L5'e ittik, daha erken değil.
- R 9/30: 5 chip tek satır, ikinci satır boş (/ux #8: kabul, 48 pt sabit).
- Level süresi varyansı yüksek (1:30 ↔ 2:50); oturum planlaması (LiveOps) için levelden çok dakika bazlı eşik gerekir (#10).
- Pillar 6 ile gerilim yok: tüm kaldıraçlar mekanikten. Pillar 3 ile gerilim yok: p sabit.

### Gerekli görüşler
- **/prototype** (#9 güncellendi): `rows`, `words`, `dirWeights` level alanı; riskli satır doğrulaması; ε ve süre logu.
- **/gameplay** (#17): ipucu sayısının tier'a bağlanıp bağlanmayacağı; ε ölçümü 0,03'ün altında çıkarsa E1'in erken açılması gerekir mi; tier 4 için PER 4 adaylığı (E1 içinde).
- **/ux** (#18): L3 çapraz tanıtımı, L31 ters tanıtımı (coach satırı); tier'ın oyuncuya gösterilip gösterilmeyeceği ("Zor level" rozeti). /ux'in #16 sorusu bu dokümanla cevaplanır: tüm kelimeler ≤ 7 harf, kelime sayısı 4–10, 11+ kelimeli tier yok → chip alanı 48 pt sabit kalır.
- **/market-research** (#19): Amaze GO! hard/superhard levelı oyuncuya etiketliyor mu; ComeBack/Relief havuzu hangi tetikleyiciyle devreye giriyor.
- **/liveops** (#10 güncellendi): 30 level ≈ 61 dk.

### Ölçüm
Aşağıda "Fail modeli ve hedefler" ve "Ölçüm" bölümlerinde.

## Karşılaştırma

Fail modeli: yanlış tap sayısı ~ Poisson(ε·Y), Y = yerleşim; fail = P(X ≥ 5). ε Amaze GO! kalibrasyonuyla 0,033, v01 varsayımıyla 0,05–0,08.

| Tier | Y | fail (ε 0,033) | fail (ε 0,05) | fail (ε 0,08) |
|---|---|---|---|---|
| F | 20 | %0,1 | %0,4 | %2,4 |
| R | 25 | %0,2 | %0,9 | %5,3 |
| N | 35 | %0,7 | %3,3 | %15,2 |
| H | 45 | %1,8 | %7,8 | %29,4 |
| S | 50 | %2,7 | %10,9 | %37,1 |

| | A (yumuşak) | B (orta) |
|---|---|---|
| Hard+ / 30 level | 6 (%20) | 9 (%30) |
| R / N / H / S | 6 / 17 / 3 / 3 | 9 / 11 / 6 / 3 |
| Beklenen fail / 10 level (ε 0,05) | 0,40 | 0,39 |
| Beklenen fail / 10 level (ε 0,08) | 1,86 | 1,90 |
| WSE "küçükten sonra büyük" | 6/6 R'den sonra evet; ama 3'lü N dizileri | 9/9 evet; H/S'den sonra her zaman R |
| Büyük tahta (45–50 yerleşim) sayısı | 6 | 9 |
| Toplam süre (tahmin) | 61 dk | 61 dk |
| Amaze GO! karşılığı | varyant 3 (en yumuşak) | varyant 1 |

## Önerilen

**Seçenek B.** Aynı toplam riskle daha fazla kontrast ve daha fazla büyük tahta; iki referansın kalıplarını aynı anda taşıyor. **Geri dönüş koşulu:** #9 logunda ε > 0,08 çıkarsa (H fail > %25) B'den A'ya geçmek yerine H 9 → 8 kelime (Y=40, p 0,47) ve S 10 → 9 kelime (Y=45) yapılır; ritim korunur, hacim düşer.

## Level tablosu L1–30 (Seçenek B)

Grid sütun×satır. Ters/çapraz = nominal `DIRS` ağırlığı. p = 5 × Σharf / hücre, aşağıdaki gerçek listelerle. Hedef = ilk-deneme kazanma hedefi (tier başına; türetim "Fail modeli" bölümünde). Süre = 10 + 16K s.

| # | Tier | Tema | Grid | Kelime | PER | Uzunluk | Ters | Çapraz | Can | İpucu | p | Hedef kazanma | Süre | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | F | Meyveler | 17×12 | 4 | 5 | 4–6 | %0 | **%0** | 5 | 3 | 0,490 | ≥ 0,98 | 1:14 | Sadece sağa/aşağı; **generator riski: 2 yön, 204 hücre** |
| 2 | R | Renkler | 17×16 | 5 | 5 | 5–7 | %0 | **%0** | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | 2 yön + KIRMIZI (7); **generator riski** |
| 3 | N | Hayvanlar | 17×21 | 7 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | Çapraz tanıtımı (coach, /ux #18) |
| 4 | N | Sofra | 17×21 | 7 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | |
| 5 | H | Ev | 17×26 | 9 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,498 | ≥ 0,90 | 2:34 | İlk büyük tahta; özel harf %0 |
| 6 | R | Okul | 17×16 | 5 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | Nefes |
| 7 | H | Vücut | 17×26 | 9 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,509 | ≥ 0,90 | 2:34 | |
| 8 | R | Taşıtlar | 17×16 | 5 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | TRAMVAY (7) 17×16'da; **generator riski** |
| 9 | N | Deniz | 17×21 | 7 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | |
| 10 | **S** | Giysi | 17×26 | 10 | 5 | **4–5** | %0 | %50 | 5 | 3 | 0,520 | ≥ 0,85 | 2:50 | Duvar 1; 50 yerleşim / 442 hücre; **generator riski** |
| 11 | R | Sebzeler | 17×16 | 5 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | Nefes; banner reklamı ~bu levelda (liveops) |
| 12 | N | Spor | 17×21 | 7 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | HENTBOL (7) |
| 13 | H | Meslekler | 17×26 | 9 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,520 | ≥ 0,90 | 2:34 | p üst uç; **generator riski** |
| 14 | R | Müzik | 17×16 | 5 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,478 | ≥ 0,98 | 1:30 | p alt uç |
| 15 | N | Şehir | 17×21 | 7 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | |
| 16 | H | Bahçe | 17×26 | 9 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,509 | ≥ 0,90 | 2:34 | Özel harf %18 (en yüksek) |
| 17 | R | Tatlılar | 17×16 | 5 | 5 | 5–7 | %0 | %50 | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | BAKLAVA (7); **generator riski** |
| 18 | N | Aile | 17×21 | 7 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,504 | ≥ 0,95 | 2:02 | |
| 19 | N | Oyuncaklar | 17×21 | 7 | 5 | 5–6 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | |
| 20 | **S** | Doğa | 17×26 | 10 | 5 | **4–5** | %0 | %50 | 5 | 3 | 0,520 | ≥ 0,85 | 2:50 | Duvar 2; **generator riski** |
| 21 | R | Kuşlar | 17×16 | 5 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,478 | ≥ 0,98 | 1:30 | |
| 22 | N | İçecekler | 17×21 | 7 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,490 | ≥ 0,95 | 2:02 | |
| 23 | H | Çiftlik | 17×26 | 9 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,498 | ≥ 0,90 | 2:34 | TRAKTÖR (7) |
| 24 | R | Uzay | 17×16 | 5 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,496 | ≥ 0,98 | 1:30 | GEZEGEN (7); **generator riski** |
| 25 | N | Kahvaltı | 17×21 | 7 | 5 | 5–7 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | YUMURTA (7) |
| 26 | H | Aletler | 17×26 | 9 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,509 | ≥ 0,90 | 2:34 | |
| 27 | R | Böcekler | 17×16 | 5 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,515 | ≥ 0,98 | 1:30 | İki 7 harfli (KELEBEK, KARINCA) 17×16'da; **generator riski** |
| 28 | N | Banyo | 17×21 | 7 | 5 | 4–7 | %0 | %50 | 5 | 3 | 0,518 | ≥ 0,95 | 2:02 | ŞAMPUAN (7) |
| 29 | N | Zaman | 17×21 | 7 | 5 | 4–6 | %0 | %50 | 5 | 3 | 0,490 | ≥ 0,95 | 2:02 | |
| 30 | **S** | Mutfak Eşyaları | 17×26 | 10 | 5 | **4–5** | %0 | %50 | 5 | 3 | 0,520 | ≥ 0,85 | 2:50 | Duvar 3; L31'den itibaren S tier ters %33 alır; **generator riski** |

p aralığı **0,478–0,520** (ortalama 0,505). Toplam süre: 74 + 9×90 + 11×122 + 6×154 + 3×170 = 3660 s ≈ **61 dk**; 11,3 dk oturumla ≈ 5–6 oturum.

**L31+ görünümü (bu dokümanın kapsamı dışında, yön için):** dizi `1121121113` devam eder; H tier ters %20, S tier ters %33 alır (WSE `hwp` L35+ dönüşümlü kalıbı); N ve R ters %0 kalır. Tier 4 E1 sonrası tanımlanır.

## Kelime listeleri

Kurallar: Türkçe, 4–7 harf (S tier 4–5), yaygın; aynı levelda hiçbir kelime veya tersi başka bir kelimenin alt dizisi değil (generator kısıtı: kaza temizliği dolgu hücresi bulamayınca `unfixable` → `throw`); kelimeler 30 level boyunca tekrar etmez. Özel harf = İ Ş Ğ Ç Ö Ü; Türkçe metinde doğal payı ~%15.

| # | Tier | Tema | Kelimeler | Σ harf | Ort. | Özel harf |
|---|---|---|---|---|---|---|
| 1 | F | Meyveler | ELMA KİRAZ KAVUN KARPUZ | 20 | 5,00 | 1/20 = %5 |
| 2 | R | Renkler | KIRMIZI PEMBE YEŞİL SİYAH BEYAZ | 27 | 5,40 | 3/27 = %11 |
| 3 | N | Hayvanlar | ASLAN KAPLAN TAVŞAN KARTAL YILAN KEDİ KOYUN | 37 | 5,29 | 2/37 = %5 |
| 4 | N | Sofra | EKMEK PEYNİR ÇORBA ZEYTİN KAHVE ŞEKER LİMON | 37 | 5,29 | 5/37 = %14 |
| 5 | H | Ev | MASA KOLTUK YASTIK PERDE LAMBA DOLAP TABAK HALI KAPI | 44 | 4,89 | 0/44 = %0 |
| 6 | R | Okul | KALEM DEFTER SİLGİ KİTAP CETVEL | 27 | 5,40 | 3/27 = %11 |
| 7 | H | Vücut | KAFA BURUN KULAK PARMAK DİRSEK BACAK OMUZ BOYUN DUDAK | 45 | 5,00 | 1/45 = %2 |
| 8 | R | Taşıtlar | ARABA UÇAK KAMYON VAPUR TRAMVAY | 27 | 5,40 | 1/27 = %4 |
| 9 | N | Deniz | BALIK DALGA KUMSAL MARTI YENGEÇ KAYIK MİDYE | 37 | 5,29 | 2/37 = %5 |
| 10 | S | Giysi | ETEK CEKET ÇORAP ŞAPKA KEMER ATKI BERE KAZAK PALTO ŞORT | 46 | 4,60 | 3/46 = %7 |
| 11 | R | Sebzeler | SOĞAN HAVUÇ KABAK LAHANA PIRASA | 27 | 5,40 | 2/27 = %7 |
| 12 | N | Spor | FUTBOL TENİS YÜZME KOŞU GÜREŞ HENTBOL KAYAK | 37 | 5,29 | 5/37 = %14 |
| 13 | H | Meslekler | DOKTOR AŞÇI POLİS KASAP TERZİ BERBER HAKİM PİLOT MİMAR | 46 | 5,11 | 7/46 = %15 |
| 14 | R | Müzik | GİTAR PİYANO KEMAN DAVUL ŞARKI | 26 | 5,20 | 3/26 = %12 |
| 15 | N | Şehir | SOKAK CADDE KÖPRÜ MEYDAN PAZAR BANKA ECZANE | 37 | 5,29 | 2/37 = %5 |
| 16 | H | Bahçe | ÇİÇEK AĞAÇ ÇİMEN TOHUM SAKSI KÜREK HORTUM YAPRAK LALE | 45 | 5,00 | 8/45 = %18 |
| 17 | R | Tatlılar | HELVA LOKUM PASTA AŞURE BAKLAVA | 27 | 5,40 | 1/27 = %4 |
| 18 | N | Aile | KARDEŞ TEYZE YEĞEN ENİŞTE KUZEN TORUN ANNE | 36 | 5,14 | 4/36 = %11 |
| 19 | N | Oyuncaklar | BEBEK TOPAÇ MİSKET BALON ROBOT YAPBOZ KUKLA | 37 | 5,29 | 2/37 = %5 |
| 20 | S | Doğa | NEHİR VADİ TEPE BULUT KAYA ÇAYIR DERE ORMAN YAMAÇ SAHİL | 46 | 4,60 | 5/46 = %11 |
| 21 | R | Kuşlar | SERÇE KARGA LEYLEK BAYKUŞ KUĞU | 26 | 5,20 | 4/26 = %15 |
| 22 | N | İçecekler | AYRAN KOLA BOZA SALEP GAZOZ ŞERBET ŞALGAM | 35 | 5,00 | 2/35 = %6 |
| 23 | H | Çiftlik | İNEK TAVUK HOROZ KEÇİ EŞEK ÖRDEK TRAKTÖR SAMAN TARLA | 44 | 4,89 | 6/44 = %14 |
| 24 | R | Uzay | YILDIZ ROKET UYDU DÜNYA GEZEGEN | 27 | 5,40 | 1/27 = %4 |
| 25 | N | Kahvaltı | YUMURTA REÇEL SUCUK SİMİT SOSİS BÖREK SALAM | 37 | 5,29 | 4/37 = %11 |
| 26 | H | Aletler | ÇEKİÇ MATKAP PENSE VİDA MAKAS BALTA RENDE KAZMA KESKİ | 45 | 5,00 | 5/45 = %11 |
| 27 | R | Böcekler | SİNEK PİRE KELEBEK KARINCA AKREP | 28 | 5,60 | 2/28 = %7 |
| 28 | N | Banyo | SABUN HAVLU FIRÇA TARAK AYNA ŞAMPUAN LAVABO | 37 | 5,29 | 2/37 = %5 |
| 29 | N | Zaman | SAAT DAKİKA HAFTA SANİYE GECE SABAH AKŞAM | 35 | 5,00 | 3/35 = %9 |
| 30 | S | Mutfak Eşyaları | TAVA KAŞIK ÇATAL BIÇAK KEPÇE TEPSİ CEZVE KASE KUPA OCAK | 46 | 4,60 | 4/46 = %9 |

Notlar: "Çiçekler" ve "Hava" temaları denendi, elendi — Çiçekler kelimeleri 6–7 harf ağırlıklı (7 kelimede Σ ≥ 42, p ≥ 0,59), Hava özel harf oranı %22–30 (YAĞMUR, GÜNEŞ, ŞİMŞEK). İkisi de ileride büyük tahtada (H, 9 kelime) veya özel harf eşiği belirlenince kullanılabilir. Lokalizasyon: parametre seti (tier dizisi, grid, K, PER, yön ağırlığı) dil bağımsız; listeler dil başına kürate edilir, Σ harf hedefi tabloya göre korunur.

## Fail modeli ve hedefler

Model: yanlış tap sayısı ~ Poisson(ε·Y); fail = P(X ≥ 5); ε = yerleşim başına yanlış tap oranı (p sabit tutulduğu için tier'dan bağımsız varsayılır, ölçülecek).

Amaze GO! `firstwinrate` türetimi:

| | Amaze GO! (3 can) | Tap Words v02 hedefi (5 can) | Model (ε 0,05) |
|---|---|---|---|
| Normal | 0,69 (fail %31) | **N ≥ 0,95** (fail ≤ %5) | %3,3 |
| Hard | 0,58 (fail %42; normalin 1,35×) | **H ≥ 0,90** (fail ≤ %10; 2×) | %7,8 |
| Super hard | 0,55 (fail %45; 1,45×) | **S ≥ 0,85** (fail ≤ %15; 3×) | %10,9 |
| Nightmare | 0,51 | tanımsız (E1) | — |
| Relief / FTUE | — (ComeBack/Relief havuzu) | **R, F ≥ 0,98** (fail ≤ %2) | %0,9 / %0,4 |

Neden mutlak değerler alınmadı: Amaze GO!'nun %31 normal fail'i, ok başına ~%3,3 hata ve 3 can ile çıkıyor. Tap Words'te 5 can ve PER 5 sabitken aynı mutlak oranlara ancak ε ≥ 0,10 ile ulaşılır — bu da p'yi bandın dışına çıkarmak (risk kaldıracı) demek, E1'in konusu. Alınan: **tier'lar arası sıralama ve oran**. Tap Words'te fail oranları tier'lar arasında Amaze GO!'dan daha dik açılıyor (1 : 2 : 3 vs 1 : 1,35 : 1,45) çünkü tek değişen yerleşim sayısı ve can sabit. E1 açıldığında Amaze GO! mutlak değerleri (0,69 / 0,58 / 0,55) hedef adayıdır.

Kalibrasyon kuralı: #9 logundan ε geldiğinde,
- ε ≤ 0,033 → tüm tier'lar hedefin çok altında kalır (S fail %2,7); eğri zorluk üretmiyor demektir → E1 açılması için sinyal (/gameplay, #17). Eğri değişmez.
- 0,033 < ε ≤ 0,08 → hedefler tutar, eğri kalır.
- ε > 0,08 → H 8 kelime (Y 40), S 9 kelime (Y 45); p 0,47–0,50 bandında kalır.

## Ölçüm

Prototipe level başına log gerekir: `{level, tier, ms, wrongTaps, hintsUsed, result}` (#9).

| Metrik | Hedef | Başarısızlık sinyali |
|---|---|---|
| ε = yanlış tap / yerleşim | Tier'lar arasında ±%20 içinde sabit | R ve S arasında ε farkı > %20 ise p bandı pratikte risk üretiyor; S'nin kısa kelimeleri ε'yi artırıyorsa S 4–5 harf → 4–6 harf |
| İlk-deneme kazanma | F/R ≥ 0,98, N ≥ 0,95, H ≥ 0,90, S ≥ 0,85 | Herhangi bir tier 5 puan altında → kalibrasyon kuralı |
| Level fail rate (can 0) | F/R ≤ %2, N ≤ %5, H ≤ %10, S ≤ %15 | Aynı tier içinde iki level arasında > 5 puan fark → kelime listesi sorunu (özel harf, kısa kelime), parametre değil |
| Süre (medyan) | R 1:15–2:00, N 1:45–2:45, H 2:15–3:30, S 2:30–3:45 | H > 3:30 → H 8 kelime |
| "Sonraki seviye" tıklama | R sonrası ≥ H/S sonrasından 5 puan yüksek | Fark yoksa Relief hissi taşınmıyor; A'ya geçiş gündeme gelir |
| Yanlış tap / level | R ≤ 2, N ≤ 3, H ≤ 4, S ≤ 4,5 (ε 0,08 tavanı) | |
| İpucu kullanımı | F/R ≤ 1,5; N ≤ 2; H/S ≤ 2,5 | H/S'de 3/3 kullanım > %40 → ipucu tier'a bağlanır (/gameplay #17) |
| L3 çapraz, L31 ters tanıtımı | İlk çapraz yerleşimi bulma süresi ≤ 2 × önceki yerleşim ortalaması | Aşıyorsa coach gerekli (/ux #18) |

## Level verisi formatı (öneri)

Global sabitler: `COLS=17`, `PER`, `MAXL`, `MAXH`, `FILL`. Tier parametre tablosu ve tier dizisi veri; level yalnızca tier ve kelimeleri taşır:

```js
const TIERS = {
  F: { rows: 12, diag: 0,   rev: 0 },
  R: { rows: 16, diag: 0.5, rev: 0 },
  N: { rows: 21, diag: 0.5, rev: 0 },
  H: { rows: 26, diag: 0.5, rev: 0 },      // L31+: rev 0.20
  S: { rows: 26, diag: 0.5, rev: 0 },      // L31+: rev 0.33
};
const RHYTHM = "FRNNHRHRNS" + "RNHRNHRNNS".repeat(…); // L1'den itibaren
const LEVELS = [
  { id: 3, theme: "Hayvanlar", words: ["ASLAN", "KAPLAN", …] },
  …
];
```

`diag`/`rev` → `DIRS` ağırlığına çevrilir: her yön ailesi için ileri ağırlık `(1−rev)`, geri `rev`; çapraz aileler `diag`, düz aileler `(1−diag)` ile çarpılır. L1–2 için `diag: 0` ayrıca FTUE override'ı. Level satırında `tier` alanı opsiyonel (dizi override'ı için).

## Prototip görevi

Uygulama ADR sonrası; doğrulama şimdi (mekaniği değiştirmez, geçici script, repo dışı):

1. **Generator doğrulama** — tablodaki riskli satırlar, her biri 1000 üretim; başarısızlık (`throw`) oranı ve ortalama `attempt`. Eşik: %0 / ≤ 5.
   - L1, L2: `COLS=17`, `ROWS=12/16`, **yalnızca sağa ve aşağı yön** (2 yön), p 0,49.
   - L10, L20, L30: 17×26, 10 kelime 4–5 harf, 50 yerleşim, p 0,52.
   - L13: 17×26, 9 kelime, p 0,52.
   - L8, L17, L24, L27: 17×16, 7 harfli kelime(ler), çapraz %50.
   - Aşılırsa: S'de 10 → 9 kelime; R'de 7 harfli → 5–6 harfli (p yeniden hesaplanır, Σ hedefi tabloda).
2. ADR sonrası: `COLS` 20 → 17; `ROWS` → `TIERS[tier].rows`; `DIRS` level başına `diag`/`rev`'den üretilir; `WORDS` → `LEVELS[i].words`; `generate()`, `inb()`, `fit()` bunları levelden okur.
3. Level sonu log: `{level, tier, ms, wrongTaps, hintsUsed, result}` → `localStorage` + konsol; ε = `wrongTaps / (K×PER)`.

## Açılan sorular

open-questions.md: #9 güncellendi (v02 doğrulama listesi), #10'a süre notu eklendi, #11 ve #16 (ux → level-design) kapatıldı; yeni: #17 (/gameplay: ipucu-tier bağı, ε eşiği ve E1 sinyali, tier 4 adayı), #18 (/ux: L3 çapraz ve L31 ters tanıtımı, tier rozeti), #19 (/market-research: Amaze GO! tier etiketi ve Relief/ComeBack tetikleyicisi).
