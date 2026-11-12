# ADR-0008: Zorluk indeksi D₂ = K · (1 + α(PER − 1)) · (1 − p); hedef hücre oranı p zorluk kaldıracıdır

- Tarih: 2026-11-11; **revizyon 2026-11-12** (formül D → D₂, K/PER kuralları; `param-tests-v02-results.md`)
- Durum: Kabul
- Alan: levels, gameplay
- Kaynak öneri: `docs/levels/param-tests-v01-results.md` (T00–T11), `docs/levels/param-tests-v02-results.md` (T09X, T12–T15), `docs/levels/difficulty-parameters.md`

## Karar

Bir levelın zorluğu **D₂ = K · (1 + α·(PER − 1)) · (1 − p)**, α = 0,5 ile hedeflenir: K = kelime sayısı, PER = kopya sayısı, p = hedef hücre oranı. Bir kelimenin ilk kopyası tam, tekrar kopyaları yarım iş sayılır. Tier'lar D₂ bandıyla tanımlanır (**F ≤ 6, R 7–8, N 9–9,5, H 10,4–11, S 12–13**); grid, K, PER ve kelime uzunluğu bu D₂'yi verecek şekilde seçilir. **K = 6 ana akış tabanıdır** (F 4, R 5, S 7; K ≥ 8 yok). **PER 5 sabittir ve PER ≤ 3 zorluk kaldıracı olarak kullanılmaz**; kelimeye göre değişen kopya gelirse alt sınır 4. Çapraz X kesişmesi kaldıraç değildir; `noDiagCross` varsayılan kapalı.

İlk hali (11 Kasım) **D = Y × (1 − p)** idi; T14/T15 (Y, p aynı, K/PER farklı) bir kademe zor çıkınca her yerleşimi eşit sayan formül yetersiz kaldı. D₂ 17 levelın 16'sını sıralıyor (eski D 12'de 11). α, `ka-log` gelince kalibre edilir; kararın özü (p kaldıraç, kısa kelime yolu, K 6) α'dan bağımsızdır. **p artık sabit tutulmaz**, zorluk kaldıracıdır: erken levellarda 0,55–0,60, taban 0,49, zor tier'larda 0,39–0,43. Aynı D'ye ulaşmanın yolu olarak **kısa kelime** (küçük tahta) büyük tahtaya tercih edilir. Sütun 17 sabit kalır (/ux #11, T11 ile oynanışta doğrulandı).

## Gerekçe

- 12 keşif levelının öznel zorluk sıralaması tek başına p ile açıklanmıyor (T01 p 0,20 kolay, T10 p 0,34 zor); D ile 12'de 11 sıralanıyor. Tek aykırı (T11) sütun 20 = okunabilirlik, D dışı.
- D, `curve-v02`'deki Poisson fail modelinin (beklenen yanlış tap = ε·Y, ε ∝ 1 − p) kendisidir; yeni model değil, modelin oynanışla doğrulanmış hali.
- `curve-v02` p'yi 0,45–0,55'te sabitleyip zorluğu yalnızca Y ile kuruyordu; oynanış p 0,69'un "çok kolay", 0,39'un "güzel bir zor" hissettirdiğini gösterdi. p'yi kaldıraç yapmak zorluk aralığını Y'yi (dolayısıyla süreyi ve chip sayısını) şişirmeden açıyor.
- Aynı D'de T04 (kısa kelime, 306 hücre) T10'dan (5 harf, 442 hücre) daha adil hissettirdi → kısa kelime yolu.
- Pillar 6 ile uyumlu: D mekaniğin kendi kaldıraçlarından türetiliyor.
- **Revizyon gerekçesi (12 Kasım):** T00 ↔ T14 ↔ T15 aynı Y (30), aynı p (0,49), yalnızca K/PER 6×5 → 10×3 → 15×2; T00 "keyifli", T14/T15 "zor". Tekrar kopya öğrenme kârı taşıyor (curve-v02 süre modeli: ilk kopya 6 s, tekrar 2,5 s). T09 ↔ T09X (X kesişme 4 → 0) fark üretmedi. Pillar 4 (bulmak koleksiyondur) ile de uyumlu: tekrar kopya hem ödül hem kolaylık.

## Reddedilen seçenekler

- **p sabit, zorluk yalnızca Y (curve-v02)** — zor tier için Y 45–50 gerekir; süre 2:30+, 9–10 chip; oynanış p'nin kendisinin hissedildiğini gösterdi.
- **PER'i risk kaldıracı olarak kullanmak** — PER düşünce p ile birlikte Y de düşüyor; net etki "kısa level", zorluk değil (T01, T02). Y sabitken PER'in etkisi `param-tests-v02` K serisinde ayrıca ölçülecek.
- **Büyük tahta ile zorlaştırmak** — aynı D'de kısa kelimeden daha az adil hissettirdi (T10 vs T04); okunabilirlik ve süre maliyeti de yüksek. Büyük tahta yalnızca hacim (koleksiyon hissi, Pillar 4) için kullanılır.
- **K ↑ veya PER ↓ ile zorlaştırmak** — çalışıyor (T14/T15) ama chip alanını bozuyor ve Pillar 4'ün tekrar-bulma ödülünü siliyor; p ve kelime uzunluğu aynı etkiyi UI'a dokunmadan veriyor.
- **`noDiagCross` zorunlu** — T09X fark üretmedi; kısıt generator'ı sıkıştırır, kazanç yok.

## Sonuçlar

- `docs/levels/curve-v03.md`: tier parametre seti D hedefiyle yeniden kuruldu; v02 ritmi (Seçenek B) korundu.
- `tools/bake.js`: D ve D₂ her level için hesaplanır, `meta.D` / `meta.D2` olarak JSON'a yazılır; `check` modu ikisini de raporlar.
- `docs/levels/level-format.md`: `meta.D`, `meta.D2` alanları (bilgi amaçlı; loader okumaz).
- `docs/levels/difficulty-parameters.md`: D türetilmiş büyüklük olarak eklendi.
- Ölçüm: `ka-log` ile toplam yanlış tap ve süre D₂'ye karşı çizilir; Spearman ≥ 0,8 beklenir. α, ilk-kopya / tekrar-kopya süre oranından ölçülür (beklenen 0,4–0,6). Tutmazsa ağırlıklar revize edilir, karar değil model güncellenir.
- Açık: ε'nin mutlak değeri (3 can ile fail oranı) log gelince; S tier (D₂ ≥ 12) 3 can ile fail %25'i aşarsa S Σ harf +3 (D₂ ≈ 11,5).
