# Parametre Keşif Levelları v02 — T09X, T12–T15

- Tarih / sürüm: 2026-11-11 / v02 (v01'e ek; T00–T11 değişmedi)
- Alan: level-design (ana sohbet)
- Amaç: v01 sonuçlarının (`param-tests-v01-results.md`) açık bıraktığı iki soru: **(1)** çapraz X kesişmesi zorlaştırıyor mu, **(2)** kelime sayısı K'nin p ve Y'den bağımsız etkisi var mı.
- Veri: `test-levels.js` (seed 20261105 + indeks·10000 + offset; `tools/bake.js bake`). Prototipte level menüsünün sonunda.
- Sabitler v01 ile aynı: can 5, ipucu 3, yön bandı (ters 0,13–0,27, çapraz 0,27–0,43), `FILL`, özel harf ≤ %13.
- **Sonuçlar (12 Kasım):** `param-tests-v02-results.md` → ADR-0008 revizyonu (D₂, K 6 taban, PER sabit, `noDiagCross` kapalı). Level tablosundaki "zorluk" sütunu Utku'nun notlarıdır.

## Öneri

Beş level: T09X (T09'un aynı kelimelerle kesişmesiz kopyası) ve K serisi T12–T15 (K 4 / 8 / 10 / 15; p 0,49 sabit; T14–T15'te Y de 30 sabit).

## Gerekçe

- **T09X:** Utku notu "kesişen birden çok çapraz zorlaştırıyor". Tahtada sayım: T09'da 4 X kesişmesi, ama T06'da da 4 ve T06 "çok kolay" → kesişme etkisi p'ye bağlı olabilir. İzole test: aynı p, aynı kelimeler, aynı grid, X = 0.
- **K serisi:** v01'de K 6 sabitti. T01/T02 PER düşürünce Y de düştüğü için PER'in etkisi okunamadı. K'yi oynatırken p'yi sabit tutmanın iki yolu var: tahtayı K ile büyütmek (T12, T13: Y değişir → hacim etkisi) veya PER'i K ile ters oynatmak (T14, T15: Y = 30 ve p = 0,49 sabit → **yalnızca K/PER bölüşümü** değişir, D = 15,3 = T00). T14/T15 ile T00 arasındaki fark doğrudan "chip sayısı / kopya sayısı" etkisidir.
- T15'te 15 chip 4 satıra taşıyor; UX sınırının (tek satır) bilerek dışında — K'nin oynanışa etkisini chip taşmasıyla birlikte görmek için.

## Level tablosu

| # | Seri | Tema | Grid | Hücre | K | PER | Uzunluk | Y | Hedef | p | D | D₂ | Ters | Çapraz | X | Kelimeler | zorluk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T09 (ref) | board | Kuşlar | 17×21 | 357 | 6 | 5 | 5 | 30 | 150 | 0,42 | 17,4 | 10,4 | 0,23 | 0,33 | **4** | SERÇE KARGA KUMRU ŞAHİN TAVUK HOROZ | zordu (v01) |
| **T09X** | kesişme | Kuşlar | 17×21 | 357 | 6 | 5 | 5 | 30 | 150 | 0,42 | 17,4 | 10,4 | 0,20 | 0,33 | **0** | aynı | biraz daha zor, ama çok değil |
| T00 (ref) | taban | Okul | 17×18 | 306 | 6 | 5 | 5 | 30 | 150 | 0,49 | 15,3 | 9,2 | 0,23 | 0,40 | 0 | KALEM SİLGİ KİTAP TAHTA SINIF ÇANTA | keyifli (v01) |
| **T12** | K | Meyveler | 17×12 | 204 | **4** | 5 | 5 | 20 | 100 | 0,49 | 10,2 | 6,1 | 0,20 | 0,40 | 0 | KİRAZ KAVUN ARMUT İNCİR | zor değil |
| **T13** | K | Şehir | 17×24 | 408 | **8** | 5 | 5 | 40 | 200 | 0,49 | 20,4 | 12,2 | 0,17 | 0,28 | 1 | SOKAK CADDE PAZAR BANKA KÖPRÜ DURAK FIRIN HAMAM | zor |
| **T14** | K | Yemek | 17×18 | 306 | **10** | **3** | 5 | 30 | 150 | 0,49 | 15,3 | 10,2 | 0,13 | 0,30 | 2 | REÇEL SUCUK SİMİT SOSİS BÖREK SALAM PİLAV ÇORBA HELVA LOKUM | zor |
| **T15** | K | Karışık | 17×18 | 306 | **15** | **2** | 5 | 30 | 150 | 0,49 | 15,3 | 11,5 | 0,17 | 0,33 | 3 | KALEM BALIK PERDE MARTI LAMBA DOLAP KUMRU HOROZ ROKET METRO TAVUK KARGA YOSUN DALGA SEHPA | zor |

Generator: 5 level × 300 üretim, %0 başarısız. T09X `noDiagCross: true` ile runtime `generate()` 30 tahtada X = 0 doğrulandı.

### Karşılaştırmalar

| Karşılaştırma | Sabit | Değişen | Soru |
|---|---|---|---|
| T09 ↔ T09X | her şey | X 4 → 0 | Kesişme zorlaştırıyor mu? Evetse `noDiagCross` N/R tier'da açılır (curve-v03 "Sabitler") |
| T00 ↔ T14 ↔ T15 | Y 30, p 0,49, D 15,3, grid | K 6 → 10 → 15, PER 5 → 3 → 2 | K/PER bölüşümü tek başına zorluk üretiyor mu? Chip taraması mı, kopya tanıma mı? |
| T12 ↔ T00 ↔ T13 | p 0,49, PER 5 | K 4 → 6 → 8, Y 20 → 30 → 40, D 10 → 15 → 20 | D'nin Y yoluyla doğrulanması (v01'de D p yoluyla değişiyordu) |
| T13 ↔ T10 | Y / p farklı, ikisi de D ≈ 20 | T13: 408 hücre K 8 p 0,49; T10: 442 hücre K 6 p 0,34 | Aynı D'ye "çok kelime" ile "düşük p" yolları aynı mı hissettiriyor? |

