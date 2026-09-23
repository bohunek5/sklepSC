# Dostęp do podglądu

GitHub Pages publikuje wynik `npm run build:protected`. Każdy plik HTML z `dist`
jest szyfrowany AES-256-GCM i zastępowany ekranem logowania. Bez poprawnego loginu
i hasła przeglądarka nie odszyfruje dokumentu. Podstrony są objęte tą samą blokadą.
Klucz bieżącego wdrożenia pozostaje w sessionStorage danej karty przez maksymalnie
4 godziny. Przycisk „Wyloguj z podglądu” usuwa sesję. Nowe wdrożenie wymaga logowania.

To ograniczenie dostępu do podglądu, a nie serwerowa autoryzacja. Repozytorium
i jego historia są publiczne. Obrazy, filmy, skrypty i dane statyczne pozostają
publicznie dostępne. Nie należy publikować tu poufnych materiałów.

`preview-access.json` zawiera publiczny klucz RSA oraz zaszyfrowany klucz prywatny.
Hasło i login nie są zapisane w repozytorium. PBKDF2-SHA-256 (600 000 iteracji)
wyprowadza klucz z obu danych logowania. RSA-OAEP-SHA-256 pozwala CI szyfrować
kolejne wdrożenia samym kluczem publicznym, bez dostępu do hasła.

Zmiana danych dostępu: przekaż obiekt JSON z polami `username` i `password` przez
standardowe wejście do `node scripts/configure-preview.mjs`, zaktualizuj wygenerowany
`preview-access.json` i opublikuj nowe wdrożenie. Nie zapisuj danych w plikach
śledzonych przez Git ani w historii poleceń. Hasło powinno mieć co najmniej 12 znaków.

`npm run build` pozostaje lokalnym buildem bez blokady. Workflow publikacyjny
używa wyłącznie `npm run build:protected` i przerywa publikację przy błędzie szyfrowania.
