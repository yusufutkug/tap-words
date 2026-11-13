# Parametre Keşif Levelları v03 — T00b, T16–T22

- Tarih / sürüm: 2026-11-13 / v03 (v01–v02'ye ek; T00–T15 değişmedi)
- Alan: level-design (ana sohbet)
- Amaç: ADR-0008 (rev.) D₂'yi hacim indeksi olarak doğruladı. Bu set **D₂'nin görmediği risk kaldıraçlarını** ölçer: dolgu–hedef örtüşmesi (#23), ters yazım oranı (#8), kelime özel harf oranı (#17). D₂ bütün levellarda 9,4 sabit; fark çıkarsa kaynağı D₂ dışıdır.
- Veri: `test-levels.js` (seed 20261105 + indeks·10000 + offset; `tools/bake.js bake`), paket `levels/test-levels-v03.json`. Prototipte level menüsünün sonunda (Seviye 68–75).
- Sabitler: can 5, ipucu 3, **15×21 (ADR-0009 N/H gridi)**, K 6, PER 5, 5 harf, p 0,476, D₂ 9,4; çapraz bandı 0,27–0,43; seri dışı parametreler eski bantta (ters 0,13–0,27, özel ≤ %13).

## Öneri

Dokuz level: yeni gridde taban T00b; dolgu serisi T16–T18 (`fillMode` disjoint / target / bigram); ters serisi T19–T20 (`reversedWeight` 0 / 0,5); özel harf serisi T21–T22 (liste %0 / %40).

## Gerekçe

- **T00b:** T00 ile aynı kelimeler, yeni N gridinde. Önceki setlerle köprü (T00 17×18 "keyifli") ve bu setin referansı; 15×21'de hücreler %13 büyüdüğü için (fit genişliğe göre) T11 "harfler küçüldü" etkisi devre dışı.
- **Dolgu (#23):** Katalogda "risk ekseninin en güçlü adayı". TR frekans alfabesiyle örtüşme doğal olarak %52–79 çıktı; iki ucu kontrollü denemeden kaldıraç olup olmadığı bilinmiyor. `disjoint` → dolgu harfleri asla hedef harfi değil, oyuncu harf bazında eleyebilir (beklenti: çok kolay, "fener" her yerde). `target` → her dolgu hücresi bir hedef harfi, tek harf hiçbir bilgi vermez (beklenti: zor). `bigram` → dolgu, hedef kelimelerde geçen ikililerle zincirlenir (POL, İLO, KAS…); yarım kelime tuzakları — near-miss (#27)'e yaklaşan mod, kaza temizliği tam eşleşmeleri yine siler.
- **Ters (#8):** WSE L35+ `hwp` kalıbı ters yazımı tier kaldıracı olarak kullanıyor. Tap Words'te oyuncu kelimeyi sürüklemediği için ters yazımın maliyeti belirsiz: tanıma zorlaşıyor mu, yoksa herhangi bir harfe dokunmak yettiğinden fark etmiyor mu? 0 ↔ 0,23 ↔ 0,50.
- **Özel harf (#17):** v01'den beri ≤ %13 banta kilitliydi; "fener etkisi" varsayımı (Ğ/Ş/Ö göze çarpar, kelimeyi bedava verir) test edilmedi. T21 %0 (hiç fener yok) ↔ T22 %40 (her kelimede 1–3 fener). Dolgu `freq` kaldığı için dolguda özel harf %13–19 bantta; T22'de hedef harfleri de özel olduğundan fener bazen tuzak olur.

## Level tablosu

| # | Seri | Tema | Grid | K | PER | Y | Hedef | p | D₂ | Dolgu modu | Dolgu örtüşme | Dolgu özel | Kelime özel | Ters | Çapraz | X | Kelimeler | zorluk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **T00b** | taban | Okul | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | freq | %72 | %15 | %13 | 0,23 | 0,33 | 4 | KALEM SİLGİ KİTAP TAHTA SINIF ÇANTA | |
| **T16** | dolgu | Renkler | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | **disjoint** | **%0** | %25 | %10 | 0,27 | 0,37 | 3 | PEMBE SİYAH BEYAZ YEŞİL BORDO KIZIL | |
| **T17** | dolgu | Meslekler | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | **target** | **%100** | %16 | %13 | 0,20 | 0,33 | 0 | POLİS ASKER PİLOT TERZİ KASAP MİMAR | |
| **T18** | dolgu | Sofra | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | **bigram** | **%100** | %9 | %13 | 0,13 | 0,30 | 1 | EKMEK PİLAV ÇORBA KAHVE ŞEKER LİMON | |
| **T19** | ters | Hayvanlar | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | freq | %70 | %15 | %10 | **0,00** | 0,30 | 3 | ASLAN YILAN KOYUN GEYİK ZEBRA TİLKİ | |
| **T20** | ters | Şehir | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | freq | %61 | %14 | %0 | **0,50** | 0,30 | 2 | SOKAK CADDE PAZAR BANKA DURAK FIRIN | |
| **T21** | özel | Mobilya | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | freq | %65 | %13 | **%0** | 0,23 | 0,30 | 1 | PERDE LAMBA DOLAP TABAK SEHPA RANZA | |
| **T22** | özel | Karışık | 15×21 | 6 | 5 | 30 | 150 | 0,48 | 9,4 | freq | %58 | %19 | **%40** | 0,27 | 0,30 | 2 | ÇİÇEK GÜNEŞ KÖPRÜ ÖRDEK YÜZÜK ÇİLEK | |

Generator: 9 level × 200 üretim, %0 başarısız; `target` ve `bigram` modlarında kaza temizliği aynı alfabeden harf seçtiği için "düzeltilemez" oranı 0. Tüm listeler palindrom/alt-dize kontrolünden geçti. "zorluk" sütunu oynayınca doldurulur.

Not: T20 (Şehir) listesinde özel harf %0 — T21 ile çakışıyor; ters serisi için T21'i ikinci "özel %0" veri noktası olarak kullanma, T20'yi yalnızca T00b/T19 ile karşılaştır.

### Karşılaştırmalar

| Karşılaştırma | Sabit | Değişen | Soru |
|---|---|---|---|
| T16 ↔ T00b ↔ T17 | D₂, grid, ters, özel | örtüşme %0 → %72 → %100 | Dolgu alfabesi risk kaldıracı mı? Evetse `fillMode` tier'a bağlanır (F `disjoint`? S `target`?) |
| T17 ↔ T18 | örtüşme %100 | ikili zincir var/yok | Yarım kelime tuzağı, tek harf örtüşmesinin ötesinde zorlaştırıyor mu? (#27 near-miss için ön veri) |
| T19 ↔ T00b ↔ T20 | D₂, dolgu | ters 0 → 0,23 → 0,50 | Tap mekaniğinde ters yazım fark ediliyor mu? WSE `hwp` kalıbı buraya taşınır mı? |
| T21 ↔ T00b ↔ T22 | D₂, dolgu, ters | kelime özel %0 → %13 → %40 | Fener etkisi: T22'de ilk tap'lar özel harfli kelimelere mi gidiyor (`wrongAt` + bulunma sırası)? |
| T00 ↔ T00b | kelimeler, K, PER, p ≈ | 17×18 → 15×21 (hücre +%13) | Grid oranı değişimi hissi bozuyor mu? (ADR-0009 doğrulaması) |

## Generator değişikliği: `fillMode`, `rev`

- `rev` (level alanı, JSON `reversedWeight`): tanımlıysa yön eksen eşit olasılıkla seçilir, `rev` olasılıkla tersine çevrilir. Tanımsızsa eski 20'lik `DIRS` dizisi (ileri 4 : ters 1) **birebir korunur**; T00–T15 tahtaları değişmedi (bake sonrası 17/17 aynı doğrulandı).
- `fillMode` (JSON `fillMode`): `freq` (varsayılan, `FILL`) · `disjoint` (`FILL`'den hedef harfleri çıkarılmış) · `target` (hedef kelimelerin harfleri, hedefteki frekansla) · `bigram` (`target` alfabesi + dolgu hücresi %80 olasılıkla sol/üst komşusuyla hedef kelimelerde geçen bir ikili oluşturacak harfi alır; ileri ve ters ikililer dahil). Kaza temizliği de aynı alfabeden değiştirir.
- Bake bandı: ters için hedef (`rev` ?? 0,20) ± 0,07; çapraz 0,27–0,43 değişmedi.
- `meta`'ya `fillOverlap`, `fillSpecial`, `wordSpecial` eklendi (`level-format.md`).
- `index.html` `generate()` aynı kuralları taşır (runtime fallback); level-sonu loguna `fillMode` ve `rev` eklendi.

## Referans

- `docs/references/word-search-explorer.md#apk-analizi` — `hwp` L35+ ters yazım kalıbı (T19–T20).
- Dolgu alfabesi ve özel harf oranı için referans yok — /market-research'e soru (`open-questions.md` #29): WSE ve Amaze GO! dolgu harflerini nasıl seçiyor; hedef harflerinden mi, frekanstan mı?
- `difficulty-parameters.md` §2c–2d (#8, #17, #23, #24, #27) ve §6 aday sırası.

## Trade-off

- `target`/`bigram` modları kaza temizliğini zorlar; p ≥ 0,6'da düzeltilemez oranı yükselebilir (bu sette p 0,48, sorun yok). Eğriye alınırsa `validate` ile tier bazında kontrol.
- `disjoint` mod TR alfabesini daraltır (T16'da 23 harf); tahta "yapay" görünebilir, özel harf payı dolguda %25'e çıkar (Pillar: okunabilirlik).
- T22 listesi tema dışı ("Karışık"); %40 özel harf tek temada bulunamadı. Kürasyon maliyeti (Pillar 7).
- Ters 0,50 pattern tanımayı bozar ama tap mekaniğinde "herhangi bir harf" kuralı etkiyi sönümleyebilir; sonuç sıfırsa #8 banttan çıkarılıp serbest bırakılır (generator basitleşir).

## Gerekli görüşler

- **/market-research:** dolgu alfabesi referansı (#29).
- **/ux:** T16 "yapay tahta" ve T17/T18 "her şey kelime gibi" okunabilirlik gözlemi.
- **/gameplay:** `bigram` sonucu near-miss'i (#27) kaldıraç yaparsa Pillar 3 ile gerilim (`uncertainties.md`).

## Ölçüm

Log v01 ile aynı (`ka-log`; artık `fillMode`, `rev` alanlarıyla). Her levelda ε = yanlış tap / dolgu hücresi, ms/yerleşim, öznel not.

| Karşılaştırma | Metrik | Anlamlı fark eşiği |
|---|---|---|
| T16 ↔ T00b ↔ T17 | ε, öznel not | ε monoton ve uçlar arası > %50 → `fillMode` kaldıraç; D₂'ye çarpan terim eklenir |
| T17 ↔ T18 | ε, yanlış tap konumu (ikili zincir üstünde mi) | ε farkı > %25 → near-miss ayrı kaldıraç |
| T19 ↔ T00b ↔ T20 | ms/yerleşim, ε | ms farkı > %20 → ters oranı tier kaldıracı; < %10 → bant kaldırılır |
| T21 ↔ T00b ↔ T22 | ilk 5 bulunan yerleşimde özel harfli kelime payı, ε | T22'de özel harfli kelimeler sırada öne çıkıyorsa fener etkisi doğrulanır; özel %0 ε'yi > %25 artırıyorsa #17 ters yönde kaldıraç |
| T00 ↔ T00b | öznel not | bir kademe fark → ADR-0009 gridinde p hedefi yeniden ayarlanır |

Sonuçlar `param-tests-v03-results.md` olarak yazılır.
