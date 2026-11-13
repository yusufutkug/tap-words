# Mekanik: Kesin Kurallar

Kaynak: `index.html` (prototip v18). Bu doküman prototipin davranışını tarif eder; tasarım niyetini değil. Prototip değişirse `/prototype` bu dosyayı günceller.

## Terimler

| Terim | Anlam |
|---|---|
| **Tahta** | Harf ızgarası. Prototipte 20 sütun × 25 satır = 500 hücre. |
| **Kelime** | Levelın hedef kelimelerinden biri. Prototipte level başına 10 kelime. |
| **Yerleşim** | Bir kelimenin tahtadaki tek bir kopyası. Her kelime `PER` kez yerleştirilir. |
| **Hedef hücre** | Bir yerleşime ait harf. Dokununca yerleşim açılır. |
| **Dolgu hücresi** | Hiçbir yerleşime ait olmayan harf. Dokununca can gider. |
| **Chip** | Üstteki kelime etiketi; sağ üst rozetinde **kalan kopya** (`PER − bulunan`) sayısını taşır; hepsi bulununca üstü çizilir. |
| **Şerit** | Açılan yerleşimin üzerine çizilen kahverengi kapsül (tek renk; harfler beyaza döner). |
| **Can** | Yanlış dokunuş hakkı. |
| **İpucu** | Rastgele açılmamış bir yerleşimin ilk harfini gösterir. |
| **Harfleri topla** | Bulunan harflerin kaybolup noktaya dönüştüğü görsel mod. **Varsayılan açık** (Netleşenler: "bulunan harfler tahtadan gider"); geri okundan açılan ayar sayfasından kapatılabilir. |

## Parametreler (prototip değerleri)

| Parametre | Kod | Değer | Ne yapar |
|---|---|---|---|
| Sütun | `COLS` | 20 | **Level başına** (`LEVELS[i].cols`, yoksa 20) — 2026-11-05 |
| Satır | `ROWS` | 25 | Level başına (`LEVELS[i].rows`, yoksa 25) |
| Kopya sayısı | `PER` | 5 | Her kelime tahtaya kaç kez konur; level başına (`LEVELS[i].per`, yoksa 5) |
| Can | `MAXL` | 5 | |
| İpucu | `MAXH` | 3 | Level başına |
| Kelime/level | — | 10 | `LEVELS[].words` uzunluğu |
| Kelime uzunluğu | — | 4–6 harf | Mevcut listelerde |
| Yön ağırlıkları | `DIRS` | ileri 4 : geri 1 | Sağa, aşağı, sağ-aşağı çapraz, sol-aşağı çapraz; her birinin tersi 1 ağırlık → yerleşimlerin ~%20'si ters yazılı |
| Dolgu alfabesi | `FILL` | Türkçe frekans ağırlıklı | A,E,İ,N,R,L,K yoğun |
| Zoom aralığı | `minScale`..`×5` | | Sığdır → 5× |
| Tap eşiği | — | 6 px, 600 ms | Bunun üstü pan sayılır |

Hedef sayısı = kelime × PER = 50. Hedef hücre ≈ 50 × ~5 harf ≈ 250–280 hücre → tahtanın **~%50–55'i hedef**. Rastgele dokunuşun bile başarı oranı yüksek; can mekaniği şu haliyle zayıf fren.

## Core loop

1. Oyuncu tahtayı tarar (pan/zoom serbest).
2. Bir harfe dokunur.
   - **Hedef hücre, yerleşim açık değil** → yerleşim açılır: şerit çizilir (pop animasyonu), harfler chip'e uçar (820 ms), chip rozeti 1 azalır ve "bump" yapar. Varsayılan modda harfler tahtadan silinip noktaya döner. (Toplam ilerleme sayacı HUD'da gösterilmez.)
   - **Hedef hücre, yerleşim zaten açık** → hiçbir şey olmaz (ceza yok).
   - **Dolgu hücresi** → hücre kızarır ve sallanır (350 ms), 1 can gider.
3. 50/50 → kazanç ekranı ("Sonraki seviye"). Can 0 → kayıp ekranı ("Tekrar oyna").

## Generator kuralları

