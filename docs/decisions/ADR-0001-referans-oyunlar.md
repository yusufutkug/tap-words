# ADR-0001: İlk tur referans oyunlar

- Tarih: 2026-10-26
- Durum: Kabul
- Alan: tümü
- Kaynak öneri: ana sohbet (Utku)

## Karar

İlk turda iki referans oyun analiz edilir ve her biri belirli bir soruya cevap olarak kullanılır:

| Oyun | Geliştirici | Hangi soruya referans |
|---|---|---|
| **Amaze GO!** | Oakever Games | Genel tasarım hatları ve **basitlik yaklaşımı**: görsel sadelik, tek dokunuş hissi, can/hata feedback'i, HUD yoğunluğu, ekran akışı. Tap-to-clear + "yanlış dokunuş can götürür" mekaniği Tap Words'e doğrudan akraba. |
| **Word Search Explorer** | PlaySimple Games | **Level tasarımı ve zorluk parametreleri**: tahta boyutu ve kelime sayısı dönüşümü (56/42 harf ritmi), fail state olmadan ilerleme kontrolü, level ritmi, monetizasyon girişinin levelle zamanlaması. |

Diğer aday oyunlar (`docs/references/README.md`) sonraki turlara kalır.

## Gerekçe

Beş-altı oyunu yüzeysel incelemek yerine iki oyunu derin incelemek; her birinin hangi karar için kullanılacağı baştan belli olduğu için agent'lar alıntı yaparken dağılmaz. Amaze GO! "ne kadar sade kalacağız" sorusunun, Word Search Explorer "levelları nasıl parametreleyeceğiz" sorusunun ölçütüdür.

## Reddedilen seçenekler

- Aday listenin tamamını tek turda analiz etmek — yüzeysel kalır, karar bağı zayıf.
- Wordscapes / Words of Wonders'ı level referansı almak — kelime oluşturma (anagram) mekaniği; word search'e daha uzak. LiveOps turunda değerlendirilebilir.

## Sonuçlar

- `/market-research` iki oyun için `docs/references/amaze-go.md` ve `docs/references/word-search-explorer.md` üretir.
- `/ux` ve `/gameplay` sadelik kararlarında Amaze GO! dosyasına; `/level-design` eğri kararlarında Word Search Explorer dosyasına referans verir.
- Not: "Amaze Go Arrow Puzzle" adlı Chrome eklentisi farklı bir üründür; karıştırılmaz.
