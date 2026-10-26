# Mekanik: Kesin Kurallar

Kaynak: `kelime-avi (18).html` (prototip v18). Bu doküman prototipin davranışını tarif eder; tasarım niyetini değil. Prototip değişirse `/prototype` bu dosyayı günceller.

## Terimler

| Terim | Anlam |
|---|---|
| **Tahta** | Harf ızgarası. Prototipte 20 sütun × 25 satır = 500 hücre. |
| **Kelime** | Levelın hedef kelimelerinden biri. Prototipte level başına 10 kelime. |
| **Yerleşim** | Bir kelimenin tahtadaki tek bir kopyası. Her kelime `PER` kez yerleştirilir. |
| **Hedef hücre** | Bir yerleşime ait harf. Dokununca yerleşim açılır. |
| **Dolgu hücresi** | Hiçbir yerleşime ait olmayan harf. Dokununca can gider. |
| **Chip** | Üstteki kelime etiketi; `bulunan/PER` sayacı taşır. |
| **Şerit** | Açılan yerleşimin üzerine çizilen renkli kapsül. |
| **Can** | Yanlış dokunuş hakkı. |
| **İpucu** | Rastgele açılmamış bir yerleşimin ilk harfini gösterir. |
| **Harfleri topla** | Bulunan harflerin kaybolup noktaya dönüştüğü görsel mod. |

## Parametreler (prototip değerleri)

| Parametre | Kod | Değer | Ne yapar |
|---|---|---|---|
| Sütun | `COLS` | 20 | |
| Satır | `ROWS` | 25 | |
| Kopya sayısı | `PER` | 5 | Her kelime tahtaya kaç kez konur |
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
   - **Hedef hücre, yerleşim açık değil** → yerleşim açılır: harfler renklenir, şerit çizilir (pop animasyonu), harfler chip'e uçar (820 ms), chip sayacı artar ve "bump" yapar. İlerleme `bulunan/50` güncellenir.
   - **Hedef hücre, yerleşim zaten açık** → hiçbir şey olmaz (ceza yok).
   - **Dolgu hücresi** → hücre kızarır ve sallanır (350 ms), 1 can gider.
3. 50/50 → kazanç ekranı ("Sonraki seviye"). Can 0 → kayıp ekranı ("Tekrar oyna").

## Generator kuralları

- Kelimeler uzundan kısaya yerleştirilir; her kelime için `PER` yerleşim, yerleşim başına 800 deneme, tahta başına 400 deneme.
- **Yerleşimler kesişmez**: her hücrenin tek sahibi var (klasik word search'ten fark).
- Çapraz yerleşimlerde komşu çapraz şeritte paralel başka çapraz kelime olamaz (şeritler görsel olarak çakışmasın).
- Boş hücreler `FILL` alfabesinden rastgele dolar.
- **Kaza temizliği**: 8 yönde tüm kelimeler taranır; planlanmamış bir eşleşme bulunursa o eşleşmenin dolgu hücrelerinden biri değiştirilir (40 pass). Sonuç: tahtada hedef kelime **sadece** planlı yerleşimlerde geçer, "haksız ceza" yok.
- **Seed yok**: her "Yeni oyun" farklı tahta. Günlük tahta / rekabet için deterministik üretim gerekir (açık konu).

## Level yapısı (prototip)

5 level, hepsi aynı parametrelerle; sadece kelime listesi (tema) değişir:

| # | Tema | Kelimeler |
|---|---|---|
| 1 | Karışık | KALEM ELMA DENİZ KİTAP GÜNEŞ ÇİÇEK BALIK YILDIZ ORMAN KÖPEK |
| 2 | Mutfak | EKMEK PEYNİR ÇORBA SALATA ZEYTİN BİBER KAHVE ŞEKER LİMON PİLAV |
| 3 | Hayvanlar | ASLAN KAPLAN TAVŞAN KARTAL YILAN KEDİ KOYUN ÖRDEK TİLKİ KUZU |
| 4 | Doğa | NEHİR VADİ TEPE BULUT RÜZGAR YAĞMUR TOPRAK ÇAYIR KAYA ŞİMŞEK |
| 5 | Ev | MASA KOLTUK YASTIK PERDE HALI LAMBA DOLAP AYNA KAPI TABAK |

**Zorluk eğrisi yok.** Level verisi = kelime listesi; tüm zorluk parametreleri global sabit.

## Kamera ve input

- Tek parmak: 6 px'ten az hareket ve 600 ms'den kısa → tap; aksi pan.
- İki parmak: pinch zoom (üs 1.1 ile hafif hızlandırılmış), pan ile birlikte.
- Tekerlek: zoom. `+`/`−` butonları: 1.5× adım.
- Tahta viewport'tan küçükse ortalanır; büyükse kenarlara kilitlenir (boşluk gösterilmez).
- İpucu, hedef harf ekranın %15'lik kenar bandındaysa kamerayı o harfe kaydırır (350 ms).

## Görsel / feedback

- Tahta her iki temada da beyaz zemin, siyah mono harf (IBM Plex Mono). UI tema değişir, tahta değişmez.
- Kelime başına sabit hue (`HUES`, 10 renk). Şerit, chip noktası ve bulunan harf rengi aynı hue'dan türer.
- Çapraz şerit daha ince (0.66 hücre), düz şerit 0.92 hücre.
- `prefers-reduced-motion` destekleniyor: animasyonlar kapanır, uçan harfler gizlenir.

## Zorluk kaldıraçları (değiştirilebilir düğmeler)

Zorluk eğrisi kurulurken oynanabilecek parametreler, etkisiyle:

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

- Seed'li üretim yok → günlük tahta, paylaşılabilir tahta, A/B için gerekli.
- Can cezası zayıf; "yanlış tap" neredeyse bedava.
- 20×25 telefon ekranında zoom'suz okunamaz; ilk görünüm "sığdır" hali küçük harf demek.
- Chip alanı 10 kelimeyle 2–3 satır; daha fazla kelime UI'ı bozar.
- Level bitişi tek ekran; yıldız/puan/süre yok.
