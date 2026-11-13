# Parametre Keşif Seti v03 — Sonuçlar (ilk oynanış)

- Tarih: 2026-11-13
- Alan: level-design (ana sohbet)
- Veri: Utku'nun T00b, T16–T22 **tamamlama süreleri** (1 oyuncu, 1 oynanış/level, sıra T00b → T22). Yanlış tap / `ka-log` alınmadı; sonuçlar süre üzerinden.
- Çıkan sonuç: **D₂ sabitken (9,4) süre 2,3× değişiyor** → D₂ hacmi ölçüyor, risk kaldıraçlarını görmüyor. Dolgu alfabesi güçlü kaldıraç, ters yazım kaldıraç değil, özel harf kaldıraç (büyüklüğü belirsiz).

## 1. Süreler

Sekiz levelda K 6, PER 5, Y 30, p 0,48, D₂ 9,4, 15×21; yalnızca seri parametresi değişti.

| Level | Seri | Değer | Süre | s / yerleşim | T00b'ye göre |
|---|---|---|---|---|---|
| T16 | dolgu | örtüşme %0 (`disjoint`) | 1:47 | 3,6 | **−50 %** |
| T22 | özel | kelime özel %40 | 1:57 | 3,9 | **−45 %** |
| T21 | özel | kelime özel %0 | 2:02 | 4,1 | **−42 %** |
| T17 | dolgu | örtüşme %100 (`target`) | 3:16 | 6,5 | −8 % |
| T00b | taban | örtüşme %72, ters 0,23, özel %13 | 3:32 | 7,1 | 0 |
| T19 | ters | ters 0 | 3:51 | 7,7 | +9 % |
| T20 | ters | ters 0,50 | 4:02 | 8,1 | +14 % |
| T18 | dolgu | örtüşme %100 + ikili (`bigram`) | 4:03 | 8,1 | +15 % |

İki küme: **hızlı** (T16, T21, T22 ≈ 2 dk) ve **yavaş** (T17, T00b, T19, T20, T18 ≈ 3,3–4 dk). Küme içi farklar gürültü sınırında (±15 %); kümeler arası fark 2×.

## 2. Dolgu–hedef örtüşmesi (#23): kaldıraç, doyumlu

T16 → T00b → T17 → T18: 1:47 → 3:32 → 3:16 → 4:03.

