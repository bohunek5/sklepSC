# Zestaw przekazany z Prescot

`zestaw.html` odbiera zestaw przygotowany w asystencie na stronie Prescot.
Adres zawiera w hashu parametr `set`: JSON z wersją protokołu, parametrami
doboru oraz identyfikatorami i ilościami produktów. Nie przyjmuje cen ani opisów
z adresu. `js/set-handoff.js` sprawdza parametry i ponownie oblicza zestaw.

Nazwy, zdjęcia i ceny pochodzą z katalogu sklepu. Użytkownik widzi podsumowanie
i sam dodaje zestaw do `prescot_cart`. Poprzednie pozycje pozostają w koszyku.
Ponowne otwarcie tego samego podsumowania nie dodaje automatycznie kolejnych
sztuk. Dane wejściowe z niezgodnymi identyfikatorami są odrzucane.

`js/set-assistant/engine.mjs` i `catalog.json` są kopiami plików z projektu
`prescotpl/shop-assistant/`. Zmiany reguł doboru oraz eksportu danych należy
synchronizować w obu repozytoriach. Ceny w podsumowaniu korzystają z pola
`price` obecnego katalogu sklepSC i są opisane jako netto.

Testy przepływu znajdują się w projekcie Prescot:

```sh
# Z serwerem Prescot na 4178 i sklepSC na 4179:
node scripts/check-set-panel.mjs
BROWSER=webkit node scripts/check-set-panel.mjs
# Test pod docelową ścieżką produkcyjną:
BUILT_SHOP_URL=http://127.0.0.1:4180/sklepSC/ node scripts/check-set-fallbacks.mjs
```

Nowa strona jest wejściem kompilacji w `vite.config.js`. Opublikuj sklepSC
przed zmianą odnośnika lub protokołu przekazania na stronie Prescot.
