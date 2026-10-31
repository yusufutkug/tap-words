# Prototip Changelog

`/prototype` her değişiklikte buraya satır ekler. En yeni üstte.

| Tarih | Değişiklik | Neden (ADR / öneri) | Nasıl denenir | Doküman etkisi |
|---|---|---|---|---|
| 2026-10-23 | v18 — başlangıç durumu: 20×25, PER=5, 5 can, 3 ipucu, 5 tema, pan/zoom, harfleri topla modu | — | Dosyayı tarayıcıda aç | `docs/game/mechanic.md` bu sürümü tarif eder |
| 2026-10-31 | Dosya `index.html` olarak yeniden adlandırıldı; `<!DOCTYPE>`, `charset`, mobil `viewport` (user-scalable=no, viewport-fit=cover), PWA meta'ları eklendi. Oynanış değişmedi. | GitHub Pages'te mobil Chrome'da oynanabilirlik | https://yusufutkug.github.io/tap-words/ | — |
| 2026-10-31 | UX Amaze GO! düzenine geçti (`docs/ux/figma ui elements/gameplay_UI_elements_20x20.png`): kompakt HUD (geri · Seviye N + canlar · altın yer tutucu, 44 px; eskiden ~150 px), tema barı, rozetli chip'ler (kalan kopya), tek renk kahverengi şerit, alt sırada ipucu + yeniden başlat, 50 px banner yer tutucu. Zoom butonları, ilerleme sayacı, yardım metni ve koyu tema kaldırıldı; level seçimi ve "harfleri topla" ayarı geri okundan açılan alt sayfaya taşındı. "Harfleri topla" varsayılan **açık**. `PAD` 48→16 (tahta karta daha çok sığıyor). Oynanış kuralları değişmedi. | Netleşenler + Amaze GO! sadelik ilkesi (ADR-0001) | https://yusufutkug.github.io/tap-words/ | — |
| 2026-10-31 | Banner yer tutucu kaldırıldı (tahta alanı +60 px; ADR-0002 Unity spec'i için geçerli, prototip simüle etmiyor). 50 level eklendi (45 yeni tema, 10 kelime, 4–8 harf); son level `localStorage`'da hatırlanıyor; level listesi kaydırılabilir. Test: her level 10× üretildi, hepsi başarılı. Bulgu: palindrom ve alt-kelime içeren listeler üretimi bozuyor → mechanic.md generator kurallarına eklendi. | Utku isteği | https://yusufutkug.github.io/tap-words/ | — |
