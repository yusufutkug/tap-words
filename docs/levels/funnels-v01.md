# Funnel A / B / C — 100 Levellık Üç Varyant (10'luk Set Desenleri)

- Tarih / sürüm: 2026-11-13 / v01 (taslak; K1 "funnel kararı" için playtest adayları)
- Alan: level-design (ana sohbet)
- Model: `funnel-v01.md` (Amaze GO!: tier dizisi + tier parametre seti + tema havuzu; ADR-0010 taslak). Bu doküman modelin **üç farklı dizi/ayar** ile 100 levele uygulanmasıdır; model değişmez.
- Veri: `tools/funnel-a.json`, `-b.json`, `-c.json` (dizi + tier seti) + ortak havuz `tools/funnel-pool.json` (116 liste) → `node tools/bake.js funnel tools/funnel-<x>.json > funnel-<x>-levels.js` → `node tools/bake.js pack funnel-<x>-levels.js funnel-<x> > levels/funnel-<x>.json`.
- Prototip: `index.html?funnel=a|b|c` (son seçim hatırlanır; menüde Funnel satırından geçiş). Her funnel kendi kaldığı leveli saklar.
- Karar: üçü de oynanır, biri (veya karması) ADR-0010'a yazılır.

## Öneri

Aynı tier parametre setini ve aynı 116 listelik havuzu kullanan, yalnızca **10'luk set deseni** ve iki tier'ın dolgu modu farklı olan üç 100 levellık funnel: **A Ritim** (sabit Amaze 2. bant), **B Kademeli** (yumuşak giriş → sert son 50; H'ler `bigram`'a döner), **C Dalgalı** (sakin / sert setler dönüşümlü; R `disjoint`). Havuz her funnel'da farklı seed'le karıştırılır (`poolSeed` 1/2/3); aynı tema üç funnel'da farklı level numarasında çıkar.

### Ortak

| | Değer |
|---|---|
| Tier parametre seti | `funnel-v01.md#tier-parametre-seti` (F 12×17 K4 · R 14×19 K5 · N/H 15×21 K6 · S 16×23 K7; PER 5; can 3) |
| Havuz | `tools/funnel-pool.json`: F 3 · R 32 · N 41 · H 23 · S 17 = 116 liste; bantlar F 4 kelime 5–6 harf Σ 21–23 · R 5k 4–7 Σ 26–28 özel ≤ %15 · N 6k 4–6 Σ 29–30 özel ≤ 4/30 · H 6k 4–5 Σ 24–26 ≤ %10 · S 7k 4–5 Σ 28–31 ≤ %10; **kelime havuz genelinde tekil** |
| Doğrulama (bake) | palindrom, alt dize (ters dahil), kelime sayısı, uzunluk ve Σ bandı, özel harf sınırı, havuzda kelime tekrarı; dizide aynı kelime < 20 level, aynı tema < 30 level → hata, çıktı üretilmez |
| FTUE | L1 `diag 0, rev 0`, L2 `diag 0` (B'de L3 de `diag 0`: ilk N L4'te) |
| Seed | A 20261113 · B 20261114 · C 20261115 (+ n·10000 + offset) |

### A — Ritim

Her 10'luk set `R N H R N H R N N S`: 3 R · 4 N · 2 H · 1 S, duvar hep 10. levelda (ilk set `F R N N H R H R N S`). ADR-0010 taslağındaki dizi; **kontrol kolu.** Sayım F 1 · R 30 · N 39 · H 20 · S 10; D₂ ortalaması 9,4; set başına D₂ toplamı 94 (sabit); `bigram` 10 level (yalnızca S); tahmini süre ≈ 3 sa.

