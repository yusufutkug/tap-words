# Word Search Explorer

- Geliştirici / yayıncı: PlaySimple Games (Bengaluru, Hindistan; Singapur tüzel kişiliği PlaySimple Games Pte Ltd). Temmuz 2021'de MTG (Modern Times Group, İsveç) tarafından 360 M$ + earn-out ile satın alındı; 2026'da MTGx'in hisse satışıyla Hindistan'da IPO süreci (DRHP).
- Platform, çıkış yılı: Android 19 Kasım 2021, iOS Şubat 2022 (tahmin: App Store id 1602508478 ve PlayStore Radar "on iOS since Feb 11"). Android paket `in.playsimple.wordsearch`, iOS id `1602508478`. 29 dil (Türkçe dahil).
- Tür ve alt tür: Kelime → klasik word search (swipe-to-select, temalı liste). Store alt başlığı "Relaxing Word Puzzle Game"; Google Play açıklaması "specially designed for seniors".
- Neden referans: ADR-0001 — **level tasarımı ve zorluk parametreleri** referansı: tahta boyutu/kelime sayısı dönüşümü (56/42 harf ritmi), fail state olmadan ilerleme kontrolü, level ritmi, monetizasyon girişinin levelle zamanlaması (ADR-0002 banner kararı için).
- Kaynaklar:
  - **[T&HG]** Two & a Half Gamers, 2025 review — podcast transkripti (Matej Lanceric, Felix Braberg, Jakub Remiar; yayın 17 May 2025, 44 dk). Yerel kopya: `agent-tools/04d93653-….txt`. En zengin kaynak; gameplay canlı oynanarak yorumlanıyor.
  - **[Gamigion-FB]** Felix Braberg, "Word Search Explorer reaches $163k/day in Ad Revenue", gamigion.com, 19 May 2025 — 56/42 ritmi ve banner L13 / interstitial L24 iddialarının yazılı kaynağı.
  - **[Gamigion-JR]** Jakub Remiar, "PlaySimple's Word Search Explorer makes $163K a day", gamigion.com, 20 May 2025.
  - **[Substack]** Felix Braberg, The Mobile Ad Monetization Newsletter #19, 25 Nis 2025 — banner "after level 10", quote levelları ~L15.
  - **[FGD]** Friendly GameDev (Kavindu Priyanath), 6 Mar 2025 — retention/ekonomi özeti (stamps, avatar, streak restore, RV cooldown 8).
  - **[AppStore]** App Store CA/US/AU sayfaları (26 Eki 2026) — IAP listesi, sürüm geçmişi, kullanıcı yorumları.
  - **[GPlay]** Google Play sayfası (26 Eki 2026) — "Includes Random Items" ibaresi, yorumlar.
  - **[SocialPeta]** socialpeta.com in-app event listesi (2025–2026).
  - **[DRHP]** PlaySimple DRHP özetleri: moneycontrol, m.Stock, newboard.in (2026) — resmi DAU ve gelir dağılımı.
  - **[AppGoblin / PlayStoreRadar]** üçüncü taraf tahminler (install, MAU).
  - **[Himalayas]** PlaySimple mühendisi Gurudev Singh'in profil sayfası — Teams, River Race, Puzzle Editor, OpenAI içerik pipeline.
  - **[Yorum]** App Store / Google Play kullanıcı yorumları (tarih belirtilerek).
  - Düşük güvenilirlik (SEO/AI üretimi görünümlü, birbirleriyle ve [Gamigion-FB] ile çelişiyor): wordsearchindia.com, iphoneappsarena.com, iofreeonline.com. Sadece "böyle iddialar var" diye anılır, sayı alınmaz.
  - `docs/references/raw/word-search-explorer/` klasörü **boş**; ekran görüntüsü, playtest notu, APK verisi yok.
- Analiz tarihi: 2026-10-26

## Core loop

