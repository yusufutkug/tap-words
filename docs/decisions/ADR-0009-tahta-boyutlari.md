# ADR-0009: Tahta boyutları telefon oranında (satır/sütun ≈ 1,4); tier başına sabit grid; sütun değişken, hücre boyutu küçük tahtada büyür

- Tarih: 2026-11-12
- Durum: Kabul
- Alan: levels, ux, prototype
- Kaynak öneri: ana sohbet (Utku: "board telefon oranında olsun, UX'teki boşluğa fit etsin, oran 1,4'lerde"); `docs/levels/curve-v03.md`, `docs/ux/gameplay-layout-v01.md#12-hedef-yerleşim`

## Karar

Ana akış tahtaları dört kanonik boyuttur; hepsinin satır/sütun oranı **1,36–1,44**, hepsi ≤ 17 sütun (/ux zoom'suz sınır):

| Tier | K | Grid | Oran | Hücre | Hücre boyutu (366 pt genişlik) | Harf (0,72) |
|---|---|---|---|---|---|---|
| F | 4 | **12×17** | 1,42 | 204 | 29 pt | 21 pt |
| R | 5 | **14×19** | 1,36 | 266 | 25 pt | 18 pt |
| N / H | 6 | **15×21** | 1,40 | 315 | 23 pt | 17 pt |
| S | 7 | **16×23** | 1,44 | 368 | 22 pt | 16 pt |
| Event / koleksiyon | 8–9 | 17×26 | 1,53 | 442 | 20,6 pt | 14,8 pt | 

Grid tier'a bağlıdır (K ile birlikte); tier içinde Σ harf sapması satırla değil kelime seçimiyle düzeltilir. **Sütun artık sabit değil**: küçük tahta az sütun = büyük hücre. Tahta her levelda genişliğe sığdırılır (`fit()`); oran 1,4 ile 553 pt viewport'ta (90 pt banner) altta ≈ 60 pt, 593 pt'de ≈ 100 pt pay kalır — sığdır butonu, coach satırı ve ipucu için alan. 17×26 ana akışta yoktur; event / "büyük koleksiyon" tahtası olarak rezerv.

## Gerekçe

- 17 sütun sabitken hücre her levelda 20 pt'ydi; küçük tahta yalnızca "daha az satır" demekti ve 17×18 gibi tahtalar viewport'ta üst-alt boş bant bırakıyordu (T15 ekran görüntüsü). WSE'de ve Amaze GO!'da küçük tahta = büyük harf; kolay level görsel olarak da kolay okunur.
- Oran 1,4 (1,5+ yerine): tahta viewport'u tam doldurmaz, altta tek bir pay kalır — chip ile tahta arasına sıkışmaz, sığdır/ipucu butonları için yer, bannera komşuluk riski (/ux v01 §Seçenek A başparmak analizi) azalır.
- Hücre sayıları curve-v03'ün eski gridleriyle neredeyse aynı (204→204, 272→266, 306→315, 357→368) → oynanmış referanslar (T00/T04 306, T09 357) ve D₂ hedefleri geçerli. 30 liste yeni gridlerde doğrulandı: %0 başarısız; D₂ F 5,5 · R 7,1–7,7 · N 9,4–9,7 · H 10,6–11,1 · S 12,2–13,0.
- S için 17×24 (408) denendi: 4 harfli listede p 0,34 → D₂ 13,8, bandın üstü; 16×23 ile 13,0.
- Komşu adımlar 1,30 / 1,18 / 1,17 — WSE APK aralığında (1,17–1,33).

## Reddedilen seçenekler

- **17 sütun sabit, yalnızca satır değişir (curve-v02/v03 ilk hali: 12/15–16/18/21)** — kontrast zayıf, boş bant, kolay levelda büyük harf avantajı yok.
- **Viewport'u tam dolduran oran (1,5–1,6: 12×18 / 13×20 / 14×22 / 16×25)** — Utku tercihi 1,4; tam dolum alt payı yer, banner komşuluğu artar.
- **Üç boyut (FTUE de R gridinde)** — F K4 ile 266 hücrede D₂ 6,8, F bandının (≤ 6) üstünde.

## Sonuçlar

- `curve-v03.md`: grid sütunu güncellendi, D₂ yeniden hesaplandı.
- `index.html`: `cols` zaten level başına; `fit()` genişliğe sığdırıyor — değişiklik yok. Harf boyutu hücrenin 0,8'i (prototip) / 0,72 (UX spec) — büyük hücrede kontrol edilecek.
- `/ux`: hedef yerleşim tablosu (`gameplay-layout-v01.md#12`) 4 grid için güncellenir; alt pay kullanımı (sığdır butonu, coach) ve 12×17'de 29 pt hücrenin tap hassasiyeti; chip genişliği değişmez (#18c kapanır).
- `/prototype`: `tools/bake.js curve` modu ile 30 level `levels.js` → prototipte oynanabilir.
- Test levelları (T00–T15) eski gridlerde kalır; referans veri olarak dokunulmaz.
- Ölçüm: zoom kullanılan level oranı ≤ %10 (17 sütunda hedef %20'ydi); R sonrası "sonraki seviye" tıklama H/S sonrasından ≥ 5 puan yüksek; tier başına süre medyanı curve-v03 tablosu.