| Level | Desen | Temalar |
|---|---|---|
| 1–10 | `FRNNHRHRNS` | Çiçekler (F) · Ağaçlar (R) · Aylar (N) · Okyanus (N) · Çiftlik (H) · Matematik (R) · Tarım (H) · Uzay (R) · Olimpiyat (N) · Aile (S) |
| 11–20 | `RNHRNHRNNS` | Liman (R) · Manav (N) · Geometri (H) · Hastane (R) · Kafe (N) · Sayılar (H) · Kahvaltı (R) · Tiyatro (N) · Dersler (N) · Eylemler (S) |
| 21–30 | `RNHRNHRNNS` | Çöl (R) · Hayvanlar (N) · Masallar (H) · Ülkeler (R) · Kiler (N) · Vücut (H) · Sebzeler (R) · Park (N) · İnternet (N) · Hisler (S) |
| 31–40 | `RNHRNHRNNS` | Böcekler (R) · Oyuncaklar (N) · Tamirat (H) · Organlar (R) · Spor (N) · Sıfatlar (H) · Market (R) · Mahalle (N) · Gezegenler (N) · Renk Paleti (S) |
| 41–50 | `RNHRNHRNNS` | Meslekler (R) · Gardırop (N) · Tatil (H) · Okul (R) · Aletler (N) · Ofis (H) · Hava (R) · Finans (N) · Çalışanlar (N) · Kent (S) |
| 51–60 | `RNHRNHRNNS` | Kitap (R) · Meyve Sepeti (N) · Spor Sahası (H) · Baharat (R) · Banyo (N) · Araç (H) · Zaman (R) · Doğum Günü (N) · El İşi (N) · Araçlar (S) |
| 61–70 | `RNHRNHRNNS` | Fırın (R) · Yemekler (N) · Yönler (H) · Taşıtlar (R) · Konser (N) · Evcil Hayvan (H) · Sirk (R) · Dağ (N) · Kuşlar (N) · Arazi (S) |
| 71–80 | `RNHRNHRNNS` | Mobilya (R) · Salon (N) · Takılar (H) · Müzik (R) · Köy (N) · Çalgılar (H) · Sinema (R) · Şehir (N) · Sofra (N) · Vakit (S) |
| 81–90 | `RNHRNHRNNS` | Duygular (R) · Tonlar (N) · Masa Oyunları (H) · Düğün (R) · İçecekler (N) · Nitelikler (H) · Teknoloji (R) · Krallık (N) · Sahil (N) · Mutfak (S) |
| 91–100 | `RNHRNHRNNS` | Renkler (R) · Trafik (N) · Okul Günü (H) · Tatlılar (R) · Deniz (N) · Türkçe (H) · Oyunlar (R) · Bilim (N) · Kanatlılar (N) · Maç Günü (S) |

### B — Kademeli

Üç bölge: **L1–20 yumuşak giriş** (set 1'de 4 R, ilk H L10'da, S yok; set 2'de ilk S L20'de), **L21–50 Ritim**, **L51–100 sert**: set başına 2 S (biri ortada, biri sonda) ve H'ler `H+` = H parametreleri + `bigram` dolgu (havuz H). Son iki sette 3 H+. Tek funnel içinde "ilerledikçe zorlaşma" hissi veren varyant — Amaze'den sapma, WSE'ye yaklaşma. Sayım F 1 · R 26 · N 38 · H 9 · H+ 12 · S 14; D₂ ortalaması 9,6; set D₂ toplamı 84 → 94 → 99–101; `bigram` 26 level; tahmini süre ≈ 3 sa 5 dk.

