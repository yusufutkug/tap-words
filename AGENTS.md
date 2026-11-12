# Tap Words

Mobil casual kelime oyunu. Klasik word search ile "tap-to-reveal" karışımı: oyuncu kelimeyi sürüklemez, kelimeye ait **herhangi bir harfe tek dokunuş** kelimenin tamamını açar. Yanlış harf (dolgu harfi) can götürür.

Çalışan prototip: `index.html` (tek dosya, vanilla JS). Mekaniğin kesin kuralları `docs/game/mechanic.md` dosyasındadır; prototip ile doküman çelişirse prototip kazanır ve doküman güncellenir.

**Asıl oyun Unity'de ayrı bir geliştirici ekibi tarafından yapılacak.** HTML prototipi yalnızca oynanış hissini (tap, feedback, tahta parametreleri) denemek içindir; UI, ekran akışı, ekonomi, reklam entegrasyonu gibi konular prototipte değil **`docs/` altındaki spesifikasyonlarda** yaşar. Agent'lar çıktılarını "Unity ekibine teslim edilecek spec" netliğinde yazar; prototipe "bunu da ekleyelim" demeden önce "bu oynanış hissi için mi gerekli?" diye sorar.

## Çalışma modeli

Bu proje bir ekip gibi çalışır: ana sohbet (Utku + ana agent) karar vericidir, uzman subagent'lar `.cursor/agents/` altında tanımlıdır. Agent'lar birbirleriyle doğrudan konuşamaz; **`docs/` altındaki dosyalar ortak hafızadır.** Her agent oradan okur, oraya yazar.

| Agent | Alan | Yazdığı yer |
|---|---|---|
| `/gameplay` | Mekanik, feature, modifier, zorluk kaldıraçları | `docs/gameplay/` |
| `/ux` | Akış, dokunma hissi, feedback, okunabilirlik, onboarding | `docs/ux/` |
| `/level-design` | Zorluk eğrisi, kelime havuzu, generator parametreleri, level ritmi | `docs/levels/` |
| `/liveops` | Event, takvim, ekonomi (can/ipucu/booster), retention, monetizasyon | `docs/liveops/` |
| `/market-research` | Referans oyunların analizi | `docs/references/` |
| `/prototype` | HTML prototipi değiştirir, deneyleri uygular | `index.html`, `docs/prototype/` |

## Herkesin okuması gereken dosyalar

Her görevin başında, alanın ne olursa olsun:

1. `AGENTS.md` (bu dosya)
2. `docs/game/mechanic.md` — mekaniğin kesin kuralları ve parametreleri
3. `docs/game/pillars.md` — tasarım ilkeleri; öneriler bunlarla çelişemez
4. `docs/decisions/` — alınmış kararlar; tekrar açılmaz, üstüne inşa edilir
5. `docs/open-questions.md` — sana yöneltilmiş soru var mı?
6. `docs/uncertainties.md` — karar bekleyen belirsizlikler ve bağımlılıkları; önerin bunlardan birine bağlıysa numarasını yaz (ör. "0.1'e bağlı")

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
- **Ekonomi** (ADR-0003): coin + shop, WSE kalıbı; booster coin + RV; çıkışta 2–4 booster. **Can** (ADR-0004): genel havuz yok, level içi 3 can, play-on RV + coin. **Generator** (ADR-0005): offline üretim, Unity yalnızca JSON okur. **Dil** (ADR-0006): TR + EN. **Çıkış event seti** (ADR-0007): Daily Challenge, Daily Goals, Daily Rush, coin mini-oyunu, haftalık kavanoz koleksiyonu. Backend yok. **Zorluk** (ADR-0008, rev. 12 Kas): hedef **D₂ = K · (1 + 0,5(PER − 1)) · (1 − p)**; p kaldıraçtır (0,39–0,59), tier'lar D₂ bandıyla (F ≤ 6, R 7–8, N 9–9,5, H 10,4–11, S 12–13); **K 6 taban** (F 4, R 5, S 7), **PER 5 sabit** (≤ 3 kaldıraç değil); zorlaştırmak için kısa kelime, büyük tahta veya daha çok kelime değil; sütun 17; çapraz kesişme kaldıraç değil. Eğri `docs/levels/curve-v03.md`, parametre kataloğu `docs/levels/difficulty-parameters.md`.
- **Execution planı:** `docs/planning/execution-plan-v01.md` — 2 sprint, üç akış (GP/LO/OR) + SPEC; kapılar K1–K4. Agent'lar görevlerini bu plandaki kapıya göre önceliklendirir.
- **Netleşenler (26 Ekim, ADR bekliyor):** kopya sayısı kelimeye göre değişir, kelime listesi tek satır chip; bulunan harfler tahtadan gider; pan/zoom kalır; yanlış dokunuş kalıcı işaretlenir. Detay: `docs/uncertainties.md#netleşenler`.

## Çıktı formatı

Öneri içeren her doküman `.cursor/rules/decision-format.mdc` içindeki formata uyar: Öneri → Gerekçe → Referans → Trade-off → Gerekli görüşler → Ölçüm.
