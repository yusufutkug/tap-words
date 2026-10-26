# Tap Words

Mobil casual kelime oyunu. Klasik word search ile "tap-to-reveal" karışımı: oyuncu kelimeyi sürüklemez, kelimeye ait **herhangi bir harfe tek dokunuş** kelimenin tamamını açar. Yanlış harf (dolgu harfi) can götürür.

Çalışan prototip: `kelime-avi (18).html` (tek dosya, vanilla JS). Mekaniğin kesin kuralları `docs/game/mechanic.md` dosyasındadır; prototip ile doküman çelişirse prototip kazanır ve doküman güncellenir.

## Çalışma modeli

Bu proje bir ekip gibi çalışır: ana sohbet (Utku + ana agent) karar vericidir, uzman subagent'lar `.cursor/agents/` altında tanımlıdır. Agent'lar birbirleriyle doğrudan konuşamaz; **`docs/` altındaki dosyalar ortak hafızadır.** Her agent oradan okur, oraya yazar.

| Agent | Alan | Yazdığı yer |
|---|---|---|
| `/gameplay` | Mekanik, feature, modifier, zorluk kaldıraçları | `docs/gameplay/` |
| `/ux` | Akış, dokunma hissi, feedback, okunabilirlik, onboarding | `docs/ux/` |
| `/level-design` | Zorluk eğrisi, kelime havuzu, generator parametreleri, level ritmi | `docs/levels/` |
| `/liveops` | Event, takvim, ekonomi (can/ipucu/booster), retention, monetizasyon | `docs/liveops/` |
| `/market-research` | Referans oyunların analizi | `docs/references/` |
| `/prototype` | HTML prototipi değiştirir, deneyleri uygular | `kelime-avi (18).html`, `docs/prototype/` |

## Herkesin okuması gereken dosyalar

Her görevin başında, alanın ne olursa olsun:

1. `AGENTS.md` (bu dosya)
2. `docs/game/mechanic.md` — mekaniğin kesin kuralları ve parametreleri
3. `docs/game/pillars.md` — tasarım ilkeleri; öneriler bunlarla çelişemez
4. `docs/decisions/` — alınmış kararlar; tekrar açılmaz, üstüne inşa edilir
5. `docs/open-questions.md` — sana yöneltilmiş soru var mı?

Sonra kendi alanının klasörü ve ilgili `docs/references/*.md`.

## Ortak kurallar

- **Referanssız öneri yok.** Her öneri en az bir referans oyuna veya prototipten gelen bir gözleme dayanır. Referans oyun `docs/references/` içinde yoksa önce `/market-research`'e soru düş.
- **Ölçümsüz öneri yok.** Her öneri hangi metrikle doğrulanacağını söyler (ör. level fail rate, yanlış tap/level, D1 retention, session length).
- **Kararı agent vermez.** Agent seçenek ve gerekçe üretir; karar ana sohbette verilir ve `docs/decisions/` altına ADR olarak yazılır.
- **Başka alanın görüşü gerekiyorsa** `docs/open-questions.md` dosyasına ekle; o agent'ı sen çağırmazsın, ana sohbet yönlendirir.
- **Sadece `/prototype` koda dokunur.** Diğer agent'lar HTML'i okuyabilir, değiştiremez.
- Dil: dokümanlar Türkçe, kod ve dosya adları İngilizce.
- Terminoloji: `docs/game/mechanic.md` içindeki "Terimler" bölümünü kullan; eş anlamlı türetme.

## Ürün kısıtları

Kararlaştırılmış, tartışılmayan kısıtlar. Detay ilgili ADR'de.

- **Gameplay ekranında banner reklam alanı var** (ADR-0002). Ekran yerleşimi, tahta sığdırma ve okunabilirlik hesapları bu alan düşülerek yapılır.
- **Referans oyunlar** (ADR-0001): sadelik/genel tasarım için Amaze GO!, level zorluk parametreleri için Word Search Explorer.

## Çıktı formatı

Öneri içeren her doküman `.cursor/rules/decision-format.mdc` içindeki formata uyar: Öneri → Gerekçe → Referans → Trade-off → Gerekli görüşler → Ölçüm.