| Level | Desen | Temalar |
|---|---|---|
| 1–10 | `FRRNRNNRNH` | Kıyafet (F) · Böcekler (R) · Düğün (R) · Tiyatro (N) · Sebzeler (R) · Doğa (N) · Okyanus (N) · Baharat (R) · Oyuncaklar (N) · Spor Sahası (H) |
| 11–20 | `RNNHRNHRNS` | Hava (R) · Kiler (N) · Aletler (N) · Coğrafya (H) · Müzik (R) · Köy (N) · Çiftlik (H) · Kitap (R) · Meyve Sepeti (N) · Tezgah (S) |
| 21–30 | `RNHRNHRNNS` | Market (R) · Krallık (N) · Araç (H) · Oyunlar (R) · Gardırop (N) · Tamirat (H) · Çöl (R) · Aylar (N) · Konser (N) · Araçlar (S) |
| 31–40 | `RNHRNHRNNS` | Taşıtlar (R) · Salon (N) · Vücut (H) · Kahvaltı (R) · İnternet (N) · Masa Oyunları (H) · Renkler (R) · Tonlar (N) · Bilim (N) · Makamlar (S) |
| 41–50 | `RNHRNHRNNS` | Şehirler (R) · Kafe (N) · Nitelikler (H) · Fırın (R) · Çalışanlar (N) · Tatil (H) · Duygular (R) · Sahil (N) · Olimpiyat (N) · Fotoğraf (S) |
| 51–60 | `NBRNBRNSNS` | Spor (N) · Tarım (H+) · Zaman (R) · Banyo (N) · Yönler (H+) · Okul (R) · Trafik (N) · Sınıf (S) · Deniz (N) · Bilgisayar (S) |
| 61–70 | `NBRNBRNSNS` | Şehir (N) · Ev (H+) · Uzay (R) · Dersler (N) · Türkçe (H+) · Hastane (R) · Canlılar (N) · Mutfak (S) · Doğum Günü (N) · Renk Paleti (S) |
| 71–80 | `NBRNBRNSNS` | Dağ (N) · Giysi (H+) · Matematik (R) · Kuşlar (N) · Takılar (H+) · Sinema (R) · Mahalle (N) · Aile (S) · Finans (N) · Eylemler (S) |
| 81–90 | `NBRNSBRNBS` | Kanatlılar (N) · Ofis (H+) · Organlar (R) · Park (N) · Kent (S) · Sıfatlar (H+) · Liman (R) · El İşi (N) · Evcil Hayvan (H+) · Maç Günü (S) |
| 91–100 | `NBRNSBRNBS` | Hayvanlar (N) · Masallar (H+) · Mobilya (R) · İçecekler (N) · Vakit (S) · Okul Günü (H+) · Ülkeler (R) · Manav (N) · Sayılar (H+) · Arazi (S) |

`B` dizide H+ kodudur (JSON `tiers.B`, `pool: "H"`, `label: "H+"`); pakette `tier: "B"`, prototip menüsünde "H+ bigram".

### C — Dalgalı

Tek ve çift setler dönüşümlü: **sakin set** `R N N R H R N N H S` (1 S sonda, 2 H) / **sert set** `N H R S N R H N R S` (2 S, biri 4. sırada — duvar set sonunda beklenmez). R tier burada `disjoint` dolgulu (`R−`): nefes levelı v03'te ölçülen −50 % süreyle gerçek nefes olur; H/S sonrası kontrast büyür. Sayım F 1 · R− 30 · N 35 · H 19 · S 15; D₂ ortalaması 9,5; set D₂ toplamı 94 / 96–98 dönüşümlü; `bigram` 15, `disjoint` 31 level; tahmini süre ≈ 2 sa 40 dk (R− kısa).

