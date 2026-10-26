# Referans Oyunlar

Her referans oyun tek dosya: `<oyun-adi>.md` (küçük harf, tire). Dosyalar `/market-research` tarafından `.cursor/skills/analyze-reference-game` şablonuyla üretilir ve tüm agent'lar tarafından okunur.

Diğer agent'lar bir referansa ihtiyaç duyup burada bulamazsa `docs/open-questions.md` dosyasına `/market-research` için soru düşer.

## Ham malzeme

Analiz için ham malzeme `docs/references/raw/<oyun-adi>/` altına konur: ekran görüntüleri, gameplay video transkriptleri, store sayfası metni, güncelleme notları, APK'dan çıkarılmış config/string dosyaları, Utku'nun playtest notları. Agent APK oynayamaz; neyi analiz edebildiği bu klasördeki malzemeyle sınırlıdır.

Not: Decompile edilmiş kodu veya asset'leri kopyalamak yok; config/level yapısı okumak ve kalıp çıkarmak var.

## Dizin

| Oyun | Neden referans | Dosya | Durum |
|---|---|---|---|
| Amaze GO! (Oakever Games) | Genel tasarım ve basitlik yaklaşımı; tap-to-clear + can mekaniği akrabası (ADR-0001) | `amaze-go.md` | Analiz edildi + **APK analizi** (2026-10-26; level JSON, config, A/B parametreleri) — bkz. `amaze-go.md#apk-analizi` |
| Word Search Explorer (PlaySimple) | Level tasarımı ve zorluk parametreleri; fail state'siz ritim; banner/interstitial zamanlaması (ADR-0001, ADR-0002) | `word-search-explorer.md` | Analiz edildi + **APK analizi** (2026-10-26; 3510 level verisi, config) — bkz. `word-search-explorer.md#apk-analizi` |

## Aday liste (sonraki turlar)

- Word search tarafı: Wordscapes Search, Word Search Pro
- Tap/seek-and-find hissi: Find Out, Hidden Folks, Seek & Find türevleri
- Kelime oyunu LiveOps kalıpları: Wordscapes, Words of Wonders, Word Trip
- Genel casual LiveOps/ekonomi: Royal Match, Toon Blast
