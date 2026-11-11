# Zorluk Parametreleri — Katalog ve Test Setindeki Kullanımı

- Tarih / sürüm: 2026-11-10 / v01
- Alan: level-design (ana sohbet, Utku + ana agent)
- Ne: Tap Words'te bir levelı zorlaştıran parametrelerin tam listesi, sınıflandırması, nasıl ölçüldüğü ve T00–T11 keşif setinde (`param-tests-v01.md`) her birinin **değişken mi, sabit mi, türetilmiş mi** olduğu.
- Bu bir öneri dokümanı değil, referans dokümanıdır; öneriler `param-tests-v01.md` ve `curve-v02.md`'de.
- Kaynaklar: `docs/game/mechanic.md#zorluk-kaldıraçları`, `docs/levels/curve-v02.md`, 5 Kasım tasarım oturumu, test tahtalarından ölçülen gerçek değerler.

## 1. Üç sınıf

Tap Words'te zorluk iki ayrı kanaldan üretilir; parametreleri buna göre ayırıyoruz.

| Sınıf | Ne değiştirir | Ana metrik | Örnek |
|---|---|---|---|
| **Risk** | Bir dokunuşun can götürme olasılığı | ε = yanlış tap / yerleşim | Hedef hücre oranı p, dolgu alfabesi, kısa kelime |
| **Hacim** | Kaç dokunuş / ne kadar tarama gerekiyor; riskin kaç kez tekrarlandığı | süre, süre / yerleşim, toplam yanlış tap | Yerleşim sayısı Y, tahta boyutu, yön oranı |
| **Sabit** | Zorluğu etkiler ama ADR'li ya da UI sınırı; keşifte oynatılmaz | — | Can, ipucu, chip tek satır |

Fail = Poisson(ε · Y) ≥ can. Yani risk (ε) ve hacim (Y) çarpılır; ikisi ayrı ayrı ölçülmeden hangisinin zorlaştırdığı bilinemez. Test seti bu ayrımı yapmak için kuruldu.

## 2. Parametre kataloğu

Kod sütunu prototip (`index.html`) ve JSON şeması (`level-format.md`) karşılığı. "Test setinde" sütunu: **D** = değişken (seride oynatıldı), **S** = sabit tutuldu, **T** = türetilmiş (başka girdilerden çıkıyor), **B** = banta alındı (kontrol edilmedi ama belli aralıkta tutuldu), **Ö** = ölçüldü ama kontrol edilmedi, **—** = bu sette yok.

### 2a. Girdi parametreleri (level verisinde doğrudan yazılan)

| # | Parametre | Kod | Sınıf | Zorlaştıran yön | Test setinde | Nerede / nasıl |
|---|---|---|---|---|---|---|
| 1 | Unique kelime sayısı | `K` = `words.length` | Hacim | ↑ (chip tarama + Y) | **S = 6** | Utku kararı; chip tek satır sınırının altında. Tek başına etkisi bu sette ölçülmüyor |
| 2 | Kopya sayısı | `PER` (JSON `per`) | Hacim + Risk | ↓ p düşer, risk ↑; ↑ Y artar, hacim ↑ | **D** | T01 (2), T02 (3), T00 (5), T03 (7) |
| 3 | Kopya dağılımı | — (Netleşenler: kelimeye göre değişken) | Hacim | eşitsiz → chip okuma yükü | **S = eşit** | Her kelime aynı PER. İleride `copies[]` |
| 4 | Tahta sütunu | `COLS` | Hacim (+ zoom) | ↑ | **S = 17**, T11 kontrol (20) | /ux #11: 17 zoom'suz okunabilir sınır. T11 yalnızca sütun etkisini izole eder |
| 5 | Tahta satırı | `ROWS` | Hacim | ↑ alan büyür, p düşer | **D** | T08 (15), T00 (18), T09 (21), T10 (26) |
| 6 | Kelime uzunluğu (ortalama) | `words[]` | Risk + Hacim | ↓ kısa kelime zor fark edilir; ↑ p artar | **D** | T04 (4), T00 (5), T05 (6), T06 (7) |
| 7 | Kelime uzunluğu (dağılım) | `words[]` | Risk | karışık → tarama stratejisi bozulur | **D** | T07 (4–7, Σ31 ≈ taban) ile T00 (hep 5) karşılaştırması |
| 8 | Ters yazım oranı | `DIRS` ağırlığı → `meta.reversedShare` | Hacim | ↑ pattern tanıma zorlaşır | **B** 0,13–0,27 | Nominal ileri 4 : geri 1 (%20); seed gerçekleşen oran bantta kalacak şekilde seçildi |
| 9 | Çapraz oranı | `DIRS` → `meta.diagonalShare` | Hacim | ↑ | **B** 0,30–0,40 | Nominal %50; sıkışık tahtada çapraz reddedildiği için gerçekleşen %3–50 savruluyordu → bant zorunlu oldu |
| 10 | Dolgu alfabesi | `FILL` | Risk | hedef harflere yakın dolgu → tuzak | **S** = TR frekans | Değişmedi. Gerçekleşen dolgu–hedef örtüşmesi aşağıda (Ö) |
| 11 | Can | `MAXL` / `lives` | Sabit | ↓ | **S = 5** | Utku kararı (ADR-0004: 3). Fail yerine ε ölçüldüğü için 5 tercih edildi |
| 12 | İpucu | `MAXH` / `hints` | Sabit | ↓ | **S = 3** | Kullanım loglanır, testte kullanılmaması önerilir |