| Level | Desen | Temalar |
|---|---|---|
| 1–10 | `FRNNRHRNNS` | Çiçekler (F) · Market (R−) · Dersler (N) · Salon (N) · Organlar (R−) · Nitelikler (H) · Teknoloji (R−) · Gardırop (N) · Kiler (N) · Maç Günü (S) |
| 11–20 | `NHRSNRHNRS` | Konser (N) · Evcil Hayvan (H) · Bahçe (R−) · Bilgisayar (S) · Yemekler (N) · Tatlılar (R−) · Coğrafya (H) · Doğa (N) · Sirk (R−) · Tezgah (S) |
| 21–30 | `RNNRHRNNHS` | Renkler (R−) · İnternet (N) · Dağ (N) · Sinema (R−) · Ev (H) · Duygular (R−) · Banyo (N) · Mahalle (N) · Türkçe (H) · Arazi (S) |
| 31–40 | `NHRSNRHNRS` | Tiyatro (N) · Çiftlik (H) · Uzay (R−) · Araçlar (S) · Finans (N) · Hava (R−) · Tamirat (H) · Canlılar (N) · Oyunlar (R−) · Mutfak (S) |
| 41–50 | `RNNRHRNNHS` | Çöl (R−) · Doğum Günü (N) · Manav (N) · Baharat (R−) · Takılar (H) · Kitap (R−) · Kuşlar (N) · Park (N) · Okul Günü (H) · Sınıf (S) |
| 51–60 | `NHRSNRHNRS` | Deniz (N) · Tatil (H) · Zaman (R−) · Ahır (S) · Kafe (N) · Hastane (R−) · Araç (H) · Trafik (N) · Taşıtlar (R−) · Eylemler (S) |
| 61–70 | `RNNRHRNNHS` | Fırın (R−) · Şehir (N) · Sofra (N) · Müzik (R−) · Tarım (H) · Sebzeler (R−) · Köy (N) · Olimpiyat (N) · Spor Sahası (H) · Vakit (S) |
| 71–80 | `NHRSNRHNRS` | El İşi (N) · Masallar (H) · Böcekler (R−) · Makamlar (S) · Aylar (N) · Kahvaltı (R−) · Sayılar (H) · Okyanus (N) · Ağaçlar (R−) · Aile (S) |
| 81–90 | `RNNRHRNNHS` | Meslekler (R−) · Oyuncaklar (N) · Bilim (N) · Düğün (R−) · Çalgılar (H) · Okul (R−) · Aletler (N) · Çalışanlar (N) · Ofis (H) · Hisler (S) |
| 91–100 | `NHRSNRHNRS` | Gezegenler (N) · Sıfatlar (H) · Mobilya (R−) · Kent (S) · İçecekler (N) · Ülkeler (R−) · Vücut (H) · Krallık (N) · Matematik (R−) · Fotoğraf (S) |

### Karşılaştırma

| | A Ritim | B Kademeli | C Dalgalı |
|---|---|---|---|
| İlk S | L10 | L20 | L10 |
| S sayısı / 100 | 10 | 14 | 15 |
| H (+H+) / 100 | 20 | 9 + 12 | 19 |
| `bigram` level | 10 | 26 | 15 |
| `disjoint` level | 1 | 1 | 31 |
| Set D₂ toplamı | 94 sabit | 84 → 101 | 94 / 97 dönüşümlü |
| Duvar konumu | hep 10. | 10. (L51+ 8. ve 10.) | 10. / 4. ve 10. |
| Tahmini içerik süresi | ≈ 3 sa | ≈ 3 sa 5 dk | ≈ 2 sa 40 dk |
| Test ettiği soru | Amaze ritmi tek başına yeter mi? | Giriş yumuşatılınca L10 drop düşer mi; L51+ sertlik D7'yi taşır mı? | Beklenmedik duvar ve güçlü nefes (R−) "sonraki seviye" oranını artırır mı? |

Önerilen: **A kontrol**; B ve C birer hipotez. Üçü de oynanır; seçim `#ölçüm`'deki eşiklerle.

## Gerekçe

- Utku (13 Kas): "3 tane funnel hazırla hepsi 100 level olsun, patternleri 10'luk setler halinde düşün, levellar ve funnel'larda çeşitlilik istiyorum." Tek dizi + tek havuz sırası, hangi kaldıracın (yumuşak giriş, kademeli sertleşme, duvar konumu, nefes gücü) işe yaradığını ayırt ettirmez; üç varyant bunları birer birer oynatır.
- Amaze GO! ritmi (A) kanıtlı ama tier'lar sabit dağılımlı: oyuncu "ilerliyorum" sinyalini yalnızca level numarasından alır. WSE ilerledikçe parametre açar (`hwp` L35+); B bu iki modelin karmasıdır — sertleşme dizi ve dolgu modundan gelir, K/grid/p'den değil (ADR-0008 kaldıraç yasağına uyar).
- v03: `disjoint` −50 % süre, `bigram` +15–24 %. C bunları R/S'ye bağlayarak relief–duvar kontrastını büyütür; B `bigram`'ı H'ye de taşıyarak 50+ sonrası "yarım kelime tuzağı" yoğunluğunu artırır.
- Havuz tek ve kelime tekil olduğu için funnel'lar arası fark yalnızca dizi + dolgu + sıradır; playtest karşılaştırması temiz kalır.

