# Funnel v01 — Amaze GO! Modeli: Tier Dizisi + Tier Parametre Seti + Tema Havuzu

- Tarih / sürüm: 2026-11-13 / v01 (taslak; K1 "funnel kararı" için)
- Alan: level-design (ana sohbet)
- Amaç: oyuncunun L1'den itibaren geçtiği level dizisinin **nasıl üretildiğini** tanımlamak — elle yazılmış bir level tablosu değil, Unity ekibine ve offline generator'a verilen **kural seti**. curve-v03'ün 30 levelı bu kuralların ilk çıktısı olur.
- Kaynak: `curve-v03.md` (tier parametreleri, D₂ bantları, 30 liste), `param-tests-v03-results.md` (dolgu modu ve özel harf kaldıraçları, ters bandı kalktı), `docs/references/amaze-go.md#apk-analizi` (tier ritmi + havuz mimarisi), ADR-0004 (3 can), ADR-0008, ADR-0009.
- Veri: `tools/funnel-<x>.json` (dizi + tier seti; x = a/b/c) + `tools/funnel-pool.json` (ortak havuz, 116 liste) → `node tools/bake.js funnel` → `funnel-<x>-levels.js` (prototip, 100 level) ve `levels/funnel-<x>.json` (Unity paketi, `tapwords-level/1`). Üç varyant: `funnels-v01.md`. (İlk 30 levellık `funnel-v01.json` çıktısı 13 Kas'ta bunlarla değiştirildi; dizi A'da aynen yaşıyor.)
- Karar: ADR-0010 (taslak; prototip playtest'inden sonra Kabul).

## Öneri

Funnel dört bileşenden oluşur; level numarasına tek tek içerik yazılmaz:

1. **Tier dizisi** — level numarası → tier. İlk 10 level `F R N N H R H R N S`, sonrası `R N H R N H R N N S` döngüsü. Her 10 levelda 3 R · 4 N · 2 H · 1 S (ilk 10'da F, R yerine); her 50 levelda 15 hard+ (Amaze GO! 2. bant).
2. **Tier parametre seti** — grid, K, PER, p bandı, dolgu modu, özel harf sınırı, can (aşağıda). Zorluk tier'ın içindedir; dizi yalnızca ritmi verir.
3. **Tema havuzu** — tier etiketli kelime listeleri; level, kendi tier'ının havuzundan sıradaki listeyi alır. Havuz büyüdükçe funnel uzar; kod değişmez.
4. **Özel havuzlar / override'lar** — FTUE kuralları (L1–2), Relief (dizideki R), geri dönen oyuncu (ComeBack), Daily Challenge (liveops). Yalnızca FTUE bu sürümde uygulanır.

### Tier parametre seti

| Tier | Grid | K | PER | Kelime uzunluğu | p | D₂ | Dolgu | Özel harf (kelime) | Can | Rol |
|---|---|---|---|---|---|---|---|---|---|---|
| **F** | 12×17 | 4 | 5 | 5–6 | 0,54 | 5,5 | **`disjoint`** | serbest (≤ %25) | 3 | L1; çapraz %0, ters %0 |
| **R** | 14×19 | 5 | 5 | 4–7 | 0,49–0,53 | 7,1–7,7 | `freq` | ≤ %15 | 3 | Nefes; her H/S'den sonra |
| **N** | 15×21 | 6 | 5 | 4–6 (Σ 29–30) | 0,46–0,48 | 9,4–9,7 | `freq` | ≤ %13 | 3 | Taban |
| **H** | 15×21 | 6 | 5 | 4–5 (Σ 24–26) | 0,38–0,41 | 10,6–11,1 | `freq` | **≤ %10** | 3 | Kısa kelime; N ile aynı tahta |
| **S** | 16×23 | 7 | 5 | 4–5 (Σ 28–31) | 0,38–0,42 | 12,2–13,0 | **`bigram`** | **≤ %10** | 3 | Duvar: L10, 20, 30… |

Sabitler: PER 5; ters yazım 0,20 (band yok — `param-tests-v03-results.md#3`); çapraz nominal %50 (gerçekleşen 0,27–0,43 bandı, seed seçimi); X kesişme serbest; ipucu/booster ADR-0003.

v03'ten gelen iki değişiklik curve-v03'e göre: F'de `disjoint` dolgu (tahta kendini okutur, −50 % süre), S'de `bigram` dolgu (+15–24 %). Özel harf sınırı H/S'de %10'a çekildi (fener etkisi, −45 %); Çiftlik, Masallar ve Tatil listeleri buna göre yeniden kürate edildi (13 Kas, `funnel-pool.json`).

### Kaldıraçların giriş sırası

| Level | Yeni olan | Neden burada |
|---|---|---|
| L1 (F) | Yalnızca sağa/aşağı; ters yok; `disjoint` dolgu; 4 kelime; 29 pt hücre | Mekanik öğretimi: her tap ya kelime ya ceza, dolgu harfleri hedef harfi değil → hata ucuz (Amaze Guide; /ux #14) |
| L2 (R) | 5 kelime; `freq` dolgu; ters %20 açılır; çapraz hâlâ %0 | Gerçek dolgu ilk kez; ters yazım kaldıraç olmadığı için sessizce açılır |
| L3 (N) | Çapraz açılır; K 6, 15×21 taban | Coach satırı adayı ("kelimeler çapraz da olabilir", /ux #18a) |
| L5 (H) | 4 harfli kelime, p 0,38 | İlk "zor-adil"; grid N ile aynı → oyuncu farkı kelime kısalığından hisseder |
| L10 (S) | 7 kelime, 16×23, `bigram` dolgu | İlk duvar; iki yeni şey (büyük tahta + yarım kelime tuzağı) aynı anda — playtest sorusu |
| L31+ | Yeni kaldıraç yok | İlerleme ritimden ve havuzdan gelir; "ilerledikçe zorlaşma" tier dağılımında yok (Amaze GO!) |

Bölümlere göre ince ayar (öneri, playtest sonrası): L1–50 tier bantlarının alt ucu (N p 0,48, H 0,41, S 0,42); L51–100 üst ucu (N 0,46, H 0,38, S 0,38). Yeni tier (Amaze "nightmare") veya K 8 ana akışa girmez (ADR-0008).

### Tema havuzu kuralları

- Liste tier'a göre etiketlenir: uzunluk ve Σ harf bandı yukarıdaki tablo; palindrom yok; alt dize yok (`mechanic.md`); özel harf sınırı tier'a göre.
- **Tekrar:** aynı kelime en az 20 level arayla; aynı tema farklı listeyle ≥ 30 level arayla kullanılabilir.
- **Mevcut dolum (13 Kas):** `tools/funnel-pool.json` — 116 liste (F 3 · R 32 · N 41 · H 23 · S 17), kelimeler havuz genelinde tekil; 100 levellık tek funnel için yeterli (A: R 30/32, N 39/41). Çiftlik / Masallar / Tatil %10 sınırına göre yeniden kürate edildi.
- Havuz her funnel'da `poolSeed` ile karıştırılır; generator listeleri ve diziyi doğrular (bant, özel harf, palindrom/alt dize, kelime tekrarı, ≥ 20 / ≥ 30 level mesafesi) — hata varsa çıktı üretilmez.
- Havuz bittiğinde generator hata verir (`L n: X havuzu bitti`); Unity'ye sessiz tekrar gitmez.

### Özel havuzlar (Amaze GO! kalıbı; bu sürümde yalnızca FTUE)

| Havuz | Amaze GO! | Tap Words karşılığı | Durum |
|---|---|---|---|
| Guide | L1 öğretici tahta | L1 override (`diag 0, rev 0`), L2 (`diag 0`) | **Uygulandı** |
| Relief | Zor sonrası kolay | Dizideki R (her H/S'yi R izler) | Uygulandı (dizi) |
| ComeBack | ≥ N gün sonra dönen oyuncuya kolay tahta | Dönen oyuncunun ilk levelı R parametresiyle yeniden üretilmiş kopya; runtime seçim gerekir (RC `comeback_days`) | /liveops görüşü; offline paketle çözüm: her level için R varyantı paketlenir |
| Daily / TimeAttack | Ayrı havuzlar | ADR-0007 event tahtaları; Daily Challenge D₂ hedefi H eşdeğeri (10,6–11,1), 17×26 rezerv | /liveops spec |
| Dyn T1–T4 (performansa göre alt havuz) | Dinamik zorluk | Yok (backend yok, ADR). Yerine RC ile tier bandı alt/üst uç seçimi | Soft launch sonrası |

## Gerekçe

- Amaze GO! APK: 21.763 tahta, `LevelsDifficulty` level → tier, tahta tier havuzundan; sabit merdiven yok; her 50 levelda hard+ sayısı sabit. Bu mimari, içerik üretimini (havuz) ritimden (dizi) ayırır: 100 → 500 level geçişi yalnızca kürasyon işidir. Tap Words generator'ı parametrik olduğu için "havuz" = kelime listesi havuzu; tahta anında değil offline üretilir (ADR-0005).
- Elle level tablosu (curve-v03 L1–30) oynanış doğrulaması için gerekliydi; funnel olarak ölçeklenmez (her level için karar + kürasyon).
- v01–v03 keşif setleri hangi parametrelerin tier'a bağlanacağını belirledi: p, K (ADR-0008); grid (ADR-0009); dolgu modu ve özel harf (v03). Ters, PER ≤ 3 ve X kesişme bağlanmaz.

## Referans

- `docs/references/amaze-go.md#apk-analizi` — tier ritmi `11211211131121121113`, `firstwinrate` normal 0,69 · hard 0,58 · super hard 0,55, Relief/ComeBack/Guide havuzları.
- `docs/references/word-search-explorer.md#apk-analizi` — sabit merdiven karşı örneği; L35+ `hwp` kalıbı (ters yazım) Tap Words'e taşınmadı (v03).
- `docs/levels/param-tests-v01-results.md`, `-v02-results.md`, `-v03-results.md` — kaldıraç kanıtları.

## Trade-off

- **Tier ritmi oyuncuya görünmez;** N→H geçişinde tahta aynı görünüyor (/ux #18b "zor level sinyali"). Amaze GO! tier'ı göstermiyor; biz de göstermeyiz, ama S duvarında chip 7 ve tahta büyüdüğü için fark görünür.
- **L10'da iki yenilik birden** (16×23 + `bigram`). Playtest'te S fail > %25 çıkarsa `bigram` L20'ye ertelenir (L10 `freq`).
- **`disjoint` dolgu L1'de "yapay" tahta** (dolgu alfabesi 23 harfe düşer, J/Ğ/V sıklığı artar — ekran görüntüsü `changelog.md` 13 Kas). FTUE'de kabul; L2'den itibaren `freq`.
- **Havuz kürasyonu darboğaz:** 100 level için 70 liste, H/S'de 4–5 harf kısıtı. Pillar 7 (kürasyon maliyeti) ile gerilim; tema tekrarına ≥ 30 level arayla izin bu yüzden.
- **Dinamik zorluk yok** (backend yok). Amaze'in Dyn havuzları yerine RC ile bant ucu seçimi — tek oyuncu için uyarlama yapılmaz.
- Özel harf sınırı H/S %10: Masallar ve Çiftlik listeleri yeniden kürate edilmeli; playtest bu iki levelı işaretli oynatır.

## Gerekli görüşler

- **/ux:** L3 çapraz coach'u; L1 `disjoint` tahtanın görünümü; S duvarında (16×23, 22 pt hücre) okunabilirlik; tier sinyali (#18b).
- **/liveops:** ComeBack kuralı ve RC alanları (`comeback_days`, tier bant ucu); Daily Challenge D₂ hedefi; 100 level ≈ 2 saat 50 dk içerik — soft launch D7 için yeterli mi?
- **/gameplay:** 3 can + S D₂ 13 fail hedefi (#17); play-on'un funnel drop'una etkisi.
- **/level-design:** 70 listelik havuz kürasyonu; H/S için 4–5 harfli tema envanteri.

## Ölçüm

Playtest (prototip, 3 can, L1–30; log `ka-log` artık `tier`, `D2`, `lives`, `fillMode`, `diag` taşıyor):

| Metrik | Hedef | Karar eşiği |
|---|---|---|
| c = yanlış tap / D₂ (tier ortalaması) | 0,08–0,13 (`curve-v03.md#fail-modeli`) | c > 0,17 → S Σ +3, H Σ +2; c < 0,06 → p bantları 0,02 aşağı |
| İlk-deneme kazanma (3 can) | F/R ≥ 0,98 · N ≥ 0,93 · H ≥ 0,85 · S ≥ 0,78 | Tier 5 puan altında → o tier'ın Σ harf +2 |
| L10 fail | ≤ %25 | > %25 → `bigram` L20'ye, L10 `freq` |
| Süre medyanı | F ≈ 1:00 · R 1:15–1:45 · N/H 1:30–2:15 · S 1:45–2:45 | H > N + %25 → kısa kelime beklenenden pahalı |
| R sonrası "sonraki seviye" | ≥ H/S sonrası + 5 puan | Yoksa relief taşınmıyor; dizi `R N H R N H R N N S` → `R R N H R N H R N S` denenir |
| L1 yanlış tap | ≤ 1 | > 1 → `disjoint` yetmiyor, L1 K 3 veya p 0,58 |

Soft launch (Unity, analytics): level başına ilk-deneme kazanma ve "level başlat → bitir" drop'u; funnel KPI'ı = L10'a ulaşan / L1'i başlatan (hedef ≥ %70 D0) ve L30'a ulaşan (≥ %35 D3) — Amaze `firstwinrate` oransal çevirisi, mutlak değerler ilk kohorttan sonra kalibre.

## Prototip / Unity

- Prototip ana akışı `funnel-<x>-levels.js` (100 level, can 3; `?funnel=a|b|c`, varsayılan a). Eski 50 level menüde **Arşiv** (20×25, can 5); test levelları ayrı bölüm. Level listesinde tier, dolgu modu (freq dışı) ve D₂ görünür.
- Yeni level alanları: `tier`, `lives`, `diag` (JSON `diagonalWeight`), `fillMode`, `rev` (`reversedWeight`) — `level-format.md`.
- Unity: funnel mantığı offline'dadır; paket (`levels/funnel-a.json`, `-b`, `-c`) sıralı level listesi + `funnel`, `sequence`, `tiers` alanları taşır. Runtime'da tier seçimi yok; ComeBack gelirse paket başına R varyantı eklenir (ADR-0005 ile uyumlu).