- **%0 → %72 süreyi ikiye katlıyor.** `disjoint` modda dolgu harfi hiçbir zaman hedef harfi değil; oyuncu harf bazında eliyor, tahta "kendini okutuyor". Eşik (%20) fazlasıyla aşıldı → **kaldıraç**, yönü kolaylaştırıcı.
- **%72 → %100 fark yok** (T17 T00b'den 16 s hızlı, gürültü). TR frekans alfabesi hedef harflerle zaten o kadar örtüşüyor ki `target` modu ek bir şey katmıyor; örtüşme ~%70 üzerinde doyuyor.
- **`bigram` +15 % (T00b'ye), +24 % (T17'ye).** Yarım kelime tuzakları (EK-MEK, ŞEK-ER zincirleri) bir kademe ekliyor; near-miss (#27) kaldıraç adayı olarak doğrulandı, ama etkisi `disjoint`'in yanında küçük.

Eğriye etkisi: `fillMode` bir **tier kaldıracı** olabilir — F'de `disjoint` (veya örtüşme %30–40'a çekilmiş karma alfabe), N'de `freq`, S'de `bigram`. Doyum nedeniyle `target` modunun eğride yeri yok.

## 3. Ters yazım (#8): kaldıraç değil

T19 (0) → T00b (0,23) → T20 (0,50): 3:51 → 3:32 → 4:02. Monoton değil, aralık ±9 %, eşiğin (%20) altında. Beklenen mekanizma doğrulandı: tap mekaniğinde oyuncu kelimeyi sürüklemediği, herhangi bir harfe dokunması yettiği için okuma yönü maliyet üretmiyor. WSE'nin `hwp` kalıbı Tap Words'e taşınmaz.

Eğriye etkisi: **ters bandı (0,13–0,27) kaldırılır**; generator'da 0,20 görsel çeşitlilik olarak kalır, `rev` alanı tier'a bağlanmaz. Bake'de seed seçimini yalnızca çapraz bandı sınırlar (üretim hızlanır).

## 4. Özel harf (#17): kaldıraç, ama taban şüpheli

T21 (%0) → T00b (%13) → T22 (%40): 2:02 → 3:32 → 1:57.

- **T22 −45 %:** fener etkisi doğrulandı. Ğ/Ş/Ö/Ü/Ç göze çarpıyor, kelimeyi bedava veriyor; dolguda özel harf %19 olsa da hedefteki yoğunluk (%40) baskın.
- **T21 −42 %:** fener yokken de hızlı — tek parametreyle açıklanamıyor. Kontrol edildi, hiçbiri T21'i T00b'den ayırmıyor: kelimeler arası Jaccard (0,17 / 0,14), harf çeşitliliği (0,50 / 0,50), ortak ikili sayısı (2 / 3), kopya kümelenmesi (0,38 / 0,36 köşegen), çapraz payı (0,30 / 0,33), X (1 / 4).
- Kalan hipotezler: (a) **sıra/ısınma** — T00b ilk oynanan level; (b) kelimelerin görsel ayırt ediciliği (PERDE LAMBA DOLAP farklı siluet; T00b'de KİTAP/KALEM, SİLGİ/SINIF benzer); (c) yanlış tap sayısı farkı (süre ε'yi göstermiyor). Bu sette çözülmez; T00b'ye takılmadan devam edilir, **taban gürültüsü ±40 % kabul edilir** ve yalnızca kümeler arası (2×) farklar kaldıraç sayılır.

Eğriye etkisi: özel harf oranı **kolaylaştırıcı kaldıraç**; F tier listelerinde %25+ serbest, S tier'da ≤ %10. Kürasyon kuralı olarak `curve-v03.md` liste kriterlerine eklenir; generator parametresi değil.

## 5. D₂'ye etkisi

D₂ hacim (K, PER, p) için doğru sırayı veriyor (v02: 17'de 16). Bu set **D₂'nin kapsamadığı risk eksenini** gösterdi: aynı D₂'de 2× süre. İki seçenek:

- **(a) D₂'yi değiştirme, kaldıraçları kürasyon/mod kuralı olarak tier'a bağla.** Eğri hedefi D₂ kalır; `fillMode` ve özel harf oranı tier başına sabitlenir (F kolaylaştırıcı, S zorlaştırıcı). Basit; D₂ tek başına level karşılaştırmak için yeterli olmaz ama tier içinde parametreler sabit olduğu için sorun çıkarmaz.
- **(b) D₃ = D₂ · r, r risk çarpanı:** `disjoint` 0,5, `freq` 1,0, `bigram` 1,15; özel %40 → 0,55. Tek sayıyla karşılaştırma mümkün ama tek oynanıştan kalibre edilmiş çarpanlar kırılgan.

**Önerilen: (a).** D₂ dokunulmaz; v03 kaldıraçları tier tablosuna "mod/kürasyon" sütunu olarak girer. (b) için `ka-log` ve ikinci oyuncu gerekir.

## 6. Sonraki adımlar

1. Eğriye `fillMode` ve özel harf sütunu (ADR-0008 ek maddesi veya ADR-0010): F `disjoint` + özel serbest · R/N `freq` + özel ≤ %13 · H `freq` + özel ≤ %10 · S `bigram` + özel ≤ %10.
2. Ters bandını bake'den kaldır; `rev` 0,20 sabit.
3. `ka-log` dökümü (ε, `wrongAt`) → süre/ε ayrımı; T21 sorusu buradan açılırsa bakılır.
4. **Funnel:** oyuncunun ilk oturumlarda geçtiği level dizisi — tier geçişleri, kaldıraçların devreye giriş sırası, level başına beklenen fail/drop. Planlama ayrı dokümanda (`docs/levels/funnel-v01.md`).
