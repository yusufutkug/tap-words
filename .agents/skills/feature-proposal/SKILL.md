---
name: feature-proposal
description: Tap Words için feature, mekanik değişikliği veya parametre önerisini standart formatta docs/ altına yazar; mekanikten türeyen sayıları (hedef hücre oranı, rastgele tap başarı olasılığı) hesaplar. Gameplay, UX, level veya LiveOps agent'ı öneri yazarken veya "öneri hazırla", "seçenekleri yaz" denince kullanılır.
---

# Feature Önerisi

Çıktı: `docs/<alan>/<konu>.md`. Format `.cursor/rules/decision-format.mdc` ile aynıdır; bu skill o formatı doldururken izlenecek adımları ve hesapları verir.

## Akış

1. Problemi tek cümleyle yaz. Kaynağı belirt: prototip gözlemi, `docs/game/mechanic.md#açık-konular`, open-questions, playtest notu.
2. `docs/decisions/` tara: konu kapanmış mı? Kapanmışsa ADR'ye bağla ve "yeniden açma gerekçesi" yaz, yoksa dur.
3. `docs/references/` tara: ilgili kalıp var mı? Yoksa open-questions'a `/market-research` sorusu düş; öneriyi "Referans yok" notuyla yine yaz.
4. 2–3 seçenek üret. Her seçenek için formatın altı başlığını doldur.
5. Mekaniğe dokunan her seçenek için aşağıdaki hesapları yap.
6. "Önerilen"i seç, nedenini bir cümleyle yaz. Karar verme.
7. "Gerekli görüşler"deki her agent için open-questions'a satır ekle.
8. "Sonuçlar / prototip görevi" bölümünde `/prototype` için somut iş yaz: hangi sabit, hangi fonksiyon, toggle mu level alanı mı.

## Hesaplar

Parametreler `docs/game/mechanic.md` tablosundan; değişen değeri belirt.

**Hedef hücre oranı**
\( p = \dfrac{K \times PER \times \bar{L}}{R \times C} \)
K = kelime sayısı, \( \bar{L} \) = ortalama kelime uzunluğu, R×C = grid. Prototip: \( 10 \times 5 \times 5.2 / 500 \approx 0.52 \).

**Rastgele dokunuşta can kaybı olasılığı** ≈ \( 1 - p \) (açılmış yerleşimler hariç; oyun ilerledikçe açık hedef azalır, bu olasılık artar). Level sonuna doğru değeri ayrıca ver.

**Beklenen bedava hata hakkı**: can sayısı / (1 − p). Prototip: 5 / 0.48 ≈ 10 rastgele tap "bedava".

**Taranacak alan**: R×C hücre; zoom'suz okunabilir hücre sayısı UX'ten gelir (açık soru).

Hesabı tabloda göster: `Seçenek | p | 1−p (başlangıç) | 1−p (son 10 hedef) | bedava hata`.

## Dosya iskeleti

```markdown
# <Konu>

- Tarih / sürüm:
- Alan:
- Problem: (tek cümle, kaynak)
- İlgili ADR: (yok / ADR-NNNN)

## Seçenek A — <ad>
### Öneri
### Gerekçe
### Referans
### Trade-off
### Gerekli görüşler
### Ölçüm

## Seçenek B — <ad>
(aynı)

## Karşılaştırma
(hesap tablosu)

## Önerilen
Seçenek X, çünkü …

## Prototip görevi
/prototype için: …

## Açılan sorular
open-questions.md'ye eklenen satırlar
```
