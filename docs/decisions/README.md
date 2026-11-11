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
| [ADR-0008](ADR-0008-zorluk-indeksi.md) | Zorluk indeksi D = Y × (1 − p); p kaldıraç, tier'lar D bandıyla; kısa kelime yolu büyük tahtaya tercih | Kabul |
