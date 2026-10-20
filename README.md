# Náklady Obytňák Boxer – PWA

Evidence nákladů na stavbu obytňáku Peugeot Boxer (Matěj Mechl, Terezka a Anička).

## Nasazení
Nahrajte celý obsah složky na libovolný statický HTTPS hosting (GitHub Pages, Netlify, Cloudflare Pages…).
Funguje i z podsložky (všechny cesty jsou relativní). Service worker a instalace vyžadují HTTPS (nebo http://localhost).

## Instalace do telefonu
- **Android / Chrome:** otevřete adresu → tlačítko „📲 Nainstalovat aplikaci“ nebo menu ⋮ → „Přidat na plochu / Nainstalovat“.
- **iPhone / Safari:** Sdílet → „Přidat na plochu“.

## Data
Data se ukládají jen v zařízení (localStorage). Každý telefon má svá data – pro přenos/zálohu použijte „Záloha JSON“ a „Obnovit zálohu“.

## Aktualizace
Po změně souborů zvyšte `VERSION` v `sw.js` (např. `obytnak-v2`); nová verze se projeví po druhém spuštění aplikace.
