# Amaze GO!

- Geliştirici / yayıncı: Oakever Games (OAKEVER GAMES PTE. LTD., Singapur). Oakever, Çin merkezli Learnings Co. Ltd.'nin (Vita Mahjong'un sahibi) yayın etiketi [S9][S10]. Eski adı **Arrows GO!**; Android paketi hâlâ `com.oakever.arrows` [S7].
- Platform, çıkış yılı: iOS + Android, Şubat 2026 (Google Play: 22 Şub 2026; iOS: 13 Şub 2026) [S4][S6]. Haftalık güncelleme ritmi (v1.16 → v1.35 arası Haz–Eki 2026, hepsi "Optimized user experience and performance!" notuyla) [S1].
- Tür ve alt tür: Casual puzzle → "arrow escape / untangle" (basitleştirilmiş parking-jam) [S8]. Hyper-casual ekonomi: IAP yok, %100 reklam geliri [S5][S8].
- Ölçek (Ekim 2026): Google Play 100M+ kurulum, 4.8★ / ~465K oy; App Store 4.7★ / ~246K oy, ABD Casual #10 [S1][S2]. Mayıs 2026'da 23.9M indirme (+%48 aylık) [S8]; Temmuz'da 11.9M [S10]; Eylül'de ~7M (−%23) [S11]. Tahmini aylık gelir $500K+ (Android, tamamı reklam) [S5].
- Neden referans: ADR-0001 — **genel tasarım hatları ve basitlik yaklaşımı**: görsel sadelik, tek dokunuş hissi, yanlış dokunuş → kalp kaybı feedback'i, HUD yoğunluğu, ekran akışı. "Tap-to-clear + yanlış tap can götürür" mekaniği Tap Words'ün tap-to-reveal + can mekaniğine doğrudan akraba.
- Kaynaklar: `docs/references/raw/amaze-go/` **boş**; analiz tamamen web kaynaklarıyla yapıldı (liste dosya sonunda). Oyun oynanmadı; mekanik iddiaları store açıklaması + ~80 kullanıcı yorumu + 5 inceleme yazısından çapraz doğrulandı.
- Analiz tarihi: 2026-10-26

> **Dikkat:** "Amaze Go Arrow Puzzle" adlı Chrome eklentisi (amazego.iamtac.com) farklı bir üründür; bu dosyada kullanılmadı. Aynı şekilde "AMAZE!!!" (maze-painting) ve Miniclip/Lessmore'un "Arrows: Puzzle Escape"i ayrı oyunlardır [S7][S8].

## Core loop