Oyuncu bir "destinasyon"a bağlı level zincirinde ilerler. Her level temalı bir harf tahtası ve altında kelime listesidir; kelimeyi sürükleyerek (swipe) seçer, doğruysa kelime boyanır ve listeden düşer. Yanlış sürükleme cezasızdır; süre yok, can yok, kaybetmek yok. Tüm liste bitince level biter; Wisdom puanı (ilerleme XP'si) ve arada coin kazanılır; haritada destinasyona doğru ilerlenir. Oyuncu durma noktası dışsaldır: interstitial (L24+), günlük streak tamamlandı hissi veya bıkkınlık. Oturum ortalaması 11,3 dk × günde 2,3 oturum [T&HG, Sensor Tower verisi].

1. Harita/ana ekran → "Play" (ana ekranda banner yok [T&HG]).
2. Level açılır: üstte tema + "oyuncuların %X'i bu leveli tamamladı" [T&HG, Substack — Cryptogram'dan alınmış kalıp]; altta kelime listesi; bazı varyantlarda liste gizli (sadece tema), eş anlamlı/zıt anlamlı veya alıntı (quote) boşluk doldurma [Yorum, App Store 19 Eyl 2026; T&HG].
3. Swipe ile kelime seçimi; doğruysa boyanır, listeden silinir, "yıldız çevresindeki daire" dolar; listede olmayan temalı kelime bulunursa **bonus word** sayılır ve daireyi doldurur, daire dolunca bedava ipucu verir [Yorum, App Store 2 Tem 2025].
4. Liste bitince: Wisdom puanı + ara ara "hediye" (coin) kümeleri [T&HG]; L24 sonrası interstitial; L10–13 sonrası gameplay'de alt banner.
5. Sonraki level: önceki büyük tahtaysa küçük tahta gelir (bkz. Zorluk eğrisi).

## Level yapısı

Level verisi (dışarıdan gözlenen):

| Alan | Değer / gözlem | Kaynak |
|---|---|---|
| Tahta harf sayısı | **56 veya 42 harf**, dönüşümlü | [Gamigion-FB]: "Generally, levels alternate between boards that contain 56 letters and 42 letters. A 42-letter level follows a 56-letter level." |
| Tahta şekli | 56 = 7×8, 42 = 6×7 **(tahmin; tek tam-sayı çarpanlar bunlar, podcast görüntüsünde dikey dikdörtgen)** | çıkarım |
| Kelime sayısı | Büyük tahta ~8–9, küçük tahta ~5–6 | [T&HG 19:00]: "this level has what? Eight or nine words… the next level will only have five words or six words… and the overall letters will be smaller." |
| Kelime uzunluğu | Veri yok; 56 harfe 8–9 kelime sığması için ortalama 4–6 harf ve klasik word search kesişimleri **(tahmin)** | — |
| Yönler | Yatay, dikey, çapraz, ters — hepsi var | [iphoneappsarena, wordsearchindia — düşük güvenilirlik; T&HG görüntüsü ters kelime gösteriyor] |
| Tema | Her level tek tema (ör. "Monsoon", "Transport"); destinasyona bağlı kültürel temalar | [Store açıklaması, iofreeonline] |
| Varyantlar | Liste gizli (sadece tema), eş anlamlı, zıt anlamlı, quote boşluk doldurma (Helen Keller cümlesi) | [Yorum 19 Eyl 2026; T&HG 18:02; Substack ~L15] |
| Bitiş koşulu | Listedeki tüm kelimeler. Süre yok, can yok, **fail state yok** | [T&HG, Gamigion-FB, Gamigion-JR] |
| Yıldız/puan | Yıldız yok. Wisdom puanı (ilerleme), coin (ara hediyeler), level üstünde "%tamamlayan" | [T&HG 13:00–14:00] |
| Tekrar oynama | Yok (gerek yok, kaybedilmez). Levellar içerik havuzundan geliyor; yoğun oynayan bir kullanıcı "çok puzzle tekrar etti" diyor → üretilmiş/geri dönüştürülmüş içerik **(tahmin)** | [Reddit r/SwagBucks 18 Şub 2026: günde 500 puzzle, 2 haftada bitirdi] |
| Level sayısı | "hundreds" (store), üçüncü taraflar 3000+ diyor; SwagBucks görevinde sonlu bir hedef var | [AppStore], [iofreeonline — düşük güvenilirlik] |
| İçerik üretimi | Dahili görsel Puzzle Editor (Excel'den geçiş, %50 hız), OpenAI API ile içerik dağıtım otomasyonu (%70 daha az manuel iş); quote'lar muhtemelen AI üretimi | [Himalayas], [Substack] |

Not: wordsearchindia.com "L1–25 6×6 / 26–50 8×8 / 51–75 10×10 / 76–100 12×12 / 100+ 15×15" ve "L217 14×14, 28 kelime" tablosu veriyor; bu, [Gamigion-FB]'nin 56/42 gözlemiyle ve podcast görüntüsüyle çelişir, sayfa AI-SEO görünümlü. **Kullanılmadı.**

## Zorluk eğrisi

Temel tez [T&HG 19:00–23:00, Gamigion-JR]: WSE'de zorluk yok, **tempo** var. Fail state olmadığı için "zor" = "daha uzun sürer". Zorluk kaldıracı tek: **kelime sayısı** (ve onunla birlikte tahta harf sayısı). Büyük tahta (56 harf, 8–9 kelime) → küçük tahta (42 harf, 5–6 kelime) dönüşümü, oyuncuya "bu kolay, hemen bitiririm" yanılsaması verir ve bir önceki uzun levelın yorgunluğunu ödüllendirir. Jakub Remiar: "changing the boards from small to big creates an illusion of easier and harder content, which is great for user pacing." Felix'in yorumu: küçük tahta aynı zamanda ipucu kullanımını da tetikliyor ("changing the optical illusion for pushing you to use hints" [T&HG 22:30]).

Sayısal oranlar (56/42 ritminden türetilmiş):

| | Büyük tahta | Küçük tahta | Oran |
|---|---|---|---|
| Harf | 56 | 42 | 1,33 |
| Kelime | 8–9 | 5–6 | ~1,5–1,6 |
| Tahmini süre (kelime sayısıyla orantılı) | ~1,5× | 1× | ~1,5 |
| Hedef hücre oranı (kelime × ~5 harf, kesişim yok sayılarak) **(tahmin)** | 40–45 / 56 ≈ %70–80 | 25–30 / 42 ≈ %60–70 | — |

Oturum matematiği: 11,3 dk oturum; uzman bir oyuncu saatte ~100 puzzle çözebiliyor (36 sn/puzzle) [Reddit SwagBucks]; sıradan oyuncu için level başına 1–2 dk **(tahmin)** → oturumda 6–10 level, yani 3–5 büyük/küçük çifti.

Level aralığı tablosu (bilinenler; boşluklar "veri yok"):

| Level aralığı | Ne değişiyor | Güven | Kaynak |
|---|---|---|---|
| L1–10 | 56/42 dönüşümü (muhtemelen baştan itibaren), kelime listesi görünür, hiç reklam yok, hediye kümeleri ile coin | 56/42 başlangıcı tahmin | [Gamigion-FB], [T&HG] |
| L10–13 | **Banner** gameplay ekranında başlar (sadece gameplay'de; ana ekranda yok) | yüksek; kaynaklar L10/L11/L13 diyor | [Substack] "after level 10", [T&HG 21:00] "around level 11", [Gamigion-FB] "around level 13" |
| ~L15–20 | **Quote levelları** ana akışa girer (yazar alıntısı, kelimeleri bul, boşlukları doldur); atlanabilir, normal level oynanır | orta | [Substack] "after approximately level 15", [Yorum 2 Tem 2025] "at like level 20… you can exit out of that" |
| L24 | **İlk interstitial** | yüksek | [T&HG 21:00], [Gamigion-FB], [Gamigion-JR] |
| ~L25 | "Remove Ads" / üst sürüm popup'ı her 2 puzzle'da bir | tek yorum | [GPlay yorumu 31 May 2025] |
| L27 | **Daily Challenge** açılır (quote formatı) | yüksek | [T&HG 18:02] "after level 27 daily challenge unlocks" |
| L30–100 | Varyant levellar (gizli liste, eş/zıt anlamlı) rotasyona girer; destinasyonlar değişir. Tahta boyutunun 56/42 dışına çıkıp çıkmadığı **veri yok** | düşük | [Yorum 19 Eyl 2026] |
| L100+ | Veri yok. Bir kullanıcı 3 günde ~150 level, bir başkası 2 haftada ~350 level; "ad load does not increase with level" iddiası var | düşük | [Yorum 20 Tem 2026], [GPlay yorumu 27 May 2025] |

"Duvar" level: yok; tasarım gereği. Fail rate hedefi: tanımsız (fail yok). Oyun yerine **"%X oyuncu bu leveli tamamladı"** gösteriyor; bu, rekabetçi duygu + sosyal kanıt işlevi görüyor, zorluk ayarı değil.

Karşılaştırma için rakip zamanlamaları [T&HG 21:00]: Words of Wonders banner L6 / interstitial L10; Wordscapes banner L8 / interstitial L11–12. WSE ikisini de ~10 level geciktiriyor.

## UX kalıpları

- **Input**: swipe (ilk harften son harfe sürükle, bırak). Yanlış seçim cezasız. Tap yok. [Store, T&HG 38:00 "very satisfying dragging your finger"]
- **Feedback zinciri**: kelime boyanır (kelimeye özgü renk), listeden düşer, yıldız çevresindeki daire dolar; bonus word'de de aynı. Çok "polished" [T&HG 38:00]. Ses: ASMR/rahatlatıcı müzik; pazarlama "10 dakika oyna, zihnini dinlendir" [T&HG 31:00, 39:00].
- **HUD**: üstte tema adı + "%tamamlayan", yıldız/daire ilerlemesi, ipucu butonu, coin bakiyesi; altta kelime listesi; L10–13 sonrası en altta banner. Görsel sadelik: "senior friendly", büyük harf, yüksek kontrast [GPlay açıklaması "designed for seniors"; iphoneappsarena — düşük güvenilirlik].
- **Level sonu**: Wisdom puanı animasyonu → ara ara hediye/coin → interstitial (L24+) → harita ilerlemesi. Yıldız/puan ekranı yok [T&HG 13:00–14:00, 22:00].
- **Onboarding/FTUE**: Veri yok (podcast ileri bir hesapla oynadı). Store açıklaması "as easy as taking a walk in the park".
- **Hata durumu**: yok; en kötü ihtimal kelimeyi bulamamak → ipucu/RV.
- **Kamera**: 56/42 harflik tahta ekrana sığar; zoom/pan yok **(tahmin; podcast görüntüsünde tahta tek ekranda)**.
- **Mağaza çıkışı RV**: mağazadan "satın almadan" çıkınca rewarded video teklifi; level başlangıcında da "get the coins" RV [T&HG 17:00]. Felix: "one of the most clever monetization features on the admon side."
- Ekran görüntüsü: raw klasörde yok.

## Meta ve ilerleme

- **Destinasyon haritası**: Level zincirleri ülke/şehirlere bölünmüş (Malezya, Danimarka örnekleri); set tamamlanınca yeni destinasyon, yeni görsel tema ve temalı kelime listeleri [T&HG 10:00–16:00; Store "closer to your next destination"]. Podcast değerlendirmesi: "level saga… nice pictures… changes from time to time" — hafif meta.
- **Wisdom puanı**: Level bitince kazanılır, haritada ilerletir; podcast "doesn't do anything" diyor — işlevi sadece ilerleme hissi [T&HG 13:30].
- **Monuments (koleksiyon)**: "Temu version of collectible album" — anıt kartı + alıntı, ilerleme/ödül bağı yok [T&HG 14:30]. Panelistler Royal Match/Monopoly Go tarzı sticker albümü önerdi ("they're slowly adding baby royal match").
- **Stamps ve avatar koleksiyonu**: haftalık avatar açma eventi (Jul 2025), stamps [FGD; SocialPeta "Begin collecting your amazing new Avatars… unlock unique avatars each week"; Yorum 19 Eyl 2026 "unlock profile pics which is animals"].
- **Teams**: matchmaking, takım turnuvası, sohbet (Go/Redis/ScyllaDB backend) [Himalayas, 2025–2026].
- **Google Play "Includes Random Items"**: rastgele içerikli satın alma var (avatar/stamp paketleri **tahmin**) [GPlay].

## Event takvimi

Store in-app event kayıtlarından [SocialPeta] ve geliştirici profilinden [Himalayas]:

| Event | Tip | Süre | Örnek tarih | Not |
|---|---|---|---|---|
| Wisdom Tournament | Hafta sonu bireysel liderlik tablosu (süre içinde bulunan kelime sayısı **tahmin**) | 5–6 gün | 25–30 Eyl 2026 | "Early bird gets the worm" → erken başlayan avantajlı |
| River Race | Takım bazlı yarış, ortak ödül | Veri yok | 2024–25'te geliştirildi | [Himalayas], [boardgamesguide — düşük güvenilirlik] |
| Teams tournament | Takım turnuvası + chat | Veri yok | 2025–26 | [Himalayas] |
| Temalı sezon event'i | Temalı puzzle seti + ödül | 1–4 hafta | Halloween 17 Eki–3 Kas 2026; Korsan 24–30 Eyl; Deniz 4–11 Eyl; Bahçe "Jade Junction" 18 Ağu–3 Eyl; Futbol 16–30 Haz; Pride 1–29 Haz; Basketbol 17 Nis–14 May; Ruh sağlığı 9–18 Eki 2025 | Takvim/spor/farkındalık günlerine bağlı |
| Avatar koleksiyon haftası | Haftalık avatar açma | 1 hafta | 29–31 Tem 2025 | |
| Daily Challenge | Günlük quote puzzle (2 parça; parçalar arası reklam) | günlük | L27'den itibaren | [T&HG], [GPlay yorumu 27 May 2025] |
| Streak | Günlük giriş/oynama serisi, **restore** seçeneği var | sürekli | — | [FGD], [T&HG 16:30 "There's the streak mechanic"] |

Ritim (tahmin): her an en az bir temalı event aktif (sezonluk 1–4 hafta), üstüne hafta sonu turnuvası; event'ler ana level akışını değiştirmiyor, ek puzzle seti/puan toplama olarak çalışıyor.

## Ekonomi

- **Kaynaklar**: Coin (tek para birimi), ipucu (coin'le alınır veya bonus daire dolunca bedava), Wisdom (ilerleme, harcanmaz), event puanları, streak.
- **Kazanım**: level sonu hediye kümeleri (coin) [T&HG]; bonus word → daire → bedava ipucu [Yorum 2 Tem 2025]; RV: mağaza çıkışında, level başında ("get the coins", ~25 coin **tahmin**: podcast'te "25 coins" geçiyor) [T&HG 17:00–18:00]; başarımlar ve quest'ler [FGD]; günlük ödül/streak [FGD]. RV sınırı: [FGD] "cooldown after every eight consecutive ads"; Felix podcast'te 11 video izleyip cap'e takılmadığını söylüyor [T&HG 17:00] → sınır zamanla/segmentle değişiyor **(tahmin)**.
- **Harcama**: ipucu (harf göster / kelimeyi göster türleri; coin maliyeti **veri yok**); Remove Ads IAP.
- **Enerji/can**: **yok**. Oyuncu istediği kadar oynar; monetizasyon "sıkışma"ya değil "süre"ye bağlı.
- **Günlük bedava akış**: giriş ödülü + streak + daily challenge ödülü + RV coin'leri. Sayılar veri yok.

## Monetizasyon

- **Model**: ~%95 reklam (Felix tahmini, May 2025) [T&HG 23:30]. Şirket geneli DRHP: 2025 gelirinin %84,83'ü reklam [DRHP/newboard]. **"IAP yok" iddiası yanlış**: IAP var ama küçük; 30 günde ~200 K$ IAP [Substack] vs ~150–168 K$/gün reklam. (AppGoblin "%64 IAP" diyor — şirket verisiyle çelişen üçüncü taraf tahmini, güvenilmez.)
- **IAP yapısı** [AppStore US, Eki 2026]: Remove Ads 5,99 $ (CA 7,99 $, AU 9,99 $); coin paketleri 250/0,99 $, 750/2,99 $, 1600/4,99 $, 3600/9,99 $, 8000/19,99 $; Super 6,99 $, Mega 11,99 $, Master 24,99 $, Ultimate 49,99 $ paketleri. Google Play'de "Includes Random Items".
- **Reklam yerleşimleri**:
  - Banner: sadece gameplay ekranında, altta; **L10–13'ten itibaren** (kaynaklar L10 [Substack], L11 [T&HG], L13 [Gamigion-FB]). Ana ekranda banner yok — Felix'e göre ~5 K$/gün kayıp ama bilinçli retention tercihi [T&HG 26:30–27:30].
  - Interstitial: **L24'ten itibaren**, level aralarında; günde kullanıcı başına ~4 [T&HG 24:00]. App-open interstitial yok (Felix: +21 K$/gün potansiyel) [T&HG 25:00].
  - Rewarded: mağaza çıkışı, level başı coin, booster; kullanıcı yarısında günde ~3 RV [T&HG 24:00].
  - Daily challenge'ın 2 parçası arasında interstitial (May 2025 sonrası) [GPlay yorumu 27 May 2025].
- **Gelir ölçeği**: 150–168 K$/gün reklam (May 2025), run-rate ~56 M$/yıl [T&HG, Gamigion-FB]; Substack Nisan 2025 tahmini ~200 K$/gün. 2,9–3,3 M DAU (May 2025, Sensor Tower) [T&HG, Gamigion-JR]; resmi 2025 ortalaması 1,96 M DAU [DRHP]. 100 M+ Android indirme [GPlay, Himalayas]. Aylık 8,2–9,1 M indirme (Nis–May 2025).
- **Agresiflik**: L1–23 yumuşak (sıfır interstitial), L24+ orta-sert: kullanıcı yorumları "her level/her iki levelde bir reklam", "oyun sırasında sesli reklam" (May 2025) [GPlay yorumları]. GameCompass ebeveyn sitesi "aggressive monetization 4/5" diyor. Yani geç başlayıp sonra standart word-game yoğunluğuna çıkıyor.

## Retention mekanizmaları

- **Erken reklamsızlık**: L24'e kadar interstitial yok → D1–D7'de kesinti yok; panelistlerin ana tezi "sacrificing early monetization for retention" [T&HG 21:30, 27:30].
- **Fail state yok + sakin ton**: oyuncu asla kaybetmez, duraklama noktası yok; "calm" pazarlama, ASMR ses [T&HG].
- **56/42 tempo**: uzun levelın ardından kısa level "ödül" gibi → "bir tane daha" etkisi [T&HG 19:00–23:00].
- **%tamamlayan göstergesi**: sosyal kanıt, hafif rekabet [T&HG, Substack].
- **Daily Challenge (L27+)** ve **streak + restore** [FGD].
- **Koleksiyonlar**: monuments, stamps, haftalık avatar [FGD, SocialPeta].
- **Sosyal**: Teams (chat, takım turnuvası), River Race, hafta sonu Wisdom Tournament [Himalayas, SocialPeta].
- **Cross-promo**: PlaySimple portföyüne "More games", popup, quest ödülleriyle yönlendirme [FGD, T&HG 16:30].
- **Facebook senkron** [GPlay].
- Geri çağırma (push/e-posta): veri yok.

## Bize uyarlanabilirlik

Tap Words tarafı (`docs/game/mechanic.md`): 20×25 = 500 hücre, 10 kelime × PER 5 = 50 yerleşim, hedef hücre ≈ 250–280 (%50–55), can 5, ipucu 3/level, fail state var. WSE'den temel fark: WSE'de "zor" = uzun sürer; Tap Words'te "zor" = can bitme riski. Bu yüzden WSE'nin tempo kalıpları alınırken **süreyi değiştiren kaldıraçlar (tahta, kelime sayısı) oynatılır, riski değiştirenler (PER, can, dolgu alfabesi) sabit tutulur**; aksi halde "kolay nefes levelı" riskli levela dönüşür.

| Kalıp | Aynen / Değiştirerek / Alınmaz | Neden (pillar referansı) | Hangi agent'ı ilgilendirir |
|---|---|---|---|
| **56/42 dönüşümlü tahta** (harf 1,33×, kelime ~1,5×) | Değiştirerek | Tap Words karşılığı önerisi: Büyük = 20×25 / 10 kelime / PER 5 (500 hücre, 50 yerleşim, hedef ≈ %52); Küçük = **20×18 / 7 kelime / PER 5** (360 hücre, 35 yerleşim, hedef ≈ 182/360 ≈ %50). Harf oranı 1,39, kelime oranı 1,43 — WSE oranlarına yakın, hedef hücre oranı ±2 puan sabit → rastgele tap riski değişmez (Pillar 6: zorluk parametreyle; Pillar 3: ceza adil kalır). Sütun sabit (20) kalırsa `fit()` ölçeği ve chip alanı değişmez (Pillar 5). | level-design (parametre), prototype (ROWS ve kelime sayısı level verisine taşınmalı), ux (7 chip tek satıra sığar mı) |
| **Zor leveli kolay level izler** (katı A-B ritmi) | Aynen | WSE'de kural "her 56'yı bir 42 izler" [Gamigion-FB]. Tap Words'te süre farkı 50 → 35 yerleşim ≈ %30 daha kısa level. Pillar 7 ("level hissi tartışılır") ile uyumlu: eğri sayı değil ritimdir. Ölçüm: küçük levelda "sonraki seviye" tıklama oranı büyük leveldan ≥ 5 puan yüksek olmalı. | level-design |
| **Fail state yok, ilerleme sadece kelime sayısıyla kontrol edilir** | Alınmaz (şimdilik) | Can mekaniği Tap Words'ün ayırt edici özelliği (Pillar 3) ve E1 ertelenmiş konu. Ancak WSE'nin dersi alınır: zorluk eğrisi **tek kaldıraçla** kurulur; Tap Words'te level başına en fazla 1–2 kaldıraç değişsin, geri kalanı global sabit kalsın. Fail'li oyunda WSE ritmi "küçük tahta = can kaybetme riski aynı, süre kısa" olarak çalışır; küçük tahtada can yenilenmesi/can geri verme düşünülebilir (gameplay). | gameplay, level-design |
| **Tek zorluk kaldıracı = kelime sayısı** | Değiştirerek | WSE kelime sayısı 5–9 bandında; Tap Words'te kelime sayısı chip alanıyla sınırlı (10 → UI taşar, mechanic.md#açık-konular). Kelime sayısı 7–10 bandında oynatılır; 7 altı chip'leri boşaltır, 10 üstü taşırır. PER sabit. | level-design, ux |
| **"%X oyuncu tamamladı" göstergesi** (Cryptogram kalıbı) | Değiştirerek | Fail'li oyunda daha anlamlı: "ilk denemede %X tamamladı" veya "ortalama kaybedilen can". HUD yoğunluğu (Pillar 5) ve Amaze GO! sadelik referansıyla tartılmalı; level sonu ekranına koymak gameplay HUD'unu kirletmez. Seed'li üretim gerektirir (open-questions #5): aynı tahtayı herkes oynamalı ki yüzde anlamlı olsun. | ux, prototype, liveops |
| **Banner: gameplay'de, L10–13'ten itibaren; ana menüde yok** | Değiştirerek | ADR-0002 banner alanı kararını destekler: alan **L1'den itibaren yerleşimde ayrılır** (tahta `fit()` sabit kalsın, L11'de layout zıplamasın), **reklam ~L11–13'te açılır**. WSE'nin "ana menüde banner yok" tercihi retention odaklı, Felix'e göre ~%3 gelir kaybı; Tap Words için L1 kararına gerek yok, LiveOps turunda. Ölçüm: banner açılan levelda D1→D3 düşüşü kontrol grubuna göre ≤ 1 puan. | liveops, ux, prototype |
| **Interstitial L24, app-open yok** | Değiştirerek | WSE: ~10 level geç (WoW L10, Wordscapes L11–12). Tap Words level süresi WSE'den uzun (50 yerleşim), 24 level ≈ 1,5–2 saat oyun **(tahmin)**; eşik level yerine "oynanan dakika" veya "tamamlanan büyük/küçük çift sayısı" ile de tanımlanabilir. Öneri LiveOps turunda, referans: L24 veya ~12 çift. | liveops |
| **Rewarded video mağaza çıkışında** | Aynen (LiveOps turunda) | Mekanikten bağımsız; Tap Words'te mağaza/ipucu satın alma olduğunda birebir uygulanır. RV cap 8/gün [FGD] başlangıç değeri. | liveops |
| **Bonus words** (listede olmayan temalı kelime) | Alınmaz | Tap Words generator'ı planlanmamış kelimeleri **temizler** (mechanic.md#generator-kuralları, Pillar 3 "haksız ceza yok"). Bonus kelime, dolgu hücresine dokunmanın bazen ödül bazen ceza olması demek → Pillar 3 ile doğrudan çelişir. Alternatif: PER+1 "bonus kopya" (6. yerleşim, bulunması zorunlu değil, ipucu doldurur) — gameplay'e soru. | gameplay |
| **Bonus daire → bedava ipucu** | Değiştirerek | Tap Words'te ipucu 3/level sabit. "Ard arda N yerleşim, 0 yanlış tap → +1 ipucu" gibi performansa bağlı ipucu kazanımı, Pillar 4 (koleksiyon ödülü) ile uyumlu. Ölçüm: ipucu kullanım/level ve yanlış tap/level. | gameplay, liveops |
| **Daily Challenge L27'de açılır, farklı format (quote)** | Değiştirerek | Günlük tahta için seed'li üretim şart (open-questions #5). Format farkı Tap Words'e çevrilirse: "chip gizli" günlük tahta (sadece tema görünür, kelimeyi tahmin edip dokun). Açılış levelı: WSE 27; Tap Words için büyük/küçük 10–12 çift sonrası **(öneri)**. | liveops, prototype, gameplay |
| **Varyant levellar** (gizli liste, eş/zıt anlamlı) | Değiştirerek | Pillar 6: yeni engel değil, mevcut mekanikle çeşitlilik. "Chip gizli" modu Tap Words'te doğal: chip sadece sayaç gösterir, kelime yazmaz. Ne zaman gireceği: WSE ~L15–20 → Tap Words için ilk 20 level dışında. | gameplay, level-design |
| **Wisdom puanı + destinasyon haritası** | Değiştirerek (hafif) | WSE'de bile "doesn't do anything" [T&HG]; Tap Words'te `bulunan/50` zaten koleksiyon hissi veriyor (Pillar 4). Hafif harita (tema = destinasyon) yeterli; Wisdom tarzı ikinci ilerleme sayacı eklenmez. | liveops |
| **Streak + restore, stamps/avatar, Teams/River Race** | Ertelenir | LiveOps turu konusu; mekanikle çatışmaz. Not: WSE sosyal katmanı 2024–25'te sonradan eklendi; 2,9 M DAU'ya sosyal katmansız ulaştı. | liveops |
| **Senior-dostu okunabilirlik** (büyük harf, yüksek kontrast, tahta tek ekranda) | Aynen (hedef) | WSE tahtası 56 harf → zoom gerekmez. Tap Words 500 hücre zoom'suz okunmaz (mechanic.md#açık-konular). WSE'nin dersi: hedef kitle için **tahta ekrana sığmalı**; 20×25 banner düşülmüş ekranda okunmuyorsa küçük tahta (20×18) varsayılan, büyük tahta "zor level" olmalı — ya da grid küçülmeli. Pillar 5 ile uyumlu. | ux, level-design |
| **Oturum hedefi 11,3 dk × 2,3** | Değiştirerek | Tap Words için metrik hedefi olarak kullanılır: oturumda ≥ 3 büyük/küçük çifti bitmeli → level süresi büyük ≤ 2,5 dk, küçük ≤ 1,5 dk **(hedef)**. Ölçüm: prototipte level süresi logu. | level-design, prototype |

## Eksik veri

| Başlık | Eksik | Ne gelirse güçlenir |
|---|---|---|
| Level yapısı | Tahta şekli (7×8 / 6×7 doğrulanmadı), kelime uzunluğu dağılımı, yön ağırlıkları, kesişim kuralı, 56/42'nin L1'den mi başladığı, L100+ tahta boyutu | L1–30 ve L100–120 arası ekran görüntüsü serisi (her level için tahta + liste); APK'dan level JSON/puzzle config |
| Zorluk eğrisi | Level süresi dağılımı, ipucu kullanım oranı, "%tamamlayan" değerlerinin level eğrisi | Utku playtest notu: ilk 30 levelda her level için süre, kelime sayısı, harf sayısı, %tamamlayan |
| UX | FTUE/onboarding akışı, ipucu türleri ve feedback, level sonu ekranı sırası | L1–5 video veya ekran görüntüsü; ipucu menüsü görüntüsü |
| Ekonomi | İpucu coin maliyeti, level sonu coin miktarı, günlük giriş ödülü tablosu, RV coin değeri, RV cap güncel değeri | Mağaza ve ipucu ekran görüntüleri; 7 günlük giriş ödülü görüntüsü |
| Event | River Race / Wisdom Tournament kuralları, puanlama, ödül tablosu, event'in level akışıyla ilişkisi | Event ekranı görüntüleri; event süresince playtest notu |
| Monetizasyon | Banner başlangıç levelının kesin değeri (L10/11/13 çelişkisi), interstitial sıklığı L24–50 arası, Remove Ads popup zamanlaması | Yeni hesapla L1–30 playtest: hangi levelda ilk banner, ilk interstitial, ilk IAP popup |
| Retention | Push/e-posta geri çağırma, streak ödül tablosu, D1/D7/D30 (tahmin bile yok) | Üçüncü taraf benchmark veya PlaySimple DRHP'nin tam metni (retention bölümü) |
| Kaynak kalitesi | wordsearchindia / iphoneappsarena / iofreeonline sayfaları AI-SEO görünümlü ve çelişkili; kullanılmadı | Birincil kaynak: oyunun kendisi |

## APK analizi (2026-10-26, v1.290.0)

Kaynak: cihazdan çekilen APK, `raw/word-search-explorer/extracted/` (CSV + README). Harf içerikleri şifreli; **grid boyutu, kelime sayısı, dolgu sayısı, puzzle tipi ve `hwp` düz metin.** Aşağıdaki sayılar web kaynaklı bölümleri düzeltir/kesinleştirir; çelişkide bu bölüm geçerlidir.

### Level verisi ve içerik hacmi
- EN: **3510 level** pakette, 6 varyant (`content` deneyi; A/B kolları 4 × %25). TR: 100 level pakette, devamı CDN. Level verisi dil başına üretilmiş; parametre seti aynı, kelimeler farklı.
- Ek havuz: 500 "alternatif" level (72/90 hücre, hwp 25/35, ort. 10,5 kelime) — zor set / daily için (tahmin). `eoc.rp = 2011`: içerik bitince muhtemelen L2011'den tekrar (tahmin).
- L1001'den itibaren grid yapısı **200 levellik periyotla tekrar ediyor** (kelimeler değişiyor).

### Grid, kelime sayısı, dolgu — gerçek değerler
| Level | Grid (hücre) | Kelime | Dolgu % | Not |
|---|---|---|---|---|
| 1 | 4×4 (16) | 3 | 44 | FTUE |
| 2–3 | 5×5 (25) | 5 | 20 | |
| 4–13 | 6×6 (36) / 6×7 (42) | 6–7 | 11–29 | ramp |
| 14 | 7×8 (56) | 9 | 23 | ilk "büyük" tahta |
| 16 | 8×9 (72) | 10 | 17 | ilk 72 |
| 14–40 | 42 ↔ 56 ↔ 72 | 6–11 | ~23 | sıkı dönüşüm |
| 40 | 9×10 (90) | 13 | 20 | ilk 90; en büyük grid |
| 41+ | **56, 72, 56, 72, 90** (5'li döngü) | 8–13 | 26–27 | kalıcı ritim |

- Grid seti sadece 5 boyut: 36, 42, 56, 72, 90. **Maksimum 90 hücre.** Kelime sayısı ≈ hücre/6–7.
- Dolgu hücresi oranı **%22–27** → hedef hücre oranı **~%75** (Tap Words prototipi %52). Kelimeler kesişebiliyor (klasik word search).
- "56/42 dönüşümü" iddiası doğru ama eksik: L14–40 arasında 42↔56↔72, L41'den sonra 56→72→56→72→90 döngüsü. Küçük tahtadan sonra büyük gelme olasılığı **%99**; büyükten sonra küçük gelme %62 (çünkü 56→72 de "büyüme").
- `hwp` (ters/çapraz oranı — tahmin): L1–34'te **0**; L35'ten itibaren **her ikinci levelda** 35/32/25, aralardaki levellarda 0. Yani "zor yön" yalnızca dönüşümlü levellarda açılıyor. L61+'da levelların ~%50'sinde hwp>0. FTUE string'i: "Some words are placed diagonally! Swipe the word 'WIN'!" → çapraz bir tutorial anıyla tanıtılıyor.

### Puzzle tipleri (ilk görülme)
- `np` normal: L1. `tp` (+`rw` 7 ek kelime; bonus/tema kelimeleri — tahmin): **L66**, sonra ~%20. `cf` quote/alıntı puzzle (`q`,`cc`,`fn`; podcast'teki "Helen Keller cümlesi"): **L94**, L101–1000 arası ~%20, L2000+ neredeyse yok. `pp` picture puzzle ve `sp` yalnızca A/B varyantlarında.
- Çeşitlilik L66'ya kadar hiç yok; ilk 65 level tek tip, tek kaldıraç.

### Sözlük
- EN 49.230 kelime (2–10 harf; %85'i 5–7 harf; anagram gruplu → bonus kelime doğrulaması için). TR 47.043 kelime (3–11 harf, alfabetik). Kelime havuzu generator'dan ayrı; level kelimeleri ayrıca küratörlü.

### Meta (harita) eşikleri
`countriesInfoV3.json`: destinasyon kümülatif level eşikleri **4, 10, 20, 30, 50, 70, 90, 110, 130, 150, …** → ilk iki destinasyon hızlı (4 ve 10), sonra 10'ar, L50'den sonra 20'şer level. Pul koleksiyonu ülke başına 1 pul + "fun fact". Taç eşikleri 10, 30, 50, …, 350 (muhtemelen daily challenge/turnuva kazanımı); çerçeve eşikleri 10…500 ve "wheel" 10…1500.

### Monetizasyon (config)
- Remove Ads **5,99 $** ve 9,99 $; coin 250/0,99 · 750/2,99 · 1600/4,99 (−25%) · 3600/9,99 (−45%, "most popular") · 8000/19,99 (−60%); xpromo 100 bedava coin. 4 mağaza görünümü (Android/iOS × 2).
- Banner/interstitial başlangıç leveli ve sıklığı APK'da **yok**, server runtime (`"runtime for Interstitial"`). L10/11/13 çelişkisi bu yüzden: muhtemelen A/B.
- 44 deney bayrağı (`hardCodedExp.json`): `content`, `step1_ftue`, `coin_need_gen`, `iap_bundles`, `outro_opts`, dil bazlı 28 deney.

### Bildirim metinleri (retention)
`text_notif_config.json`: bedava ipucu ("You just received a free hint"), geri çağırma, milestone, hediye, streak ("Your reward is about to go away"), daily challenge hatırlatması, Wisdom Tournament, River Race. Streak shield ("safe even if you miss 1 day") string'leri libapp'te var.

### Tap Words için düzeltilmiş çeviri
- WSE'nin "büyük↔küçük" ritmi hücre bazında 1,33–1,6× adımlarla gidiyor (42→56→72→90). Tap Words çevirisi: büyük 20×25 (500) için küçük tahta **~20×18 (360)** değil, oran korunursa **~17×22 (375)** veya kelime sayısıyla: 10 ↔ 7 kelime. 5'li döngü (orta, büyük, orta, büyük, en büyük) denenebilir.
- Hedef hücre oranı %75 WSE'de mümkün çünkü ceza yok. Tap Words'te p=%52 zaten düşük; WSE'yi oran için değil **ritim ve kelime sayısı** için referans al.
- "Zor yön"ü L35'e kadar açmamak ve sonra dönüşümlü levellarda açmak doğrudan uyarlanabilir (`DIRS` ağırlığı level alanı olur).
- İlk 65 level tek tip: Tap Words'te de modifier/tipi L60+'a ertelemek için kanıt.
