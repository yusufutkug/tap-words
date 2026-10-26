# Zorluk Eğrisi v01 — İlk 20 Level

- Tarih / sürüm: 2026-10-26 / v01 (taslak, open-questions #3 cevabı)
- Alan: level-design
- Problem: Prototipte zorluk eğrisi yok; 5 level aynı parametrelerle oynanıyor, sadece tema değişiyor (`docs/game/mechanic.md#level-yapısı-prototip`). İlk 20 level için ritim ve parametre seti gerekiyor; fail state olduğu için "kolay level" riskli levela dönüşmemeli.
- İlgili ADR: ADR-0001 (referans WSE), ADR-0002 (banner alanı düşülür). Can mekaniği E1 ile ertelenmiş → **can 5 sabit, can üzerine öneri yok.**

## Sabitler ve varsayımlar

Bu dokümandaki tüm hesaplar şu sabitlerle yapıldı. Değişen değer yalnızca **satır sayısı ve kelime sayısı**dır (Seçenek B).

| Parametre | Değer | Kaynak / not |
|---|---|---|
| `PER` | 5 | sabit, risk kaldıracı (WSE dersi: risk kaldıraçları oynatılmaz) |
| `MAXL` (can) | 5 | E1 ertelenmiş |
| `MAXH` (ipucu) | 3/level | sabit; 25 yerleşimli L1'de %12, 50 yerleşimli büyük tahtada %6'ya denk gelir → FTUE doğal olarak daha cömert |
| Yön ağırlıkları | ileri 4 : geri 1, 4 yön ailesi eşit | nominal **ters %20, çapraz %50** (`DIRS`); çapraz şerit kuralı yüzünden gerçekleşen çapraz payı biraz düşük |
| `COLS` | 20 | sabit → `fit()` ölçeği ve harf boyutu her levelda aynı (Pillar 5) |
| Dolgu alfabesi | `FILL` | sabit |
| Hedef hücre oranı bandı | **p = 0,48–0,55** | prototip 0,52 ± 3,5 puan; rastgele dokunuşta can kaybı olasılığı 1−p her levelda 0,45–0,52 |

**Ekran varsayımı (ADR-0002):** 390×844 pt telefon; safe area (~80 pt) + HUD (~56 pt) + chip alanı 2 satır (~72 pt) + banner 50–90 pt düşülünce tahtaya ~500–540 pt yükseklik, ~374 pt genişlik kalır. 20 sütun → hücre ≈ **18,7 pt**, 25 satır → 467 pt → büyük tahta zoom'suz sığar; küçük tahta (18 satır, 337 pt) aynı harf boyutuyla ekranda **görünür biçimde küçük** kalır — WSE'nin "küçük tahta = kolay yanılsaması" etkisi ücretsiz gelir. 18,7 pt hücre (~13 pt mono harf) okunabilirlik sınırında kabul edildi; **kesin sınır /ux'ten** (open-questions #7). /ux ≥ 24 pt derse Seçenek C devreye girer.

**Süre modeli (tahmin, kalibre edilecek):** \( T \approx 10 + 6K + 2{,}5 \cdot K \cdot (PER-1) = 10 + 16K \) saniye. İlk kopya 6 s (kelimeyi öğrenme + arama), sonraki kopyalar 2,5 s (pattern biliniyor), 10 s açılış/kapanış. K=5 → 1:30, K=6 → 1:46, K=7 → 2:02, K=10 → 2:50. Zoom/pan süresi dahil değil. `docs/references/word-search-explorer.md` hedefi (büyük ≤ 2:30, küçük ≤ 1:30) bu modele göre iyimser; ölçüm karar verir (bkz. Ölçüm).

## Seçenek A — Sadece kelime sayısı değişir (grid 20×25 sabit)

### Öneri
Grid tüm levellarda 20×25 kalır; büyük level 10 kelime, küçük level 7 kelime.

### Gerekçe
WSE'nin "tek kaldıraç = kelime sayısı" dersinin en düz çevirisi; `/prototype` için en ucuz değişiklik (sadece `LEVELS[].words` uzunluğu).

### Referans
`docs/references/word-search-explorer.md#zorluk-eğrisi` — tek kaldıraç kelime sayısı. Ancak WSE'de kelime sayısıyla birlikte **tahta da küçülüyor** (56 → 42); A bunu almıyor.

### Trade-off
Hedef hücre oranı çöküyor: büyük p = 50×5,2/500 = **0,52**, küçük p = 35×5,2/500 = **0,36**. Küçük levelda rastgele dokunuşta can kaybı 0,48 → 0,64; bedava hata hakkı 10,4 → 7,8. "Nefes" levelı **daha riskli** level oluyor — tam da kaçınılması gereken şey. Ayrıca 500 hücrede 35 yerleşim aramak süreyi beklendiği kadar kısaltmaz (tarama alanı aynı). Pillar 6 ile gerilim: zorluk niyet edilmeden risk kaldıracından geliyor.

### Gerekli görüşler
Yok (reddedilmesi önerilen seçenek).

### Ölçüm
Küçük levellarda yanlış tap/level büyük levellardan yüksek çıkarsa (öngörü: +%30) seçenek çürümüş sayılır.

## Seçenek B — Satır + kelime birlikte değişir, sütun sabit (Önerilen)

### Öneri
Büyük level **20×25 / 10 kelime**, küçük level **20×18 / 7 kelime**; FTUE için L1 **20×12 / 5 kelime**, L2 **20×15 / 6 kelime**; L3'ten itibaren katı B-A ritmi (her büyük tahtayı bir küçük izler); PER, can, ipucu, yön ağırlıkları, dolgu alfabesi, sütun sayısı global sabit.

### Gerekçe
- p bandı dar kalır: hesaplanan 20 level için **p = 0,500–0,542** (aşağıdaki tablo). Rastgele dokunuşta can kaybı olasılığı 0,46–0,50; bedava hata hakkı 10,0–10,9 — levelden levele risk değişmiyor, sadece süre değişiyor.
- Hücre oranı WSE'ye yakın: 500/360 = 1,39 (WSE 1,33); kelime oranı 10/7 = 1,43 (WSE ~1,5); süre oranı 170/122 = 1,39 (WSE ~1,5).
- FTUE: L1 25 yerleşim (~1:30), L2 30 yerleşim (~1:46); ilk iki levelda ipucu/yerleşim oranı %12 ve %10. WSE'nin ilk levelları için veri yok (`#eksik-veri`); FTUE basamağı prototipin "L1'de 50 yerleşim" gözlemine karşı önlem.
- Sütun sabit → `fit()` ölçeği, harf boyutu ve chip alanı genişliği değişmez; küçük tahta ekranda daha az yer kaplar, bu da WSE'nin "optik yanılsama"sını üretir.

### Referans
- `docs/references/word-search-explorer.md#zorluk-eğrisi` — 56/42 dönüşümü, "zor leveli kolay level izler", süre ritmi.
- `docs/references/word-search-explorer.md#bize-uyarlanabilirlik` — 20×25/10 ↔ 20×18/7 çevirisi (bu dokümanda kelime listeleriyle doğrulandı: market-research'ün ±2 puan tahmini, gerçek listelerle ±2,1 puan çıktı).
- "Duvar" levelı yok: WSE'de tasarım gereği yok (`#zorluk-eğrisi`, "Duvar level: yok").

### Trade-off
- 20 sütun okunabilirlik sınırında (mechanic.md#açık-konular: "zoom'suz okunamaz"). /ux reddederse C'ye geçilir.
- Küçük tahtada 7 chip alanı yarım kalır; L1'de 5 chip. UI boşluğu /ux konusu.
- L1 20×12 yatay dikdörtgen (5:3); portre telefonda alışılmadık görünebilir.
- "Duvar" yok → ilerleme hissi için yıldız/puan gibi başka bir sinyal gerekebilir (ilk 20 level dışı, gameplay).
- Pillar 7 ile uyumlu, Pillar 5 ile gerilim yok (tahta değişmiyor, sadece boyutu).

### Gerekli görüşler
- **/ux**: `fit()` hücre boyutu alt sınırı (20 sütun kabul mü?), 5/7/10 chip yerleşimi, küçük tahtada boş alanın kullanımı, L1 yatay oran, FTUE'de ters yazımın kapatılıp kapatılmayacağı (open-questions #7, #8).
- **/prototype**: riskli satırların generator doğrulaması; `LEVELS` verisine `rows` ve değişken `words` alanı; süre/yanlış tap logu (open-questions #9).
- **/liveops**: 20 level ≈ 47 dk tahmini → banner (L11–13) ≈ 25. dakika, WSE'nin L24'ü ≈ 55. dakika; eşik level mi dakika mı (open-questions #10).

### Ölçüm
Aşağıda "Ölçüm ve hedef aralıkları" bölümünde.

## Seçenek C — Sütun da küçülür (okunabilirlik yedeği)

### Öneri
Büyük level **16×22 / 7 kelime** (352 hücre, p ≈ 0,51), küçük level **16×16 / 5 kelime** (256 hücre, p ≈ 0,49); FTUE L1 16×12 / 4 kelime (p ≈ 0,50 için ort. uzunluk 4,8 gerekir). PER, can, ipucu sabit.

### Gerekçe
16 sütun → hücre ≈ 23,4 pt (~16 pt harf); WSE'nin "tahta tek ekranda, zoom'suz" hedefine daha yakın. Kelime bandı 5–7 → chip tek satır. Süre: büyük ~2:02, küçük ~1:30 → market-research'ün oturum hedefine (≥ 3 çift / 11 dk) **bu seçenek uyar**, B uymaz (B ≈ 2,3 çift / 11 dk).

### Referans
`docs/references/word-search-explorer.md#bize-uyarlanabilirlik` — "Senior-dostu okunabilirlik: tahta ekrana sığmalı … ya da grid küçülmeli". `#zorluk-eğrisi` oturum matematiği.

### Trade-off
- Prototipin "500 hücre, 50 yerleşim" koleksiyon hissi (Pillar 4) zayıflar: büyük levelda 35, küçükte 25 yerleşim.
- Level başına içerik düşer → aynı oyun süresi için 1,4× daha fazla level/tema gerekir (Pillar 7: küratörlük maliyeti artar).
- Prototipte `COLS` değişkeni level verisine taşınır; chip ve HUD genişliği yeniden sığdırılır.

### Gerekli görüşler
/ux (okunabilirlik kararı bu seçeneğin tetikleyicisi), /prototype (COLS level alanı).

### Ölçüm
B ile aynı metrikler; ek olarak oturumda tamamlanan çift sayısı ≥ 3.

## Karşılaştırma

p = hedef hücre oranı; 1−p = rastgele dokunuşta can kaybı; "son 10" = açılmamış 10 yerleşim kaldığında (≈ 10×5,2 = 52 hücre hedef); bedava hata = 5 / (1−p).

| Seçenek / tahta | Grid | K | Yerleşim | p | 1−p (başlangıç) | 1−p (son 10) | Bedava hata |
|---|---|---|---|---|---|---|---|
| A büyük | 20×25 | 10 | 50 | 0,52 | 0,48 | 0,90 | 10,4 |
| A küçük | 20×25 | 7 | 35 | **0,36** | **0,64** | 0,90 | **7,8** |
| B büyük | 20×25 | 10 | 50 | 0,51–0,53 | 0,47–0,49 | 0,90 | 10,2–10,6 |
| B küçük | 20×18 | 7 | 35 | 0,50–0,54 | 0,46–0,50 | 0,86 | 10,0–10,9 |
| B FTUE L1 | 20×12 | 5 | 25 | 0,50 | 0,50 | 0,80 | 10,0 |
| B FTUE L2 | 20×15 | 6 | 30 | 0,52 | 0,48 | 0,83 | 9,6 |
| C büyük | 16×22 | 7 | 35 | 0,51 | 0,49 | 0,85 | 10,2 |
| C küçük | 16×16 | 5 | 25 | 0,49 | 0,51 | 0,80 | 9,8 |

Not: "son 10" riski küçük tahtada **daha düşük** (dolgu hücresi daha az). Yani küçük tahta oyun sonunda da daha az cezalandırıcı; nefes hissi hesapla tutarlı.

## Önerilen

**Seçenek B.** p bandını tutan en küçük değişiklik (sadece `ROWS` ve kelime sayısı level verisine iner), market-research çevirisini gerçek kelime listeleriyle doğruluyor, prototipin koleksiyon hissini (50 yerleşim) koruyor. **Karar tetikleyicisi:** /ux 20 sütunu zoom'suz okunabilir saymazsa (open-questions #7) B düşer, C'nin tablosu aynı formülle yeniden üretilir.

## Level tablosu (Seçenek B)

Ters ve çapraz oranları nominal `DIRS` değerleri (global sabit). p = K × PER × ort. uzunluk / (sütun × satır), aşağıdaki gerçek kelime listeleriyle hesaplandı. Süre = 10 + 16K s (tahmin). B = büyük, K = küçük, F = FTUE.

| # | Tema | Grid (s×s) | Kelime | PER | Uzunluk | Ters | Çapraz | Can | İpucu | p | Süre | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Meyveler | 20×12 | 5 | 5 | 4–5 | %20 | %50 | 5 | 3 | 0,500 | 1:30 | F. 25 yerleşim; **generator riski: küçük grid** (#9) |
| 2 | Renkler | 20×15 | 6 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,517 | 1:46 | F. 7 harfli KIRMIZI 15 satırda; **generator riski** (#9) |
| 3 | Hayvanlar | 20×18 | 7 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,514 | 2:02 | K. İlk standart küçük tahta |
| 4 | Mutfak | 20×25 | 10 | 5 | 5–6 | %20 | %50 | 5 | 3 | 0,530 | 2:50 | B. Prototip L2 listesi; üretildiği biliniyor |
| 5 | Ev | 20×18 | 7 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,500 | 2:02 | K. Nefes; özel harf %0 |
| 6 | Doğa | 20×25 | 10 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,510 | 2:50 | B. Prototip L4 listesi; özel harf %16 (en yüksek) |
| 7 | Okul | 20×18 | 7 | 5 | 5–6 | %20 | %50 | 5 | 3 | 0,500 | 2:02 | K |
| 8 | Vücut | 20×25 | 10 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,510 | 2:50 | B |
| 9 | Taşıtlar | 20×18 | 7 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,514 | 2:02 | K. 7 harfli TRAMVAY; **generator riski** (#9) |
| 10 | Deniz | 20×25 | 10 | 5 | 5–6 | %20 | %50 | 5 | 3 | 0,530 | 2:50 | B. 10. level büyük tahtaya denk gelir; ekstra zorluk yok |
| 11 | Giysi | 20×18 | 7 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,514 | 2:02 | K. 7 harfli ELDİVEN; **generator riski** (#9). Banner reklamı ~bu levelda açılır (liveops) |
| 12 | Meslekler | 20×25 | 10 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,520 | 2:50 | B |
| 13 | Sebzeler | 20×18 | 7 | 5 | 5–6 | %20 | %50 | 5 | 3 | 0,514 | 2:02 | K |
| 14 | Spor | 20×25 | 10 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,510 | 2:50 | B. 7 harfli HENTBOL, nadir harf J (JUDO) kolay ipucu |
| 15 | Müzik | 20×18 | 7 | 5 | 5–7 | %20 | %50 | 5 | 3 | 0,528 | 2:02 | K. 7 harfli KLARNET; **generator riski** (#9) |
| 16 | Şehir | 20×25 | 10 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,530 | 2:50 | B |
| 17 | Aile | 20×18 | 7 | 5 | 4–6 | %20 | %50 | 5 | 3 | 0,500 | 2:02 | K |
| 18 | Bahçe | 20×25 | 10 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,520 | 2:50 | B. Özel harf %15 |
| 19 | Tatlılar | 20×18 | 7 | 5 | 5–7 | %20 | %50 | 5 | 3 | **0,542** | 2:02 | K. **Bandın üst ucu + 7 harfli BAKLAVA; en riskli satır** (#9). REVANİ → TAHİN ile p 0,528 |
| 20 | Oyuncaklar | 20×25 | 10 | 5 | 4–7 | %20 | %50 | 5 | 3 | 0,530 | 2:50 | B. 20. level büyük tahtaya denk gelir; "duvar" eklenmez |

Toplam tahmini süre: 20 level ≈ **47 dk** (318 s FTUE + 9×170 s büyük + 8×122 s küçük). 11,3 dk oturumla ≈ 4 oturum → ilk 20 level D0–D2 içeriği.

## Kelime listeleri

Kurallar: Türkçe, 4–7 harf, yaygın; aynı levelda hiçbir kelime (veya tersi) başka bir kelimenin alt dizisi değil — bu yalnızca algı değil **generator kısıtı**: kaza temizliği alt dizi eşleşmesini bulur, değiştirecek dolgu hücresi olmadığı için `unfixable` → 400 denemenin hepsi düşer → `throw`. Özel harf = İ Ş Ğ Ç Ö Ü (büyük mono fontta İ/I ayrımı ve aksanlar okunabilirliği etkiler); Türkçe metinde doğal payı ~%15, listeler %0–16 arasında. Kelimeler levellar arasında tekrar etmez.

| # | Tema | Kelimeler | Σ harf | Ort. | Özel harf |
|---|---|---|---|---|---|
| 1 | Meyveler | ELMA ARMUT KİRAZ ÇİLEK KAVUN | 24 | 4,80 | 3/24 = %13 |
| 2 | Renkler | MAVİ KIRMIZI YEŞİL PEMBE SİYAH BEYAZ | 31 | 5,17 | 4/31 = %13 |
| 3 | Hayvanlar | ASLAN KAPLAN TAVŞAN KARTAL YILAN KEDİ KOYUN | 37 | 5,29 | 2/37 = %5 |
| 4 | Mutfak | EKMEK PEYNİR ÇORBA SALATA ZEYTİN BİBER KAHVE ŞEKER LİMON PİLAV | 53 | 5,30 | 7/53 = %13 |
| 5 | Ev | MASA KOLTUK YASTIK PERDE LAMBA DOLAP TABAK | 36 | 5,14 | 0/36 = %0 |
| 6 | Doğa | NEHİR VADİ TEPE BULUT RÜZGAR YAĞMUR TOPRAK ÇAYIR KAYA ŞİMŞEK | 51 | 5,10 | 8/51 = %16 |
| 7 | Okul | KALEM DEFTER SİLGİ KİTAP ÇANTA TAHTA SINIF | 36 | 5,14 | 4/36 = %11 |
| 8 | Vücut | KAFA BURUN KULAK PARMAK DİRSEK BACAK OMUZ BOYUN DUDAK KİRPİK | 51 | 5,10 | 3/51 = %6 |
| 9 | Taşıtlar | ARABA OTOBÜS GEMİ UÇAK KAMYON VAPUR TRAMVAY | 37 | 5,29 | 3/37 = %8 |
| 10 | Deniz | BALIK DALGA KUMSAL MARTI YENGEÇ KAYIK MİDYE FENER YOSUN İSKELE | 53 | 5,30 | 3/53 = %6 |
| 11 | Giysi | GÖMLEK ETEK CEKET ÇORAP ŞAPKA KEMER ELDİVEN | 37 | 5,29 | 4/37 = %11 |
| 12 | Meslekler | DOKTOR AŞÇI POLİS KASAP TERZİ BERBER HAKİM PİLOT AVUKAT MİMAR | 52 | 5,20 | 7/52 = %13 |
| 13 | Sebzeler | SOĞAN HAVUÇ KABAK MARUL BAMYA LAHANA PIRASA | 37 | 5,29 | 2/37 = %5 |
| 14 | Spor | FUTBOL TENİS YÜZME KOŞU GÜREŞ BOKS JUDO HENTBOL KAYAK ESKRİM | 51 | 5,10 | 6/51 = %12 |
| 15 | Müzik | GİTAR PİYANO KEMAN DAVUL ŞARKI ZURNA KLARNET | 38 | 5,43 | 3/38 = %8 |
| 16 | Şehir | SOKAK CADDE KÖPRÜ MEYDAN PAZAR BANKA HASTANE ECZANE FIRIN MÜZE | 53 | 5,30 | 3/53 = %6 |
| 17 | Aile | KARDEŞ TEYZE YEĞEN ENİŞTE KUZEN TORUN ANNE | 36 | 5,14 | 4/36 = %11 |
| 18 | Bahçe | ÇİÇEK AĞAÇ ÇİMEN TOHUM SAKSI KÜREK HORTUM YAPRAK LALE PAPATYA | 52 | 5,20 | 8/52 = %15 |
| 19 | Tatlılar | BAKLAVA HELVA LOKUM SÜTLAÇ PASTA AŞURE REVANİ | 39 | 5,57 | 4/39 = %10 |
| 20 | Oyuncaklar | BEBEK TOPAÇ MİSKET BALON ROBOT YAPBOZ DAMA SAPAN KUKLA UÇURTMA | 53 | 5,30 | 3/53 = %6 |

Prototipin "Karışık" (L1) listesi kullanılmadı: FTUE için tek tema daha okunur; kelimeleri (ÇİÇEK, KALEM, KİTAP, BALIK) ilgili temalara dağıtıldı. Lokalizasyon: parametre seti (grid, K, PER) dil bağımsız; listeler dil başına yeniden kürate edilir, p bandı her dilde ort. uzunlukla yeniden hesaplanır.

## Ritim: nefes ve duvar

- **Nefes = küçük tahta, her iki levelda bir.** WSE'nin kuralı "her 56'yı bir 42 izler"; "her 5 levelda nefes" kalıbı B-A dönüşümüyle çakışır, kullanılmadı. Küçük tahta hem %28 daha kısa (122 vs 170 s) hem oyun sonunda daha az riskli (1−p son 10: 0,86 vs 0,90).
- **Duvar yok (L1–20).** WSE'de tasarım gereği yok. Tap Words'te süreyi uzatmadan zorlaştıran her kaldıraç (PER↓, ters↑, kısa kelime, dolgu alfabesi) risk kaldıracıdır; p bandını bozar ve E1 (can) tartışmasını erken açar. L10 ve L20 doğal olarak büyük tahtaya denk gelir; bu yeterli "kapanış" hissidir, üstüne bir şey eklenmez. Duvar ihtiyacı L21+ için, ters oranı kaldıracıyla ve E1 açıldıktan sonra değerlendirilir.
- **FTUE basamağı (L1–2):** 25 → 30 → 35 yerleşim. Üç levelda standart küçük tahtaya ulaşılır; L4 ilk büyük tahta. İlk büyük tahtanın L4'te gelmesi, oyuncunun "kelimeyi 5 kez bul" döngüsünü üç kez tamamlamış olmasına bağlı.

## Ölçüm ve hedef aralıkları

Prototipe level başına log gerekir (süre, yanlış tap, ipucu, sonuç) — open-questions #9. Hedefler ilk playtest'ten sonra revize edilir.

| Metrik | Hedef | Başarısızlık sinyali |
|---|---|---|
| Level fail rate (can 0) | L1–3: ≤ %3; L4–20: %2–8 | Herhangi bir level komşularından > 5 puan sapıyorsa p bandı pratikte tutmuyor demektir |
| Yanlış tap / level | Büyük 2–4, küçük 1,5–3, L1 ≤ 2 (≈ 0,05–0,08 yanlış tap/yerleşim, levelden bağımsız) | Küçük tahtada yanlış tap/yerleşim büyükten > %20 yüksekse "nefes" nefes değil |
| Süre (medyan) | Büyük 2:30–3:30, küçük 1:45–2:30, L1 ≤ 1:45 | Büyük > 3:30 → büyük tahta 20×22 / 9 kelimeye iner (p = 45×5,2/440 = 0,53, band korunur) |
| İlk denemede tamamlama | L1–3 ≥ %97, L4–20 ≥ %92 | |
| "Sonraki seviye" tıklama oranı | Küçük level sonunda büyükten ≥ 5 puan yüksek (WSE ritim tezi) | Fark yoksa 56/42 yanılsaması Tap Words'e taşınmıyor |
| İpucu kullanımı / level | L1–2 ≤ 1,5; L3+ ≤ 2 | 3/3 kullanımı yaygınsa (> %30) ipucu bütçesi tartışılır (gameplay) |
| Oturumda tamamlanan çift | ≥ 2 (B), ≥ 3 (C) | |

## Level verisi formatı (öneri)

Global sabitler kalır (`COLS`, `PER`, `MAXL`, `MAXH`, `DIRS`, `FILL`); level sadece değişeni taşır:

```js
{ id: 3, theme: "Hayvanlar", rows: 18, words: ["ASLAN", "KAPLAN", ...] }
```

Kelime sayısı `words.length`'ten türer. Gelecekte kaldıraç açılırsa alan eklenir (`per`, `reverseWeight`), varsayılanı global değer olur; v01'de eklenmez.

## Prototip görevi

Uygulama ADR sonrası; doğrulama şimdi yapılabilir (mekaniği değiştirmez):

1. **Generator doğrulama** (geçici script, repo dışı): tablodaki 1, 2, 9, 11, 15, 19 numaralı satırlar için 1000'er üretim; başarısızlık oranı (`throw`) ve ortalama `attempt`. Eşik: başarısızlık %0, ortalama attempt ≤ 5. Aşılırsa ilgili levelın 7 harfli kelimesi 5–6 harfliyle değişir (p yeniden hesaplanır).
2. ADR sonrası: `ROWS` → `LEVELS[i].rows`, `WORDS` → `LEVELS[i].words`; `generate()`, `inb()`, `fit()` ve `owner/letters` dizileri `ROWS`'u levelden okur.
3. Level sonu log: `{level, ms, wrongTaps, hintsUsed, result}` → `localStorage` + konsol.

## Açılan sorular

open-questions.md'ye eklenen satırlar: #7 (/ux okunabilirlik ve hücre alt sınırı), #8 (/ux chip alanı, boş alan, L1 oranı, FTUE ters yazım), #9 (/prototype generator doğrulama + level verisi + log), #10 (/liveops süre bazlı eşik).