### 2b. Türetilmiş büyüklükler (girdilerden hesaplanır, doğrudan yazılmaz)

| # | Büyüklük | Formül | Sınıf | Test setinde | Aralık |
|---|---|---|---|---|---|
| 13 | Yerleşim sayısı | \( Y = K \times PER \) | Hacim | **T** | 12 (T01) … 42 (T03); uzunluk ve board serilerinde **30 sabit** |
| 14 | Hedef hücre | \( H = PER \times \sum \text{uzunluk} \) | — | **T** | 60 … 210 |
| 15 | Hedef hücre oranı | \( p = H / (R \times C) \) | **Risk** (ana) | **T** | 0,196 (T01) … 0,686 (T03, T06) |
| 16 | Dinamik p (level sonu) | bulunan harfler gidince kalan hedef / kalan hücre | Risk | **Ö** (`wrongAt[]`) | Son yerleşimde p → ~%2–5 her levelda; log yanlış tap'ın hangi aşamada geldiğini kaydeder |
| 16b | **Zorluk indeksi D** | \( D = Y \times (1 - p) \) | Risk × Hacim | **T** (ADR-0008) | 9,4 (T06) … 19,8 (T10). T00–T11 öznel sıralamasını 12'de 11 açıklıyor (`param-tests-v01-results.md`); tier hedefi artık D ile verilir (`curve-v03.md`) |

p'nin bağımsız parametre **olmadığı** test tasarımının çekirdeği: K, PER, uzunluk ve tahta boyutundan dördünü seçince p kendiliğinden çıkar. Bu yüzden üç seri aynı p'ye farklı yoldan ulaşan çiftler üretir (bölüm 4).

### 2c. Kelime listesi özellikleri (tema seçimiyle gelir; şu an kontrol edilmiyor)

Bunlar `words[]`'den türetilir ama generator parametresi değildir; listeyi kürate ederek ayarlanır. Test setinde "kirletmesin" diye banta alındı veya ölçüldü.