## Generator değişikliği: `noDiagCross`

Mevcut kural çapraz bir yerleşimin **paralel komşu** şeridinde başka çapraz olmasını engelliyordu. Yeni opsiyonel kural: SE eğimli bir yerleşimin ardışık iki hücresinin oluşturduğu 2×2 karenin diğer köşegeninde SW eğimli tek bir yerleşim varsa (hücre paylaşmadan görsel X) aday reddedilir. `tools/bake.js` ve `index.html` `generate()` aynı kuralı taşır; level alanı `noDiagCross: true`. JSON şemasına `noDiagCross` (bool, opsiyonel) ve `meta.xCross` (int) eklendi.

## Referans

- `param-tests-v01-results.md` §3–4 (bu setin kaynağı).
- Referans oyunlarda çapraz kesişme kuralı bilinmiyor → **/market-research'e soru:** WSE ve Amaze GO! kesişen çaprazlara izin veriyor mu? (`open-questions.md`)

## Trade-off

- T13 (17×24) ve T15 (15 chip) UX sınırlarının dışında; sonuçları eğriye doğrudan taşınmaz, yalnızca K'nin yönünü gösterir.
- T14/T15 kelime listeleri "Yemek", "Karışık" — tema tutarlılığı zayıf; K ≥ 10 için tek temada 5 harfli kelime bulmak zor (kürasyon maliyeti, Pillar 7).
- `noDiagCross` açıkken çapraz yerleştirme zorlaşır; sıkışık tahtada (p ≥ 0,6) gerçekleşen çapraz oranı düşebilir. v03 eğrisinde p ≤ 0,54 olduğu için risk düşük; bake sırasında bant kontrolü yakalar.

## Gerekli görüşler

- **/ux:** T15 chip taşması gözlemi; K üst sınırı için veri.
- **/market-research:** kesişme kuralı (yukarıda).
- **/gameplay:** T14/T15 sonucu "kopya tanıma" etkisi gösterirse PER'in alt sınırı.

## Ölçüm

Log v01 ile aynı (`ka-log`). Ek olarak her levelda `meta.xCross` ve `meta.D` JSON'da.

| Karşılaştırma | Metrik | Anlamlı fark eşiği |
|---|---|---|
| T09 ↔ T09X | ε, ms/yerleşim, öznel not | ε farkı > %25 veya not bir kademe |
| T00 ↔ T14 ↔ T15 | ε, ms, chip'e bakma (öznel) | ms farkı > %20 → K tarama yükü; ε farkı > %25 → kopya tanıma |
| T12 ↔ T00 ↔ T13 | toplam yanlış tap | D ile monoton |

Sonuçlar `param-tests-v02-results.md` olarak yazılır.
