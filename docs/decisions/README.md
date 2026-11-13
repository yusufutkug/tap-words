# Kararlar (ADR)

Ana sohbette verilen her tasarım kararı burada bir dosya olur: `ADR-NNNN-<kisa-konu>.md`. Numara artan sıra, dört hane.

Agent'lar bu klasörü her görevin başında okur. Kapanmış konu tekrar açılmaz; açılacaksa yeni ADR eski ADR'yi "supersedes" ile işaret eder.

## Şablon

```markdown
# ADR-NNNN: <Başlık>

- Tarih: YYYY-MM-DD
- Durum: Kabul | Reddedildi | Supersedes ADR-XXXX | Superseded by ADR-YYYY
- Alan: gameplay | ux | levels | liveops | prototype
- Kaynak öneri: docs/<alan>/<dosya>.md

## Karar
Tek paragraf: ne yapıyoruz.

## Gerekçe
Neden bu seçenek.

## Reddedilen seçenekler
- Seçenek B — neden değil
- Seçenek C — neden değil

## Sonuçlar
Prototipte ne değişecek (/prototype için görev), hangi dokümanlar güncellenecek, hangi metrik takip edilecek.
```

## Dizin

| ADR | Konu | Durum |
|---|---|---|
| [ADR-0001](ADR-0001-referans-oyunlar.md) | İlk tur referans oyunlar: Amaze GO! (sadelik), Word Search Explorer (level zorluğu) | Kabul |
| [ADR-0002](ADR-0002-gameplay-banner.md) | Gameplay ekranında banner reklam alanı | Kabul |
| [ADR-0003](ADR-0003-ekonomi-modeli.md) | Ekonomi: coin + shop (WSE kalıbı), booster coin + RV, çıkışta 2–4 booster, mevcut ipucu kalkar | Kabul |
| [ADR-0004](ADR-0004-can-sistemi.md) | Can: genel havuz yok, level içi 3 can, play-on RV + coin, restart reklamsız (E1 kapandı) | Kabul |
| [ADR-0005](ADR-0005-offline-generator.md) | Level üretimi offline, Unity yalnızca pre-baked JSON okur; daily paketi tarih anahtarlı | Kabul |
| [ADR-0006](ADR-0006-dil.md) | Çıkış TR + EN; altyapı 5 dile hazır | Kabul |
| [ADR-0007](ADR-0007-cikis-event-seti.md) | Çıkış event seti: Daily Challenge, Daily Goals, Daily Rush (merdiven), coin mini-oyunu, haftalık kavanoz koleksiyonu | Kabul |
| [ADR-0008](ADR-0008-zorluk-indeksi.md) | Zorluk indeksi D₂ = K·(1+0,5(PER−1))·(1−p); p kaldıraç, tier'lar D₂ bandıyla; kısa kelime yolu; K 6 taban, PER 5 sabit (rev. 12 Kas) | Kabul |
| [ADR-0009](ADR-0009-tahta-boyutlari.md) | Tahta boyutları telefon oranında (≈ 1,4): F 12×17, R 14×19, N/H 15×21, S 16×23; 17×26 event rezervi; sütun değişken, küçük tahta = büyük hücre | Kabul |
| [ADR-0010](ADR-0010-funnel-modeli.md) | Funnel: Amaze GO! modeli — tier dizisi `FRNNHRHRNS` + `RNHRNHRNNS` döngüsü, tier parametre seti (F `disjoint`, S `bigram`, özel ≤ %10 H/S, can 3, ters 0,20 sabit), tema havuzu; elle level tablosu yok | **Taslak** (playtest sonrası) |
