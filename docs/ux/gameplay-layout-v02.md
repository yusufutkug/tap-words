# Gameplay ekranı yerleşimi v02 — Amaze GO! APK verisiyle revizyon

- Tarih / sürüm: 2026-10-26, prototip v18; v01 → v02
- Alan: ux
- Problem: v01 Amaze GO!'yu yalnızca web kaynaklarıyla okudu; APK analizi (`docs/references/amaze-go.md#apk-analizi`) banner iddiasını çürüttü ve input/feedback katmanının gerçek parametrelerini açtı. v01'in dayandığı yanlış varsayımlar düzeltilir, yeni veriden türeyen input/feedback önerileri eklenir.
- İlgili ADR: ADR-0001, ADR-0002.
- Önceki sürüm: `docs/ux/gameplay-layout-v01.md` (silinmedi; burada "v01 geçerli" denen bölümler oradan okunur).
- Prototip koduna dokunulmadı.

Sayı notu: APK config tabloları şemasız binary; aşağıda "(APK)" etiketli değerler `raw/amaze-go/extracted/config/config` içinden float olarak çözüldü, alan anlamları **tahmin**. A/B deney id'leri `abtest_config.json`'dan, kesin.

## v01'den farklar

| # | v01 | v02 | Neden |
|---|---|---|---|
| 1 | Amaze GO!'da display banner yok (tahmin); alt %15 boşluk "muhtemelen rezerv" | **Banner var, `BannerOpen: Banner;0/1/3` → L0–3'ten itibaren**; aktif strateji v1.14+ için `Banner;1`. Alt %15 = banner + güvenlik payı | APK |
| 2 | Banner rezervi L1'den, reklam açılışı WSE'ye göre ~L11–13 (liveops'a) | Rezerv L1'den **değişmedi**; açılış için iki referans ucu var: Amaze GO! L1, WSE L10–13. UX görüşü: açılış levelı yerleşimi etkilemez, karar /liveops (#12 güncellendi). Fail kartı → interstitial (`inter_fail_strategy`) için UX notu eklendi (§1) | APK |
| 3 | Ölü bölge 12 pt, yedek 24 pt içe kaydırma | Aynı; Amaze GO!'nun ~%15 (≈127 pt) etkileşimsiz alanı banner 50–90 + **37–77 pt pay** demek → 24 pt yedek muhtemelen devreye girer; placeholder ölçümü (v01 P1) öncelik | APK + çıkarım |
| 4 | Tap/pan eşiği 6 px / 600 ms prototipten alındı, öneri yok | **Yeni §2**: yanlış tap sonrası 500 ms giriş kilidi (`touchprotect`/`touchcd` kalıbı), sürükleme eşiği 6 px → 8 pt (`dragconfigdata` ≈ 0,009 × ekran ≈ 7,6 pt), tap süresi 600 → 350 ms (chip long-press'e yer açar) | APK |
| 5 | Zoom: `+`/`−` yerine "sığdır" butonu | Aynı + **çift tık zoom alınmaz** (gerekçe §2.3), zoom tavanı ×5 → **×2,5** (17 sütunda hücre 50 pt yeter; Amaze GO! `zoomrange` 2,1–4,0 / 2,1–5,5 aralık oranı ≈ 1,9–2,6×) | APK + 17 sütun kararı |
| 6 | Feedback: zincir korunur, süre önerisi yok | **Yeni §3**: can kaybı görsel zinciri (`hpfloateffect`/`hpuiconfigdata`), kombo bump (`comboconfigdata` 1,0–1,5 s), ilk bulma (`firstclickcheer`), erken hata coach (`earlyerrorfx`), L1–2 boşta otomatik ipucu pulse'u (`newbieautohintconfigdata` 15–30 s), level sonu başlığı (`fullhpsuc`/`onehpsuc`). Can sayısı/cezası yok | APK |
| 7 | HUD: Amaze GO! = level no + kalp + ampul | Aynı; **§4** QuickPass / FocusMode / BoardTipUI / StyleUI deneyleri değerlendirildi — biri hariç alınmaz | APK |
| 8 | Chip: 10 kelime sabit, Seçenek C 2 satır 48 pt | Kelime sayısı tier'a göre **5–10**; 5 kolon C düzeninde 5 → 1 satır, 6–10 → 2 satır; **alan 48 pt sabit kalır** (§5). 17×26 tahtayla genişlik kontrolü yapıldı | curve-v02 (yazılıyor) |
| 9 | Okunabilirlik, ekran bütçesi, HUD sadeleştirme, kalıcı hata işareti notu, prototip görevi P1/P2 | **v01 geçerli** (§1.1–1.2, §2, §3.1, §4, §6 v01). P2'ye §2–3'teki parametreler eklendi (§6 burada) | — |

## 1. Banner (v01 §1.3 revizyonu)

v01'in karar kısmı geçerli: **alt, 50 pt sabit rezerv, L1'den itibaren, viewport–banner arası 12 pt ölü bölge.** Değişen yalnızca referans ve iki not.

**Referans düzeltmesi.** `docs/references/amaze-go.md#apk-analizi`: `BannerOpen: Banner;0 | 1 | 3`, aktif strateji v1.14+ `Banner;1` → banner **L1'den** açık. v01'in "Amaze GO!'da banner yok, alt %15 rezerv tahmini" cümlesi düşer; yerine: Amaze GO! gameplay'in altında L1'den itibaren banner taşıyor ve tahtanın alt ~%15'ini (≈127 pt @844) etkileşimsiz bırakıyor. 50–90 pt banner düşülünce **37–77 pt** güvenlik payı kalıyor. Yani v01'deki 12 pt ölü bölge Amaze GO!'nun 3–6 katı altında; 24 pt içe kaydırma yedeği (v01 §1.3 A) büyük ihtimalle gerekecek. Placeholder dokunuş sayacı (v01 P1) bu yüzden ilk ölçülecek şey.

**Not 1 — reklam açılış levelı.** İki referans iki uçta: Amaze GO! L1 (A/B'de L0–3), WSE L10–13. Yerleşim her iki durumda aynı (rezerv L1'den). UX tarafından tek şart: açılış **level sınırında** olur, level içinde banner belirmez (`fit()` zıplamaz). Karar /liveops; #12 güncellendi.

**Not 2 — fail kartı ve interstitial.** `inter_fail_strategy: level_progress | level_progress_all | no` → Amaze GO! fail sonrası interstitial gösterimini A/B'liyor; yorumlarda "Restart'ta bile reklam" en sert şikâyet (`amaze-go.md#monetizasyon`). UX görüşü: fail kartında oyuncu bir butona basmadan reklam gelmez; "Tekrar oyna" reklamsız (v01'de de "aynen" denen tek Amaze GO! övgüsü). `inter_cd_dynamic` ("180;150;…;0" — oturum ilerledikçe azalan cooldown) /liveops konusu; UX etkisi: level sonu kartı en az **1,5 s** ekranda kalmadan interstitial başlamaz (Amaze GO! şikâyeti: "kart okunamıyor").

## 2. Input katmanı (yeni)

Prototip: tek parmak, < 6 px ve < 600 ms → tap; aksi pan; iki parmak pinch; zoom `minScale`–×5 (`mechanic.md#kamera-ve-input`). Amaze GO! APK input tabloları: `touchcd` (2 satır: 0,5 s / 0,7 s; aktif `TouchCd;1`), `touchprotect` (5 satır; 0,3–0,7 s pencereler), `dragconfigdata` (6 satır; eşik 0,009 / 0,014 / 0,018 ekran oranı, atalet 0,12 / 0,08 / 0,05, 120), `doubleclickzoomconfigdata` (5 varyant, `DoubleClick` 0–4; aralık 0,15 / 0,30 s, 0,25 s, 50 px), `zoomrange` (çözülen 2 satır: 2,1–4,0 ve 2,1–5,5), `assistlineconfigdata`, `ArrowLongPressExperience` (0, 8–11).

### 2.1 Yanlış tap sonrası giriş kilidi

#### Öneri
Dolgu hücresine dokunuştan sonra **500 ms** boyunca tahtaya gelen tap'ler yok sayılır (pan/pinch serbest); kilit süresi boyunca hücre `--wrong` zemini korur (bugün 350 ms'de temizleniyor → 500 ms'e uzar). Doğru tap sonrası kilit **yok**.

#### Gerekçe
Amaze GO! yanlış dokunuşu input katmanında da frenliyor: `touchcd` 0,5–0,7 s genel dokunma cooldown'u + `touchprotect` 0,3–0,7 s koruma pencereleri (APK, alan anlamı tahmin). Tap Words'te yanlış tap'ın tipik ikinci hatası "aynı yere/komşuya refleks ikinci dokunuş" (parmak sektirme, çift tık alışkanlığı); bu dokunuş karar değil tepkidir ve Pillar 3 ("ceza adil") açısından haksız ceza üretir. Doğru tap'e kilit koymamak Pillar 4'ün hızlı ardışık bulma hissini korur; Amaze GO!'nun genel cooldown'unu almıyoruz çünkü orada ok animasyonu 0,5 s sürüyor, bizde doğru tap sonrası açılmış hücre zaten tekrar dokunulsa no-op.

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `touchcd`, `touchprotect`; `#ux-kalıpları` → auto-clear sonrası tap/pan karışması şikâyeti (input katmanının önemi).

#### Trade-off
- Kilit süresinde bilinçli ikinci yanlış tap da cezasız → teknik olarak "bedava hata" 500 ms; sayısal etki ihmal edilebilir (reaksiyon süresi + nişan > 500 ms) ama **E1'e dokunup dokunmadığını /gameplay teyit etmeli** (soru #15).
- Pillar 1: dokunuşa adım eklemez, sadece 500 ms pencerede dokunuşu yutar. Oyuncu "basıyorum olmuyor" hissederse kötü; bu yüzden kilit süresinde hücre kırmızı kalır (görünür neden).
- `prefers-reduced-motion`: sallama zaten kapalı; kırmızı zemin 500 ms statik kalır, kilit aynı.

#### Gerekli görüşler
`/gameplay` (#15): kilit mekanik sayılır mı. `/prototype`: §6.

#### Ölçüm
- "Önceki tap'ten < 500 ms sonra gelen yanlış tap" / toplam yanlış tap: bugün ölçülmüyor; **önce ölçülür** (P1'e log eklenir), ≥ %10 ise kilit açılır. Kilit sonrası bu oran 0.
- Yanlış tap / level: kilit sonrası ≥ %10 düşüş.
- "Basıyorum olmuyor" şikâyeti (playtest): 0.

### 2.2 Tap/pan eşikleri

#### Öneri
Sürükleme eşiği 6 px → **8 pt** (`devicePixelRatio`'dan bağımsız CSS pt); tap süre üst sınırı 600 → **350 ms**; pan bittikten sonra **120 ms** içinde gelen pointerdown tap sayılmaz (pan kuyruğu koruması).

#### Gerekçe
`dragconfigdata` eşiği 0,009 × ekran yüksekliği ≈ 7,6 pt @844 (tahmin: normalize mesafe); prototipin 6 px'i aynı bantta, 8 pt'ye yuvarlamak yüksek ppi cihazlarda titrek parmağı pan saymamayı garanti eder. 600 ms çok uzun: chip'e long-press (Guidance uyarlaması, `ArrowLongPressExperience` 8–11 varyant, #14) gelirse long-press eşiği 400–500 ms olur ve tap ile çakışır; tap'i 350 ms'de kesmek ikisini ayırır (tipik tap 80–200 ms). 120 ms pan kuyruğu: `dragconfigdata`'daki 120 değeri (tahmin: ms) ile uyumlu; parmak kalkarken ikinci parmağın/aynı parmağın tekrar değmesi tap üretmesin (Pillar 2).

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `dragconfigdata`, `ArrowLongPressExperience`; `#ux-kalıpları` → erken sürüm övgüsü "kaydırırken ok göndermiyor".

#### Trade-off
- 350 ms: yavaş/yaşlı oyuncu basılı tutup bırakıyorsa tap kaçar; WSE hedef kitlesi senior. Playtest'te 350 ms'de kaçan tap oranı > %2 ise 450 ms.
- `prefers-reduced-motion`: etkilenmez.

#### Gerekli görüşler
Yok (long-press kararı #14'te).

#### Ölçüm
- "Pan sırasında istenmeyen tap" (pan bitiminden < 300 ms sonra yanlış tap): 0'a yakın.
- Tap kaybı: pointerup süresi 350–600 ms arası kalan, hareketsiz dokunuşların oranı ≤ %2.

### 2.3 Çift tık zoom

#### Öneri
**Alınmaz.** Zoom girişi pinch + "sığdır" butonu (v01 §3.1) olarak kalır; zoom tavanı ×5 → **×2,5**.

#### Gerekçe
Amaze GO! çift tık zoom'u 5 varyantla A/B'liyor (`DoubleClick` 0–4; aralık 0,15 / 0,30 s). Çift tık algısı tek tık'ı en az aralık kadar (150–300 ms) geciktirmeyi gerektirir, yoksa ilk tık zaten işlem olur. Amaze GO!'da ilk tık ok gönderir → onlar da bu gecikmeyi yaşıyor olmalı (varyant sayısı bunu söylüyor). Tap Words'te ilk tık can götürebilen bir karar; her tap'e 150–300 ms gecikme eklemek Pillar 1'in "tek dokunuş, tam ödül" anındalığını bozar, üstelik ikinci tık komşu dolgu hücresine düşerse can gider (Pillar 2/3). Boş alanda çift tık seçeneği yok: PAD 8'e indi, tahta viewport'u dolduruyor.

Zoom tavanı: 17 sütun / 20 pt hücre tabanında ×2,5 = 50 pt hücre, 36 pt harf — en düşük görme keskinliği için yeterli, viewport'ta 7×12 hücre görünür (kaybolma düşük). ×5 = 100 pt hücre, 3,6×6 hücre görünür → "neredeyim" sorunu. Amaze GO! `zoomrange` 2,1–4,0 / 2,1–5,5 → oran 1,9–2,6×, aynı bantta (alan anlamı tahmin).

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `DoubleClick`, `zoomrange`, `ZoomCropFocus`; `#bize-uyarlanabilirlik` → "level başında otomatik zoom-in / Alınmaz".

#### Trade-off
- Tek elle zoom yolu kalmıyor (pinch iki parmak). Yedek: sığdır butonuna **basılı tutma** = ×2,5'e merkezden zoom (400 ms geçiş; reduced-motion anında). Bu buton zaten HUD dışı, tahtaya dokunuşla karışmaz.
- 20 sütun tavanda kalırsa (curve Seçenek B) ×2,5 → 44 pt hücre; hâlâ yeter.

#### Gerekli görüşler
Yok.

#### Ölçüm
- Zoom kullanılan level oranı ve zoom'da geçen süre: 17 sütunda zoom'lu level ≤ %20 hedef; > %40 ise hücre boyutu varsayımı yanlış.
- Zoom sonrası "sığdır"a dönüş süresi medyan ≤ 8 s.

`assistlineconfigdata` (ok rotası yardımcı çizgisi): Tap Words karşılığı kelimenin yolunu göstermek = ipucu; görsel katmanda karşılığı yok, alınmaz.

## 3. Feedback zinciri (yeni; yalnızca görsel/işitsel)

Sınır: can sayısı, ceza miktarı, ipucu adedi değişmez (E1). Aşağıdakiler mevcut zincirin (şerit → uçuş 820 ms → bump 300 ms; yanlış: kızar-salla 350 ms) üstüne süre/piksel ekler.

### 3.1 Can kaybı zinciri

#### Öneri
Yanlış tap'te: (a) hücre kızarır + sallanır (mevcut 350 ms; zemin 500 ms kalır, §2.1), (b) hücrenin üstünden **12 pt kırmızı kalp** 24 pt yukarı süzülüp 400 ms'de söner (`hpfloateffect` kalıbı), (c) HUD'daki kalp **aynı anda** (0 ms gecikme) 200 ms'de `scale .85` + `--line` rengine döner ve 2 px yatay titrer (`hpuiconfigdata`), (d) tek kısa düşük frekanslı ses (≤ 120 ms) + hafif haptic (iOS `.light`). Son 1 can kaldığında HUD kalbi 1,2 s periyotla %100 → %60 opaklık nefes alır (kalıcı, sessiz).

#### Gerekçe
Prototipte can kaybı tahtada 350 ms görünür, HUD'da kalp sessizce sönüyor; oyuncu tahtaya bakarken kalbi kaçırıyor (v01 §1.3 B ölçümü bu şüpheyle yazıldı). Amaze GO! bunu iki ayrı tabloyla (float efekt + HUD kalp UI, 6 ve 8 varyant) ele alıyor; hata **tahtada başlayıp HUD'da biten** bir hareketle anlatılıyor. Süreler Amaze GO!'dan değil, mevcut zincir oranlarından: bulma zinciri 820 + 300 ms, ceza zinciri bunun yarısından kısa olmalı ki ödül > ceza hissi korunsun (Pillar 4), ama tek bakışta fark edilmeli (Pillar 3).

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `hpfloateffect`, `hpuiconfigdata`, `erroreffectconfigdata`; `#ux-kalıpları` → yanlış tap kırmızı + kalp azalır.

#### Trade-off
- Pillar 5: süzülen kalp tahtanın üstünde 400 ms yaşar; küçük (12 pt) ve kısa. Konfeti sınıfına girmez.
- Son can nefesi kalıcı hareket; "sahte zaman baskısı" (Pillar 6) değil ama gerginlik ekler. Ayarlardan kapatılabilir olmalı (Amaze GO! dersi: kapatılamayan nudge).
- `prefers-reduced-motion`: süzülen kalp ve titreme yok; HUD kalbi anında söner; hücre zemini 500 ms statik kırmızı; nefes animasyonu yerine son kalp statik **kırmızı kenarlık 2 px**; ses/haptic kalır.

#### Gerekli görüşler
Yok (can sayısına dokunmaz).

#### Ölçüm
- Yanlış tap sonrası bir sonraki dokunuşa kadar duraklama: bugünkü değere göre **+200–400 ms** (fark edildi sinyali); > +1 s ise zincir fazla ağır.
- Playtest sorusu "kaç canın kaldı?" doğru cevap oranı ≥ %90.

### 3.2 Kombo vurgusu (metin/ses yok)

#### Öneri
Ardışık doğru tap'ler arası ≤ **1,5 s** ise kombo sayacı artar (maks 5): chip bump ölçeği 1,15 → 1,15 + 0,03 × kombo (maks 1,30), bulma sesi her kademede yarım ton yukarı (5 kademe), uçuş süresi 820 → 820 − 60 × kombo ms (min 520). Kombo kırılınca sessizce sıfırlanır. Ekranda metin, voice-over, parlama **yok**.

#### Gerekçe
`comboconfigdata` (9 satır; pencereler 1,0 / 1,5 s) ve `comboencourage` Amaze GO!'nun "Eagle Eye!" zinciri; yorumlarda kapatılamayan yazı + ses şikâyet konusu, kombo hissinin kendisi değil (`amaze-go.md#ux-kalıpları`). Tap Words'te PER 5 yüzünden aynı kelimenin kopyalarını peş peşe bulmak doğal kombo; ödülü mevcut zincirin **hızlanması ve büyümesi** olarak vermek Pillar 4'ün "zincir kısaltılmaz ama hızlandırılabilir" kuralına birebir uyar.

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `comboconfigdata`, `comboencourage`; `#bize-uyarlanabilirlik` → "whoosh + tek ses, konfeti yok / Aynen".

#### Trade-off
- Pillar 6: kombo süreye bağlı → hafif zaman baskısı. Puan/ödül bağlanmadığı sürece (sadece his) kabul; puana bağlanırsa /gameplay kararı.
- `prefers-reduced-motion`: uçuş zaten kapalı; bump kapalı; **ses perdesi kademesi kalır** (tek sinyal).

#### Gerekli görüşler
`/liveops` kombo puana/event'e bağlanacaksa (şimdi değil).

#### Ölçüm
- Ardışık bulma aralığı medyanı: kombo açıkken ≥ %10 kısalır.
- Playtest "fazla gürültülü" yorumu: 0.

### 3.3 İlk bulma ve erken hata (L1–2)

#### Öneri
- **İlk doğru tap (hesap ömründe 1 kez)**: v01 coach satırı 200 ms'de kaybolur, chip bump 1,30 ölçekle (kombo tavanı) ve ses bir oktav yukarıdan; başka kutlama yok (`firstclickcheer` kalıbı; APK'da 0,125 — tahmin: gecikme s).
- **İlk yanlış tap (L1–2, 1 kez)**: standart ceza zinciri + tahtanın üstünde coach: "Bu harf hiçbir kelimeye ait değil — kelimedeki harflere dokun." 2,5 s, 200 ms fade (`earlyerrorfx`, 3 satır). Can gider (mekanik değişmez), sadece açıklama eklenir.

#### Gerekçe
Amaze GO! ilk tıkı ve erken hatayı ayrı tablolarla özelleştiriyor; tutorial ekranı yok, öğretim ilk 2 etkileşimde (`amaze-go.md#ux-kalıpları` onboarding). Tap Words'ün tek öğrenme yükü "sürükleme değil dokunma, herhangi bir harf yeter"; ilk hata anında bunun söylenmesi word search alışkanlığından gelen oyuncuyu (WSE kitlesi) 1 can'a mal olup kurtarır.

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `firstclickcheer`, `earlyerrorfx`; `#ux-kalıpları` → onboarding.

#### Trade-off
- Coach tahtanın üstünde 2,5 s yaşar (Pillar 5); L1–2 ile sınırlı, 1 kez.
- `prefers-reduced-motion`: fade yok, coach anında gelir/gider; ses kalır.

#### Gerekli görüşler
Yok.

#### Ölçüm
- L1'de ilk doğru tap'e medyan süre ≤ 10 s (v01); L1–2 yanlış tap / level, coach'lu grupta ≥ %20 düşük.

### 3.4 Boşta otomatik ipucu pulse'u (L1–3)

#### Öneri
L1–3'te oyuncu **20 s** dokunmazsa, viewport içinde görünen açılmamış bir yerleşimin ilk harfi mevcut `hintpulse` animasyonuyla (1,2 s × 2) vurgulanır; **ipucu sayacı düşmez**, kamera kaydırılmaz. Level başına en fazla 1 kez; sonraki eşik 30 s. L4+ yok. Ayarlardan kapatılabilir.

#### Gerekçe
`newbieautohintconfigdata` (3 satır; eşikler 15 / 20 / 25 s → 20 / 25 / 30 s artan) Amaze GO!'nun yeni oyuncuya boşta kalınca bedava yardım verdiğini gösteriyor; genel idle nudge ("X ok hareket edebilir") ise kapatılamadığı için şikâyetli. Yeni oyuncuya sınırlı ve sessiz (metin yok) bir pulse, 20×12 FTUE tahtasında bile ilk 20 s'de hiçbir şey bulamayan oyuncuyu tutar.

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `newbieautohintconfigdata`, `mainboardhintlogic`; `#bize-uyarlanabilirlik` → idle nudge "kapatılabilir olmalı".

#### Trade-off
- İpucu ekonomisine bedava ipucu ekler (L1–3, 1/level, ≤ 3 toplam) → `/gameplay` + `/liveops` onayı gerekir (soru #15). Mekanik önerisi değil, FTUE yardımı olarak sunuluyor; reddedilirse pulse yerine coach metni tekrarı.
- `prefers-reduced-motion`: pulse kapalı → harf 2,5 s `--accent` renginde statik kalır.

#### Gerekli görüşler
`/gameplay`, `/liveops` (#15).

#### Ölçüm
- L1–3'te 20 s+ hareketsizlik sonrası level terk oranı: pulse'lu grupta ≥ 5 puan düşük.
- Pulse'tan sonra ilk dokunuşa süre medyan ≤ 5 s.

### 3.5 Level sonu başlığı

#### Öneri
Kazanç kartı başlığı duruma göre: 5/5 can → "Hatasız!" (perfect run), 1 can → "Son anda!", diğer → "Hepsini buldun!"; kart 300 ms gecikmeyle girer (son uçuş bitsin), başlık 150 ms scale 0,9 → 1. Rozet/yıldız yok (ayrı iş: level sonu ekranı).

#### Gerekçe
`fullhpsucconfigdata` / `onehpsucconfigdata` (APK; 0,125 / 0,3 — tahmin: gecikme s) Amaze GO!'nun tam-can ve tek-can bitirişi ayrı kutladığını gösteriyor; v01 §4'te "perfect run" zaten "değiştirerek alınır" denmişti. Can sayısına dokunmaz, sadece sonucu adlandırır.

#### Referans
`docs/references/amaze-go.md#apk-analizi` → `fullhpsucconfigdata`, `onehpsucconfigdata`; `#bize-uyarlanabilirlik` → perfect run.

#### Trade-off
- "Son anda!" tek can kalan oyuncuya başarıyı tatlandırır ama can mekaniğini sahneye çıkarır; E1 sonrası eşik (1 can) değişebilir, metin parametrik tutulur.
- `prefers-reduced-motion`: scale yok, kart anında.

#### Gerekli görüşler
Yok.

#### Ölçüm
- "Sonraki seviye" tıklama oranı: "Hatasız!" kartında diğerlerinden ≥ 3 puan yüksek (ödül hissi).

`mainboardhintlogic` (24 satır) ve `hintadconfigdata`: ipucu seçim mantığı varyantları. Prototip rastgele açılmamış yerleşim seçip gerekirse kamerayı kaydırıyor (350 ms). UX tercihi: **viewport içindeki** açılmamış yerleşim öncelikli, yoksa en yakını → kamera kaydırması çoğu zaman atlanır, oyuncu bağlamını kaybetmez. Seçim mantığı mekaniğe dokunur mu, /gameplay'e not (#15).

## 4. HUD / odak deneyleri (kısa değerlendirme)

| Amaze GO! deneyi | Ne olduğu (tahmin, varyant sayısından) | Tap Words kararı | Neden |
|---|---|---|---|
| `MainGameQuickPass` (0–6) | Level sonu kartını kısaltma/atlama, otomatik sonraki level | **Alınmaz** | Yorumlar "kart okunamıyor, Continue butonu olsun" (`amaze-go.md#ux-kalıpları` level sonu). Kart oyuncu dokunana kadar kalır; ≥ 1,5 s önce interstitial yok (§1 Not 2). Pillar 4: koleksiyon özeti okunmalı. |
| `FocusModeLogic` (0–7) | Odak modu: HUD/dekor soluklaştırma veya dikkat dağıtıcıları (lig akışı, danmaku) kapatma | **Alınmaz (zaten yok)** | Tap Words HUD'u 108 pt'ye inmiş, tahta dışında hareketli öğe yok; odak modu "kapatılacak şeyi" eklememekle sağlanır. Tek karşılık: zoom > ×1,5 iken chip alanı **soluklaşmaz** (bilgi gerekli, Pillar 4). |
| `MainBoardGameTipUI` (0, 13–17) | Tahta üstü ipucu/tip arayüzü varyantları | **Değiştirerek** | v01 coach satırı + §3.3 erken hata coach'u bunun Tap Words karşılığı: tek satır, tahtanın üstünde, ≤ 2,5 s, L1–2. Varyant denemesi gerekirse metin/konum A/B'si; HUD'a kalıcı tip alanı eklenmez. |
| `MainGameStyleUI` (0, 8, 13–15) | Gameplay HUD stil/tema varyantları | **Alınmaz (şimdilik)** | Pillar 5: tema UI'da yaşar, tahta değişmez; stil A/B'si ürün aşaması konusu. Not: Amaze GO! stil deneylerini HUD öğesi eklemeden yapıyor — bizim de sınırımız bu. |
| `ArrowLongPressExperience` (0, 8–11) | Long-press Guidance varyantları | #14'te /gameplay'e | v01: long-press yalnızca chip üzerinde (açılmış yerleşimleri vurgular). §2.2 tap süresini 350 ms'e çekerek long-press'e 400–500 ms eşik alanı açar. |

## 5. Chip alanı — değişken kelime sayısı kontrolü (v01 §3.2 revizyonu)

Varsayım: kelime sayısı tier'a göre **5–10** (curve-v02 yazılıyor; grid ≤ 17×26). Chip Seçenek C (5 kolon, segmentli dolgu, chip ≈ 70 × 22 pt, satır 24 pt) ile:

| Kelime | Satır | Alan | Not |
|---|---|---|---|
| 5 | 1 | 24 pt dolu, 24 pt boş | Alan **48 pt sabit** tutulur; ikinci satır boş. Chip'ler sola hizalı |
| 6–10 | 2 | 48 pt | 6 ve 7'de ikinci satır yarım; boşluk sağda |
| 11–15 | 3 | 72 pt | Tier'da yok; gelirse alan 72'ye çıkar ve `fit()` tüm levellarda 72 ile hesaplanır (zıplama yok) |

Genişlik kontrolü: 17 sütun × 20 pt + 2 × 8 PAD = 356 pt ≤ 366 viewport ✓ (hücre 20,6 pt, harf 14,8 pt). Chip kolonu (366 − 4 × 4 gap) / 5 = 70 pt; en uzun kelime 7 harf (curve-v01'de TRAMVAY, KLARNET, BAKLAVA) 12 pt Plex Sans ≈ 50 pt + padding 12 + border 2 = 64 pt ≤ 70 ✓. 8 harf gelirse kırpılır → kelime havuzu üst sınırı **7 harf** (soru #16, /level-design).

Sabit 48 pt'nin gerekçesi v01 §7'de (levelden levele `fit()` ölçeği değişmesin). 5 kelimelik L1'de boş ikinci satır coach satırına (§3.3) ev sahipliği yapar; L3+'ta boş kalır.

Değişen tek şey: Seçenek C'nin `--n` segment sayısı PER'e bağlı (5); PER tier'a göre değişirse segment sayısı da değişir, chip genişliği değişmez.

## 6. Prototip görevi (v01 §6'ya ek)

v01 P1 (banner placeholder + viewport meta + ölçüm) **değişmedi, öncelik 1**. P1'e eklenen log: her tap için `t, i, sonuç (hit/miss/noop), önceki tap'ten geçen ms, pan bitiminden geçen ms` → §2.1 ve §2.2 ölçümlerinin tabanı.

P2 (ADR sonrası) ek maddeler:
- Input: `endPtr` içinde yanlış tap sonrası `lockUntil = now + 500`; `tap()` çağrısı `now < lockUntil` ise atlanır (pan/pinch etkilenmez). Sürükleme eşiği `6` → `8`; tap süre eşiği `600` → `350`; pan bitiminde `panEndAt = now`, pointerdown `now − panEndAt < 120` ise tap adayı olmaz. `.cell.wrong` temizleme 350 → 500 ms.
- Zoom: `minScale*5` → `minScale*2.5` (iki yerde: `zoomAt`, pinch). Sığdır butonuna `pointerdown` 400 ms basılı tutma → `zoomAt(2.5, merkez)`.
- Feedback: `tap()` yanlış dalında `.hp-float` elementi (12 pt ♥, `translateY(-24px)` + opacity 0, 400 ms); `renderLives()` kaybolan kalbe `.lose` sınıfı (200 ms scale/renk + 2 px titreme); son kalpta `.last` (1,2 s nefes). Kombo: `lastHitAt`, `combo` sayacı; `flyToChip` süresi `820 − 60*combo` (min 520); bump ölçeği `--bump` değişkeni; ses için `AudioContext` osilatör, perde `440 × 2^(combo/12)`. Coach satırı: `#coach` elementi, chip alanının altında / viewport üstünde, 2,5 s. Auto-hint: `idleTimer` 20 s, L1–3, `hints` düşmeden `hintpulse`. Level sonu başlık: `finish()` içinde `lives===MAXL` / `lives===1` dalları.
- Tümü `prefers-reduced-motion` dalında: float/titreme/nefes/bump/coach-fade kapalı, statik karşılıklar §3'teki gibi.
- `docs/game/mechanic.md` "Kamera ve input" (eşikler, zoom tavanı, kilit) ve "Görsel / feedback" güncellenir.

## 7. Pillar gerilim özeti (v01 §5'e ek)

| Öneri | Gerilim | Nasıl kapanır |
|---|---|---|
| Yanlış tap sonrası 500 ms kilit | Pillar 1 (dokunuş yutuluyor hissi); E1 sınırı | Kırmızı zemin görünür; /gameplay teyidi (#15) |
| Çift tık zoom alınmaz | Tek el zoom yok | Sığdır butonuna basılı tutma |
| Kombo hızlanması | Pillar 6 (süreye bağlı) | Puana bağlanmaz; sadece his |
| Son can nefesi, süzülen kalp, coach | Pillar 5 | Küçük/kısa; ayarlardan kapatılabilir |
| Boşta otomatik ipucu pulse'u | İpucu ekonomisi (/gameplay, /liveops) | L1–3, 1/level, sayaç düşmez; onay bekler |

## 8. Açılan sorular

`docs/open-questions.md`'ye eklenen satırlar:

- #15 → `/gameplay`: (a) yanlış tap sonrası 500 ms giriş kilidi mekanik sayılır mı (E1 sınırı); (b) L1–3 boşta otomatik ipucu pulse'u (sayaç düşmez, 1/level) ipucu ekonomisine dokunur mu; (c) ipucu seçim mantığı "viewport içi öncelikli" kabul mü. /liveops (b) için eş-görüş.
- #16 → `/level-design`: chip 5 kolon düzeninde kelime uzunluğu üst sınırı **7 harf** (70 pt chip); curve-v02 havuzları buna uyuyor mu; kelime sayısı 11+ tier'ı var mı (chip alanı 72 pt'ye çıkar).
- #12 güncellendi (/liveops): Amaze GO! banner L1'den açık (APK) — açılış levelı için iki referans ucu L1 / L10–13; fail kartında buton öncesi interstitial yok ve kart ≥ 1,5 s görünür kalmadan reklam başlamaz (UX şartı).
