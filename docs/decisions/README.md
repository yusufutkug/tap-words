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
