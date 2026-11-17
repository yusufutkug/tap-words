# ADR-0011: Level bileşimi — tier = D₂ bandı + tarifler (K 3–7), yön profilleri, kelime rolleri, hizalı kopya kuralı, intro bloğu

- Tarih: 2026-11-17
- Durum: **Taslak** (Funnel E / F playtest'i sonrası Kabul; K1 "funnel kararı". ADR-0008, ADR-0009 ve ADR-0010'un ilgili maddelerini yeniden açar — gerekçe aşağıda)
- Alan: levels, gameplay, prototype
- Kaynak öneri: `docs/levels/funnels-v02.md`; `docs/references/maze-out.md`; Utku (16 Kas, Funnel D oynanışı sonrası): "ters düz çapraz oranları her levelda yakın", "süper hard'lar çok zor; ilk 100 için süper hard tanımımız hard olsun", "kelime tipleri çok yakınsıyor", "tam yan yana aynı kelime hoşuma gitmedi", "tek bir tipten yakalamayalım", "tarifler K 3 – K 7 aralığına açılsın", "pattern yaratmayalım, sınırlayalım", "ilk 10 level intro".

## Karar

Level, tier'ın tek parametre setinden üretilmez; **tier yalnızca bir D₂ bandıdır** (K 4,8–6,0 · O 6,5–7,5 · Z 8,5–9,5 · ÇZ ≤ 11,0) ve her levelda dört şey seed'li çekilişle seçilir: **(1) tarif** — o banda düşen kelime sayısı / uzunluk / grid kalıbı, K 3–7 (K: `K4` `K5` `K3` `KD`; O: `O5` `O4` `O6`; Z: `Z6` `Z5` `Z7`; ÇZ: `X6` `X7`); **(2) yön profili** — karışık %40, düz %20, çapraz ağırlıklı %20, ters ağırlıklı %20; **(3) kelime rolü** — ayrışan (dolgu o kelimenin harflerini kullanmaz) ve fener (2+ harfi Ç Ğ Ö Ş Ü) kombinasyonları, desen yok, sınırlı (level başına ≤ 3 ve kelimelerin ≤ yarısı, ÇZ'de ≤ 1, aynı kombinasyon art arda ≤ 2, 10'luk sette 3–7 rollü level); **(4) tam hizalı aynı kelime çifti** varsayılan yok, 10'luk set başına bir levelda en fazla bir çift. Art arda iki level tarif / profil / rol üçlüsünün en az ikisinde farklıdır; tepe sonrası level K bandının alt ucundadır. İlk 100 levelda **ÇZ = eski H bandı** (D₂ ≤ 11, `freq` dolgu, `bigram` yok). İlk 10 level ayrı **intro bloğudur**: L1–4 minik tahta (6×8 → 10×13), 2–3 kopya, yatay → dikey → çapraz sırasıyla açılır; PER 5 L5'te, ilk Z L9–10'da; yeni tarif / profil / rol önce planlı bir levelda görünür, sonra çekilişe girer. PER 5 (L5+), can 3 ve minimum kelime 4 harf değişmez. Üretim `tools/bake.js compose` (config `tools/funnel-<x>.json`, tema bankası `tools/word-bank.json`).

## Gerekçe

- Funnel D'de (ADR-0010 kalıbı, tier başına tek parametre seti) levellar birbirine benziyordu: ters 0,20 ± 0,04, çapraz 0,32 ± 0,05, tier başına tek (K, Σ, grid); 39 levelda 46 tam hizalı aynı kelime çifti; ÇZ D₂ 11,3–11,9 + `bigram` "çok zor".
- MazeOut ana seti (`docs/references/maze-out.md`) çeşitliliği kademenin içinde kuruyor (100 levelda 57 tahta boyutu), zor ile çok zoru yapısal olarak aynı tutuyor, yeni öğeyi zordan sonraki küçük levelda tanıtıyor, ilk 10 leveli ayrı intro olarak veriyor.
- Keşif seti v03: dolgu–hedef örtüşmesi %0'da süre −%50, özel harf %40'ta −%45 → ayrışan ve fener rolleri ölçülmüş iki kolaylaştırıcının kelime ölçeğine indirilmiş hâli. Ters yazım ±%9 → yön profili zorluk değil çeşitlilik aracı.
- Feasibility (16–17 Kas, bake): 12 tarifin hepsi üretiliyor; iki funnel × 100 level 0 doğrulama hatası.

