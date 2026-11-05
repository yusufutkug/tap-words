# Parametre Keşif Levelları v01 — T00–T11

- Tarih / sürüm: 2026-11-05 / v01
- Alan: level-design (ana sohbet, Utku + ana agent)
- Amaç: oyunu zorlaştıran parametreleri **tek tek izole ederek** ölçmek. Zorluk eğrisi değil, kalibrasyon seti. `curve-v02.md`'nin "p sabitken tier farkı yalnızca hacimdir" iddiası bu setle test edilir.
- Veri: `test-levels.js` (pre-baked, seed 20261105; ADR-0005 kalıbı). Prototipte level menüsünün sonunda `T00…T11` olarak görünür.

## Öneri

12 levellık keşif seti: K = 6 kelime ve can = 5 sabit; bir **taban** levelından (17×18, PER 5, 5 harf) üç seride birer parametre sapar — PER (2/3/7), kelime uzunluğu (4/6/7/karışık), tahta satırı (15/21/26) — artı sütun etkisini izole eden bir kontrol levelı (20×15).

## Gerekçe

- `mechanic.md#zorluk-kaldıraçları` kaldıraçları listeliyor ama hiçbirinin etkisi ölçülmedi; `curve-v02` ε (yanlış tap / yerleşim) için 0,033–0,08 **varsayımıyla** kuruldu (#9 logu hiç gelmedi).
- p türetilmiş bir büyüklük (\( p = \sum(\text{kopya} \times \text{uzunluk}) / (R \times C) \)); hangi girdinin p üzerinden, hangisinin yapı üzerinden zorlaştırdığı ayrılmalı. Bu yüzden set, aynı p'ye farklı yoldan ulaşan çiftler içeriyor (aşağıda).
- Utku kararı (5 Kasım): can 5, K 6; PER / uzunluk / board birer birer değişir.

## Sabitler

| Parametre | Değer | Not |
|---|---|---|
| K (kelime) | 6 | Chip tek satır sınırının altında |
| Can | 5 | Prototip `MAXL`; ADR-0004'ün 3'ü **bu sette uygulanmaz** — fail oranı değil ε ölçülüyor |
| İpucu | 3 | Testte kullanılmaması önerilir; kullanım loglanır |
| Yön | nominal ileri 4 : geri 1, çapraz %50 | **Gerçekleşen** oran levelden levele savruluyordu (çapraz %3–50); seed, gerçekleşen ters 0,13–0,27 ve çapraz 0,27–0,43 bandına düşecek şekilde seçildi |
| Dolgu | `FILL` (TR frekans) | |
| Özel harf (İŞĞÇÖÜ) | %0–13 / level | "Fener harf" etkisi serileri kirletmesin diye bantta tutuldu |
| Sütun | 17 (T11 hariç) | /ux zoom'suz sınır; board serisi yalnızca satır oynatır |

## Level tablosu

Y = yerleşim (K × PER). Hedef = hedef hücre. p = hedef / hücre. Ters/çapraz = tahtada gerçekleşen oran.

| # | Seri | Tema | Grid | Hücre | PER | Uzunluk | Y | Hedef | p | Ters | Çapraz | Kelimeler |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T00 | taban | Okul | 17×18 | 306 | 5 | 5 | 30 | 150 | 0,490 | 0,23 | 0,40 | KALEM SİLGİ KİTAP TAHTA SINIF ÇANTA |
| T01 | PER | Vücut | 17×18 | 306 | **2** | 5 | 12 | 60 | 0,196 | 0,25 | 0,33 | BURUN KULAK BACAK BOYUN DUDAK KALÇA |
| T02 | PER | Deniz | 17×18 | 306 | **3** | 5 | 18 | 90 | 0,294 | 0,22 | 0,33 | BALIK DALGA MARTI KAYIK MİDYE YOSUN |
| T03 | PER | Mobilya | 17×18 | 306 | **7** | 5 | 42 | 210 | 0,686 | 0,21 | 0,31 | PERDE LAMBA DOLAP TABAK SEHPA RANZA |
| T04 | uzunluk | Ev | 17×18 | 306 | 5 | **4** | 30 | 120 | 0,392 | 0,27 | 0,33 | MASA KAPI HALI SOBA ÇATI ODUN |
| T05 | uzunluk | Hayvanlar | 17×18 | 306 | 5 | **6** | 30 | 180 | 0,588 | 0,23 | 0,30 | KAPLAN TAVŞAN KARTAL MAYMUN SİNCAP ZÜRAFA |
| T06 | uzunluk | Karışık | 17×18 | 306 | 5 | **7** | 30 | 210 | 0,686 | 0,20 | 0,30 | TRAKTÖR GEZEGEN BAKLAVA KELEBEK KARINCA YUMURTA |
| T07 | uzunluk | Mutfak | 17×18 | 306 | 5 | **4–7** (Σ31) | 30 | 155 | 0,507 | 0,20 | 0,30 | TAVA KASE KAŞIK ÇATAL BARDAK TENCERE |
| T08 | board | Taşıtlar | **17×15** | 255 | 5 | 5 | 30 | 150 | 0,588 | 0,13 | 0,30 | ARABA VAPUR METRO TAKSİ MOTOR ROKET |
| T09 | board | Kuşlar | **17×21** | 357 | 5 | 5 | 30 | 150 | 0,420 | 0,23 | 0,33 | SERÇE KARGA KUMRU ŞAHİN TAVUK HOROZ |
| T10 | board | Doğa | **17×26** | 442 | 5 | 5 | 30 | 150 | 0,339 | 0,13 | 0,40 | NEHİR BULUT ÇAYIR ORMAN YAMAÇ SAHİL |
| T11 | kontrol | Giysi | **20×15** | 300 | 5 | 5 | 30 | 150 | 0,500 | 0,17 | 0,33 | CEKET ÇORAP ŞAPKA KEMER PALTO HIRKA |

### Tasarımın içine gömülü karşılaştırmalar

- **PER serisi** tek başına Y'yi değiştirir (12 → 42); uzunluk ve board serilerinde Y = 30 sabit. PER'de süre farkı hacimden, diğerlerinde tarama güçlüğünden gelir.
- **p = 0,59 çifti:** T05 (6 harf) ve T08 (17×15) aynı p'ye farklı yoldan ulaşır. ε aynı çıkarsa "zorluk = p" hipotezi güçlenir; farklıysa yapı (uzunluk mu, alan mı) önemlidir.
- **p = 0,69 çifti:** T03 (PER 7, Y 42) ve T06 (7 harf, Y 30). Aynı p, farklı yerleşim sayısı ve kelime uzunluğu.
- **p ≈ 0,50 üçlüsü:** T00, T07, T11. T07 → uzunluk **dağılımının** etkisi (ortalama aynı), T11 → sütun 20'nin (zoom ihtiyacı) etkisi.

## Referans

- Amaze GO! (`docs/references/amaze-go.md#apk-analizi`): tier = daha fazla ok, aynı dolu hücre oranı (%47–49) → "hacim mi risk mi" ayrımının kaynağı.
- Word Search Explorer (`docs/references/word-search-explorer.md#apk-analizi`): 5 boyutlu grid seti, komşu adım 1,17–1,33× → board serisinin 255 → 306 → 357 → 442 adımları (1,20 / 1,17 / 1,24×).
- `curve-v02.md`: p bandı 0,45–0,55 ve ε modeli; bu set o modeli kalibre eder.

## Trade-off

- Girdileri tek tek oynatınca p de kayar (kaçınılmaz, tabloda görünür). "p sabit, yapı farklı" sorusu yalnızca T07/T11 ve 0,59 / 0,69 çiftleriyle cevaplanır.
- Can 5 (ADR-0004: 3). Fail oranı bu setten okunmaz; ε okunur. 3 can için fail Poisson(ε·Y) ile türetilir.
- T06'da 7 harfli kelimeler 17 sütunda çaprazı zorluyor; bantta tahta bulmak 496 seed aldı. Generator 1000 üretimde %0 başarısız (T03 ort. 1,8, T06 ort. 4,2 deneme), fallback gerekmedi.
- Öğrenme etkisi: sırayla oynanırsa sonraki leveller avantajlı. Öneri: T00'ı başta ve sonda oyna; seriler arası sırayı karıştır.
- Pillar 3 (adil ceza) ile gerilim yok: dolgu alfabesi ve kaza temizliği aynı.

## Gerekli görüşler

- **/prototype:** uygulandı (bu commit). Level başına `cols/rows/per`, `test-levels.js`, level sonu logu.
- **/gameplay:** sonuç geldikten sonra — ε hangi eşiği aşınca can/PER kaldıracı açılır (#17 ile birleşir).
- **/ux:** T11 (20 sütun) ile T00 arasında süre farkı > %20 ise zoom'suz sınır doğrulanmış olur (#11).

## Ölçüm

Her level sonunda prototip şunu loglar (konsol `[tapwords]` + `localStorage["ka-log"]`, son 300 kayıt):

```json
{"level":51,"name":"T00 · Okul","cols":17,"rows":18,"per":5,"words":6,"placements":30,"found":30,
 "ms":95000,"wrongTaps":2,"wrongAt":[4,27],"hintsUsed":0,"result":"win","at":"2026-11-05T…"}
```

`wrongAt[i]` = yanlış tap geldiğinde kaç yerleşim bulunmuştu (harfleri-topla kaynaklı dinamik p etkisi için). Dökmek için konsolda: `copy(JSON.parse(localStorage.getItem("ka-log")))`.

| Metrik | Türetim | Ne gösterir |
|---|---|---|
| ε | wrongTaps / placements | Risk ekseni; seriler arası karşılaştırmanın ana metriği |
| Süre / yerleşim | ms / placements | Tarama güçlüğü (Y sabit serilerde doğrudan) |
| Toplam süre | ms | Hacim (PER serisi) |
| Son çeyrek yanlış payı | wrongAt'ta ≥ 0,75 × placements olanların oranı | Level sonuna doğru p düşüşünün etkisi |
| İlk yerleşim süresi | (henüz loglanmıyor) | Gerekirse sonraki sürümde |

Başarı ölçütü (bu set için): her levelda en az 3 oynanış (farklı kişi veya gün); seriler içinde ε'nin tekdüze (monoton) değişip değişmediği ve 0,59 / 0,69 çiftlerinde ε farkının ±%20 içinde kalıp kalmadığı raporlanır. Sonuç `docs/levels/param-tests-v01-results.md` olarak yazılır; eğri (`curve-v02`) o rapora göre revize edilir.
