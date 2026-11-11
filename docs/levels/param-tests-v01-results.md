# Parametre Keşif Seti v01 — Sonuçlar (ilk oynanış)

- Tarih: 2026-11-11
- Alan: level-design (ana sohbet)
- Veri: Utku'nun T00–T11 oynanış notları (`param-tests-v01.md` level tablosu "zorluk" sütunu, 1 oyuncu, 1 oynanış/level, sıralı). Sayısal log (`ka-log`) henüz alınmadı; bu rapor öznel sıralamaya dayanır ve log geldiğinde güncellenir.
- Çıkan karar: ADR-0008 (zorluk indeksi D, p kaldıraç). Devam: `curve-v03.md`, `param-tests-v02.md`.

## 1. Notlar, p'ye göre sıralı

| Level | p | Y | Not |
|---|---|---|---|
| T01 | 0,20 | 12 | kısaydı, zorlanmadım |
| T02 | 0,29 | 18 | keyifli |
| T10 | 0,34 | 30 | zordu baya |
| T04 | 0,39 | 30 | güzel bir zor |
| T09 | 0,42 | 30 | zordu — kesişen çaprazlar |
| T00 | 0,49 | 30 | keyifli |
| T11 | 0,50 | 30 | bu p'ye göre zordu; harfler küçüldü |
| T07 | 0,51 | 30 | orta-kolay |
| T05 | 0,59 | 30 | keyifli; ileri seviye için kolay |
| T08 | 0,59 | 30 | orta-kolay |
| T03 | 0,69 | 42 | çok kolay; p bu kadar yüksek ancak oyun başında |
| T06 | 0,69 | 30 | çok kolay |

p tek başına açıklamıyor: T01 (p 0,20) kolay, T10 (p 0,34) zor. Fark yerleşim sayısı.

## 2. Zorluk indeksi D = Y × (1 − p)

Y = kaç kez bulmak gerekiyor, (1 − p) = tahtanın dolgu payı. Çarpım "gürültü içinde arama sayısı"; `curve-v02`'deki Poisson modeliyle aynı şey (beklenen yanlış tap = ε·Y, ε dolgu payıyla orantılıysa ∝ D).

| D | Level | Y | p | Not | Uyum |
|---|---|---|---|---|---|
| 9,4 | T06 | 30 | 0,69 | çok kolay | ✓ |
| 9,6 | T01 | 12 | 0,20 | zorlanmadım | ✓ |
| 12,4 | T05 | 30 | 0,59 | keyifli / kolay | ✓ |
| 12,4 | T08 | 30 | 0,59 | orta-kolay | ✓ |
| 12,7 | T02 | 18 | 0,29 | keyifli | ✓ |
| 13,2 | T03 | 42 | 0,69 | çok kolay | ~ (bir kademe aşağı; Y 42 uzun ama risksiz) |
| 14,8 | T07 | 30 | 0,51 | orta-kolay | ✓ |
| 15,0 | T11 | 30 | 0,50 | **zordu** | ✗ — sütun 20, zoom |
| 15,3 | T00 | 30 | 0,49 | keyifli | ✓ |
| 17,4 | T09 | 30 | 0,42 | zordu | ✓ |
| 18,2 | T04 | 30 | 0,39 | güzel bir zor | ✓ |
| 19,8 | T10 | 30 | 0,34 | zordu baya | ✓ |

12 levelda 11'i tek sayıyla sıralanıyor; tek aykırı T11 ve nedeni D'nin dışında (okunabilirlik). Öznel kademeler:

| D | His | Tier karşılığı (curve-v03) |
|---|---|---|
| ≤ 10 | çok kolay | F |
| 12–13 | kolay / keyifli | R |
| 15 | orta, keyifli | N |
| 17–18 | zor ama adil | H |
| ≥ 20 | zor | S |

## 3. Gömülü karşılaştırmaların sonucu

| Çift | Sonuç |
|---|---|
| p 0,69: T03 (PER 7) ↔ T06 (7 harf) | İkisi de "çok kolay". Üst uçta zorluk = p; kopya sayısı ile uzunluk arasında fark hissedilmedi. |
| p 0,59: T05 (6 harf) ↔ T08 (17×15) | "keyifli" ↔ "orta-kolay". Tutarlı; küçük tahta hafifçe daha zor hissettiriyor. |
| p ≈ 0,50: T00 ↔ T07 ↔ T11 | T07 (karışık uzunluk) ≈ T00: uzunluk **dağılımı** etkisiz. T11 (sütun 20) zor: **/ux #11 doğrulandı, 17 sütun sınır.** |
| PER 2–3 (T01, T02) | Kolay — ama p ile birlikte Y de düştü (12, 18). PER düşürmek risk kaldıracı değil, "kısa level" kaldıracı. PER'i izole etmek için Y sabit tutulmalı → `param-tests-v02` K serisi (K 10 × PER 3, K 15 × PER 2). |

## 4. Tahtada doğrulanan gözlemler

**Çapraz kesişme (T09 notu).** SE ve SW yönlü iki çaprazın hücre paylaşmadan görsel X yaptığı yer sayıldı:

| T00 | T01 | T02 | T03 | T04 | T05 | T06 | T07 | T08 | T09 | T10 | T11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 2 | 4 | 2 | 3 | **4** | 2 | 2 |

T09'da 4 kesişme var ama T06'da da 4 var ve T06 "çok kolay". Kesişme tek başına zorlaştırmıyor; p yüksekken hedef bolluğu altında kayboluyor, p 0,42'de hissediliyor. Mevcut generator kuralı yalnızca **paralel komşu** çaprazı engelliyor, X'i değil. → `noDiagCross` generator parametresi eklendi (`tools/bake.js`, `index.html`), T09X aynı kelimelerle 0 kesişme (`param-tests-v02.md`).

**T04 vs T10 (D 18,2 vs 19,8).** İkisi de zor ama T04 "güzel", T10 "baya". Aynı Y'de T04 küçük tahta + kısa kelime, T10 büyük tahta + normal kelime. İpucu: aynı D'de **kısa kelime yolu** büyük tahta yolundan daha adil hissettiriyor (tarama yükü düşük, risk yüksek). curve-v03'te H ve S tier bu yolla kuruldu.

## 5. Sınırlar

- Tek oyuncu, tek oynanış, sıralı (öğrenme ve yorgunluk etkisi; T10 son sıralardaydı).
- Öznel kademeler; `ka-log` (`ms`, `wrongTaps`, `wrongAt`) D ile aynı sırayı veriyor mu doğrulanmalı. Dökmek için: `copy(JSON.parse(localStorage.getItem("ka-log")))`.
- ε'nin mutlak değeri hâlâ yok; ADR-0004'teki 3 can için fail oranı türetilemiyor.

## 6. Sonraki adımlar

1. ADR-0008: D zorluk indeksi, p kaldıraç olarak kabul.
2. `curve-v03.md`: tier'lar D hedefiyle (F 9 / R 12,5 / N 15,3 / H 17–18 / S 20–21).
3. `param-tests-v02.md`: T09X (kesişme), T12–T15 (K serisi, p sabit).
4. Log + ikinci oyuncu ile bu raporun sayısal doğrulaması.
