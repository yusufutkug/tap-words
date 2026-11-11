# Zorluk Eğrisi v03 — İlk 30 Level, D Hedefli Tier Modeli

- Tarih / sürüm: 2026-11-11 / v03 (taslak; `curve-v02.md`'yi günceller, v02 arşiv)
- Alan: level-design (ana sohbet)
- Problem: v02 p'yi 0,45–0,55'te sabitleyip zorluğu yalnızca yerleşim sayısıyla kuruyordu. T00–T11 oynanışı (`param-tests-v01-results.md`) zorluğun **D = Y × (1 − p)** ile sıralandığını ve p'nin kendisinin hissedildiğini gösterdi → ADR-0008. Eğri D hedefiyle yeniden kuruluyor.
- İlgili ADR: ADR-0001, ADR-0002, ADR-0004 (can 3 — bu dokümanda fail hedefleri 3 can içindir, ε log'dan gelince kalibre edilir), ADR-0005 (üretim `tools/bake.js`), **ADR-0008**.
- Doğrulama: 30 listenin tamamı `node tools/bake.js check` ile 200'er üretim, **%0 başarısız**, kelime tekrarı yok, palindrom/alt dizi yok.

## v02'den farklar

| Konu | v02 | v03 | Neden |
|---|---|---|---|
| Zorluk hedefi | p sabit 0,45–0,55; tier = Y | **D bandı**; p 0,39–0,59 arasında kaldıraç | ADR-0008; oynanış |
| N tier | 17×21, 7 kelime, Y 35 | **17×18, 6 kelime, Y 30, p 0,49** (= T00, "keyifli") | T00 doğrudan N referansı |
| H tier | 17×26, 9 kelime, Y 45 | **17×18, 6 kelime, 4–5 harf, p 0,39–0,42, Y 30** (= T04, "güzel bir zor") | Kısa kelime yolu; süre ve chip sayısı N ile aynı, yalnızca risk artar |
| S tier | 17×26, 10 kelime 4–5 harf, Y 50 | **17×21, 7 kelime, 4–5 harf, p 0,39–0,43, Y 35** | D 20–21; T10'un (D 19,8) üstünde ama 442 hücre yerine 357 |
| R tier | 17×16, 5 kelime, p 0,50 | aynı grid/K; p 0,48–0,51 korunur | D 12–13 "keyifli" bandına zaten düşüyordu |
| F tier | 17×12, 4 kelime, p 0,49 | 17×12, 4 kelime, **p 0,54** (5–6 harf) | D 9 "çok kolay"; p üst ucu FTUE'de kullanılır (Utku notu T03) |
| En büyük tahta | 17×26 (442) | **17×21 (357)** | Büyük tahta reddedildi (ADR-0008); 17×26 yalnızca ileride koleksiyon/event tahtası |
| Toplam süre (tahmin) | 61 dk | ≈ 52 dk (Y toplamı 1180 → 900) | Y düştü |
| Ritim | Seçenek B `1121121113` | aynı | Değişiklik gerekmedi |

## Sabitler

| Parametre | Değer | Not |
|---|---|---|
| `COLS` | 17 | T11 ile doğrulandı |
| `PER` | 5 | K serisi (`param-tests-v02`) sonucu gelene kadar |
| Can | 3 (ADR-0004) | Keşif setinde 5'ti; fail hedefleri aşağıda 3 can için |
| İpucu/booster | ADR-0003 | |
| Ters | %0 L1–30; L31+ H %20, S %33 | v02 ile aynı (WSE `hwp`) |
| Çapraz | L1–2 %0, L3+ nominal %50 | v02 ile aynı; **gerçekleşen oran** 0,27–0,43 bandında seed seçilir (`tools/bake.js`) |
| Çapraz X kesişme | serbest | T09X sonucu gelince karar; zorlaştırdığı doğrulanırsa N/R'de `noDiagCross: true` |
| Dolgu | `FILL` TR frekans | |
| Özel harf | ≤ %15 / level (L23 %19 işaretli) | |

## Tier parametre seti

D = Y × (1 − p). Hedef = ilk-deneme kazanma (3 can; ε log'dan gelince kalibre).

| Tier | Ad | Grid | Hücre | K | PER | Y | Σ harf | Hedef hücre | p | **D** | Süre (10 + 16K) | Rol |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **F** | FTUE | 17×12 | 204 | 4 | 5 | 20 | 22 | 110 | 0,54 | **9,2** | 1:14 | L1; çapraz %0 |
| **R** | Relief | 17×16 | 272 | 5 | 5 | 25 | 26–28 | 130–140 | 0,48–0,51 | **12,1–13,1** | 1:30 | Her H/S'den sonra; L2 |
| **N** | Normal | 17×18 | 306 | 6 | 5 | 30 | 29–30 | 145–150 | 0,47–0,49 | **15,3–15,8** | 1:46 | Taban (= T00) |
| **H** | Hard | 17×18 | 306 | 6 | 5 | 30 | 24–26 | 120–130 | 0,39–0,42 | **17,3–18,2** | 1:46 | Kısa kelime (= T04) |
| **S** | Super hard | 17×21 | 357 | 7 | 5 | 35 | 28–31 | 140–155 | 0,39–0,43 | **19,8–21,3** | 2:02 | L10/20/30 |

N ve H aynı grid, aynı K, aynı Y, aynı süre: fark yalnızca kelime uzunluğu → p → D. Oyuncu "aynı tahta, daha zor" hisseder; UI değişmez.

## Öneri

v02 Seçenek B ritmi (`F R N N H R H R N S | R N H R N H R N N S | R N H R N H R N N S`) korunur; tier'lar yukarıdaki D hedefli parametre setiyle değiştirilir; kelime listeleri yeniden kürate edilir (H/S için 4–5 harf).

## Gerekçe

`param-tests-v01-results.md` §2–4: D sıralaması, p 0,69 çiftinin "çok kolay", T04'ün "güzel bir zor", T11'in sütun etkisi. ADR-0008.

## Referans

- `docs/references/amaze-go.md#apk-analizi` — tier ritmi varyant 1, `firstwinrate` 0,69/0,58/0,55.
- `docs/references/word-search-explorer.md#apk-analizi` — grid seti, `hwp` L35+.
- `docs/levels/param-tests-v01-results.md` — oynanış verisi (bu eğrinin birincil referansı).

## Trade-off

- D öznel notlardan türedi (1 oyuncu); `ka-log` ile doğrulanana kadar bandlar ±1 oynayabilir.
- H/S için 4–5 harfli kelime kürasyonu daha zor; tema seçeneği daralıyor (Meslekler, Çiçekler, Hava gibi uzun kelimeli temalar yalnızca N/R'de).
- Büyük tahta (17×26) ana akıştan çıktı → Pillar 4 "50 yerleşim topla" hissi yalnızca event tahtalarında. S tier 35 yerleşim.
- Pillar 3: p 0,39'da dolgu %61; ceza oranı artar ama kural görünür, adil kalır. Pillar 6: tüm kaldıraçlar mekanikten.
- L1–2'de çapraz %0 ile 2 yön + p 0,54: generator riski düşük (L1 ort. 0,02 deneme).

## Gerekli görüşler

- **/prototype:** curve-v03'ü `levels.js` olarak bake etmek (`tools/bake.js`'e `curve` modu; 50 level yerine 30 + ritim); `rows/per/words` zaten level başına.
- **/gameplay:** 3 can ile D ≥ 20'de fail hedefi; booster'ın D'ye etkisi (#17 güncellenir).
- **/ux:** N→H geçişinde tahta aynı görünüyor; "zor level" sinyali gerekir mi (#18 güncellenir). Chip 4–7 kelime tek satır (48 pt) tutuyor.
- **/liveops:** 30 level ≈ 52 dk (#10 güncellenir); Daily Challenge tahtası D hedefi (öneri: D 17–18, H eşdeğeri).

## Ölçüm

| Metrik | Hedef | Başarısızlık sinyali |
|---|---|---|
| ε·Y (yanlış tap / level) ↔ D | Spearman ≥ 0,8 | < 0,6 → D modeli revize (uzunluk terimi) |
| İlk-deneme kazanma (3 can) | F/R ≥ 0,98, N ≥ 0,93, H ≥ 0,85, S ≥ 0,78 | Tier 5 puan altında → Σ harf +2 (p ↑, D ↓) |
| Süre (medyan) | N ≈ H 1:30–2:15, S 1:45–2:45 | H > N + %25 → kısa kelime taramayı beklenenden çok uzatıyor |
| "Sonraki seviye" tıklama | R sonrası ≥ H/S sonrası + 5 puan | Yoksa relief hissi taşınmıyor |
| H sonrası R'de yanlış tap | N'deki ile aynı | Yüksekse H oyuncuyu "hızlı dokunmaya" alıştırıyor |

## Level tablosu L1–30

Grid sütun×satır. p ve D gerçek listelerle (`tools/bake.js check`). Çapraz nominal; L1–2 %0. Ters %0.

| # | Tier | Tema | Grid | K | Uzunluk | Σ | Y | Hedef | p | D | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | F | Meyveler | 17×12 | 4 | 5–6 | 22 | 20 | 110 | 0,54 | 9,2 | Sadece sağa/aşağı |
| 2 | R | Renkler | 17×16 | 5 | 5–7 | 27 | 25 | 135 | 0,50 | 12,6 | Çapraz %0; KIRMIZI (7) |
| 3 | N | Hayvanlar | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | Çapraz tanıtımı (/ux) |
| 4 | N | Sofra | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 5 | H | Ev | 17×18 | 6 | **4** | 24 | 30 | 120 | 0,39 | 18,2 | = T04 |
| 6 | R | Okul | 17×16 | 5 | 5–6 | 27 | 25 | 135 | 0,50 | 12,6 | |
| 7 | H | Vücut | 17×18 | 6 | **4** | 24 | 30 | 120 | 0,39 | 18,2 | |
| 8 | R | Taşıtlar | 17×16 | 5 | 4–7 | 27 | 25 | 135 | 0,50 | 12,6 | TRAMVAY (7) |
| 9 | N | Deniz | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 10 | **S** | Aile | 17×21 | 7 | **4** | 28 | 35 | 140 | 0,39 | **21,3** | Duvar 1; ort. 2,5 deneme (en yüksek) |
| 11 | R | Sebzeler | 17×16 | 5 | 5–6 | 27 | 25 | 135 | 0,50 | 12,6 | |
| 12 | N | Spor | 17×18 | 6 | 4–6 | 29 | 30 | 145 | 0,47 | 15,8 | |
| 13 | H | Çiftlik | 17×18 | 6 | 4–5 | 26 | 30 | 130 | 0,42 | 17,3 | |
| 14 | R | Müzik | 17×16 | 5 | 5–6 | 26 | 25 | 130 | 0,48 | 13,1 | |
| 15 | N | Şehir | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 16 | H | Tatil | 17×18 | 6 | 4–5 | 26 | 30 | 130 | 0,42 | 17,3 | |
| 17 | R | Tatlılar | 17×16 | 5 | 5–7 | 27 | 25 | 135 | 0,50 | 12,6 | BAKLAVA (7) |
| 18 | N | Kuşlar | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 19 | N | Oyuncaklar | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 20 | **S** | Mutfak | 17×21 | 7 | 4–5 | 31 | 35 | 155 | 0,43 | **19,8** | Duvar 2 |
| 21 | R | Uzay | 17×16 | 5 | 4–7 | 27 | 25 | 135 | 0,50 | 12,6 | GEZEGEN (7) |
| 22 | N | İçecekler | 17×18 | 6 | 4–6 | 29 | 30 | 145 | 0,47 | 15,8 | |
| 23 | H | Masallar | 17×18 | 6 | 4–5 | 26 | 30 | 130 | 0,42 | 17,3 | Özel harf %19 (işaretli) |
| 24 | R | Kahvaltı | 17×16 | 5 | 5–7 | 27 | 25 | 135 | 0,50 | 12,6 | YUMURTA (7) |
| 25 | N | Doğa | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | = T10 listesi, 17×18'de |
| 26 | H | Giysi | 17×18 | 6 | 4–5 | 26 | 30 | 130 | 0,42 | 17,3 | |
| 27 | R | Böcekler | 17×16 | 5 | 4–7 | 28 | 25 | 140 | 0,51 | 12,1 | KELEBEK, KARINCA (7) |
| 28 | N | Banyo | 17×18 | 6 | 4–6 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 29 | N | Aletler | 17×18 | 6 | 5 | 30 | 30 | 150 | 0,49 | 15,3 | |
| 30 | **S** | Sınıf | 17×21 | 7 | 4–5 | 31 | 35 | 155 | 0,43 | **19,8** | Duvar 3; L31+ S ters %33 |

D dizisi: 9 · 13 · 15 · 15 · **18** · 13 · **18** · 13 · 15 · **21** | 13 · 16 · **17** · 13 · 15 · **17** · 13 · 15 · 15 · **20** | 13 · 16 · **17** · 13 · 15 · **17** · 12 · 15 · 15 · **20**. Toplam Y = 900; süre ≈ 52 dk.

## Kelime listeleri

Kurallar: Türkçe, yaygın; aynı levelda palindrom yok, hiçbir kelime (veya tersi) başka bir kelimenin alt dizisi değil; 30 level boyunca kelime tekrar etmez (doğrulandı). Özel harf = İŞĞÇÖÜ.

| # | Tier | Tema | Kelimeler | Σ | Özel |
|---|---|---|---|---|---|
| 1 | F | Meyveler | KARPUZ KAYISI ÇİLEK KİRAZ | 22 | %14 |
| 2 | R | Renkler | KIRMIZI PEMBE YEŞİL SİYAH BEYAZ | 27 | %11 |
| 3 | N | Hayvanlar | ASLAN YILAN KOYUN TİLKİ GEYİK ZEBRA | 30 | %10 |
| 4 | N | Sofra | EKMEK ÇORBA KAHVE ŞEKER LİMON BİBER | 30 | %13 |
| 5 | H | Ev | MASA KAPI HALI SOBA ÇATI ODUN | 24 | %4 |
| 6 | R | Okul | KALEM DEFTER SİLGİ KİTAP CETVEL | 27 | %11 |
| 7 | H | Vücut | KAFA OMUZ AYAK KALP ALIN ÇENE | 24 | %4 |
| 8 | R | Taşıtlar | ARABA UÇAK KAMYON VAPUR TRAMVAY | 27 | %4 |
| 9 | N | Deniz | BALIK DALGA MARTI KAYIK MİDYE YOSUN | 30 | %3 |
| 10 | S | Aile | ANNE BABA DEDE NİNE HALA AMCA DAYI | 28 | %4 |
| 11 | R | Sebzeler | SOĞAN HAVUÇ LAHANA PIRASA MARUL | 27 | %7 |
| 12 | N | Spor | FUTBOL TENİS YÜZME HOKEY JUDO GOLF | 29 | %7 |
| 13 | H | Çiftlik | İNEK EŞEK KEÇİ AHIR HOROZ SAMAN | 26 | %15 |
| 14 | R | Müzik | GİTAR PİYANO KEMAN DAVUL ŞARKI | 26 | %12 |
| 15 | N | Şehir | SOKAK CADDE PAZAR BANKA KÖPRÜ DURAK | 30 | %7 |
| 16 | H | Tatil | PLAJ OTEL GEZİ KAMP ÇADIR VALİZ | 26 | %12 |
| 17 | R | Tatlılar | HELVA LOKUM PASTA AŞURE BAKLAVA | 27 | %4 |
| 18 | N | Kuşlar | SERÇE KARGA KUMRU ŞAHİN TAVUK ÖRDEK | 30 | %13 |
| 19 | N | Oyuncaklar | BEBEK TOPAÇ BALON ROBOT KUKLA PELUŞ | 30 | %7 |
| 20 | S | Mutfak | TAVA KASE KUPA OCAK ÇATAL KAŞIK BIÇAK | 31 | %10 |
| 21 | R | Uzay | YILDIZ ROKET UYDU DÜNYA GEZEGEN | 27 | %4 |
| 22 | N | İçecekler | AYRAN SALEP GAZOZ ŞERBET KOLA BOZA | 29 | %3 |
| 23 | H | Masallar | PERİ CÜCE ŞATO TAHT SARAY SİHİR | 26 | **%19** |
| 24 | R | Kahvaltı | YUMURTA REÇEL SUCUK SİMİT BÖREK | 27 | %15 |
| 25 | N | Doğa | NEHİR BULUT ÇAYIR ORMAN YAMAÇ SAHİL | 30 | %13 |
| 26 | H | Giysi | ATKI BERE ŞORT MONT ÇORAP KEMER | 26 | %8 |
| 27 | R | Böcekler | SİNEK PİRE KELEBEK KARINCA AKREP | 28 | %7 |
| 28 | N | Banyo | SABUN HAVLU FIRÇA TARAK LAVABO AYNA | 30 | %3 |
| 29 | N | Aletler | PENSE MAKAS BALTA RENDE KAZMA KESKİ | 30 | %3 |
| 30 | S | Sınıf | SIRA BOYA DERS TEST SINIF TAHTA ÇANTA | 31 | %3 |

Notlar: KABAK ve KAYAK palindrom olduğu için Sebzeler/Spor'dan çıkarıldı. L23 Masallar özel harf %19 — fener etkisi H'yi kolaylaştırabilir; alternatif (özel harf ≤ %12) kürasyon bekliyor. Test setiyle ortak kelimeler (T00 Okul, T04 Ev, T09 Kuşlar, T10 Doğa) ana akışta sorun değil; test levelları ayrı pakettir.

## Fail modeli (3 can)

Yanlış tap ~ Poisson(λ), λ = c · D (c = yanlış tap / D birimi, log'dan). Fail = P(X ≥ 3).

| c | F (9) | R (12,6) | N (15,3) | H (18,2) | S (21,3) |
|---|---|---|---|---|---|
| 0,05 | %1,2 | %2,6 | %4,3 | %6,5 | %9,3 |
| 0,08 | %3,9 | %8,2 | %12,6 | %18,0 | %24,4 |
| 0,10 | %6,6 | %13,4 | %19,9 | %27,5 | %35,8 |

c ≈ 0,05–0,08 hedef bandı (N ≤ %13, S ≤ %25 → Amaze GO! normal 0,69 / super hard 0,55 ile karşılaştırılabilir). c > 0,10 çıkarsa S Σ +3 (D 19), H Σ +2 (D 17).

## Prototip görevi

1. `tools/bake.js` `curve` modu: bu tablodan 30 level `levels.js` biçiminde (ritim + parametre + liste; yön bandı seed seçimi; L1–2 `diag: 0`).
2. `index.html`: `LEVELS[i].diag` → `DIRS` ağırlığı (şu an yalnızca `noDiagCross` var).
3. Mevcut 50 level: arşiv (`levels-v01.js`) veya menüde ayrı bölüm.

## Açılan sorular

open-questions.md: #10 süre güncellemesi (/liveops), #17 3 can + D ≥ 20 (/gameplay), #18 N→H görünmez geçiş sinyali (/ux); yeni: Daily Challenge D hedefi (/liveops).