| # | Parametre | Nasıl ölçülür | Sınıf | Zorlaştıran yön | Test setinde | Gerçekleşen (T00–T11) |
|---|---|---|---|---|---|---|
| 17 | Özel harf oranı (İŞĞÇÖÜ) | özel harf / Σ harf | Risk ↓ (fener etkisi: oyuncu Ğ'yi arar, kelimeyi değil) | ↓ zorlaştırır | **B** %0–13 | %0 (T03) … %13 (T00, T10) |
| 18 | Kelimeler arası ortak harf | ikili Jaccard ortalaması (kelime harf kümeleri) | Risk ↑ (benzer kelimeler birbirine karışır) | ↑ | **Ö** | 0,13 (T09) … 0,26 (T01, T08) |
| 19 | Harf çeşitliliği | farklı harf / Σ harf | Risk | ↓ az çeşit → tahta tekdüze | **Ö** | %40 (T01, T06) … %63 (T04) |
| 20 | Kelime içi tekrarlı harf | tekrarlı harfi olan kelime sayısı | Risk ↓ (ANNE, TAHTA görsel olarak kolay) | ↓ | **Ö** | 1 (T04) … 6 (T06) |
| 21 | Kelime tanıdıklığı / tema | öznel; tema etiketi gösteriliyor | Risk | gizli tema / az bilinen kelime ↑ | **S** = tema gösterilir, yaygın kelimeler | — |
| 22 | Palindrom / alt dizi | generator kısıtı | — | — | **yasak** | `mechanic.md#generator-kuralları` |

### 2d. Tahta yapısı özellikleri (generator'ın ürettiği, seed'e bağlı)

| # | Parametre | Nasıl ölçülür | Sınıf | Zorlaştıran yön | Test setinde | Gerçekleşen (T00–T11) |
|---|---|---|---|---|---|---|
| 23 | Dolgu–hedef harf örtüşmesi | hedef kelimelerde geçen harfi taşıyan dolgu hücresi / tüm dolgu | **Risk** (en güçlü aday) | ↑ her harf şüpheli | **Ö** | %52 (T01) … %79 (T02) — TR frekans alfabesiyle doğal olarak yüksek |
| 24 | Dolguda özel harf | özel harfli dolgu / tüm dolgu | Risk ↑ (feneri söndürür) | ↑ | **Ö** | %13–21 |
| 25 | Kopya kümelenmesi | aynı kelimenin kopyaları arası ort. merkez mesafesi / tahta köşegeni | Hacim ↓ (yakın kopyalar bedava bulunur) | ↓ | **Ö** | %30 (T05) … %40 (T04) köşegen — rastgele, kümelenme yok |
| 26 | Kelime başına yön çeşitliliği | aynı kelimenin kopyaları kaç farklı yönde | Hacim ↑ | ↑ | **—** | Ölçülmedi; rastgele |
| 26b | Çapraz X kesişmesi | SE ve SW yerleşimlerin hücre paylaşmadan görsel X yaptığı çift sayısı (`meta.xCross`) | Hacim ↑ (okuma) | ↑ | **Ö** v01 (0–4) → **D** v02 (`noDiagCross`, T09 4 ↔ T09X 0) | Generator kuralı yalnızca paralel komşu çaprazı engelliyordu; `noDiagCross` parametresi eklendi (`tools/bake.js`, `index.html`). T06'da 4 kesişme + "çok kolay" → etkisi p'ye bağlı olabilir |
| 27 | Yakın-kelime tuzağı (near-miss) | hedeften 1 harf farklı dizi sayısı | Risk ↑ | ↑ | **—** | Kaza temizliği yalnızca tam eşleşmeyi siler; near-miss sayılmıyor. Pillar 3 ile gerilimli (`uncertainties.md`) |

## 3. Taban level ve seri mantığı

Tek seferde tek değişken: her seri **T00**'dan bir adım sapar, geri kalan her şey T00 ile aynı kalır.

**T00 (taban):** 17×18 = 306 hücre, K 6, PER 5, tüm kelimeler 5 harf → Y 30, H 150, **p 0,49** (prototipin 0,52'sine ve curve-v02 bandı 0,45–0,55'e yakın).

```
                PER serisi          uzunluk serisi         board serisi        kontrol
                (Y değişir)         (Y=30, p değişir)      (Y=30, p değişir)   (p≈0,50, Y=30)
T01  PER 2  ───┐
T02  PER 3  ───┤
T00  PER 5 ── taban ── 5 harf ── 17×18 ──────────────────────────────────────── 
T03  PER 7  ───┘        │                   │
                        ├─ T04  4 harf      ├─ T08  17×15
                        ├─ T05  6 harf      ├─ T09  17×21
                        ├─ T06  7 harf      └─ T10  17×26
                        └─ T07  4–7 karışık                            T11  20×15
```

| Seri | Oynatılan girdi | Sabit kalan | Değişen türetilmiş | Ne öğretir |
|---|---|---|---|---|
| PER | `per` 2 → 7 | board, uzunluk, K | **Y** 12 → 42 **ve** p 0,20 → 0,69 | Hacim ve risk birlikte artar; "kopya sayısı klasik word search'ten ne kadar uzaklaştırır" |
| Uzunluk | ort. harf 4 → 7 | board, PER, K → **Y 30** | p 0,39 → 0,69 | Aynı dokunuş sayısıyla risk değişimi; kısa kelime hipotezi (`mechanic.md`: "3 harf çok sert") |
| Board | satır 15 → 26 | PER, uzunluk, K → **Y 30** | p 0,59 → 0,34 | Alan büyüyünce risk düşer ama tarama uzar — iki etki ters yönde |
| Kontrol | sütun 17 → 20 | her şey (p 0,50, Y 30) | — | Yalnızca zoom/okunabilirlik etkisi (/ux #11 doğrulaması) |

## 4. Test setinde parametre → level matrisi

Her hücre o leveldaki değer; **kalın** = tabandan sapan parametre.

| Parametre | T00 | T01 | T02 | T03 | T04 | T05 | T06 | T07 | T08 | T09 | T10 | T11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Seri | taban | PER | PER | PER | uzunluk | uzunluk | uzunluk | uzunluk | board | board | board | kontrol |
| K | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 |
| PER | 5 | **2** | **3** | **7** | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Sütun × satır | 17×18 | 17×18 | 17×18 | 17×18 | 17×18 | 17×18 | 17×18 | 17×18 | **17×15** | **17×21** | **17×26** | **20×15** |
| Hücre | 306 | 306 | 306 | 306 | 306 | 306 | 306 | 306 | 255 | 357 | 442 | 300 |
| Uzunluk | 5 | 5 | 5 | 5 | **4** | **6** | **7** | **4–7** | 5 | 5 | 5 | 5 |
| Y (türetilmiş) | 30 | 12 | 18 | 42 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 30 |
| Hedef hücre | 150 | 60 | 90 | 210 | 120 | 180 | 210 | 155 | 150 | 150 | 150 | 150 |
| **p** | 0,49 | 0,20 | 0,29 | 0,69 | 0,39 | 0,59 | 0,69 | 0,51 | 0,59 | 0,42 | 0,34 | 0,50 |
| Ters (gerçek) | 0,23 | 0,25 | 0,22 | 0,21 | 0,27 | 0,23 | 0,20 | 0,20 | 0,13 | 0,23 | 0,13 | 0,17 |
| Çapraz (gerçek) | 0,40 | 0,33 | 0,33 | 0,31 | 0,33 | 0,30 | 0,30 | 0,30 | 0,30 | 0,33 | 0,40 | 0,33 |
| Özel harf | %13 | %3 | %3 | %0 | %4 | %8 | %2 | %6 | %3 | %10 | %13 | %7 |
| Ortak harf (Jaccard) | 0,14 | 0,26 | 0,15 | 0,17 | 0,16 | 0,21 | 0,17 | 0,18 | 0,26 | 0,13 | 0,14 | 0,20 |
| Dolgu–hedef örtüşme | %63 | %52 | %79 | %64 | %62 | %67 | %75 | %64 | %55 | %68 | %70 | %57 |
| Kopya mesafesi (köşegen %) | 37 | 37 | 34 | 37 | 40 | 30 | 37 | 33 | 37 | 37 | 36 | 38 |
| Can / ipucu | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 | 5 / 3 |

### Aynı p'ye farklı yoldan ulaşan çiftler

Bu çiftler "zorluk = p mi, yoksa yapı mı" sorusunun cevabı:

| p | Leveller | Fark | ε aynı çıkarsa | ε farklı çıkarsa |
|---|---|---|---|---|
| 0,59 | T05 (6 harf, 306 hücre) ↔ T08 (5 harf, 255 hücre) | uzunluk vs alan | p yeterli açıklayıcı | uzun kelime ya da küçük tahta kendi başına etkili |
| 0,69 | T03 (PER 7, Y 42) ↔ T06 (7 harf, Y 30) | kopya vs uzunluk | risk p'den; süre farkı Y'den | kopya sayısı veya uzunluk p'nin ötesinde etkili |
| ≈0,50 | T00 ↔ T07 ↔ T11 | hep 5 / karışık 4–7 / sütun 20 | dağılım ve zoom önemsiz | T07: uzunluk **dağılımı**; T11: zoom ihtiyacı |

## 5. Parametre → metrik eşlemesi

Hangi parametrenin etkisi hangi logdan okunur (`mechanic.md` level sonu logu, `localStorage["ka-log"]`):

| Parametre | Beklenen etki | Okunan metrik | Beklenen yön |
|---|---|---|---|
| p (PER, uzunluk, satır üzerinden) | Risk | ε = `wrongTaps / placements` | p ↓ → ε ↑ (dolgu payı artar). Eğer ε p'den bağımsız çıkarsa oyuncu rastgele değil taramayla oynuyor demektir |
| Y (PER üzerinden) | Hacim | `ms`, toplam `wrongTaps` | Y ↑ → süre ve toplam yanlış ↑, ε sabit |
| Kelime uzunluğu | Risk (kısa) | ε, `ms / placements` | 4 harf → ε ↑, yerleşim başına süre ↑ |
| Tahta alanı | Hacim | `ms / placements` | 442 hücre → yerleşim başına süre ↑ (Y sabitken) |
| Sütun 20 (T11) | Zoom | `ms` T11 vs T00 | Fark > %20 → zoom'suz sınır doğrulandı |
| Dinamik p | Risk (level sonu) | `wrongAt[]` içinde ≥ 0,75·Y olanların payı | Yanlış tap'lar son çeyrekte toplanıyorsa "harfleri topla" zorluğu level sonuna yığıyor |
| İpucu | — | `hintsUsed` | Kullanıldıysa o oynanış ε hesabında işaretlenir |

## 5b. v02 seti (2026-11-11): T09X, T12–T15

`param-tests-v02.md`. İlk oynanış sonuçları (`param-tests-v01-results.md`) iki soruyu açtı; v02 onları izole eder:

| Level | Oynatılan | Sabit | Soru |
|---|---|---|---|
| T09X | #26b X kesişme 4 → 0 (`noDiagCross`) | T09'un her şeyi (kelimeler, grid, p, D) | Kesişme zorlaştırıyor mu? |
| T12, T13 | #1 K 4 / 8, tahta K ile büyür (17×12, 17×24) | p 0,49, PER 5 | D'nin Y yoluyla doğrulanması (10 / 20) |
| T14, T15 | #1 K 10 / 15 **ve** #2 PER 3 / 2 ters yönde | **Y 30, p 0,49, D 15,3 = T00** | K/PER bölüşümü tek başına zorluk üretir mi? |

## 6. Bu setlerde oynatılmayan, sonraki setin adayları

Katalogdaki **S/B/Ö** parametreleri bilinçli olarak sabit tutuldu; v02 sonuçları geldikten sonra üçüncü set bunlardan seçilir. Aday sırası, beklenen etki büyüklüğüne göre:

1. **Dolgu–hedef örtüşmesi (#23)** — TR frekans alfabesiyle zaten %52–79; kontrollü olarak %0 (hedefte olmayan harflerden dolgu) ve %100 (yalnızca hedef harflerinden dolgu) uçları denenmeli. Risk ekseninde en güçlü tek kaldıraç adayı. Referans yok — /market-research'e soru düşülecek (WSE ve Amaze GO! dolgu alfabesini nasıl seçiyor).
2. **Ters / çapraz oranı (#8, #9)** — WSE `hwp` L35+ kalıbı (`word-search-explorer.md`); %0 / %20 / %50 ters.
3. **Özel harf oranı (#17)** — %0 vs %25; fener etkisinin büyüklüğü.
4. **Kopya dağılımı (#3)** — eşit 5 vs 2–8 arası değişken (Netleşenler).
5. ~~K (#1)~~ → v02 setinde (T12–T15).
6. **Can (#11)** — 3 (ADR-0004) ile aynı setin tekrarı; fail oranı için.

Her yeni seri aynı kuralla kurulur: T00 tabanı korunur, tek parametre sapar, yön oranı ve özel harf bantta tutulur, seed gerçekleşen değerlere göre seçilir.

## 7. Referans

- `docs/game/mechanic.md#zorluk-kaldıraçları` — kaldıraç listesi (bu dokümanın tohumu).
- `docs/levels/curve-v02.md` — p bandı 0,45–0,55, Poisson fail modeli, "tier farkı hacim, risk değil" iddiası.
- `docs/levels/param-tests-v01.md` — test setinin tasarımı, kelime listeleri, ölçüm planı.
- `docs/levels/level-format.md` — parametrelerin JSON'daki karşılıkları (`per`, `cols`, `rows`, `meta.ratio`, `meta.reversedShare`, `meta.diagonalShare`).
- `docs/references/amaze-go.md#apk-analizi` — tier = daha fazla ok, aynı dolu hücre oranı (hacim/risk ayrımının kaynağı).
- `docs/references/word-search-explorer.md#apk-analizi` — grid seti, `hwp` ters yazım kalıbı.