## Referans

- `docs/references/amaze-go.md#apk-analizi` — tier dizisi `11211211131121121113`, Relief havuzu (C'nin R− fikri: relief'in gerçekten kolay olması).
- `docs/references/word-search-explorer.md#apk-analizi` — bölüm ilerledikçe parametre açma (B'nin L51+ bölgesi).
- `docs/levels/param-tests-v03-results.md#2`, `#4` — dolgu modu etkileri; `funnel-v01.md` — model ve tier seti.

## Trade-off

- **Üç funnel = üç playtest;** Utku tek başına 300 level oynamaz. Öneri: A L1–30 tam; B L1–20 + L51–60; C L1–20 + L31–40 (karakteristik setler). Ekip dağıtımıyla tamamı.
- **B'de H+ `bigram`:** S'den farkı yalnızca K 6 vs 7 ve grid; iki tier benzeşir (pillar "okunabilir zorluk" ile gerilim). Playtest'te H+ fail S'ye yaklaşırsa H+ kalkar.
- **C'de 31 `disjoint` level:** dolgu alfabesi 23 harfe düşen "yapay" tahta (v03 gözlemi) sık görülür; FTUE dışında görünüm rahatsız edebilir (/ux). Havuz-başına alfabenin okunurluğu #29'a bağlı.
- **Havuz 116 liste:** tek funnel 100 çeker, R 30/32 ve N 39/41 kullanıldı; yedek az. Yeni funnel varyantı için havuz büyütmek gerekir (kelime tekilliği kısıtı sıkı).
- Aynı tema üç funnel'da farklı tier'da değil, aynı tier'da farklı sırada çıkar (havuz tier etiketli); funnel'lar arası çeşitlilik sıradan ve desenden gelir, içerikten değil.

## Gerekli görüşler

- **/ux:** C'de sık `disjoint` tahta görünümü; B'de L51+ `bigram` yoğunluğunun okunabilirliğe etkisi; "4. levelda duvar" (C) sinyali (#18b).
- **/liveops:** B'nin L51+ sertliğinin play-on RV/coin talebine etkisi (ADR-0003/0004); C'nin kısa içerik süresinin (≈ 2 sa 40 dk) D7 içerik yeterliliği.
- **/level-design:** havuz yedeği (R/N) ve H/S 4–5 harfli yeni temalar; N özel harf sınırının 4/30 olarak yazılması.

## Ölçüm

`funnel-v01.md#ölçüm` eşikleri funnel başına; ek karşılaştırma metrikleri (prototip `ka-log`, kayıtta `funnel: a|b|c`):

| Metrik | A | B | C | Karar |
|---|---|---|---|---|
| L10 fail | ≤ %25 | L10 H: ≤ %15; L20 S: ≤ %25 | ≤ %25 | B'de L10 fail A'dan ≥ 10 puan düşükse yumuşak giriş ADR'ye girer |
| S sonrası "sonraki seviye" | taban | — | C'de L14/L34 (4. sıra S) sonrası ≥ A'nın L10 sonrası | Beklenmedik duvar drop artırıyorsa C elenir |
| R sonrası süre / N süresi | ≈ 0,8 | ≈ 0,8 | R−: ≤ 0,5 | C'de ≤ 0,5 değilse `disjoint` R'de saturasyonda (v03 %70) |
| H+ fail (B L51+) | — | H ile S arasında (0,85 > kazanma > 0,78) | — | S'ye eşitse H+ kalkar |
| c = yanlış tap / D₂ | 0,08–0,13 | 0,08–0,13; L51+ ≤ 0,15 | 0,08–0,13 | Funnel'lar arası fark > 0,03 ise dolgu modu D₂'ye katsayı olarak girer |

Soft launch: üç paket A/B/C testi olarak dağıtılır; KPI L10'a ulaşan (≥ %70 D0), L30'a ulaşan (≥ %35 D3), L50'ye ulaşan (D7). Kazanan ADR-0010'a dizi olarak yazılır.
