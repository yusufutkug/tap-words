# ADR-0008: Zorluk indeksi D = Y × (1 − p); hedef hücre oranı p zorluk kaldıracıdır

- Tarih: 2026-11-11
- Durum: Kabul
- Alan: levels, gameplay
- Kaynak öneri: `docs/levels/param-tests-v01-results.md` (T00–T11 oynanış notları), `docs/levels/difficulty-parameters.md`

## Karar

Bir levelın zorluğu **D = Y × (1 − p)** ile hedeflenir: Y = yerleşim sayısı (K × PER), p = hedef hücre oranı. Tier'lar D bandıyla tanımlanır (F ≤ 10, R 12–13, N ≈ 15, H 17–18, S ≥ 20); grid, K, PER ve kelime uzunluğu bu D'yi verecek şekilde seçilir. **p artık sabit tutulmaz**, zorluk kaldıracıdır: erken levellarda 0,55–0,60, taban 0,49, zor tier'larda 0,39–0,43. Aynı D'ye ulaşmanın yolu olarak **kısa kelime** (küçük tahta) büyük tahtaya tercih edilir. Sütun 17 sabit kalır (/ux #11, T11 ile oynanışta doğrulandı).

## Gerekçe

- 12 keşif levelının öznel zorluk sıralaması tek başına p ile açıklanmıyor (T01 p 0,20 kolay, T10 p 0,34 zor); D ile 12'de 11 sıralanıyor. Tek aykırı (T11) sütun 20 = okunabilirlik, D dışı.
- D, `curve-v02`'deki Poisson fail modelinin (beklenen yanlış tap = ε·Y, ε ∝ 1 − p) kendisidir; yeni model değil, modelin oynanışla doğrulanmış hali.
- `curve-v02` p'yi 0,45–0,55'te sabitleyip zorluğu yalnızca Y ile kuruyordu; oynanış p 0,69'un "çok kolay", 0,39'un "güzel bir zor" hissettirdiğini gösterdi. p'yi kaldıraç yapmak zorluk aralığını Y'yi (dolayısıyla süreyi ve chip sayısını) şişirmeden açıyor.
- Aynı D'de T04 (kısa kelime, 306 hücre) T10'dan (5 harf, 442 hücre) daha adil hissettirdi → kısa kelime yolu.
- Pillar 6 ile uyumlu: D mekaniğin kendi kaldıraçlarından türetiliyor.

## Reddedilen seçenekler

- **p sabit, zorluk yalnızca Y (curve-v02)** — zor tier için Y 45–50 gerekir; süre 2:30+, 9–10 chip; oynanış p'nin kendisinin hissedildiğini gösterdi.
- **PER'i risk kaldıracı olarak kullanmak** — PER düşünce p ile birlikte Y de düşüyor; net etki "kısa level", zorluk değil (T01, T02). Y sabitken PER'in etkisi `param-tests-v02` K serisinde ayrıca ölçülecek.
- **Büyük tahta ile zorlaştırmak** — aynı D'de kısa kelimeden daha az adil hissettirdi (T10 vs T04); okunabilirlik ve süre maliyeti de yüksek. Büyük tahta yalnızca hacim (koleksiyon hissi, Pillar 4) için kullanılır.

## Sonuçlar

- `docs/levels/curve-v03.md`: tier parametre seti D hedefiyle yeniden kuruldu; v02 ritmi (Seçenek B) korundu.
- `tools/bake.js`: D her level için hesaplanır ve `meta.D` olarak JSON'a yazılır; `check` modu kelime listesi + parametre setini D ile raporlar.
- `docs/levels/level-format.md`: `meta.D` alanı eklenir (bilgi amaçlı; loader okumaz).
- `docs/levels/difficulty-parameters.md`: D türetilmiş büyüklük olarak eklendi.
- Ölçüm: `ka-log` ile ε ve süre/yerleşim D'ye karşı çizilir; D ile ε·Y korelasyonu ≥ 0,8 beklenir. Tutmazsa D'nin ağırlıkları (ör. uzunluk terimi) revize edilir, karar değil model güncellenir.
- Açık: ε'nin mutlak değeri (3 can ile fail oranı) log gelince; D ≥ 20'de 3 can ile fail %15'i aşarsa S tier D 19'a çekilir.