- Kelimeler uzundan kısaya yerleştirilir; her kelime için `PER` yerleşim, yerleşim başına 800 deneme, tahta başına 400 deneme.
- **Yerleşimler kesişmez**: her hücrenin tek sahibi var (klasik word search'ten fark).
- Çapraz yerleşimlerde komşu çapraz şeritte paralel başka çapraz kelime olamaz (şeritler görsel olarak çakışmasın).
- **`noDiagCross` (level alanı, opsiyonel, 2026-11-11):** açıksa SE ve SW eğimli iki çapraz hücre paylaşmadan görsel X de yapamaz. Varsayılan kapalı; T09X testi fark üretmedi, kaldıraç değil (`docs/levels/param-tests-v02-results.md`). Aynı kural `tools/bake.js`'te.
- Boş hücreler `FILL` alfabesinden (TR harf frekansı) rastgele dolar. **`fillMode` (level alanı, opsiyonel, 2026-11-13):** `freq` varsayılan · `disjoint` hedef kelimelerde geçmeyen harfler · `target` yalnızca hedef kelimelerin harfleri · `bigram` hedef ikilileriyle zincirlenmiş hedef harfleri. Kaza temizliği aynı alfabeden değiştirir. Keşif seti v03'te test ediliyor (`docs/levels/param-tests-v03.md`); eğride varsayılan `freq`.
- Yön: 4 eksen eşit olasılık; ters yazım payı **`rev` (level alanı, opsiyonel; JSON `reversedWeight`)**, yoksa 0,20 (ileri 4 : ters 1). v03'te 0 / 0,5 test ediliyor.
- **Kaza temizliği**: 8 yönde tüm kelimeler taranır; planlanmamış bir eşleşme bulunursa o eşleşmenin dolgu hücrelerinden biri değiştirilir (40 pass). Sonuç: tahtada hedef kelime **sadece** planlı yerleşimlerde geçer, "haksız ceza" yok.
- **Kelime listesi kısıtı (Unity generator için de geçerli):** aynı levelda **palindrom kelime** (KABAK, KAYAK, ETEK, KAZAK, KAVAK, KAPAK) ve **başka bir kelimeyi içeren kelime** (KRAL/KRALİÇE, GELİN/GELİNLİK) olamaz. Kaza temizliği yalnızca dolgu hücresi değiştirebildiği için bu eşleşmeler düzeltilemez ve tahta üretimi başarısız olur. 50 levellik liste bu kurala göre elendi.
- **Pre-baked tahtalar (2026-11-02, ADR-0005 mock):** 50 levelın tahtası `levels.js` içinde sabit; herkes aynı tahtayı oynar, ↻ aynı tahtayı yeniden başlatır. Üretim repo dışı script ile (seed 20261102), format `letters` (500 harf) + `p = [kelime, başlangıç, dr, dc]`. `levels.js` yoksa runtime `generate()` devreye girer (eski davranış: her ↻ farklı tahta).
- **Offline generator `tools/bake.js` (2026-11-11, ADR-0005):** generator'ın Node kopyası; `validate` / `bake` (test levelları → `test-levels.js`) / `pack` (→ `levels/*.json`, şema `docs/levels/level-format.md`) / `check` (kelime listesi + parametre seti doğrulama, D hesabı). Seed'ler gerçekleşen yön oranı bandına göre seçilir.

## Level yapısı (prototip)

50 level, hepsi aynı parametrelerle; sadece kelime listesi (tema) değişir. Liste `index.html` içinde `LEVELS` dizisinde (ilk 5: Karışık, Mutfak, Hayvanlar, Doğa, Ev; sonra Meyveler, Sebzeler, Renkler, Meslekler, Spor, Taşıtlar, Vücut, Giysiler, Okul, Deniz, Uzay, Hava, Müzik, Çiçekler, Ağaçlar, Kuşlar, Böcekler, Şehirler, Ülkeler, Aile, Duygular, Kahvaltı, Tatlılar, İçecekler, Mobilya, Banyo, Sofra, Bahçe, Orman, Çiftlik, Oyuncaklar, Teknoloji, Aletler, Hastane, Masallar, Tatil, Sinema, Kitap, Zaman, Matematik, Aylar, Organlar, Kamp, Market, Düğün). Her levelda 10 kelime, 4–8 harf. Son oynanan level `localStorage` ile hatırlanır.

**Zorluk eğrisi yok.** Level verisi = kelime listesi; 50 levelda tüm zorluk parametreleri aynı. Level menüsünün sonundaki **T00–T11** (`param-tests-v01.md`: K 6, can 5; PER / uzunluk / board tek tek değişir) , **T09X, T12–T15** (`param-tests-v02.md`: çapraz kesişme, K serisi) ve **T00b, T16–T22** (`param-tests-v03.md`: 15×21 gridde dolgu modu, ters oranı, özel harf; D₂ 9,4 sabit) parametre keşif levellarıdır (`test-levels.js`). Zorluk hedefi **D₂ = K · (1 + 0,5(PER − 1)) · (1 − p)** (ADR-0008, rev. 12 Kas); K 6 taban, PER 5 sabit; eğri `curve-v03.md`.

**Level sonu logu (2026-11-05):** her bitişte `{level, name, cols, rows, per, words, placements, found, ms, wrongTaps, wrongAt[], hintsUsed, result, at}` konsola (`[tapwords]`) ve `localStorage["ka-log"]`'a (son 300 kayıt) yazılır. `wrongAt[i]` = yanlış tap anında bulunmuş yerleşim sayısı.

## Kamera ve input

- Tek parmak: 6 px'ten az hareket ve 600 ms'den kısa → tap; aksi pan.
- İki parmak: pinch zoom (üs 1.1 ile hafif hızlandırılmış), pan ile birlikte.
- Tekerlek: zoom. Ekranda zoom butonu yok (pinch/tekerlek yeterli).
- **Serbest kaydırma (Amaze GO! gibi):** tahta başlangıçta ortalanır; sonra herhangi bir kenarı ekranın ortasına kadar kaydırılabilir, ötesine geçemez (`clamp`: tx ∈ [W/2 − BW, W/2]). Tahta krem kart olarak zeminden ayrışır, kenar görünür.
- İpucu, hedef harf ekranın %15'lik kenar bandındaysa kamerayı o harfe kaydırır (350 ms).

## Görsel / feedback

- Tek palet (Amaze GO! benzeri, `docs/ux/figma ui elements/`): krem zemin, kahverengi vurgu, Nunito yazı tipi. Koyu tema yok.
- Tahta krem kart; harfler kahverengi. Şerit tek renk kahverengi, açılan harfler beyaz. `HUES` kodda duruyor ama artık görselde kullanılmıyor.
- Ekran düzeni yukarıdan aşağı: HUD (geri · "Seviye N" + canlar · altın sayacı — altın şimdilik sabit yer tutucu) → tema barı → chip'ler (sarmalı) → tahta → ipucu (rozetli) + yeniden başlat. Banner (ADR-0002) prototipte simüle edilmiyor; Unity spec'inde kalır. Level seçimi ve "harfleri topla" ayarı geri okundan açılan alt sayfada.
- Harf boyutu hücrenin 0.8'i (eskiden 0.72); hücre adımı değişmedi, harfler görsel olarak daha sık.
- Çapraz şerit daha ince (0.66 hücre), düz şerit 0.92 hücre.
- `prefers-reduced-motion` destekleniyor: animasyonlar kapanır, uçan harfler gizlenir.

## Zorluk kaldıraçları (değiştirilebilir düğmeler)

Zorluk eğrisi kurulurken oynanabilecek parametreler, etkisiyle (tam katalog, sınıflandırma ve test setindeki kullanımı: `docs/levels/difficulty-parameters.md`):

| Kaldıraç | Zorlaştırır | Not |
|---|---|---|
| Grid boyutu ↑ | tarama alanı büyür | mobil okunabilirlik sınırı |
| `PER` ↓ | hedef oranı düşer, rastgele tap riski artar | 1'e inince klasik word search |
| Ters yön oranı ↑ | pattern tanıma zorlaşır | %20 → %50 ciddi fark |
| Çapraz oranı ↑ | | |
| Kelime uzunluğu ↓ | kısa kelime fark edilmesi zor | 3 harf çok sert |
| Can ↓ | | |
| Dolgu alfabesi | hedef harflere benzer dolgu → tuzak | |
| Kelime sayısı ↑ | chip alanı taşar | UX sınırı |

## Açık konular (prototipten gelen)

- ~~Seed'li üretim yok~~ → pre-baked `levels.js` ile kapandı (ADR-0005); daily paketi aynı yolla üretilecek.
- Can cezası zayıf; "yanlış tap" neredeyse bedava.
- 20×25 telefon ekranında zoom'suz okunamaz; ilk görünüm "sığdır" hali küçük harf demek.
- Chip alanı 10 kelimeyle 2–3 satır; daha fazla kelime UI'ı bozar.
- Level bitişi tek ekran; yıldız/puan yok. Win ve fail kartında **süre (m:ss) · yanlış tap · ipucu** gösteriliyor (2026-11-05).
