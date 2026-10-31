# Gameplay ekranı yerleşimi v01 — banner kısıtı altında

- Tarih / sürüm: 2026-10-26, prototip v18
- Alan: ux
- Problem: Gameplay ekranında banner alanı var (ADR-0002); mevcut prototip HUD'u telefonda ekranın yarısını yiyor ve 20×25 tahta "sığdır" hâlinde okunmuyor (`docs/game/mechanic.md#açık-konular`). Banner düşülünce durum kötüleşiyor. Kaynak: open-questions #4 ve #6.
- İlgili ADR: ADR-0001 (sadelik ölçütü Amaze GO!), ADR-0002 (banner alanı var; konum/yükseklik açık).
- Prototip koduna dokunulmadı; iş tarifi §6'da.

## 0. Varsayımlar

Tüm hesaplar bu varsayımlarla; biri değişirse tablolar yeniden hesaplanır.

| Varsayım | Değer | Not |
|---|---|---|
| Referans cihaz | 390 × 844 pt (6,1"), 3×, 460 ppi → 1 pt = 0,166 mm | iPhone 14/15 sınıfı; Android 6,1" (411 × 914 dp) daha geniş, sonuç biraz daha iyi çıkar |
| Safe area | üst 47 pt (status bar / Dynamic Island), alt 34 pt (home indicator) | Android: üst 24–48, alt 0–48 dp |
| CSS px = pt | 1:1 | Prototip CSS değerleri doğrudan pt okunur |
| Banner | 50 pt sabit **ve** 50–90 pt adaptif iki senaryo | AdMob anchored adaptive 390 pt genişlikte tipik ~60 pt döner; 90 üst sınır |
| Tahta fontu | IBM Plex Mono 600; büyük harf yüksekliği (cap height) ≈ 0,70 em; `font-size = 0.72 × hücre` (`buildGrid`) | Harf yüksekliği ≈ 0,50 × hücre |
| Okuma mesafesi | 35 cm (telefon, oturarak) | Dış mekân parlaklığı için pay §2.1'de |
| Yerleşim ölçüleri | ±2 pt (border, satır yüksekliği yuvarlamaları) | |

## 1. Ekran bütçesi

### 1.1 Mevcut prototip (ölçüm, 390 pt genişlik)

Prototipte `<meta name="viewport">` **yok**; telefonda sayfa 980 px genişlikte render edilip ölçeklenir, yani aşağıdaki sayılar meta eklendikten sonra beklenen değerlerdir. Kaynak: `index.html` CSS (body `padding-block:10px 12px; gap:10px`, side padding 16; `base=20`, `PAD=48`).

| Öğe | Yükseklik (pt) | Neden |
|---|---|---|
| body padding + 4 gap | 22 + 40 = 62 | |
| `header` (başlık + kalpler + 0/50 + Yeni oyun) | ≈ 65 | 358 pt'ye sığmaz, 2 satıra kırılır |
| `.tools` (level 1–5, İpucu, Harfleri topla) | ≈ 61 | 2 satıra kırılır |
| `.words` (10 chip) | ≈ 122 | chip ≈ 110 pt genişlik → 3 chip/satır → **4 satır** (mechanic.md'deki "2–3 satır" masaüstü ölçüsü) |
| `p.hint` açıklama | ≈ 45 | 3 satır |
| **Toplam HUD** | **≈ 355** | kullanılabilir 763 pt'nin %47'si |
| Viewport | ≈ 408 × 358 | |

`fit()`: `scale = min(358/(20·20+96), 408/(25·20+96)) = min(0,72, 0,68) = 0,68` → **hücre 13,6 pt, harf 9,8 pt**. Yükseklik sınırlı; `PAD=48` (iki yanda 96 pt ölçeklenmemiş beyaz kenar) tek başına ölçeğin %16'sını yiyor.

Banner eklenince (gap 10 ile): 50 pt → viewport 348 → hücre 11,6 / harf 8,4 pt; 90 pt → viewport 308 → hücre 10,3 / harf 7,4 pt. Bunlar §6'daki placeholder testinin beklenen okumaları.

### 1.2 Hedef yerleşim (öneriler §1.3, §2.4, §3 uygulanmış hâli)

Yukarıdan aşağı, 390 × 844:

| Öğe | 50 pt banner | 90 pt banner | Not |
|---|---|---|---|
| Üst safe area | 47 | 47 | |
| HUD tek satır: level·tema / kalpler / ampul | 44 | 44 | §3 |
| boşluk | 8 | 8 | |
| Chip alanı (Seçenek C, 2 satır) | 48 | 48 | §3.2; Seçenek A ile 122 |
| boşluk | 8 | 8 | |
| **Tahta viewport** | **593** | **553** | genişlik 366 (yan padding 16 → 12) |
| ölü bölge | 12 | 12 | §1.3 |
| Banner | 50 | 90 | |
| Alt safe area | 34 | 34 | banner safe area'nın üstünde |

Viewport 408 → 593 pt (+%45). Sığdır hesapları §2.2'de.

### 1.3 Banner konumu

#### Seçenek A — Alt (viewport ile arasında 12 pt ölü bölge)

##### Öneri
Banner ekranın altında, alt safe area'nın hemen üstünde; viewport ile banner arasında 12 pt etkileşimsiz boşluk; alan **L1'den itibaren** 50 pt rezerve edilir, reklam açılsa da açılmasa da yerleşim değişmez.

##### Gerekçe
Banner yüklendiğinde/kaldırıldığında `fit()` yeniden çalışır ve tahta zıplar; L1'den rezerv bunu engeller. Alt konum, HUD + chip + tahta okuma sırasını (yukarıdan aşağı) bozmaz; kalpler ve chip'ler reklamla aynı bakış alanına girmez.

Başparmak analizi (tek el, sağ el, 844 pt): rahat erişim ekranın alt ~%55'i (y ≈ 380–810). Alt banner (y 760–810) tam başparmak dinlenme bölgesinde → risk "yanlışlıkla reklama dokunma". İki durum:
- Sığdır zoom'da: tahta genişlik sınırlı, viewport'ta dikey ortalanır (20×25: 454 pt yüksek, 593 viewport → üstte-altta 70 pt boşluk). Tahtanın alt kenarı y ≈ 679, banner üstü y ≈ 760 → **81 pt** mesafe, risk yok.
- Zoom'dayken: `clamp()` tahtayı viewport kenarına kilitler, son satır y ≈ 748'de; banner 760'ta. 12 pt ölü bölge + 1,5–2 mm (9–12 pt) tipik parmak sapması → alt satıra nişan alan bazı dokunuşlar bannera düşebilir. Ölçüm §Ölçüm'de; eşik aşılırsa `clamp()`'e alt kenarda 24 pt içe kaydırma payı eklenir (son satır hiçbir zaman viewport'un son 24 pt'sine oturmaz).

Pointer capture viewport'ta olduğu için viewport'ta başlayıp banner üzerinde biten pan hareketi reklamı tıklamaz; sadece banner üzerinde **başlayan** dokunuş tıklar.

##### Referans
Word Search Explorer: banner sadece gameplay'de, altta, L10–13'ten itibaren → `docs/references/word-search-explorer.md#ux-kalıpları` ve `#bize-uyarlanabilirlik` ("alan L1'den ayrılır, reklam ~L11–13'te açılır"). Amaze GO!: tahtanın alt ~%15'i etkileşimsiz boş alan (banner/HUD rezervi tahmini) → `docs/references/amaze-go.md#ux-kalıpları`.

##### Trade-off
- Pillar 2 (tap/pan karışmaz) ile gerilim: banner başparmak bölgesinde; yanlış dokunuş can götürmez ama oturumu keser (reklam açılır), bu can kaybından daha pahalı. Mitigasyon: 12 pt ölü bölge, gerekirse 24 pt içe kaydırma.
- Pillar 3 ile gerilim yok (can mekaniğine dokunmaz).
- 12 pt ölü bölge = 12 pt viewport kaybı (≈ 0,6 satır).

##### Gerekli görüşler
- `/liveops`: 50 sabit mi, adaptif (60–90) mi — eCPM farkı; reklam açılana kadar rezerv alanda ne gösterilecek (boş / marka şeridi / house promo). UX tercihi: boş, `--bg` rengi, içerik yok.
- `/prototype`: §6.

##### Ölçüm
- Banner placeholder'a dokunuş / oturum: **< 0,1** (prototipte sayaç). 0,1–0,3 → 24 pt içe kaydırma eklenir; > 0,3 → Seçenek B'ye geçiş gündeme gelir.
- Level içinde `fit()` tetiklenme sayısı (banner yükleme kaynaklı): **0**.

#### Seçenek B — Üst (status bar altı, HUD üstü)

##### Öneri
Banner üst safe area'nın altında, HUD'un üstünde; HUD + chip + tahta 50/90 pt aşağı kayar.

##### Gerekçe
Başparmakla yanlışlıkla dokunma riski sıfıra iner (y 47–97 başparmak erişimi dışında). Tahta merkezi 32 pt aşağı iner (y 486 → 518), tek el erişimi az da olsa iyileşir.

##### Referans
Referans yok — iki referans oyunda da üst banner yok; `/market-research`'e soru düşülmedi çünkü alt konum zaten referanslı ve önerilen. Üst banner için eCPM/benchmark gerekirse `/liveops` açar.

##### Trade-off
- Pillar 5 ("UI konuşur") ile gerilim: her levelde ilk bakış alanı (üst) reklam olur; kalpler reklamın hemen altında, kritik durum göstergesi reklamla yarışır.
- Chip'lere long-press gibi bir etkileşim eklenirse (amaze-go.md Guidance uyarlaması) bannera komşuluk riski oraya taşınır.
- Viewport yüksekliği aynı (589 pt); kazanç sadece başparmak riski.

##### Gerekli görüşler
- `/liveops`: üst banner eCPM / görünürlük farkı.

##### Ölçüm
- Aynı metrik: banner dokunuş / oturum; hedef < 0,05.
- Kalp kaybının fark edilme süresi (yanlış tap → oyuncunun bir sonraki tap'e kadar duraklaması) A ile B arasında ≥ 300 ms fark varsa "kalp gözden kaçıyor" sinyali.

#### Önerilen
**Seçenek A — alt, 50 pt sabit rezerv, 12 pt ölü bölge, L1'den itibaren.** Referanslı tek seçenek; başparmak riski ölçülebilir ve iki kademeli mitigasyonu var. Adaptif banner istenirse: yükseklik **level başlamadan önce** ölçülür, level içinde değişmez (`fit()` level ortasında tetiklenmez); üst sınır 90.

## 2. Okunabilirlik

### 2.1 Minimum harf boyutu varsayımı

İki eşik tanımlıyorum; ikisi de **varsayım**, playtest'te doğrulanacak (dış mekân parlaklığında bir kademe yukarı çıkması beklenir).

| Eşik | Harf (font-size) | Hücre (= harf / 0,72) | Harf yüksekliği | Gerekçe |
|---|---|---|---|---|
| **Alt sınır** | 12 pt | 17 pt | 8,4 pt = 1,4 mm ≈ 13,7′ (35 cm) | Apple HIG gövde metni alt sınırı 11 pt; Türkçe diakritikler (Ş/S, Ğ/G, Ç/C, Ö/O, Ü/U, İ/I) ~0,15 em → 12 pt'de 1,8 pt = 0,3 mm, bunun altında çengel/şapka ayırt edilmiyor. Word search'te harf *tanımak* değil *ayırt etmek* gerekir; İ/I ve Ş/S karışması yanlış tap demek (Pillar 3 adalet hissi). |
| **Hedef** | 14 pt | 20 pt (= prototip `base`) | 9,8 pt = 1,6 mm ≈ 16′ | ISO 9241-303 karakter yüksekliği alt sınırı 16 arc-dk; tarama görevinde 20–22′ önerilir. 20 pt hücre prototipin tasarım hücresi (`base=20`, scale 1,0). |

Dokunma hassasiyeti ayrı bir kısıt: hücre 17 pt = 2,9 mm; tipik parmak nişan sapması 1,5–2 mm (dokunma offset literatürü; prototipte doğrulanmadı). Yani alt sınırda harf okunur ama **komşu hücreye basma riski gerçek**; komşu dolgu ise can gider ve oyuncu "oraya basmadım" der (Pillar 3). 24 pt hücre (4 mm) altında bu risk kabul edilebilir seviyeye iner (tahmin). Bu yüzden sığdır zoom'da tap beklenen tahtalar için hedef hücre 20 pt, alt sınır 17 pt; 17 pt altı "zoom zorunlu" demektir ve bu Pillar 1 ("tek dokunuş") ile gerilimdir: zoom + tap = iki adım.

### 2.2 Sığdır hesabı (hedef yerleşim, viewport 366 × 593 / 553)

`PAD` 48 → 8 varsayımıyla (§2.4): `scale = min(366 / (COLS·20 + 16), H / (ROWS·20 + 16))`.

| Tahta | Banner | scale | Hücre | Harf | Sınırlayan | Durum |
|---|---|---|---|---|---|---|
| 20×25 (bugün) | 50 | 0,88 | 17,6 pt | 12,7 pt | genişlik | alt sınırın hemen üstü; zoom beklenir |
| 20×25 | 90 | 0,88 | 17,6 pt | 12,7 pt | genişlik | **aynı** — banner yüksekliği 20 sütunda hücre boyutunu değiştirmez |
| 20×25, mevcut HUD + PAD 48 | 50 | 0,58 | 11,6 pt | 8,4 pt | yükseklik | karşılaştırma (§1.1) |
| 17×25 | 50 | 1,00 | 20 pt | 14,4 pt | genişlik | hedef eşik |
| 17×26 | 90 | 1,00 | 20 pt | 14,4 pt | genişlik/yükseklik | hedef eşik, 90 pt'de de sığar |
| 20×18 (WSE "küçük" çevirisi) | 50/90 | 0,88 | 17,6 pt | 12,7 pt | genişlik | sütun 20 olduğu sürece küçük tahta da alt sınırda |
| 14×22 | 50/90 | 1,21 | 24 pt | 17,4 pt | genişlik | dokunma-güvenli eşik |

Bulgu: 390 pt genişlikte **sütun sayısı hücre boyutunu belirler**, satır sayısı ve banner yüksekliği sadece kapasiteyi (kaç satır sığar) belirler. WSE çevirisindeki "büyük 20×25 / küçük 20×18" çifti bu yüzden okunabilirlik açısından aynı; küçültme sütundan gelmeli.

### 2.3 Zoom'suz okunabilir maksimum grid — /level-design için sayılar

| Hücre eşiği | Maks sütun (366 pt) | Maks satır, 50 pt banner (593 pt) | Maks satır, 90 pt banner (553 pt) |
|---|---|---|---|
| 24 pt (dokunma-güvenli) | 14 | 24 | 22 |
| **20 pt (hedef)** | **17** | **28** | **26** |
| 17 pt (alt sınır) | 20 | 33 | 31 |

**Net sayı:** zoom'suz üst sınır **sütun ≤ 17, satır ≤ 26** (hücre 20 pt, harf 14,4 pt; her iki banner senaryosunda sığar). Mutlak tavan **sütun ≤ 20, satır ≤ 31** (hücre 17,6 pt, harf 12,7 pt — alt sınır; oyuncu tap için zoom yapar, Pillar 1 gerilimi kabul edilmiş sayılır). 20 sütun üstü hiçbir levelda önerilmez.

Yan etki (karar `/level-design` + `/gameplay`'in): 20×25 → 17×26 hücre sayısı 500 → 442; aynı 10 kelime × PER 5 × 5,2 harf ile hedef hücre oranı 0,52 → **0,59**. Oranı korumak için PER 4 (p = 0,47) veya 8–9 kelime (p = 0,47–0,53) gerekir; bu E1 (can mekaniği) ile komşu, burada öneri yapılmıyor.

`docs/levels/curve-v01.md` ile eşleme (open-questions #7): Seçenek B (20 sütun) hücre 17,6 pt / harf 12,7 pt → **alt sınırı geçer, hedefi geçmez**; sığdır zoom'da tap için komşu-kaçırma riski taşır, oyuncunun zoom yapması beklenir. Seçenek C (16 sütun) hücre (366−16)/16 = **21,9 pt / harf 15,8 pt** → hedefi geçer, dokunma-güvenli 24 pt'ye yaklaşır. UX tercihi C; 24 pt şartı koşulmuyor (14 sütun gerektirirdi), B "zoom kabul edilmiş" koşuluyla elenmez. curve-v01'in 18,7 pt hesabı 374 pt genişlik ve PAD=0 varsayıyor; fark 1 pt, sonuç değişmez.

### 2.4 Yerleşim parametreleri (tek öneri)

#### Öneri
`PAD` 48 → 8 px; body yan padding 16 → 12 pt; viewport–banner arası 12 pt; `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` eklenir; alt padding `max(12px, env(safe-area-inset-bottom))`.

#### Gerekçe
`PAD` tahtanın etrafındaki ölçeklenen beyaz kenar; sığdır hâlinde 20 sütunda genişliğin %19'unu yiyor (96/496). Zoom'dayken kenar harflerinin viewport ortasına gelebilmesi için küçük bir pay yeterli (8 px → sığdırda 7 pt). Yan padding 16 → 12: +8 pt viewport genişliği = 20 sütunda +0,4 pt hücre; küçük ama bedava. Viewport meta olmadan telefonda hiçbir ölçüm anlamlı değil.

#### Referans
Amaze GO!: tahta kenar boşluğu minimal, HUD ile tahta arasında dekor yok → `docs/references/amaze-go.md#ux-kalıpları`. WSE: tahta tek ekranda, zoom yok → `docs/references/word-search-explorer.md#ux-kalıpları` (hedef: tahta ekrana sığsın).

#### Trade-off
- Zoom'dayken kenar harfleri viewport kenarına 7 pt yaklaşır; ipucu kamerası (%15 kenar bandı kuralı) zaten merkeze çeker, sorun yok.
- Pillar 5 ile gerilim yok; tahta zemini değişmez.

#### Gerekli görüşler
`/prototype` (§6).

#### Ölçüm
- 20×25 sığdır harf boyutu 390 pt'de: **9,8 → 12,7 pt** (konsola `minScale*base*0.72` yazdırılır).
- Viewport yüksekliği 408 → 593 pt (50 pt banner ile).

## 3. HUD sadeleştirme

Ölçüt: Amaze GO! gameplay HUD'u = level no + kalpler + ampul; puan, coin, ilerleme çubuğu, hedef listesi yok (`docs/references/amaze-go.md#ux-kalıpları` → HUD; `#bize-uyarlanabilirlik` → "chip alanı dışında HUD'a hiçbir şey eklenmemeli").

### 3.1 Ne kalır, ne gider, ne taşınır (tek öneri)

#### Öneri
Gameplay HUD'u tek 44 pt satıra iner: sol **level no · tema** ("3 · Hayvanlar"), orta **kalpler** (5 × 20 pt, gap 6 → 124 pt), sağ **ampul + kalan sayı** (44 × 44 pt dokunma alanı). Diğer her şey gider veya taşınır:

| Öğe (bugün) | Karar | Nereye | Neden |
|---|---|---|---|
| "Kelime Avı" başlığı | Gider | — | Amaze GO!'da oyun adı gameplay'de yok |
| "· 3. seviye: Hayvanlar" | Kalır, kısalır | HUD sol: "3 · Hayvanlar" | Amaze GO! level no; WSE tema adı |
| Kalpler (5) | Kalır | HUD orta | Amaze GO! |
| `0 / 50` bulunan/toplam | **Gider** | level sonu kartı | Chip'ler toplamı zaten taşır (10 × n/5); Amaze GO!'da ilerleme çubuğu yok, "tahtanın boşalması ilerlemedir" |
| "Yeni oyun" butonu | Gider | prototip: debug çekmecesi; ürün: pause menüsü (ayrı iş, `docs/ux/flows/`) | Amaze GO!'da Restart var ama HUD'da nerede olduğu eksik veri (§7 soru) |
| Level butonları 1–5 | Gider | debug çekmecesi | Ürün akışında level seçimi gameplay ekranında olmaz |
| "İpucu (3)" metin butonu | Kalır, ikonlaşır | HUD sağ: ampul + rozet "3" | Amaze GO! ampul + sayı |
| "Harfleri topla" toggle | Gider | ayarlar (ürün) / debug çekmecesi (prototip) | Görsel mod, level içinde değişmez; `localStorage`'da zaten kalıcı |
| Açıklama paragrafı | Gider | FTUE: L1'de, ilk bulmaya kadar tahtanın üstünde tek satır coach ("Kelimenin herhangi bir harfine dokun"), 200 ms fade; sonra bir daha görünmez | Amaze GO!: tutorial yok, L1 kendini anlatır; ama "sürükleme değil dokunma" word search alışkanlığına ters, tek cümle gerekli. Detay onboarding dokümanında (ayrı iş) |
| Zoom `+`/`−` butonları | Gider | yerine **"sığdır" butonu**: 40 × 40 pt, viewport sol alt, sadece `scale > minScale` iken görünür (150 ms fade) | Pinch standart; Amaze GO!'da en çok istenen eksik özellik fit-to-screen (`#bize-uyarlanabilirlik` → "Level başında otomatik zoom-in / Alınmaz") |
| Debug çekmecesi (yeni, sadece prototip) | Eklenir | HUD sağ üstte 24 pt "⚙", `?debug=1` ile görünür | Level 1–5, Yeni oyun, Harfleri topla, banner 0/50/90 ve ölçüm çıktıları buraya |

`prefers-reduced-motion`: kalp kaybı (scale .85 + solma 200 ms) → anında; coach fade → anında; sığdır butonu fade → anında.

#### Gerekçe
Mevcut HUD 355 pt (ekranın %47'si), hedef HUD 44 + 8 + 48 + 8 = 108 pt (%14). Amaze GO!'nun 100M+ kurulumu "boş HUD" ile geldi; yaz 2026'da eklediği her HUD öğesi (süre sayacı, kayan banner) puan düşürdü (`amaze-go.md#özet-yargı`).

#### Referans
`docs/references/amaze-go.md#ux-kalıpları` (HUD), `#bize-uyarlanabilirlik` (HUD minimal, level başında zoom-in alınmaz, idle nudge kapatılabilir olmalı).

#### Trade-off
- `0/50` gidince "levelın ne kadarı kaldı" tek bakışta görülmez; chip'lerden toplamak gerekir. Pillar 4 (koleksiyon) ile hafif gerilim; level sonu kartında gösterilerek telafi.
- Pause/menü girişi HUD'da olmayınca oyuncu levelden nasıl çıkar? Ürün akışı sorusu; prototip için debug çekmecesi yeter. Amaze GO!'nun çözümü bilinmiyor (eksik veri, §7).

#### Gerekli görüşler
- `/market-research`: Amaze GO! HUD'da pause/ayarlar ikonu var mı (ekran görüntüsü).
- `/prototype`: §6 (P2).

#### Ölçüm
- HUD yüksekliği 355 → 108 pt.
- L1'de ilk doğru tap'e medyan süre ≤ 10 sn (Amaze GO! "öğrenmesi 10 saniye").
- İpucu kullanımı/level: metin buton → ampul geçişinde ±%10 içinde kalmalı (ikon anlaşılmıyorsa düşer).
- Zoom'dan sığdıra dönüş: sığdır butonu kullanımı / zoom yapılan level ≥ %50 (buton bulunuyor).

### 3.2 Chip alanı — 10 kelimeyle kaç satır

Chip alanı zorunlu bilgi (Pillar 4); soru boyutu. Kısıt: kelime 4–6 harf (mechanic.md), 10 kelime, 366 pt genişlik.

#### Seçenek A — Mevcut chip (referans)
Nokta 10 pt + kelime 13,6 pt + "n/5"; chip ≈ 110 × 26 pt → 3 chip/satır → **4 satır = 122 pt**. 7 kelimede 3 satır (90 pt).

(Öneri değil, karşılaştırma tabanı.)

#### Seçenek B — Tipografik sıkıştırma
##### Öneri
Font 13,6 → 12 pt, padding 4/9 → 3/7, nokta 10 → 8 pt, gap 6 → 4; 3 sabit kolon.
##### Gerekçe
Chip 26 → 22 pt yükseklik; **4 satır = 100 pt** (−22 pt). 6 harfli kelime + "n/5" 4 kolona sığmıyor (≈ 102 > 88 pt), bu yüzden satır sayısı düşmüyor.
##### Referans
WSE: kelime listesi altta, büyük harf, senior-dostu → `word-search-explorer.md#ux-kalıpları`. Amaze GO!'da liste yok.
##### Trade-off
Küçük kazanç; 12 pt chip metni HIG alt sınırına (11) yaklaşır. Pillar 4 etkilenmez.
##### Gerekli görüşler
Yok.
##### Ölçüm
Chip alanı 122 → 100 pt.

#### Seçenek C — Segmentli dolgu chip, 5 kolon
##### Öneri
Chip sadece kelimeyi yazar (12 pt, padding 3/6); `n/5` metni ve nokta kalkar, yerine chip zemini kelimenin hue'suyla **5 segment hâlinde soldan sağa dolar** (her segment ≈ 12 pt); 5/5'te chip tam dolu + üstü çizili. Sabit 5 kolon × ≈ 70 pt → 10 kelime **2 satır = 48 pt**; 7 kelime de 2 satır; 11–15 kelime 3 satır (74 pt). Uçan harfler chip'e varınca segment dolar + mevcut bump (300 ms). `prefers-reduced-motion`: segment anında dolar, bump zaten kapalı.
##### Gerekçe
En uzun kelime (6 harf) 12 pt Plex Sans'ta ≈ 43 pt + padding 12 + border 2 = 57 pt < 70 → tüm kelimeler sığar, kırpma yok. Chip alanı 122 → 48 pt (−74 pt); hedef yerleşimdeki 593 pt viewport bu seçeneği varsayar. Sayaç kaybolmaz, biçim değiştirir: 5 ayrık segment hâlâ sayılabilir; renk, şeritle aynı hue (mevcut `--h`).
##### Referans
WSE: kelime bulununca listede boyanıp düşer (ikili durum) → `word-search-explorer.md#ux-kalıpları`; Tap Words'te 5 kademe gerektiği için segment. Amaze GO!: HUD'da hedef listesi yok, "tahta ilerlemedir" → chip'i mümkün olduğunca küçük tutma gerekçesi (`amaze-go.md#bize-uyarlanabilirlik`, HUD satırı).
##### Trade-off
- Pillar 4 ile gerilim: "3/5" rakamı ödülün parçasıydı; segment aynı bilgiyi verir ama okuması bir bakış daha uzun olabilir. Ölçülür (aşağıda).
- Renk körlüğü: segment dolu/boş farkı yalnızca renkle verilmemeli; boş segment `--line` rengi + dolu segment hue → açıklık farkı ≥ %30 (L*). 10 hue'da ayrım şeritle aynı sorun, yeni sorun değil.
- "Harfleri topla" modunda nokta chip'ten de kalkar; harf noktası tahtada kalır, chip'teki nokta zaten gereksizdi.
##### Gerekli görüşler
- `/gameplay`: segment sayaç, Pillar 4 "bulunan/PER sayacı" tanımını karşılıyor mu; chip'e long-press (amaze-go Guidance uyarlaması) planlanıyorsa 70 pt chip yeterli hedef mi.
##### Ölçüm
- Chip alanı 122 → 48 pt.
- "Açık yerleşime tekrar dokunma" / level (oyuncu neyin bulunduğunu takip edemiyor sinyali): Seçenek A ile C arasında fark ≤ %10. Bugün bu dokunuş sessizce yutuluyor (`tap()`: `if(found[p])return`), sayılabilir.
- Chip'e bakış (playtest gözlemi): "kaç tane kaldı?" sorusuna ≤ 2 sn cevap.

#### Önerilen
**Seçenek C.** 74 pt kazanç = 90 pt bannerın bedelini tek başına karşılar; 17×26 hedef tahta 90 pt bannerla da 20 pt hücreyle sığar. Pillar 4 gerilimi ölçümle kapatılır; ölçüm kötü çıkarsa C'nin varyantı (segment + bump sırasında 300 ms görünen küçük "3/5" rozeti) denenir.

## 4. Not: yanlış tap'in tahtada kalıcı işareti (öneri değil)

Amaze GO! yanlış dokunulan oku kırmızıya çevirip tahtada bırakıyor; Tap Words'te 350 ms kızar-salla sonrası iz kalmıyor (`amaze-go.md#bize-uyarlanabilirlik`, 2. satır). Sadece görsel katman olarak değerlendirme:

- **Bilgi sızdırmaz**: işaretlenen hücrenin dolgu olduğu oyuncu tarafından zaten öğrenildi (can gitti). İşaret hafıza yardımıdır, hedef oranını değiştirmez.
- **Pillar 3 lehine**: ceza görünür kalır, "neden can gitti" sorusu tahtada cevaplı; aynı dolgu hücresine ikinci kez basma (çifte ceza) azalır.
- **Pillar 5 ile gerilim**: işaret küçük ve nötr olmalı — örn. harf %40 soluk + sağ üst köşede 3 pt kırmızı nokta; kırmızı dolgu zemin (`--wrong`) kalıcı olursa tahta "kirlenir". "Harfleri topla" modunda bulunan harf de noktaya dönüşüyor; iki nokta türü karışır, bu modla birlikte tasarlanmalı.
- `prefers-reduced-motion`: sallama zaten kapalı; kalıcı işaret statik olduğu için ek karşılık gerekmez.

Can sayısı, ceza miktarı veya işaretin mekanik etkisi (örn. işaretli hücreye tekrar basınca can gitmesin mi) **burada ele alınmaz**; bunlar E1'in konusu. **E1 açılınca** bu not giriş olarak kullanılır; o zamana kadar prototipe eklenmez.

## 5. Pillar gerilim özeti

| Öneri | Gerilim | Nasıl kapanır |
|---|---|---|
| Alt banner | Pillar 2 (başparmak bölgesi) | 12 pt ölü bölge + ölçüm + 24 pt içe kaydırma yedeği |
| 20 sütun korunursa | Pillar 1 (zoom + tap = iki adım) | /level-design: sütun ≤ 17 |
| `0/50` kaldırma | Pillar 4 (hafif) | level sonu kartı |
| Chip Seçenek C | Pillar 4 (sayaç biçimi) | segment + ölçüm + rozet varyantı |
| Kalıcı yanlış işareti (not) | Pillar 5 | küçük/nötr işaret; E1'de |

## 6. Prototip görevi (open-questions #6)

`/prototype` için iki kademe. P1 bu dosyadaki kararı beklemeden yapılabilir (sadece ölçüm aracı); P2 ADR sonrası.

### P1 — Banner placeholder ve mobil ölçüm (küçük)

1. `<head>`'e `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` ekle. Bu olmadan telefon testi geçersiz.
2. `#viewport`'tan sonra, body'nin son çocuğu olarak `<div id="banner" aria-hidden="true">BANNER 320×50</div>`. CSS: `flex:0 0 auto; height:var(--banner-h,50px); margin-top:2px; border:1px dashed var(--line); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.75rem; color:var(--muted)`. Body `gap` 10 olduğu için viewport–banner mesafesi 10 + 2 = 12 pt (ölü bölge). `--banner-h: 0px` iken `display:none`.
3. Alt safe area: body `padding-bottom: max(12px, env(safe-area-inset-bottom))`.
4. Yükseklik seçimi: URL `?banner=0|50|90` ve/veya debug'da üç buton; `localStorage` `ka-banner`. Değişince `document.documentElement.style.setProperty('--banner-h', …)` ardından mevcut `resize` handler'ındaki mantık çağrılır (`fit()` + eski zoom oranını koru). `fit()` kodu değişmez; `vp.clientHeight` küçüldüğü için otomatik uyum sağlar.
5. Ölçüm çıktıları (konsol veya debug satırı): `minScale`, `minScale*base` (hücre pt), `minScale*base*0.72` (harf pt), `vp.clientWidth × vp.clientHeight`.
6. Banner'a `pointerdown` sayacı: `bannerTaps++`, debug satırında göster. Yanlışlıkla dokunma metriğinin kaynağı.

Beklenen okumalar (390 × 844, mevcut HUD, PAD 48): banner 0 → hücre ≈ 13,6 / harf ≈ 9,8 pt; 50 → ≈ 11,6 / 8,4; 90 → ≈ 10,3 / 7,4. Bu sayılar §1.1 ile ±1 pt uyuşmazsa varsayımlar düzeltilir.

Not: Safari'de `height:100%` adres çubuğu görünürken küçük viewport'u verir; ana ekrana ekleyip (standalone) veya `100dvh` ile test edilmeli.

### P2 — Yerleşim sıkılaştırma (ADR sonrası)

- `PAD` 48 → 8; body yan padding 16 → 12.
- HUD: §3.1 tablosu. `header` tek satır (level·tema, kalpler, ampul); `.tools`, `p.hint`, `#found/#total` kaldırılır; `Yeni oyun`, level butonları, `collectT`, banner yüksekliği → `?debug=1` ile açılan çekmece.
- Chip Seçenek C: `.chip` 5 kolon grid (`grid-template-columns:repeat(5,1fr)`), `.cnt` ve `.dot` kaldırılır, `updateChip()` segment sayısını `--n` CSS değişkenine yazar, zemin `linear-gradient` ile 5 segment. `flyToChip` hedefi aynı chip.
- Zoom `+`/`−` → tek "sığdır" butonu, `scale > minScale*1.01` iken görünür; tıklayınca `fit()` (350 ms transform geçişi; reduced-motion'da anında).
- Beklenen: 20×25 harf 12,7 pt; 17×26 harf 14,4 pt (50 ve 90 pt bannerla aynı).
- `docs/game/mechanic.md` "Kamera ve input" ve "Açık konular" güncellenir (chip satır sayısı, sığdır butonu).

## 7. /level-design sorularına cevap (open-questions #7, #8)

`docs/levels/curve-v01.md` bu dosyayla eşzamanlı yazıldı; sorular oradan.

**#7 — 20 sütun / 18,7 pt hücre zoom'suz okunabilir mi? Minimum hücre?** Cevap §2.1–2.3: alt sınır **17 pt hücre / 12 pt harf**, hedef **20 pt / 14 pt**, dokunma-güvenli 24 pt. 20 sütun (17,6 pt) alt sınırı geçer, hedefi geçmez → Seçenek B elenmez ama "sığdırda tap güvenilmez, zoom beklenir" koşuluyla; Seçenek C (16 sütun, 21,9 pt) hedefi geçer. **UX tercihi C.** ≥ 24 pt şartı konmuyor.

**#8 — dört alt soru:**

| Soru | UX görüşü | Sayı |
|---|---|---|
| Değişken kelime sayısı (5/6/7/10) chip alanında | Chip alanı **sabit 2 satır (48 pt)**, levelden levele değişmez; 5 kelime tek satır + boş ikinci satır (chip'ler sola hizalı). Yükseklik değişirse `fit()` her levelda farklı ölçek verir ve tahta zıplar (Pillar 5: sakin). Seçenek C chip'inde (§3.2) 5 kolon: 5 → 1 satır, 6–10 → 2 satır, 11–15 → 3 satır. | 48 pt sabit |
| Küçük tahtada (20×18) boş alan | **Boş bırakılır**, tahta dikey ortalanır (`clamp()` bunu zaten yapar). Sütun sabit olduğu sürece harf boyutu her levelda aynı kalır; boşluk "küçük tahta = kolay" yanılsamasının görsel taşıyıcısı (WSE). Boşluğa UI koymak Pillar 5'i bozar. | 20×18: tahta 317 pt, viewport 593 → üst/alt ≈ 138 pt boş |
| L1 20×12 yatay oran (5:3) | Portrede kabul: ortalanmış 352×211 pt bant, üst/alt ≈ 190 pt boş. Üstteki boşluk FTUE coach satırına (§3.1) ev sahipliği yapar → boşluk işe yarar. Alternatif (daha az sütun, daha büyük hücre) "sütun sabit" kuralını bozar; UX bunu zorunlu görmüyor. | 5:3 kabul |
| FTUE L1–2'de ters yazım kapatılsın mı | UX tarafından **evet**: L1–2'de oyuncu "sürükleme değil dokunma" alışkanlığını kırıyor; ters okuma ikinci bir öğrenme yükü. Amaze GO! L1–2 "kendini anlatan tahta". Ama bu bir mekanik/level kaldıracı (level başına yön ağırlığı); karar `/gameplay` + `/level-design`, maliyet `/prototype`. Ölçüm: L1 ilk doğru tap'e medyan süre ≤ 10 sn. | yön ağırlığı L1–2: geri 0 |

## 8. Açılan sorular

`docs/open-questions.md`'ye eklenen satırlar (numaralar mevcut #10'dan devam):

- #11 → `/level-design`: zoom'suz üst sınır sütun ≤ 17, satır ≤ 26 (hücre 20 pt); mutlak tavan 20×31 (harf 12,7 pt, zoom beklenir). curve-v01 Seçenek C (16 sütun) UX tercihi; B kalırsa "zoom kabul edilmiş" notu düşülür. Grid küçülürse hedef oranı etkisi (§2.3) E1 ile birlikte.
- #12 → `/liveops`: banner 50 sabit mi adaptif (60–90) mi (eCPM farkı); reklam açılana kadar rezerv alanda ne var (UX tercihi: boş); yükseklik level içinde değişmesin kuralı kabul mü.
- #13 → `/market-research`: Amaze GO! gameplay HUD'unda pause/ayarlar/restart girişi var mı, alt %15 gerçekten boş mu — ekran görüntüsü (mevcut "Eksik veri" satırının önceliklendirilmesi).
- #14 → `/gameplay`: Chip Seçenek C'de "n/5" yerine 5 segment Pillar 4 sayaç tanımını karşılıyor mu; chip'e long-press planlanıyor mu (70 pt chip hedef boyutu); FTUE L1–2'de ters yazım kapatma (§7).