## Reddedilen seçenekler

- **Tier başına tek tarif, yalnız yön / rol çeşitlensin** — "tek tipten yakalamayalım" şikâyetini çözmez; 6 kelime × 5 harf yine her Z'de.
- **Set başına sabit rol kotası (2 ayrışan + 1 fener)** — Utku: "pattern olmasın".
- **Tam hizalı kopyayı tamamen yasaklamak** — Utku: "yasak olmasın, frekansı çok düşük olsun".
- **ÇZ'yi D₂ 11,3–11,9 + `bigram`'da tutmak** — D oynanışında çok zor; `bigram` ileri levellara (100+) saklanır.
- **Yalnız çapraz tahta (çapraz %100)** — komşu çapraz şerit kuralıyla üretilemiyor; çapraz ağırlıklı profil ≥ 0,45 pay ve p ≤ 0,53 ile sınırlı.
- **7 kelimeyi K'ya indirmek** — D₂ ≤ 6 için p ≥ 0,71 gerekir, üretilemez; 7 kelime yalnız Z / ÇZ tarifi.

## Yeniden açma gerekçesi

- **ADR-0008** ("K 6 taban; F 4, R 5, S 7", "PER 5 sabit"): K tier'a değil tarife bağlanır (3–7); D₂ formülü ve bantla tier tanımı aynen kalır. PER yalnız intro L1–4'te 2–3 (FTUE; L5'ten itibaren 5). Gerekçe: aynı bantta tek K, levelları tek tipe indiriyor (D oynanışı).
- **ADR-0009** (dört boyut, oran ≈ 1,4): intro tahtaları 6×8, 7×9, 8×11, 10×13 (oran 1,29–1,38); E 12×16 / 14×18 / 15×20 (D'deki gibi bir satır kısa); F ayrıca 11×15, 13×17, 16×21. 17 sütun üst sınırı ve "küçük tahta = büyük hücre" korunur. Gerekçe: MazeOut intro kalıbı ve tier içi boyut çeşitliliği.
- **ADR-0010** (tier parametre seti + tier etiketli liste havuzu): dizi + tier modeli kalır; "tier parametre seti" → tarif kümesi, "liste havuzu" → tema bankasından D₂ hedefine göre kelime seçimi olur; "ters 0,20 sabit, çapraz nominal %50" → yön profili.

## Sonuçlar

- `/prototype` (yapıldı, 17 Kas): `tools/bake.js` — `generate()` opsiyonel `axisW`, `sepWords`, `allowStack`; `compose` modu; `pack` yeni alanlar. A–D ve test çıktıları birebir aynı. `index.html` — `?funnel=e|f`, menü etiketi (tarif · profil · rol), sütun ≤ 10 tahtada hücre tavanı 40 px, `ka-log` alanları `recipe`, `dirProfile`, `roles`, `sep`, `fener`, `revShare`, `diagShare`, `fillOverlap`, `stacks`.
- `/level-design` (yapıldı, 17 Kas): `tools/word-bank.json` (118 tema, 1.103 kelime, 68 fener); `tools/funnel-e.json`, `tools/funnel-f.json`; `funnel-e|f-levels.js`; Unity paketleri `levels/funnel-e.json`, `levels/funnel-f.json`.
- Dokümanlar: `level-format.md` (yeni alanlar, tier kodları I/K/O/Z/X), `mechanic.md` (generator kuralları, terimler), `uncertainties.md`, `open-questions.md` #30–#32.
- **Açık:** E mi F mi (dizi) — ADR-0010'a yazılır; tarif eşdeğerliği, rol ve dolgu katsayısı — `ka-log` ile (`funnels-v02.md#ölçüm`); tutmazsa D₂'ye katsayı eklenir (ADR-0008 revizyonu). Unity ekibi E/F kabul edilene kadar A–D paket şemasını bozmayan ek alanları yok sayabilir (hepsi opsiyonel).
- Ölçüm: ilk-deneme kazanma K, O ≥ 0,98 · Z ≥ 0,93 · ÇZ ≥ 0,85; aynı tier'ın tarifleri arasında süre medyanı farkı ≤ %25; rollü level süresi rolsüze göre −%10 … −%30; c = yanlış tap / D₂ 0,08–0,13.