Tahta, farklı yönleri gösteren oklarla dolu bir ızgaradır. Oyuncu, ucundan tahta kenarına kadar yolu boş olan bir oka **tek dokunur**; ok "whoosh" sesiyle tahtadan kayıp çıkar ve arkasındaki oklara yol açar. Yolu kapalı bir oka dokunmak **1 kalp** götürür. Tüm oklar çıkınca level biter. Oyun kendi başına sakin bir "sırayı bul" döngüsüdür; zaman baskısı yoktur (2026 yazına kadar; sonra HUD'a süre sayacı eklendi) [S1][S3][S12].

1. Level öncesi kart: zorluk etiketi (Simple / Hard / Super Hard / Extreme / "One Chance") + "oyuncuların %X'i bu leveli geçemedi" istatistiği [S3][S12].
2. Tahta açılır; oyuncu pan/pinch-zoom ile tarar (level başında otomatik zoom-in yapıyor, çok şikâyet alıyor) [S12].
3. Serbest oka tap → ok kayarak çıkar (whoosh + hafif haptic). Arka arkaya hızlı doğru tap'lerde "Eagle Eye!" yazı + ses efekti (combo övgüsü) [S12].
4. Yolu kapalı oka tap → ok **kırmızıya döner ve tahtada kalır**, 1 kalp gider. Kırmızı ok, önü sonradan açılınca **kendiliğinden çıkar** (ceza kalıcı ama görev kaybolmaz) [S12].
5. 3 kalp bitince: "Continue (rewarded ad) / Restart" diyaloğu [S12].
6. Tahta boşalınca sonuç kartı: yıldız, süre, puan, harf notu (S/A…), "oyuncuların %Y'si gibi sen de tamamladın" [S3][S12]. Hatasız bitirme = **perfect run** [S1].
7. Sonraki level; L10–20'den sonra ve/veya level ≥60 sn sürdüyse araya interstitial girer [S12][S13].

Seans uzunluğu: level 30 sn–2 dk arası ("kettle boils" ölçeği) [S3]; yorumlarda "bir level daha" döngüsü ve "saat uçtu" sık geçiyor [S12].

## Level yapısı

- **Level verisi** (tahmin, dışarıdan gözlem): ok yerleşimi (her ok bir hücre dizisi — oklar düz değil, tahtada kıvrılan "çizgi" segmentleri; İngiltere store metni aynı oyunu "line puzzle / sliding puzzle" diye anlatıyor) [S2][S14], tahta boyutu, zorluk etiketi, mod bayrağı (normal / One Chance / Extreme / worm). Kelime, hedef sayısı veya süre hedefi yok; hedef = tahtayı boşalt.
- **Bitiş**: tüm oklar çıkınca. Fail: 3 kalp bitince (One Chance modunda 1 hata) [S12].
- **Yıldız / puan**: sonuç kartında yıldız, süre, puan ve harf notu var; formül oyunda açıklanmıyor (bir oyuncu "full lives + 3 Eagle Eye ile bazen birkaç bin, bazen 30.000 puan" diye şikâyetçi) [S1][S12]. Yıldızın ilerlemeye etkisi görülmedi (tahmin: sadece lig puanı için).
- **Tekrar oynama**: Restart her zaman var ve reklamsız (yorumlarda "en iyi tarafı") [S4]; level haritası yok, lineer sayaç (L1000+, banner'larda L2599 görülmüş) [S12]. Üçüncü parti walkthrough sitesi 890 level listeliyor [S15].
- **Şekilli tahtalar**: L199'da oklar kedi silueti oluşturuyor; event tahtaları yıldız, uçurtma, satranç taşı vb. şekilde [S3][S12]. İçerik üretimi parametrik değil, elle/yarı-otomatik şekil tasarımı gibi görünüyor (tahmin). L82 civarı tekrar eden tahtalar rapor edilmiş [S4].
- **Varyant modlar**: "Worm/Caterpillar" (renkli, yüzlü tırtıllar; tahta ekrana sığıyor; çocuk dostu) [S16]; "One Chance" (tek hata = fail; önce opsiyoneldi, Ağu–Eyl 2026'da ileri levellarda zorunlu oldu) [S12]; altın/çok renkli oklar (çıkınca bir grup oku birden serbest bırakır — Ağu 2026 eklemesi, açıklaması yok) [S12].

## Zorluk eğrisi

Resmî veri yok; yorumlardan türetilmiş tablo. Tüm satırlar **tahmin**.

| Level bandı | Gözlem | Kaynak |
|---|---|---|
| 1–5 | Tutorial yok, kural tek cümle; L1→L5 arası sıçrama hissi ("iki kolay levelden sonra zor") | [S12] |
| ~10–20 | Reklamsız bölge biter; interstitial başlar (yorumlar L10 / L15 / L16 / "ilk 20") | [S12][S13][S15] |
| 14 | Bir çocuk oyuncu için "imkânsız" eşiği | [S13] |
| 82 | Tahtalar tekrar etmeye başlıyor | [S4] |
| 85 | Bir oyuncu "tek mekanik, hâlâ eğlenceli, aylık trophy kazandım" | [S1] |
| 110 | "Zorluk ilk levellardan farklı değil" (düz eğri şikâyeti) | [S12] |
| 199 | Kedi şekilli yoğun tahta | [S3] |
| 250 | Level süresi çoğunlukla ≥60 sn → her levelde interstitial | [S12] |
| 670–1000+ | Lig/Glory League baskısı; One Chance zorunlu; oyuncular bırakıyor | [S4][S12] |

Oynayan **kaldıraçlar** (çıkarım): ok sayısı ↑, ok uzunluğu/kıvrımı ↑, tahta ekranı aşar hâle gelir (yorum: "zorluk sadece okları küçültüp göremez hâle getirmekten geliyor") [S12][S16], bağımlılık zinciri derinliği ↑, kalp sayısı ↓ (One Chance), kolay levellerin araya serpiştirilmesi ("ritim" — bir oyuncu bunu gereksiz buluyor) [S12]. Gamigion/Storr analizi: "tek fail aracı karmaşıklık; her tahta sabırla ilk denemede çözülüyor, bu da monetizasyon fırsatını azaltıyor" [S8]. Bilinen fail-rate hedefi yok; level öncesi gösterilen "%X geçemedi" istatistiklerinin uydurma/çelişkili olduğu birden fazla yorumda hesapla gösterilmiş ("%67 geçemedi" → bitince "%87.5 ile tamamlayanlardansın") [S12].

## UX kalıpları

**Input**
- Tek tap = oku gönder. Sürükleme yok, seçme yok, onay yok [S1].
- **Long-press = Guidance**: oka basılı tutunca gideceği rota vurgulanır; bırakınca hareket eder (bir yorumcu "basılı tut → yolunu gör → bırak" diye tarif ediyor) [S1][S16]. Zorunlu değil, kalp harcamaz.
- Pan: tek parmak sürükleme; pinch-zoom var; "+/−" butonu rapor edilmedi. Level başında **otomatik zoom-in** (ortaya) yapıyor — en çok şikâyet edilen kamera davranışı; "fit-to-screen" seçeneği yok, büyük tahtalar en küçük zoom'da bile ekrana sığmıyor [S12][S16].
- **Tap/pan ayrımı**: erken sürümlerde övgü ("ekranda gezerken ok göndermiyor", "tamamen zoom-out'ta bile yanlış oka nadiren basıyorum") [S12]. Auto-clear eklendikten sonra (Ağu–Eyl 2026) şikâyet patladı: oyun bir oku kendisi gönderirken oyuncunun tap'i yandaki kilitli oka düşüyor → kalp gidiyor [S4][S13]. Boş alana basınca kalp gittiğini söyleyen bug raporu var; geliştirici "boş alana basmak asla kalp götürmemeli" diye kabul etmiş [S13].
- Tahtanın **alt ~%15'i etkileşimsiz** boş alan (tahmin: banner/HUD rezervi; bir oyuncu "hiçbir şey kullanmıyor, oyun alanına katın" diyor) [S12].

**Feedback zinciri**
- Doğru tap: ok kayar, whoosh sesi, hafif haptic → tahtada boşluk açılır. Store metni bunu "ASMR gibi, nag yerine soothe eden feedback" diye pazarlıyor [S1]. İnceleme: "çoğu oyun kazanımı konfeti topuna gömer; burada kısıtlılık asıl nokta" [S3].
- Hızlı ardışık doğru tap: "Eagle Eye!" yazısı + sesli övgü (voice-over). Kapatma ayarı yok; "eye-safe mode"da bile parlıyor diye şikâyet [S12].
- Yanlış tap: ok **kırmızıya döner, tahtada kalır**; kalp azalır. Kırmızı işaret, hatanın tahtada görünür kalması demek (Tap Words'teki 350 ms kızar-salla'dan farklı: kalıcı). Önü açılınca kırmızı ok kendiliğinden çıkar [S12].
- Boşta kalma: birkaç saniye tap gelmezse "şu an X ok hareket edebilir" baloncuğu çıkar. Bir kesim bunu sever, bir kesim "beni acele ettiriyor, puzzle'ı çözmeme izin vermiyor, kapatılamıyor" diye bırakmış [S12].
- 2026 yaz eklemeleri (tümü olumsuz karşılandı): ekranın üstünden kayan "DillyDallyDan bu leveli 3 sn'de bitirdi" banner'ları (tahtanın üstünü kapatıyor, offline'da bile çıkıyor), level içi konfeti, emoji "tebrik"ler, neon ok renkleri [S12][S13]. İnceleme özeti: "çekirdek meditatif, sargı seni geri getirme makinesi" [S3].

**HUD** (yorum ve ekran görüntüsü tariflerinden derlendi; görsel doğrulama yok — Eksik veri)
- Var: level numarası, 3 kalp, ipucu (ampul + kalan sayı), süre sayacı (yaz 2026'da eklendi, kapatılamıyor) [S3][S12].
- Yok: puan göstergesi (sadece sonuçta), coin/para, enerji, hedef listesi, ilerleme çubuğu (tahtanın boşalması ilerlemenin kendisi) [S1][S4].
- Ana ekranda: level ilerleme çubuğu üzerinde küçük sayılar/semboller (anlamı açıklanmıyor; oyuncu "FAQ lazım" diyor), lig paneli, event girişleri [S12].
- Ayarlar: sadece 3 toggle (müzik, SFX, haptic) + eye-safe mode; slider yok; dark mode yok; tema: pastel yeşil-mavi ve bebek pembesi, ikisi de açık zemin [S12][S13].

**Level sonu ekranı**
- Sonuç kartı: yıldız, süre, puan, harf notu (S/A gibi) ve "tamamlayanların %Y'sine katıldın" [S3][S12]. Reklam o kadar hızlı geliyor ki kart okunamıyor; "Continue butonu olsun, istatistiğe bakayım" talebi [S12].
- Fail kartı: **Continue** (reklam ikonu, 3 kalp yeniler) / **Restart** (ikon yok ama yine interstitial geliyor — "yanıltıcı" diye şikâyet) [S12][S13].

**Onboarding / FTUE**
- Tutorial ekranı yok; L1–2 tek oklu, kendini anlatan tahta ("öğrenmesi 10 saniye") [S7]. Eksik: Eagle Eye'ın ne olduğu, puan formülü, HUD sembolleri hiçbir yerde açıklanmıyor — oyuncular bunun için tutorial sayfası istiyor [S12].

**Erişilebilirlik**
- Renk körü oyuncu: tüm oklar aynı renk, aktif yol vurgusu görünmüyor. Noktalı grid zemini düşük kontrast; "çizgili grid seçeneği" talebi. Yaşlı oyuncular küçülen okları seçemiyor; geliştirici "okları büyütürsek görünen içerik azalır" diye savunuyor [S3][S12][S13].

## Meta ve ilerleme

- **Lineer level sayacı**; harita/dünya/hikâye yok [S1][S12].
- **Lig (Glory League vb.)**: puan = level başına ~4; terfi/düşme çizgileri; 24 saatlik turnuva turları; gün atlayınca düşme. Oyuncular rakiplerin bot olduğuna ikna ("6 saat oynamadım kimse hareket etmedi; 1 level oynadım herkes 4 puan aldı", "hep 8 puan arkamda") [S4][S12]. Zorunlu katılım ("lige zorlanıyorum") [S12].
- **Daily Challenge**: aylık takvim; ay sonunda "monthly bonus trophy" [S1][S17]. **Daily Streak** sayacı [S17].
- **Koleksiyon**: yok. Şekilli event tahtaları (bkz. Event takvimi) koleksiyon hissini kısmen veriyor (tahmin).
- Hesap/giriş yok, tamamen offline çalışıyor [S1][S3].

## Event takvimi

App Store/Google Play "in-app events" kayıtlarından (SocialPeta) [S18]. Hepsi tematik, **şekilli tahta** serisi; ~2 haftalık, çoğu zaman 2 event üst üste biniyor:

| Event | Tarih (2026) | Tema |
|---|---|---|
| Maze Mastermind | 30 May – 14 Haz | labirent/çeşme |
| Lotus Zen Realm | 14 – 28 Haz | lotus |
| Maze Ball, MVP Awaits! | 28 Haz – 21 Tem | futbol/top |
| Summer Night Light | 16 Tem – 3 Ağu | havai fişek |
| Bond of Vows | 3 – 17 Ağu | düğün mandala |
| Wish Upon the Star / It's Time for Kites! | 12 – 25 Ağu | Perseid yıldızı / uçurtma |
| Paddle to Glory / Spot the Hidden Pet! | 24 Ağu – 8 Eyl | yılan kayığı / köpek silueti |
| Labor Day Grill Party | 8 – 21 Eyl | BBQ |
| Autumn Carnival | 21 Eyl – 5 Eki | karnaval |
| One More Sky to Cross | 5 – 26 Eki | kuş göçü |
| Escape the Halloween Maze! | Eki (aktif) | cadılar bayramı şatosu |

Ayrıca yorumlarda: "Spring battle" (bahar event'i, bitince yerine yenisi gelmedi şikâyeti), Labor Day puzzle'ları, satranç taşı şekilleri, "colored worm challenge", 10 levellik zamanlı challenge'lar ("reklamlar yüzünden süre bitiyor") [S12][S13]. Ödül yapısı ve modifier'lar bilinmiyor (Eksik veri). Ritim: **aylık 2 event, 2 haftalık süre, takvim/bayram bağlantılı**.

## Ekonomi

- **Kalp**: level başına 3 (One Chance'ta 1). Level bitince sıfırlanır; kalıcı can havuzu / enerji sistemi **yok** [S12][S16]. 0 kalp → rewarded ad ile 3 kalp yenile veya restart [S12].
- **İpucu**: ampul butonu, sınırlı sayı ekranda; bitince rewarded ad ile kazanılır [S3][S12]. Ne gösterdiği net değil (tahmin: hareket edebilen bir oku işaretliyor).
- **Guidance**: sınırsız, bedava, long-press [S1].
- **Coin / para / booster / pass**: yok. Oyuncular "coin kazanmak zorunda değilsin, ipucu satın almak yok" diye övüyor [S12]. Storr: "hyper-casual, IAP ekonomisi yok; coin ekonomisi, power-up, streak, yarışma, koleksiyon katmanları henüz üstüne konmamış" [S8].
- **Günlük bedava akış**: daily challenge + streak; başka bir "günlük hediye" raporu yok.

## Monetizasyon

- **IAP**: iki store'da da listelenmiyor; "no-ads" satın alma yok. En çok istenen özellik (yorumlarda £9.99 / $3.99–5.99 lifetime teklifleri) [S3][S12][S13]. Geliştirici yanıtı: "öneri ekibe iletildi" [S13]. Bir üçüncü parti rehber "tek seferlik No Ads var" diyor ama store ile çelişiyor; **güvenilmez** [S15].
- **Interstitial**: ana gelir. Başlangıç: ~L10–20 (yorumlar L10, L15, L16, "ilk 20") [S12][S13][S15]. Tetik: her level sonrası; bir oyuncu kontrollü test etmiş — **level ≥60 sn sürdüyse** reklam, 59 sn'de yok [S12]. Uygulama açılışında da interstitial [S12]. Uzunluk: 30 sn–2 dk, playable/interaktif, çoklu kapatma ekranı [S12]. Fail sonrası "Restart" bile interstitial gösteriyor [S12][S13]. Yorumların baskın şikâyeti; GameTrending'de iOS yorumlarının %40'ı negatif, ana sebep bu [S19].
- **Rewarded**: (a) 0 kalpte continue, (b) ipucu. İkisi de "uygun ve adil" bulunuyor [S12].
- **Display banner**: Hiçbir kaynak kalıcı banner reklam tarif etmiyor; "banner" kelimesi yorumlarda yalnızca kayan oyuncu-istatistik baloncukları için kullanılıyor. **Tahmin: gameplay'de display banner yok**; alt %15 boş alan olasılıkla rezerv. Doğrulama için ekran görüntüsü lazım (Eksik veri).
- **Agresiflik**: **sert**. "Yarı oyun yarı reklam", "oyun süresinin %50'sinden fazlası reklam" ölçümleri [S12]. UA kreatifleri "No annoying ads" vaat ediyor; yorumlar bunu yalan sayıyor [S4][S12]. Gelir: ~$500K+/ay tahmini, %100 reklam [S5]; 24 reklam SDK'sı [S5].

## Retention mekanizmaları

- Daily challenge (aylık takvim, trophy) + daily streak [S1][S17].
- Lig/turnuva: 24 saatlik tur, terfi/düşme, gün atlayınca düşme → oyuncuyu her gün geri çağırıyor; ama "sahte rakip" algısı ve "rahatlatıcı oyun bana düştüğümü söylüyor" tepkisi [S3][S12].
- 2 haftalık tematik event'ler [S18].
- Sosyal: "chat" özelliği var (yanıt gelmiyor şikâyeti) [S4]; arkadaş/paylaşım yok.
- Push bildirim rapor edilmedi (Eksik veri).
- Pozitif retention'ın asıl kaynağı yorumlarda hep aynı: "bir level daha", "sakinleştirici", "offline uçakta oynanıyor" [S3][S12].

## Bize uyarlanabilirlik

Karşılaştırma tabanı: `docs/game/mechanic.md` (20×25 tahta, PER 5, 5 can, 3 ipucu, hedef hücre ~%50–55) ve `docs/game/pillars.md`.

| Kalıp | Aynen / Değiştirerek / Alınmaz | Neden (pillar referansı) | Hangi agent'ı ilgilendirir |
|---|---|---|---|
| **Tek tap, sürükleme/seçme/onay yok**; store'un tüm vaadi bu | Aynen | Pillar 1 "Tek dokunuş, tam ödül" ile birebir. Amaze GO!'nun 100M+ kurulumu bu eşiğin ticari kanıtı. | gameplay, ux |
| **Yanlış tap → hücre kalıcı kırmızı işaretli kalır** (ok tahtada kalıyor, hata görünür) | Değiştirerek | Pillar 3 "Ceza adil, görünür ve anında": prototipte 350 ms kızar-salla sonra iz kalmıyor; Amaze GO! hatayı tahtada bırakıyor, böylece oyuncu aynı dolgu hücresine ikinci kez basmıyor ve "neden can gitti" sorusu kalmıyor. Tap Words'te dolgu hücresi solgun/kırmızı nokta ile işaretlenebilir. Pillar 5 (tahta sakin) ile gerilim: işaret küçük ve nötr olmalı. | ux, gameplay |
| **3 kalp, level başına sıfırlanır, kalıcı can havuzu yok** | Değiştirerek | Prototipte MAXL=5 ve hedef oranı ~%55 → can zayıf fren (mechanic.md#açık-konular, E1 ertelendi). Amaze GO! 3 kalp + ~%10–30 serbest ok oranıyla (tahmin) hatayı anlamlı tutuyor. Sayı kararı E1 açılınca; ama "level başına sıfırlanan kalp, enerji yok" modeli Pillar 6 ile uyumlu ve offline/sakin konumlandırmayı koruyor. | gameplay, liveops |
| **Perfect run** (hatasız bitirme) kavramı + sonuç kartında yıldız/süre | Değiştirerek | Prototipte level sonu tek ekran, yıldız/puan/süre yok (mechanic.md#açık-konular). "Hatasız level" rozeti Pillar 4 "Bulmak koleksiyondur" ile uyumlu; ama puan formülünü gizli tutma (Amaze GO! hatası: oyuncu "neden bazen 3K bazen 30K" diye soruyor) yapılmamalı. Süreyi HUD'da göstermek Pillar 6'ya aykırı (sahte zaman baskısı) → sadece sonuçta. | ux, gameplay, liveops |
| **Long-press Guidance** (bedava, sınırsız, kalp harcamaz, rota gösterir) | Değiştirerek | Tap Words karşılığı: harfe basılı tutunca o harfin ait olduğu yerleşimin tamamı mı, yoksa sadece "bu harf hedef mi/dolgu mu" bilgisi mi gösterilecek? İlki ipucuyu bedavaya çıkarır (ipucu ekonomisini öldürür), ikincisi can mekaniğini boşa çıkarır. Muhtemel uyarlama: long-press sadece **chip** üzerinde → o kelimenin açılmış yerleşimlerini vurgular (hafıza yardımı, bilgi sızdırmaz). Pillar 1 ile çatışmaz çünkü zorunlu adım değil. | gameplay, ux |
| **HUD minimal**: level no, kalp, ipucu; puan/coin/hedef listesi yok; tahtanın boşalması = ilerleme | Değiştirerek | Pillar 5 "Tahta sakin, UI konuşur". Tap Words'te chip alanı (10 kelime × bulunan/PER) zorunlu bilgi, kaldırılamaz; ama onun dışında HUD'a hiçbir şey eklenmemeli. Banner alanı (ADR-0002) zaten var; Amaze GO!'nun alt %15 boş alanı bunun bir benzeri. | ux |
| **Whoosh + tek ses, konfeti yok; "ASMR" tonlu feedback** | Aynen | Pillar 4: zincir (şerit → uçuş → sayaç) korunur, ama her adım tek, kısa, düşük frekanslı ses. Amaze GO!'nun sonradan eklediği konfeti/emoji/voice-over'ın yorum puanını düşürmesi karşı-kanıt. | ux |
| **Idle nudge** ("şu an X ok hareket edebilir") | Değiştirerek | Tap Words karşılığı "kalan N yerleşim" zaten chip'lerde görünüyor; ek nudge gereksiz. Ama **kapatılamayan** nudge'ın oyuncu kaybettirdiği Amaze GO!'da kanıtlı → eklenecek her otomatik yardım ayarlardan kapatılabilir olmalı. | ux |
| **Level öncesi kart: zorluk etiketi** (Simple/Hard/Extreme/One Chance) | Değiştirerek | Pillar 7 "level hissi tartışılır": etiket oyuncunun seans planlamasına yardım ediyor ("Extreme'se şimdi başlamam"). Tap Words'te tema adı + zorluk etiketi birlikte gösterilebilir. **"%X geçemedi" istatistiği alınmaz**: uydurma olduğu yorumlarda hesapla yakalanmış, güven kaybı. | level-design, ux |
| **Interstitial her levelde / ≥60 sn kuralı; Restart'ta bile reklam** | Alınmaz | Yorumların en büyük şikâyeti ve iOS negatif oranının (%40) ana sebebi. Tap Words'ün ADR-0002 banner modeli zaten farklı. Interstitial zamanlaması Word Search Explorer referansından (L24 civarı) alınacak; "fail'de restart reklamsız" Amaze GO!'nun övülen tek tarafı → **o kısım aynen**. | liveops |
| **Rewarded: 0 canda continue, ipucu için reklam** | Aynen | Yorumlarda tek "adil" bulunan reklam yerleşimi. Tap Words'te "can 0 → reklam izle, 5 can" ve "ipucu bitti → reklam" doğrudan uygulanabilir. | liveops |
| **Kayan oyuncu-istatistik banner'ları, sahte lig rakipleri, zorunlu lig** | Alınmaz | Pillar 5 doğrudan ihlal (tahtanın üstünü kapatıyor) ve Pillar 3 (sahte veri = adil değil). Amaze GO!'nun "Disappointed" 5★ yorumu: "rahatlatıcı puzzle bana düştüğümü söylüyor". Lig eklenirse opsiyonel ve gerçek rakipli olmalı. | liveops |
| **Auto-clear** (oyun serbest kalan parçayı kendisi gönderiyor) | Alınmaz | Tap Words'te karşılığı "kalan son yerleşimi otomatik aç" olurdu; Pillar 1 ve 4'ü boşa çıkarır (ödül oyuncunun). Amaze GO!'da Ağu–Eyl 2026 sonrası tap/pan karışmasını da artırdı (Pillar 2 ihlali). | gameplay |
| **Level başında otomatik zoom-in** | Alınmaz | Pillar 2 ve okunabilirlik: oyuncu önce bütünü görmek istiyor. Prototipin "sığdır" başlangıcı doğru; fit-to-screen butonu eklenmeli (Amaze GO!'da yok, en çok istenen kamera özelliği). 20×25 tahtanın sığdır hâlinde okunamaması ayrı sorun (open-questions #4). | ux, prototype |
| **Zorluk = parça küçültme + ekranı aşan tahta** | Alınmaz | Pillar 6 "zorluk parametreyle gelir, hileyle değil": Amaze GO! yorumları "zorluk sadece okları küçültmekten geliyor" diyor. Tap Words'te grid büyümesi mobil okunabilirlik sınırıyla (mechanic.md#zorluk-kaldıraçları) kısıtlanır; zorluk PER/yön/uzunluk'tan gelir. | level-design |
| **2 haftalık tematik şekilli-tahta event'leri** | Değiştirerek | Tap Words'te şekil yerine **tema kelime paketi** (Halloween kelimeleri, bayram) aynı rolü oynar ve generator sayesinde bedava (Pillar 7). Takvim ritmi (aylık 2, 2 hafta, bayram bağlantılı) aynen alınabilir. | liveops, level-design |
| **Daily challenge + aylık trophy + streak** | Değiştirerek | Seed'li üretim gerektirir (open-questions #5). Amaze GO!'da sade ve işe yarıyor; Tap Words'te "günlük tahta" doğal karşılık. | liveops, prototype |

**Özet yargı:** Amaze GO!'nun çekirdeği (tek tap, 3 kalp, whoosh, boş HUD, offline) Tap Words pillar'larının neredeyse birebir dış kanıtı. Yaz 2026 sonrası eklenen her "büyüme" katmanı (banner, konfeti, auto-clear, sahte lig, her levelde interstitial) yorum puanını düşürdü; bu, **neyi eklemeyeceğimizin** listesi olarak en az çekirdek kadar değerli.

## Eksik veri

| Zayıf başlık | Ne gelirse güçlenir |
|---|---|
| HUD ve ekran akışı (hangi öğe nerede, boyutlar, alt %15'in içeriği) | 5–6 ekran görüntüsü: ana ekran, level öncesi kart, gameplay (zoom-out ve zoom-in), fail kartı, sonuç kartı, ayarlar → `raw/amaze-go/screens/` |
| Display banner var mı, varsa konumu ve başlangıç leveli | L1, L15, L25 gameplay ekran görüntüsü (ADR-0002 kararı için kritik) |
| Feedback zinciri süreleri (whoosh animasyonu kaç ms, kırmızıya dönüş, kalp kaybı animasyonu) | 60 fps ekran kaydı, L1–L5 (ilk 3 dk) |
| Grid boyutları ve ok sayısı levele göre | L1, L10, L50, L100, L200 ekran görüntüsü; mümkünse APK'dan level dosyası şeması (yapı, asset değil) |
| İpucunun ne gösterdiği; ipucu başlangıç sayısı; rewarded ile kaç ipucu | Playtest notu (Utku): L1–L30, her rewarded teklifi ve ipucu kullanımı not edilerek |
| Puan/yıldız formülü, harf notları (S/A) | Aynı playtest; 5 levelın sonuç kartı fotoğrafı |
| Event ödül yapısı ve modifier'ları | Aktif Halloween event'inin ekran görüntüleri; event içi level akışı |
| Lig puanlama, tur süresi, düşme kuralları | Lig ekranı görüntüleri 2 gün arayla |
| Push bildirim, geri çağırma metinleri | 3 gün oynamadan bekleyip bildirimleri kaydetme |
| Tap/pan eşikleri (px, ms) | Ölçülemez; sadece davranış gözlemi — ekran kaydında "kaydırırken ok gitti mi" |

## Kaynaklar

- [S1] App Store (US) listesi ve yorumlar — https://apps.apple.com/us/app/amaze-go/id6758326278 (26 Eki 2026)
- [S2] Google Play listesi ve yorumlar — https://play.google.com/store/apps/details?id=com.oakever.arrows (26 Eki 2026)
- [S3] iOSAppLists, "Amaze GO! Review 2026: A Calm Arrow Puzzle, Loud Ads" (16 Eki 2026) — https://iosapplists.com/amaze-go-review-2026/
- [S4] Google Play yorumları (Stev Anderson, Kevan Allisen, Lawrie Cherniack, Stephen Campbell, Raphael L., MJK, Thomas Lister-Looker; Ağu–Eyl 2026) — [S2] üzerinden
- [S5] AppGoblin Android analytics — https://www.appgoblin.info/apps/com.oakever.arrows
- [S6] AppGazers — https://appgazers.com/reports/apps/android-com.oakever.arrows ; AppInsider — https://appinsider.io/apps/amaze-go-6758326278
- [S7] GamingPicked, "Amaze GO! Explained" (21 Eki 2026) — https://www.gamingpicked.com/guides/amaze-go/
- [S8] Tom Storr / Gamigion, "Arrows Puzzle Escape and Amaze GO hit 50M Downloads in May!" (15 Haz 2026) — https://www.gamigion.com/arrows-puzzle-escape-and-amaze-go-hit-50m-downloads-in-may/ (LinkedIn kopyası üzerinden okundu)
- [S9] Mobilegamer.biz, "2026's top 10 mobile game downloads (so far)" — https://mobilegamer.biz/2026s-top-10-mobile-game-downloads-so-far-free-fire-max-block-blast-roblox-arrows-more/
- [S10] Mobilegamer.biz, "Data digest: Miniclip, Learnings and Tripledot top July's US ad revenue chart" — https://mobilegamer.biz/data-digest-miniclip-learnings-and-tripledot-top-julys-us-ad-revenue-chart-smash-fest-stats-fundraising-news-more/
- [S11] SocialPeta (Google Play) — https://socialpeta.com/en/google-play/com.oakever.arrows
- [S12] App Store (US) tüm yorum dökümü, v1.5.0–v1.35.0 (Nis–Eki 2026), Chartoo aynası — https://www.chartoo.com/itunes/app/6758326278-amaze-go ; StoreTally — https://storetally.com/apple/6758326278/amaze-go
- [S13] App Store (GB) yorumları ve geliştirici yanıtları — https://apps.apple.com/gb/app/amaze-go/id6758326278?see-all=reviews
- [S14] App Store (GB) / Google Play (IE) store metni "line / sliding puzzle" varyantı — https://apps.apple.com/gb/app/amaze-go/id6758326278
- [S15] iofreeonline walkthrough (düşük güvenilirlik; "Undo" ve "No Ads IAP" iddiaları store ile çelişiyor) — https://www.iofreeonline.com/IOS/game/Arrows-GO/pages/Walkthrough.html ; Nova's Puzzle Den level listesi (890) — https://www.novaspuzzleden.com/games/Amaze-Go
- [S16] Logic Loft Games, "Amaze Go: Addictive and Frustrating in Equal Measure" (18 Ağu 2026, güncelleme 22 Eyl) — https://www.logicloftgames.com/blog/amaze-go-addictive-and-frustrating-in-equal-measure/
- [S17] Cyberscore chart listesi (Daily Streak, Daily Challenge aylık, Event – Countryside Caper) — https://cyberscore.me.uk/games/3890
- [S18] SocialPeta (App Store) in-app events listesi — https://socialpeta.com/en/app-store/6758326278
- [S19] GameTrending — https://gametrending.com/games/amaze-go/
- Geliştirici sayfası: https://oakevergames.com/ ("minimalist arrow-routing puzzle that strips away visual noise … calm, fully offline flow"; A/B test ve entegre monetizasyon yayıncılık hizmeti)

## APK analizi (2026-10-26, v1.35.0)

Kaynak: cihazdan çekilen APK, `raw/amaze-go/extracted/` (3 CSV + README). Unity 6; level JSON'ları ve 325 config tablosu açıldı; A/B deney parametreleri düz metin. Çelişkide bu bölüm geçerlidir.

### Level verisi
- **21.763 tahta** pakette (gzip JSON: `XSize, YSize, Arrows[{Points}]`). Ana havuz 11.742 tahta; ayrıca Guide, Daily, Arrow3D, TimeAttack, ComeBack ("geri dönen kullanıcı" kolay tahtaları), Relief (zorluk sonrası nefes), Warmup, Handmade, tema paketleri.
- **Sabit merdiven yok.** `LevelsDifficulty` tablosu her level numarasına bir **tier** atar (1 normal, 2 hard, 3 super hard, 4 nightmare); tahta o tier'ın havuzundan seçilir (`LevelAttr`: tahta → tier, ok sayısı). `DynT1–T4 × A/B/C` tabloları dinamik zorluk havuzları (performansa göre alt havuz — tahmin).
- Tier başına ok sayısı (ortalama): **normal 59 · hard 113 · super hard 146 · nightmare 172** (havuz `LevelAttr12`, 5926 tahta). Grid: normal ~16–23 × 22–32, hard+ ~1400–1900 hücre. Dolu hücre oranı **~%47–49 sabit** (nightmare %60).
- Eski/alternatif sabit merdiven `AllLevel` (964 level): ok sayısı **30 → 61 neredeyse lineer** (+1 ok / ~2–3 level), grid 368 → 640 hücre, dolu %46–49 sabit. L1 bile 30 ok; FTUE ayrı `GuideLevels`.

### Tier ritmi (L1–300, 6 varyant — A/B)
| Varyant | normal/hard/sh/nm | hard+ aralığı | İlk hard / sh / nm | Örüntü (L1–20) |
|---|---|---|---|---|
| base | 201/67/20/12 | ort. 3,0 (1–10, düzensiz) | L3 / L4 / L60 | 11231111221112111223 |
| 1 | 210/60/24/6 | 3–4 (düzenli) | L3 / L10 / L50 | 11211211131121121113 |
| 2 | 180/60/30/30 | 2–3 | L3 / L5 / L10 | 11213112141121311214 |
| 3 (en yumuşak) | 240/30/15/15 | tam 5 | L5 / L10 / L20 | 11112111131111211114 |
| 4 (en sert) | 164/55/54/27 | 1–3 | L3 / L5 / L11 | 11213131124112131311 |
| 5 | 175/50/50/25 | 2–3 | L2 / L5 / L10 | 12113121141312113121 |

- Her 50 levelda hard+ sayısı sabit (10 / 15 / 20 / 22) → ritim periyodik, "ilerledikçe zorlaşma" tier dağılımında yok; zorlaşma tier içi ok sayısıyla.
- "Zor leveli kolay izler" kuralı burada da var: hard+ ardışık gelmiyor (varyant 4 hariç).

### Hedef kazanma oranı
`firstwinrate` (3833 tahta, ilk denemede kazanma hedefi/ölçümü): **normal 0,69 · hard 0,58 · super hard 0,55 · nightmare 0,51.** Ayrıca `normalbeatplayerperce`/`dcbeatplayerpercent` ("oyuncuların %X'ini geçtin" sosyal kanıt metni için tablo) ve `difficultyspikes` (4 satır).

### Deney parametreleri (`abtest_config.json`, 52 deney) — monetizasyon ve UX
- **`BannerOpen: Banner;0 | 1 | 3`** → banner **L0–3'te** açılıyor (A/B). Web kaynağındaki "display banner yok (tahmin)" **yanlış**; banner var ve neredeyse ilk levelden itibaren.
- `inter_unlock_level_new: 4 | 5 | 14`; `reward_unlock_level: 5 | 15`; `inter_cd_new: 30–60 s`; `inter_cd_dynamic` örn. `"180;150;120;90;75;60;40;60;30;0"` (oturum/level ilerledikçe azalan cooldown); `inter_fail_strategy: level_progress | level_progress_all | no` (fail sonrası interstitial); `inter_extra_protect: new_cd_and_session_2/4/5`; `inter_online_strategy: noads_after_reward_115_115 | 309_309`.
- UX deneyleri: `ArrowLongPressExperience` (8–11), `DoubleClick` (çift tık zoom, 0–4), `FocusModeLogic` (0–5), `MainGameQuickPass` (0–5), `MainGameReviveLogic` (104, 210–214) / `MainGameReviveUI` (1, 14–16) → RV ile devam, `MainBoardGameTipUI` (13–17), `MainGameStyleUI` (8, 13–15), `LightningPropLogic` (0–5, yeni prop), `SharkRunLogic`, `LeagueRankRobot*` (lig botları), `OneLineMiniGame`, `Push`.
- Config sheet adları tek başına UX yol haritası veriyor: `touchprotect` (5), `touchcd` (2; 0,5 s / 0,7 s cooldown), `erroreffectconfigdata`, `farerrorconfigdata`, `earlyerrorfx`, `newbieautohintconfigdata`, `mainboardhintlogic` (24), `hintadconfigdata`, `onelife` (23; tek can modu), `reviveadconfigdata`, `zoomrange` (10), `doubleclickzoomconfigdata`, `dragconfigdata`, `assistlineconfigdata`, `comboconfigdata`/`comboencourage`, `encourageconfigdata`, `firstclickcheer`, `fullhpsucconfigdata`/`onehpsucconfigdata` (tam can / tek can ile bitirme kutlaması), `winstreak`, `pinata*`, `danmaku` (akan yorum), `rateustest` (30), `survey`, `botconfig` (22.500 satır lig botu), `botnickname`.

### Tap Words için düzeltilmiş çeviri
- **Banner L0–3'ten itibaren** → ADR-0002 için "alan L1'den ayrılır, reklam erken açılır" seçeneğinin ticari kanıtı Amaze GO!'da da var; interstitial L4–14, rewarded L5–15.
- Zorluk mimarisi: **tier ritmi + tier havuzu**, sabit eğri değil. Tap Words'te eşdeğeri: level numarasına tier atayan kısa bir dizi (ör. `1121121113` periyodik) + tier başına parametre seti (grid, kelime, ters oranı). Generator parametrik olduğu için havuz yerine tier→parametre yeter.
- Hedef ilk-deneme kazanma: normal %69, hard %58, super hard %55. Tap Words fail-rate hedefleri için doğrudan referans.
- Hard+ ardışık gelmez; en yumuşak varyant 5 levelde bir zor; en sert 2–3'te bir. İlk zor level L3–5 (çok erken), nightmare L10–60.
- `ComeBackLevels` (geri dönen kullanıcıya kolay tahta) ve `Relief` (zor sonrası nefes) ayrı havuzlar: LiveOps/level-design için kalıp.
- `touchcd` 0,5–0,7 s dokunma cooldown'u ve `touchprotect`: yanlış dokunuşu önlemek için input katmanı; pillar 2/3 için somut referans.
