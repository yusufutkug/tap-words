# Tasarım İlkeleri (Pillars)

**Durum: TASLAK.** Prototipten çıkarılmış ilk ilkeler; Utku onaylayana kadar "güçlü varsayım" muamelesi görür. Onaylanınca bu satır silinir ve her değişiklik ADR gerektirir.

Öneriler bu ilkelerle çelişemez. Çelişiyorsa ya öneri değişir ya da ilke için ADR açılır.

## 1. Tek dokunuş, tam ödül

Kelimeyi bulmak tek dokunuştur; sürükleme, seçme, onaylama yoktur. Eşik bu kadar düşük kaldığı sürece oyun "herkes oynayabilir" sınıfında kalır. Dokunuşa adım ekleyen her öneri bu ilkeyle çatışır.

## 2. Tap ile pan asla karışmaz

Oyuncu tahtayı kaydırırken yanlışlıkla can kaybetmez, dokunmak isterken tahta kaymaz. Kamera ve input kararlarında bu ilke estetikten önce gelir.

## 3. Ceza adil, görünür ve anında

Can sadece dolgu hücresine dokununca gider; tahtada görünmeyen bir kural yoktur. Kaza eseri oluşan kelimeler generator'da temizlenir, oyuncu "ama bu da kelimeydi" diyemez. Ceza anında geri bildirim verir (kızarma + sallanma).

## 4. Bulmak koleksiyondur

Aynı kelimeyi 5 kez bulmak "tamamlama" hissi verir; chip sayaçları, uçan harfler ve bump bunun ödülüdür. Bulma anının feedback zinciri (şerit → uçuş → sayaç) kısaltılmaz, ancak hızlandırılabilir.

## 5. Tahta sakin, UI konuşur

Tahta beyaz zemin + siyah harf; tema, dekor ve efekt tahtanın dışında yaşar. Okunabilirlik tahtada tartışılmaz.

## 6. Zorluk parametreyle gelir, hileyle değil

Zorluk, mekaniğin kaldıraçlarından (grid, PER, yön, uzunluk, can) kurulur; sahte zaman baskısı, görünmez harf gibi mekaniğe yabancı engellerle değil. Yeni bir engel öneriliyorsa önce mevcut kaldıraçlarla aynı etki alınabilir mi diye sorulur.

## 7. İçerik ucuz, küratörlük pahalı

Generator parametrik olduğu için tahta üretmek bedava. Değer, kelime havuzunun kalitesinde ve zorluk eğrisinin ritminde. Level sayısı değil, level hissi tartışılır.
