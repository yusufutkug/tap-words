# Parametre Keşif Seti v02 — Sonuçlar (ilk oynanış)

- Tarih: 2026-11-12
- Alan: level-design (ana sohbet)
- Veri: Utku'nun T09X, T12–T15 oynanış notları (1 oyuncu, 1 oynanış/level). Sayısal log (`ka-log`) hâlâ alınmadı.
- Çıkan karar: ADR-0008 revizyonu — D formülü D₂'ye güncellendi; K 6 taban; PER ≤ 3 kaldıraç değil; `noDiagCross` varsayılan kapalı.

## 1. Notlar

| Level | K | PER | Y | p | D | Not |
|---|---|---|---|---|---|---|
| T09X | 6 | 5 | 30 | 0,42 | 17,4 | T09'dan biraz daha zor, ama çok değil |
| T12 | 4 | 5 | 20 | 0,49 | 10,2 | zor değil |
| T13 | 8 | 5 | 40 | 0,49 | 20,4 | zor |
| T14 | 10 | 3 | 30 | 0,49 | 15,3 | zor |
| T15 | 15 | 2 | 30 | 0,49 | 15,3 | zor |

Utku'nun çıkarımı: "K'den çok Y'ye bağlı; K'ya hafif bağlılık var; sweet spot K 6."

## 2. T09 ↔ T09X: çapraz kesişme kaldıraç değil

Her şey aynı, yalnızca X 4 → 0. Beklenti "T09X daha kolay"; sonuç "biraz daha zor". Fark gürültü içinde ve yön ters → T09'un zorluğu D'den geliyordu, kesişmeden değil (T06'da 4 kesişme + "çok kolay" aynı şeyi söylüyordu). **`noDiagCross` eğride varsayılan kapalı kalır**; parametre generator'da duruyor, ileride görsel/okunabilirlik gerekçesiyle açılabilir. open-questions #26 düşük öncelik.

## 3. K serisi: Y değil, "ilk kopya sayısı"

T12 ↔ T13 (Y 20 → 40): kolay → zor. Y etkili, doğru.

Ama **T00 ↔ T14 ↔ T15**: Y 30, p 0,49, D 15,3 üçünde de aynı; tek fark K/PER bölüşümü. T00 "keyifli", T14 ve T15 "zor". Mevcut D bunu göremez çünkü her yerleşimi eşit sayar. Oynanışta bir kelimenin **ilk kopyası pahalı, sonraki kopyaları ucuz**: şekil öğrenildikten sonra kalan kopyalar hızlı bulunur (curve-v02 süre modeli: ilk kopya 6 s, sonrakiler 2,5 s). PER 2'de bu öğrenme kârı yok; 15 farklı şekli sıfırdan aramak gerekiyor.

Yani zorluğu taşıyan Y değil, **K (kaç farklı şekil) ağırlıklı, PER (kaç tekrar) hafif**. Utku'nun "sweet spot 6" sezgisi bununla örtüşüyor: K 6 × PER 5 = 6 pahalı arama + 24 ucuz tekrar.

## 4. D₂: tekrar kopya yarım sayılır

\( D_2 = K \cdot \big(1 + \alpha \cdot (PER - 1)\big) \cdot (1 - p), \quad \alpha = 0{,}5 \)

α = 0,5: tekrar kopya, ilk kopyanın yarısı kadar iş. 17 levelın öznel sıralamasına karşı:

| D₂ | Level | Not | |
|---|---|---|---|
| 5,6 | T06 | çok kolay | ✓ |
| 6,1 | T12 | zor değil | ✓ |
| 7,2 | T01 | zorlanmadım | ✓ |
| 7,4 | T05 / T08 | keyifli / orta-kolay | ✓ |
| 7,5 | T03 | çok kolay | ✓ (eski D'de 13,2 ile yanlış yerdeydi) |
| 8,5 | T02 | keyifli | ✓ |
| 8,9 | T07 | orta-kolay | ✓ |
| 9,0 | T11 | zordu | ✗ (sütun 20, zoom) |
| 9,2 | T00 | keyifli | ✓ |
| 10,2 | T14 | zor | ✓ (eski D'de 15,3 = T00 ile aynıydı) |
| 10,4 | T09 / T09X | zor / biraz daha zor | ✓ |
| 10,9 | T04 | güzel bir zor | ✓ |
| 11,5 | T15 | zor | ✓ (eski D'de 15,3) |
| 11,9 | T10 | zordu baya | ✓ |
| 12,2 | T13 | zor | ✓ |

**17'de 16**; tek aykırı yine T11 (D dışı). Eski D'nin açıklayamadığı üç level (T03, T14, T15) yerine oturdu.

Öznel kademeler: **≤ 7,5 kolay · 8,5–9,5 keyifli (N) · 10–11 zor-adil (H) · ≥ 11,5 zor (S)**.

Sınır: α 17 öznel nottan uyarlandı. `ka-log` gelince α, süre/yerleşim ile ilk-kopya/tekrar-kopya oranından doğrudan ölçülür (beklenen 0,4–0,6).

## 5. Eğriye etkisi

curve-v03 tier'ları (K 4–7, PER 5) D₂ ile aynı sırada; eğri değişmez, hedef sütunu D₂ cinsine çevrildi:

| Tier | K | p | D (eski) | **D₂** |
|---|---|---|---|---|
| F | 4 | 0,54 | 9,2 | 5,5 |
| R | 5 | 0,48–0,51 | 12,1–13,1 | 7,3–7,8 |
| N | 6 | 0,47–0,49 | 15,3–15,8 | 9,2–9,5 |
| H | 6 | 0,39–0,42 | 17,3–18,2 | 10,4–11,0 |
| S | 7 | 0,39–0,43 | 19,8–21,3 | 12,0–12,8 |

Yeni kurallar (ADR-0008 revizyonu):
- **K 6 ana akış tabanı**; R 5, S 7, F 4; K ≥ 8 ana akışta yok (T13 zor + chip 2 satır).
- **PER ≤ 3 zorluk kaldıracı olarak kullanılmaz** (aynı D'de bir kademe zorlaştırıyor ve chip alanını bozuyor). PER 5 sabit; kelimeye göre değişen kopya gelirse alt sınır 4.
- `noDiagCross` varsayılan kapalı.

## 6. Sonraki adımlar

1. `ka-log` dökümü → α kalibrasyonu, ε ve süre/yerleşim'in D₂ ile korelasyonu.
2. İkinci oyuncu ile T00/T04/T10/T14 tekrarı (öğrenme etkisi).
3. Üçüncü set adayları (`difficulty-parameters.md#6`): dolgu–hedef örtüşmesi, ters oranı, özel harf.
4. curve-v03 bake (`tools/bake.js curve` modu) → prototipte oynanabilir 30 level.
