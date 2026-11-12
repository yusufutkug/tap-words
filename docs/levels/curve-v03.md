# Zorluk Eğrisi v03 — İlk 30 Level, D Hedefli Tier Modeli

- Tarih / sürüm: 2026-11-11 / v03 (taslak; `curve-v02.md`'yi günceller, v02 arşiv). **12 Kasım:** ADR-0008 revizyonuyla hedef D → **D₂ = K·(1+0,5(PER−1))·(1−p)**; tier parametreleri değişmedi, hedef sütunu çevrildi; K/PER/`noDiagCross` kuralları eklendi (`param-tests-v02-results.md`). **ADR-0009:** gridler telefon oranına (≈ 1,4) çevrildi — F 12×17, R 14×19, N/H 15×21, S 16×23; sütun artık sabit değil, hücre boyutu küçük tahtada büyür. Hücre sayıları eski gridlerle ≈ aynı, D₂ hedefleri korunur.
- Alan: level-design (ana sohbet)
- Problem: v02 p'yi 0,45–0,55'te sabitleyip zorluğu yalnızca yerleşim sayısıyla kuruyordu. T00–T11 oynanışı (`param-tests-v01-results.md`) zorluğun **D = Y × (1 − p)** ile sıralandığını ve p'nin kendisinin hissedildiğini gösterdi → ADR-0008. Eğri D hedefiyle yeniden kuruluyor.
- İlgili ADR: ADR-0001, ADR-0002, ADR-0004 (can 3 — bu dokümanda fail hedefleri 3 can içindir, ε log'dan gelince kalibre edilir), ADR-0005 (üretim `tools/bake.js`), **ADR-0008**.
- Doğrulama: 30 listenin tamamı `node tools/bake.js check` ile 200'er üretim (ADR-0009 gridlerinde yeniden), **%0 başarısız**, kelime tekrarı yok, palindrom/alt dizi yok. L10 (4 harfli, p 0,38) ort. 2,3 deneme — en sıkışık level.

## v02'den farklar

| Konu | v02 | v03 | Neden |
|---|---|---|---|
| Zorluk hedefi | p sabit 0,45–0,55; tier = Y | **D bandı**; p 0,39–0,59 arasında kaldıraç | ADR-0008; oynanış |
| N tier | 17×21, 7 kelime, Y 35 | **15×21 (315), 6 kelime, Y 30, p 0,48** (≈ T00 306 hücre, "keyifli") | T00 doğrudan N referansı; grid ADR-0009 |
| H tier | 17×26, 9 kelime, Y 45 | **15×21, 6 kelime, 4–5 harf, p 0,38–0,41, Y 30** (≈ T04, "güzel bir zor") | Kısa kelime yolu; süre ve chip sayısı N ile aynı, yalnızca risk artar |
| S tier | 17×26, 10 kelime 4–5 harf, Y 50 | **16×23 (368), 7 kelime, 4–5 harf, p 0,38–0,42, Y 35** | D₂ 12,2–13,0; 442 hücre yerine 368 |
| R tier | 17×16, 5 kelime, p 0,50 | **14×19 (266)**, 5 kelime, p 0,49–0,53 | D₂ 7,1–7,7 "keyifli" bandı; grid ADR-0009 |
| F tier | 17×12, 4 kelime, p 0,49 | **12×17 (204)**, 4 kelime, **p 0,54** (5–6 harf) | D 9 "çok kolay"; p üst ucu FTUE'de kullanılır (Utku notu T03) |
| En büyük tahta | 17×26 (442) | **16×23 (368)** | Büyük tahta reddedildi (ADR-0008); 17×26 event rezervi (ADR-0009) |
| Toplam süre (tahmin) | 61 dk | ≈ 52 dk (Y toplamı 1180 → 900) | Y düştü |
| Ritim | Seçenek B `1121121113` | aynı | Değişiklik gerekmedi |

## Sabitler

| Parametre | Değer | Not |
|---|---|---|
| Grid | tier'a bağlı: F 12×17 · R 14×19 · N/H 15×21 · S 16×23 (oran 1,36–1,44) | ADR-0009; 17 sütun üst sınır (T11), hiçbir ana akış tahtası değmiyor; `fit()` genişliğe sığdırır → hücre 29 / 25 / 23 / 22 pt |
| `PER` | 5 **sabit** | K serisi sonucu: PER ≤ 3 aynı D'de bir kademe zorlaştırıyor ve chip alanını bozuyor → kaldıraç değil (ADR-0008 rev.) |
| `K` | F 4 · R 5 · **N/H 6** · S 7 | K 6 taban ("sweet spot", T00); K ≥ 8 ana akışta yok (T13) |
| Can | 3 (ADR-0004) | Keşif setinde 5'ti; fail hedefleri aşağıda 3 can için |
| İpucu/booster | ADR-0003 | |
| Ters | %0 L1–30; L31+ H %20, S %33 | v02 ile aynı (WSE `hwp`) |
| Çapraz | L1–2 %0, L3+ nominal %50 | v02 ile aynı; **gerçekleşen oran** 0,27–0,43 bandında seed seçilir (`tools/bake.js`) |
| Çapraz X kesişme | serbest (`noDiagCross: false`) | T09 ↔ T09X fark üretmedi; kaldıraç değil |
| Dolgu | `FILL` TR frekans | |
| Özel harf | ≤ %15 / level (L23 %19 işaretli) | |

## Tier parametre seti

D₂ = K·(1 + 0,5(PER − 1))·(1 − p) (ADR-0008 rev.); eski D = Y·(1 − p) karşılaştırma için. Hedef = ilk-deneme kazanma (3 can; ε log'dan gelince kalibre).

| Tier | Ad | Grid | Hücre | K | PER | Y | Σ harf | Hedef hücre | p | **D₂** | D (eski) | Süre (10 + 16K) | Rol |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **F** | FTUE | 12×17 | 204 | 4 | 5 | 20 | 22 | 110 | 0,54 | **5,5** | 9,2 | 1:14 | L1; çapraz %0; hücre 29 pt |
| **R** | Relief | 14×19 | 266 | 5 | 5 | 25 | 26–28 | 130–140 | 0,49–0,53 | **7,1–7,7** | 11,8–12,8 | 1:30 | Her H/S'den sonra; L2; hücre 25 pt |
| **N** | Normal | 15×21 | 315 | 6 | 5 | 30 | 29–30 | 145–150 | 0,46–0,48 | **9,4–9,7** | 15,7–16,2 | 1:46 | Taban (≈ T00 "keyifli"); hücre 23 pt |
| **H** | Hard | 15×21 | 315 | 6 | 5 | 30 | 24–26 | 120–130 | 0,38–0,41 | **10,6–11,1** | 17,6–18,6 | 1:46 | Kısa kelime (≈ T04 "güzel bir zor"); N ile aynı tahta |
| **S** | Super hard | 16×23 | 368 | 7 | 5 | 35 | 28–31 | 140–155 | 0,38–0,42 | **12,2–13,0** | 20,3–21,7 | 2:02 | L10/20/30 (≈ T13 "zor"); hücre 22 pt |

Öznel kademeler (17 test levelı): D₂ ≤ 7,5 kolay · 8,5–9,5 keyifli · 10–11 zor-adil · ≥ 11,5 zor.

N ve H aynı grid (15×21), aynı K, aynı Y, aynı süre: fark yalnızca kelime uzunluğu → p → D₂. Oyuncu "aynı tahta, daha zor" hisseder; UI değişmez. Tier'lar arası görsel kontrast sütun sayısından gelir: F'de harf 21 pt, S'de 16 pt (WSE "küçük tahta = büyük harf").

## Öneri

v02 Seçenek B ritmi (`F R N N H R H R N S | R N H R N H R N N S | R N H R N H R N N S`) korunur; tier'lar yukarıdaki D hedefli parametre setiyle değiştirilir; kelime listeleri yeniden kürate edilir (H/S için 4–5 harf).

## Gerekçe

`param-tests-v01-results.md` §2–4: D sıralaması, p 0,69 çiftinin "çok kolay", T04'ün "güzel bir zor", T11'in sütun etkisi. `param-tests-v02-results.md` §3–5: T14/T15 ile K/PER etkisi, D₂, K 6 taban, PER sabit. ADR-0008.

## Referans

- `docs/references/amaze-go.md#apk-analizi` — tier ritmi varyant 1, `firstwinrate` 0,69/0,58/0,55.
- `docs/references/word-search-explorer.md#apk-analizi` — grid seti, `hwp` L35+.
- `docs/levels/param-tests-v01-results.md` — oynanış verisi (bu eğrinin birincil referansı).

## Trade-off

- D öznel notlardan türedi (1 oyuncu); `ka-log` ile doğrulanana kadar bandlar ±1 oynayabilir.
- H/S için 4–5 harfli kelime kürasyonu daha zor; tema seçeneği daralıyor (Meslekler, Çiçekler, Hava gibi uzun kelimeli temalar yalnızca N/R'de).
- Büyük tahta (17×26) ana akıştan çıktı → Pillar 4 "50 yerleşim topla" hissi yalnızca event tahtalarında. S tier 35 yerleşim.
- Oran 1,4 viewport'u tam doldurmaz: 90 pt bannerla altta ≈ 60 pt, 50 pt ile ≈ 100 pt pay (ADR-0009: sığdır butonu / coach alanı).
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
| Yanlış tap / level ↔ D₂ | Spearman ≥ 0,8 | < 0,6 → D₂ modeli revize (α veya uzunluk terimi) |
| α (tekrar kopya ağırlığı) | ilk-kopya / tekrar-kopya süre oranından 0,4–0,6 | Dışındaysa D₂ yeniden hesaplanır, tier hedefleri kayar |
| İlk-deneme kazanma (3 can) | F/R ≥ 0,98, N ≥ 0,93, H ≥ 0,85, S ≥ 0,78 | Tier 5 puan altında → Σ harf +2 (p ↑, D ↓) |
| Süre (medyan) | N ≈ H 1:30–2:15, S 1:45–2:45 | H > N + %25 → kısa kelime taramayı beklenenden çok uzatıyor |
| "Sonraki seviye" tıklama | R sonrası ≥ H/S sonrası + 5 puan | Yoksa relief hissi taşınmıyor |
| H sonrası R'de yanlış tap | N'deki ile aynı | Yüksekse H oyuncuyu "hızlı dokunmaya" alıştırıyor |

## Level tablosu L1–30

Grid sütun×satır. p ve D gerçek listelerle (`tools/bake.js check`). Çapraz nominal; L1–2 %0. Ters %0.

| # | Tier | Tema | Grid | K | Uzunluk | Σ | Y | Hedef | p | D₂ | Not |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | F | Meyveler | 12×17 | 4 | 5–6 | 22 | 20 | 110 | 0,54 | 5,5 | Sadece sağa/aşağı |
| 2 | R | Renkler | 14×19 | 5 | 5–7 | 27 | 25 | 135 | 0,51 | 7,4 | Çapraz %0; KIRMIZI (7) |
| 3 | N | Hayvanlar | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 | Çapraz tanıtımı (/ux) |
| 4 | N | Sofra | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 5 | H | Ev | 15×21 | 6 | **4** | 24 | 30 | 120 | 0,38 | 11,1 | = T04 |
| 6 | R | Okul | 14×19 | 5 | 5–6 | 27 | 25 | 135 | 0,51 | 7,4 |  |
| 7 | H | Vücut | 15×21 | 6 | **4** | 24 | 30 | 120 | 0,38 | 11,1 |  |
| 8 | R | Taşıtlar | 14×19 | 5 | 4–7 | 27 | 25 | 135 | 0,51 | 7,4 | TRAMVAY (7) |
| 9 | N | Deniz | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 10 | **S** | Aile | 16×23 | 7 | **4** | 28 | 35 | 140 | 0,38 | **13,0** | Duvar 1; ort. 2,5 deneme (en yüksek) |
| 11 | R | Sebzeler | 14×19 | 5 | 5–6 | 27 | 25 | 135 | 0,51 | 7,4 |  |
| 12 | N | Spor | 15×21 | 6 | 4–6 | 29 | 30 | 145 | 0,46 | 9,7 |  |
| 13 | H | Çiftlik | 15×21 | 6 | 4–5 | 26 | 30 | 130 | 0,41 | 10,6 |  |
| 14 | R | Müzik | 14×19 | 5 | 5–6 | 26 | 25 | 130 | 0,49 | 7,7 |  |
| 15 | N | Şehir | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 16 | H | Tatil | 15×21 | 6 | 4–5 | 26 | 30 | 130 | 0,41 | 10,6 |  |
| 17 | R | Tatlılar | 14×19 | 5 | 5–7 | 27 | 25 | 135 | 0,51 | 7,4 | BAKLAVA (7) |
| 18 | N | Kuşlar | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 19 | N | Oyuncaklar | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 20 | **S** | Mutfak | 16×23 | 7 | 4–5 | 31 | 35 | 155 | 0,42 | **12,2** | Duvar 2 |
| 21 | R | Uzay | 14×19 | 5 | 4–7 | 27 | 25 | 135 | 0,51 | 7,4 | GEZEGEN (7) |
| 22 | N | İçecekler | 15×21 | 6 | 4–6 | 29 | 30 | 145 | 0,46 | 9,7 |  |
| 23 | H | Masallar | 15×21 | 6 | 4–5 | 26 | 30 | 130 | 0,41 | 10,6 | Özel harf %19 (işaretli) |
| 24 | R | Kahvaltı | 14×19 | 5 | 5–7 | 27 | 25 | 135 | 0,51 | 7,4 | YUMURTA (7) |
| 25 | N | Doğa | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 | = T10 listesi, N gridinde |
| 26 | H | Giysi | 15×21 | 6 | 4–5 | 26 | 30 | 130 | 0,41 | 10,6 |  |
| 27 | R | Böcekler | 14×19 | 5 | 4–7 | 28 | 25 | 140 | 0,53 | 7,1 | KELEBEK, KARINCA (7) |
| 28 | N | Banyo | 15×21 | 6 | 4–6 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 29 | N | Aletler | 15×21 | 6 | 5 | 30 | 30 | 150 | 0,48 | 9,4 |  |
| 30 | **S** | Sınıf | 16×23 | 7 | 4–5 | 31 | 35 | 155 | 0,42 | **12,2** | Duvar 3; L31+ S ters %33 |

D₂ dizisi: 5,5 · 7,4 · 9,4 · 9,4 · **11,1** · 7,4 · **11,1** · 7,4 · 9,4 · **13,0** | 7,4 · 9,7 · **10,6** · 7,7 · 9,4 · **10,6** · 7,4 · 9,4 · 9,4 · **12,2** | 7,4 · 9,7 · **10,6** · 7,4 · 9,4 · **10,6** · 7,1 · 9,4 · 9,4 · **12,2**. Toplam Y = 900; süre ≈ 52 dk.

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

Yanlış tap ~ Poisson(λ), λ = c · D₂ (c = yanlış tap / D₂ birimi, log'dan). Fail = P(X ≥ 3).

| c | F (5,5) | R (7,4) | N (9,4) | H (11,1) | S (13,0) |
|---|---|---|---|---|---|
| 0,08 | %1,0 | %2,3 | %3,9 | %6,0 | %8,5 |
| 0,13 | %3,6 | %7,6 | %12,0 | %17,4 | %23,3 |
| 0,17 | %6,9 | %13,7 | %20,7 | %28,8 | %37,1 |

c ≈ 0,08–0,13 hedef bandı (N ≤ %12, S ≤ %25 → Amaze GO! normal 0,69 / super hard 0,55 ile karşılaştırılabilir). c > 0,17 çıkarsa S Σ +3 (D₂ ≈ 11,5), H Σ +2 (D₂ ≈ 10).

## Prototip görevi

1. `tools/bake.js` `curve` modu: bu tablodan 30 level `levels.js` biçiminde (ritim + parametre + liste; yön bandı seed seçimi; L1–2 `diag: 0`).
2. `index.html`: `LEVELS[i].diag` → `DIRS` ağırlığı (şu an yalnızca `noDiagCross` var). `cols` level başına zaten var; harf boyutu 29 pt hücrede kontrol (0,8 → 0,72?).
3. Mevcut 50 level: arşiv (`levels-v01.js`) veya menüde ayrı bölüm.

## Açılan sorular

open-questions.md: #10 süre güncellemesi (/liveops), #17 3 can + D ≥ 20 (/gameplay), #18 N→H görünmez geçiş sinyali (/ux); yeni: Daily Challenge D hedefi (/liveops).
