# Modernizacja sklepu PRESCOT LED

## Status dokumentu

- Wersja: 1.0
- Data opracowania: 22 lipca 2026
- Status: plan zatwierdzający zakres; bez rozpoczęcia wdrożenia
- Projekt: `sklepSC`
- Zakres: wiarygodność i formalności, backend checkoutu, wydajność, wyszukiwarka i filtry, konfigurator systemu LED, kompletne zestawy i kompatybilność

## 1. Cel modernizacji

Celem jest przekształcenie obecnego prototypu katalogowo-zakupowego w sklep, który:

- pokazuje prawdziwe i spójne dane sprzedawcy;
- nie składa obietnic handlowych, których system nie potrafi potwierdzić;
- wylicza ceny, dostawę i dostępność po stronie serwera;
- tworzy rzeczywiste zamówienie i bezpiecznie obsługuje płatność;
- nie pobiera całego katalogu 1323 produktów przy wejściu na każdą stronę;
- pozwala szybko znaleźć produkt po nazwie, SKU, EAN i parametrach technicznych;
- dobiera zgodne elementy systemu LED na podstawie jawnych, zatwierdzonych reguł;
- umożliwia zakup kompletnego zestawu bez ryzyka przypadkowego połączenia niezgodnych elementów.

Ten dokument ma być źródłem prawdy dla kolejnych prac. Zmiana zakresu lub decyzji architektonicznej powinna zostać dopisana tutaj przed wdrożeniem.

## 2. Zakres i granice

### W zakresie

- wspólna stopka i prawdziwe dane firmy;
- strony: regulamin, prywatność, cookies, dostawa i płatności, zwroty i reklamacje, formularz odstąpienia, informacje o dostępności;
- przegląd wszystkich obietnic handlowych na stronie;
- backend produktów, cen, stanów, koszyka, zamówień i płatności;
- bezpieczny panel administracyjny lub ograniczony panel operacyjny;
- import katalogu z XML do kontrolowanej warstwy danych;
- optymalizacja obrazów, filmów, JavaScriptu i zapytań katalogowych;
- wyszukiwanie, podpowiedzi, sortowanie, filtry techniczne i stan filtrów w URL;
- model relacji produktowych i reguł kompatybilności;
- konfigurator „Dobierz system LED”;
- gotowe zestawy oraz sekcje „pasuje do” i „potrzebujesz również”;
- testy funkcjonalne, bezpieczeństwa, mobile, dostępności i wydajności dla powyższego zakresu.

### Poza zakresem tej modernizacji

- pełna przebudowa identyfikacji wizualnej;
- migracja na nowy framework tylko dla samej migracji;
- rozbudowany system kont klientów i program lojalnościowy;
- pełna integracja księgowa lub ERP, dopóki nie zostanie wskazany konkretny system i API;
- SEO contentowe, kampanie reklamowe i rozbudowana analityka marketingowa;
- automatyczne projektowanie instalacji elektrycznej zastępujące ocenę technika.

## 3. Stan wyjściowy potwierdzony w projekcie

### 3.1. Technologia

- Sklep jest wielostronicowym projektem HTML/CSS/JavaScript budowanym przez Vite.
- Vite wystawia dziewięć wejść: stronę główną, sklep, produkt, o nas, kontakt, koszyk, blog, checkout i panel administracyjny.
- Nie ma obecnie serwera aplikacyjnego ani bazy danych.
- Koszyk jest zapisany w `localStorage` jako `prescot_cart`.
- Checkout odczytuje koszyk z przeglądarki, symuluje złożenie zamówienia i czyści lokalny koszyk.
- Panel administracyjny korzysta z danych demonstracyjnych i zapisuje zmiany w `localStorage`. Nie jest panelem produkcyjnym.

### 3.2. Katalog produktów

- Katalog zawiera 1323 produkty.
- `js/products-data.js` ma około 3,17 MB i jest dołączany także do stron, które nie potrzebują pełnego katalogu.
- `js/prescot-imported-products.json` ma około 3,17 MB, a źródłowy `prescotcloud.xml` około 11,2 MB.
- Największe kategorie to:
  - akcesoria do taśm LED i zasilaczy: 668 produktów;
  - taśmy LED: 453 produkty;
  - sterowniki LED: 180 produktów;
  - zasilacze LED Scharfer: 20 produktów;
  - koszulki silikonowe PRO: 2 produkty.
- Dane zawierają m.in. cenę, stan, EAN, kod handlowy, kategorię, opis HTML, obrazy, atrybuty i pola GPSR.
- Atrybuty nie są jeszcze w pełni znormalizowane. Przykład: występują warianty `Napięcie wejściowe` i `Napięcie Wejściowe`.
- Stan magazynowy jest zapisany jako tekst, niekiedy z przecinkiem dziesiętnym. Trzeba ustalić jednostkę sprzedaży i zasady zaokrąglania.
- Opisy produktów zawierają HTML pochodzący z importu. Przed renderowaniem w sklepie musi być sanityzowany.
- Warstwa GPSR wskazuje producenta, ale pola adresu i kontaktu są puste.

### 3.3. Wiarygodność i deklaracje handlowe

- W wielu stopkach nadal widnieje `ul. Przykładowa 12, 00-001 Warszawa` i roboczy adres e-mail.
- Ikony Instagram/Facebook prowadzą do `#`.
- Nie ma docelowych stron regulaminu, prywatności, cookies, dostawy, zwrotów i reklamacji.
- Na kartach produktów występują deklaracje m.in. „wysyłka w 24h”, dostawa kolejnego dnia, darmowa dostawa od 500 zł i 30 dni na zwrot.
- Każda taka deklaracja musi zostać potwierdzona przez właściciela sklepu i odwzorowana w regułach backendu. W przeciwnym razie należy ją usunąć albo zastąpić informacją obliczaną na podstawie danych zamówienia.
- Pole `compareAtPrice` nie może automatycznie pełnić roli prawnej „ceny przed obniżką”. Dla komunikowanej promocji potrzebna jest historia cen i prawidłowo wyliczona najniższa cena z właściwego okresu.

### 3.4. Zasoby i wydajność

- Część lokalnych zdjęć waży od około 6 MB do 14,5 MB.
- Niektóre zasoby występują równolegle w `images/` i `public/images/`.
- Katalog zawiera pełne opisy HTML i wszystkie obrazy każdego produktu, choć lista sklepu wykorzystuje tylko mały podzbiór tych danych.
- Ładowanie jednego dużego pliku katalogu zwiększa czas pobierania, parsowania JavaScriptu i blokowania głównego wątku.

## 4. Definicja ukończenia całej modernizacji

Modernizacja jest ukończona dopiero wtedy, gdy spełnione są wszystkie poniższe warunki:

- [ ] Na żadnej publicznej stronie nie ma przykładowych danych firmy ani martwych linków `#`.
- [ ] Każda publiczna deklaracja o cenie, dostawie, stanie, zwrocie i gwarancji ma potwierdzone źródło.
- [ ] Regulamin i dokumenty informacyjne zostały zaakceptowane przez właściciela firmy oraz zweryfikowane prawnie.
- [ ] Dane wymagane dla konkretnego produktu, w tym właściwe informacje GPSR, są widoczne przed zakupem.
- [ ] Cena, podatek, rabat, dostawa, dostępność i suma zamówienia są wyliczane przez backend.
- [ ] Odświeżenie strony, zmiana urządzenia lub modyfikacja danych w przeglądarce nie pozwala zmienić ceny zamówienia.
- [ ] Zamówienie ma trwały identyfikator, historię statusów i nie może powstać podwójnie po ponowieniu żądania.
- [ ] Status płatności jest potwierdzany podpisanym webhookiem operatora, a nie parametrem w adresie URL.
- [ ] Publiczny panel administracyjny nie daje dostępu do danych ani operacji bez uwierzytelnienia i autoryzacji.
- [ ] Strona główna, blog, kontakt i o nas nie pobierają pełnego katalogu produktów.
- [ ] Lista produktów pobiera tylko bieżącą stronę wyników i potrzebne facety.
- [ ] Wyszukiwanie obsługuje nazwę, SKU/kod produktu, EAN i znormalizowane parametry.
- [ ] Filtry działają na mobile, są dostępne z klawiatury i zapisują stan w URL.
- [ ] Konfigurator nie proponuje produktu, jeżeli nie potrafi potwierdzić jego zgodności.
- [ ] Dodanie zestawu do koszyka powoduje ponowną walidację ceny, stanu i kompatybilności po stronie serwera.
- [ ] Krytyczne ścieżki zakupowe przechodzą testy automatyczne i ręczne na 375, 390, 768, 1024 i 1440 px.
- [ ] Budżety wydajności i kryteria dostępności z tego dokumentu są spełnione.

## 5. Dane i decyzje wymagane od właściciela sklepu

Brak poniższych danych nie blokuje przygotowania kodu szkieletowego, ale blokuje produkcyjne uruchomienie odpowiednich funkcji.

| Obszar | Potrzebna decyzja lub materiał | Co blokuje |
|---|---|---|
| Firma | pełna nazwa, forma prawna, adres, NIP, KRS/REGON jeśli właściwe, e-mail, telefon, adres reklamacji i zwrotów | stopkę, kontakt, regulamin, checkout, e-maile |
| Sprzedaż | B2C, B2B czy oba tryby; ceny brutto/netto; obsługiwane kraje i waluty | zasady cen, podatki, formularz checkoutu |
| Zwroty | czy Prescot świadomie oferuje 30 dni, czy stosuje podstawowy termin; wyjątki dla produktów wykonywanych/ciętych na zamówienie | komunikaty produktu i regulamin |
| Dostawa | rzeczywiste metody, cennik, próg darmowej dostawy, limity długości/wagi, odbiór osobisty, godzina graniczna wysyłki | kalkulator dostawy i obietnice terminów |
| Płatności | wybrany operator i podpisana umowa; tryby BLIK/karta/przelew/PayPal, jeżeli mają być dostępne | produkcyjny checkout |
| Magazyn | system będący źródłem stanów, częstotliwość aktualizacji, zasady rezerwacji i jednostki sprzedaży | dostępność i realizację zamówienia |
| Katalog | potwierdzenie, że XML jest źródłem prawdy; częstotliwość i sposób pobierania; zasady dezaktywacji produktów | automatyczny import |
| E-mail | domena nadawcza, skrzynki transakcyjne, operator SMTP/API, treści wiadomości | potwierdzenia zamówień |
| Social media | prawdziwe adresy profili albo decyzja o ukryciu ikon | stopkę i menu mobilne |
| Analityka/cookies | narzędzia konieczne od startu; lista usług zewnętrznych | CMP, politykę prywatności, skrypty zewnętrzne |
| Technika LED | zatwierdzone zasady zapasu mocy, długości odcinków, spadku napięcia, zgodności sterowników, profili i klas IP | konfigurator i zestawy |
| Hosting | docelowa domena, hosting frontendu, backendu, bazy i plików; środowisko staging | wdrożenie i monitoring |

## 6. Docelowa architektura

### 6.1. Kierunek rekomendowany

W pierwszym etapie należy zachować istniejący frontend Vite i stopniowo zastępować jego dane lokalne wywołaniami API. Pozwala to nie przepisywać od razu działającej warstwy wizualnej.

Domyślna propozycja, jeżeli hosting nie narzuci innego rozwiązania:

- frontend: obecny Vite/HTML/CSS/JavaScript, przechodzący na moduły ES;
- backend: Node.js z TypeScript i walidacją schematów wejściowych;
- baza: PostgreSQL;
- migracje bazy uruchamiane automatycznie i wersjonowane w repozytorium;
- obrazy: kontrolowany storage/CDN z generowaniem AVIF/WebP i kilku rozmiarów;
- zadania cykliczne: import XML, odświeżanie stanów i cen, zwalnianie rezerwacji;
- operator płatności: adapter do wybranego dostawcy, bez przechowywania danych kart w sklepie;
- środowiska: development, staging i production z oddzielnymi sekretami i bazami.

Ostateczny wybór backendu i hostingu należy zatwierdzić przed rozpoczęciem fazy bazodanowej. Jeżeli Prescot ma już ERP, platformę sprzedażową lub API zamówień, integracja z tym systemem ma pierwszeństwo przed tworzeniem dublującego panelu.

### 6.2. Przepływ danych

```text
XML / ERP / PIM
      |
      v
Walidowany importer ----> raport błędów i zmian
      |
      v
PostgreSQL: produkty, ceny, stany, atrybuty
      |                         ^
      |                         |
      +---- API sklepu --------+---- panel z logowaniem
      |                              (tylko warstwa ręczna)
      v
Frontend: katalog, produkt, wyszukiwarka, konfigurator
      |
      v
Serwerowa wycena -> zamówienie -> operator płatności
                         ^                |
                         |                v
                         +----------- podpisany webhook
```

### 6.3. Źródła prawdy

| Dane | Źródło prawdy | Zasada |
|---|---|---|
| Nazwa, SKU, EAN, cena bazowa, stan | XML/ERP/PIM | import nieedytowalny ręcznie, chyba że uzgodniono wyjątek |
| Kategorie i atrybuty surowe | XML | zachować wartość źródłową do audytu |
| Atrybuty znormalizowane | reguły importera | wersjonowane mapowanie nazw i wartości |
| Opis marketingowy, wyróżnienie, SEO, materiały własne | warstwa `product_overrides` | import nie może nadpisywać |
| Kompatybilność i konfigurator | relacje i reguły zatwierdzone przez technika | każda zmiana wersjonowana i audytowana |
| Cena transakcji | backend w chwili wyceny | klient przesyła tylko identyfikator i ilość |
| Stan dostępny do sprzedaży | backend/ERP | rezerwacja podczas płatności zgodnie z ustaloną polityką |
| Zamówienie i płatność | baza backendu + webhook operatora | pełna historia zmian statusu |

### 6.4. Minimalny model danych

- `products`: identyfikator, SKU, EAN, slug, nazwa, status, producent, jednostka sprzedaży;
- `categories`: drzewo kategorii i kolejność;
- `product_categories`: relacje wiele-do-wielu;
- `attributes`: kanoniczne definicje parametrów i typ danych;
- `product_attribute_values`: wartości surowe i znormalizowane;
- `product_media`: obraz, film, model 3D, kolejność, alt, warianty rozmiaru;
- `prices`: cena brutto/netto, VAT, waluta, data obowiązywania;
- `price_history`: dane potrzebne do prawidłowej informacji o obniżkach;
- `inventory`: stan, jednostka, dostępność, źródło i czas synchronizacji;
- `product_overrides`: treści ręczne, wyróżnienia i widoczność;
- `product_relations`: relacja, produkt źródłowy, produkt docelowy, priorytet, warunki;
- `configurator_rules`: wersjonowane warunki, kalkulacje i uzasadnienia;
- `quotes`: krótkotrwała, serwerowa wycena koszyka;
- `orders` i `order_items`: zamówienie oraz niezmienny snapshot pozycji;
- `payments` i `payment_events`: próby płatności, identyfikatory operatora i webhooki;
- `shipments`: wybrana metoda, punkt odbioru, koszt, numer przesyłki i status;
- `consents_and_terms`: wersja zaakceptowanego regulaminu i wymagane zgody;
- `admin_users` i `audit_log`: role, operacje administracyjne i ślad zmian.

## 7. Plan wykonawczy

## Faza 0 — zabezpieczenie projektu i pomiary bazowe

### Cel

Ustalić bezpieczny punkt startowy i uniknąć pomieszania istniejących zmian z modernizacją.

### Zadania

- [ ] Spisać bieżące zmienione i nowe pliki; nie usuwać istniejącej pracy użytkownika.
- [ ] Ustalić, które pomocnicze skrypty i zrzuty ekranu są częścią projektu, a które mogą trafić do katalogu narzędziowego lub archiwum.
- [ ] Wykonać build i zapisać wynik jako bazowy raport.
- [ ] Zmierzyć każdą główną trasę na mobile i desktop: transfer, liczbę żądań, LCP, CLS, TBT oraz błędy konsoli.
- [ ] Zrobić bazowe testy ścieżek: wyszukanie produktu, filtr, karta produktu, koszyk i checkout.
- [ ] Utworzyć środowiskowy szablon konfiguracji bez sekretów, np. `.env.example`.
- [ ] Ustalić strategię feature flags dla nowego katalogu, checkoutu i konfiguratora.

### Kryteria odbioru

- [ ] Istnieje raport bazowy, z którym można porównać końcowy wynik.
- [ ] Żaden istniejący plik użytkownika nie został nadpisany lub usunięty bez potwierdzenia.
- [ ] Każda nowa funkcja może być włączana osobno na stagingu.

## Faza 1 — wiarygodność, formalności i kontrola deklaracji

### Cel

Usunąć dane demonstracyjne i przygotować kompletną warstwę informacyjną sklepu. Jest to bramka przed publicznym uruchomieniem sprzedaży.

### 1.1. Jedno źródło danych firmy

- [ ] Zdefiniować dane firmy w jednym pliku konfiguracyjnym lub rekordzie backendu.
- [ ] Objąć nim nazwę, adres, NIP, KRS/REGON jeśli właściwe, e-mail, telefon, godziny kontaktu, adres zwrotów i reklamacji.
- [ ] Zbudować jeden współdzielony komponent stopki zamiast duplikowania HTML na każdej stronie.
- [ ] Podmienić dane na stronie kontaktowej, checkout, stopkach i wiadomościach transakcyjnych.
- [ ] Dla każdego social media wstawić prawdziwy adres albo całkowicie ukryć ikonę.
- [ ] Dodać automatyczny test blokujący build, jeżeli znajdzie `Przykładowa`, `00-001 Warszawa`, roboczy e-mail lub `href="#"` w publicznych linkach.

### 1.2. Dokumenty i linki informacyjne

- [ ] Przygotować strony: Regulamin sklepu, Polityka prywatności, Polityka cookies, Dostawa i płatności, Zwroty i reklamacje.
- [ ] Dodać wzór formularza odstąpienia od umowy w HTML oraz jako dostępny PDF do pobrania.
- [ ] Dodać dane kontaktowe dla reklamacji i zwrotów oraz jasny opis kosztów zwrotu.
- [ ] Zdefiniować wersjonowanie regulaminu i dokumentów. Zamówienie zapisuje zaakceptowaną wersję.
- [ ] Dodać mechanizm preferencji cookies, jeśli pojawią się narzędzia niewymagane do działania sklepu.
- [ ] Skrypty analityczne i marketingowe ładować dopiero po odpowiedniej zgodzie; odrzucenie ma być równie łatwe jak akceptacja.
- [ ] Ustalić, czy Polski Akt o Dostępności ma zastosowanie do firmy. Niezależnie od wyłączeń przyjąć WCAG 2.2 AA jako standard techniczny tej modernizacji.
- [ ] Dokumenty przekazać do końcowej akceptacji osoby odpowiedzialnej i prawnika. Ten plan nie zastępuje porady prawnej.

### 1.3. Audyt obietnic handlowych

- [ ] Wyszukać wszystkie komunikaty o terminie wysyłki, terminie dostawy, darmowej dostawie, zwrocie, gwarancji, promocji i dostępności.
- [ ] Dla każdego komunikatu wskazać właściciela danych i warunek wyświetlenia.
- [ ] „Wysyłka w 24h” pokazywać tylko dla produktu dostępnego i zamówienia spełniającego zatwierdzoną godzinę graniczną.
- [ ] Termin dostawy obliczać z kalendarza roboczego i wybranej metody; nie wpisywać stałej obietnicy w HTML.
- [ ] „Darmowa dostawa od 500 zł” powiązać z serwerową regułą i wyjątkami dla przesyłek dłużycowych.
- [ ] Potwierdzić, czy 30 dni na zwrot jest świadomą korzyścią ponad podstawowy termin sprzedaży internetowej. Jeżeli tak, opisać jej warunki spójnie we wszystkich miejscach.
- [ ] Gwarancję pokazywać z danych konkretnego produktu, nie jako jedną obietnicę dla całego katalogu.
- [ ] Dla komunikowanej obniżki wyświetlać prawidłową najniższą cenę z wymaganego okresu; nie wyliczać jej procentem od ceny bieżącej.

### 1.4. Informacje produktowe i GPSR

- [ ] Uzupełnić nazwę producenta, adres pocztowy i elektroniczny kontakt.
- [ ] Uzupełnić osobę odpowiedzialną, gdy jest wymagana.
- [ ] Przenieść identyfikatory produktu, ostrzeżenia i informacje bezpieczeństwa na kartę produktu w czytelnym miejscu.
- [ ] Nie publikować produktu z wymaganymi, ale pustymi danymi bezpieczeństwa; oznaczyć go w raporcie importu do uzupełnienia.
- [ ] Przechowywać język i źródło każdej informacji bezpieczeństwa.

### Kryteria odbioru fazy 1

- [ ] Brak przykładowych danych i martwych linków w publicznych stronach.
- [ ] Wszystkie wymagane dokumenty są dostępne z każdej strony i w checkout.
- [ ] Komunikaty handlowe są spójne z regulaminem i działaniem systemu.
- [ ] Produkty z brakującymi obowiązkowymi informacjami trafiają do raportu i nie są automatycznie publikowane.
- [ ] Akceptacja biznesowa i prawna została odnotowana z datą oraz wersją dokumentów.

## Faza 2 — warstwa danych, importer i bezpieczny backend

### Cel

Zbudować źródło prawdy dla katalogu, cen, stanów, kompatybilności i późniejszych zamówień.

### 2.1. Szkielet backendu

- [ ] Utworzyć backend jako oddzielną część repozytorium z TypeScript, testami i walidacją schematów.
- [ ] Dodać konfigurację przez zmienne środowiskowe i rozdzielić development, staging i production.
- [ ] Dodać PostgreSQL, migracje i dane startowe tylko dla developmentu.
- [ ] Dodać centralną obsługę błędów, identyfikator żądania, logi strukturalne i healthcheck.
- [ ] Ustawić limity rozmiaru zapytań, rate limiting i bezpieczne nagłówki.
- [ ] Zdefiniować CORS tylko dla dozwolonych domen.
- [ ] Sekrety trzymać poza repozytorium.

### 2.2. Import XML

- [ ] Rozdzielić import na: pobranie, walidację, transformację, zapis i raport.
- [ ] Zachowywać identyfikator źródłowy oraz skrót rekordu, aby wykrywać realne zmiany.
- [ ] Znormalizować kodowanie tekstu i testować polskie znaki.
- [ ] Zmapować warianty nazw atrybutów na klucze kanoniczne.
- [ ] Przeliczyć ceny, stany i wartości liczbowe do typów liczbowych; zachować oryginalną wartość do audytu.
- [ ] Ustalić jednostki: sztuka, metr, rolka, komplet. Nie zaokrąglać stanu bez reguły biznesowej.
- [ ] Sanityzować importowany HTML według listy dozwolonych tagów i atrybutów.
- [ ] Walidować URL obrazów oraz źródło materiałów.
- [ ] Nie nadpisywać ręcznych opisów, wyróżnień i relacji kompatybilności.
- [ ] Dezaktywować brakujący produkt dopiero według zatwierdzonej polityki, np. po kilku kolejnych brakach w źródle.
- [ ] Generować raport: dodane, zmienione, bez zmian, odrzucone, brakujące GPSR, brakujące atrybuty, błędne ceny i stany.
- [ ] Zapewnić idempotencję: ponowny import tego samego pliku nie tworzy duplikatów.

### 2.3. Publiczne API katalogu

- [ ] `GET /api/products` — stronicowanie, sortowanie, zapytanie tekstowe i filtry.
- [ ] `GET /api/products/:slug` — jeden produkt z pełnym opisem i mediami.
- [ ] `GET /api/search/suggestions` — krótkie podpowiedzi nazw, SKU i EAN.
- [ ] `GET /api/categories` — drzewo kategorii.
- [ ] `GET /api/filters` lub facety w odpowiedzi listy — dostępne wartości i liczności.
- [ ] `GET /api/products/:slug/relations` — zgodne, wymagane i alternatywne elementy.
- [ ] Lista ma zwracać tylko pola potrzebne karcie produktu, bez pełnych opisów i wszystkich obrazów.
- [ ] Dodać ETag/Last-Modified, kompresję i kontrolowane nagłówki cache.
- [ ] Udokumentować API i przykładowe błędy.

### 2.4. Panel operacyjny

- [ ] Usunąć publiczny, lokalny charakter `admin.html` albo wyłączyć tę trasę z produkcyjnego buildu do czasu zabezpieczenia.
- [ ] Dodać logowanie, bezpieczną sesję, wylogowanie, ochronę przed próbami siłowymi i role.
- [ ] Minimalne role: administrator, obsługa zamówień, redaktor katalogu, technik zgodności.
- [ ] Ograniczyć ręczną edycję pól źródłowych z XML.
- [ ] Udostępnić warstwę ręczną: opis, widoczność, materiały, relacje, reguły konfiguratora.
- [ ] Zapisywać autora, datę oraz wartości przed i po zmianie.

### Kryteria odbioru fazy 2

- [ ] 1323 produkty importują się bez duplikatów i z raportem jakości.
- [ ] Błędny rekord nie przerywa całego importu i jest wskazany w raporcie.
- [ ] Pełny katalog nie jest wymagany w pamięci przeglądarki.
- [ ] Import nie nadpisuje warstwy ręcznej.
- [ ] Niezalogowany użytkownik nie ma dostępu do danych i operacji panelu.
- [ ] Importowane opisy nie mogą wstrzyknąć skryptu ani niedozwolonego HTML.

## Faza 3 — prawdziwy koszyk, checkout, zamówienie i płatność

### Cel

Zastąpić lokalną symulację przepływem transakcyjnym, w którym backend potwierdza wszystkie wartości.

### 3.1. Koszyk i serwerowa wycena

- [ ] Zachować lokalny koszyk jako wygodny interfejs, ale przechowywać wyłącznie identyfikatory, warianty i ilości.
- [ ] Dodać `POST /api/quotes`, który pobiera aktualne produkty, ceny, stany, podatki, rabaty i dostępne dostawy.
- [ ] Odpowiedź ma zawierać identyfikator wyceny i krótki czas ważności.
- [ ] Każda zmiana ilości, dostawy, kodu rabatowego lub danych wpływających na cenę odświeża wycenę.
- [ ] Pokazać użytkownikowi czytelną informację, gdy cena lub stan zmieniły się od dodania do koszyka.
- [ ] Nie ufać cenie, nazwie, kosztowi dostawy ani sumie przesłanej przez przeglądarkę.
- [ ] Zablokować ilości ujemne, zerowe, nieliczbowe i przekraczające dostępny stan lub regułę jednostki.

### 3.2. Formularz checkoutu

- [ ] Domyślnie umożliwić zakup bez zakładania konta.
- [ ] Ustalić pola dla osoby prywatnej i firmy; NIP i nazwa firmy pokazywać warunkowo.
- [ ] Dodać trwałe, widoczne etykiety, poprawne `autocomplete`, `inputmode` i typy pól.
- [ ] Walidować przy polu po opuszczeniu oraz ponownie na serwerze.
- [ ] Nie usuwać wpisanych danych po odrzuceniu pojedynczego pola.
- [ ] Pokazywać pełne podsumowanie produktów, ilości, cen, podatków, dostawy i sumy bezpośrednio przed przyciskiem zakupu.
- [ ] Wskazać właściwe linki do regulaminu i informacji o odstąpieniu.
- [ ] Oddzielić zgody wymagane do zawarcia umowy od opcjonalnych zgód marketingowych.
- [ ] Utrzymać jednoznaczne oznaczenie przycisku wskazujące obowiązek zapłaty.
- [ ] Podczas wysyłania zablokować przycisk i pokazać stan przetwarzania, aby ograniczyć podwójne kliknięcia.

### 3.3. Dostawa

- [ ] Zaimplementować zatwierdzone reguły DPD, InPost, SUUS/przesyłek dłużycowych i odbioru osobistego albo usunąć metody, które nie będą obsługiwane.
- [ ] Walidować gabaryt, długość, wagę, kod pocztowy i kraj po stronie serwera.
- [ ] Dla punktów odbioru przechowywać identyfikator punktu oraz jego snapshot w zamówieniu.
- [ ] Próg darmowej dostawy liczyć po właściwej podstawie i z uwzględnieniem wyłączeń.
- [ ] Termin prezentować jako estymację obliczaną z dostępności, godziny granicznej, kalendarza i przewoźnika.

### 3.4. Utworzenie zamówienia

- [ ] Dodać `POST /api/orders` przyjmujący identyfikator ważnej wyceny, dane kupującego, dostawę i wersję zaakceptowanych dokumentów.
- [ ] Wykorzystać klucz idempotencji, aby ponowienie żądania nie tworzyło drugiego zamówienia.
- [ ] Zapisać snapshot SKU, nazwy, jednostki, ceny, VAT, ilości i relacji zestawu.
- [ ] Ustalić moment rezerwacji stanu i czas jej wygaśnięcia.
- [ ] Status początkowy: `pending_payment` albo właściwy dla płatności odroczonej.
- [ ] Dodać historię statusów oraz audit log.

### 3.5. Płatność

- [ ] Zintegrować sandbox wybranego operatora przez oficjalne API.
- [ ] Utworzyć sesję płatności wyłącznie dla istniejącego zamówienia i kwoty odczytanej z bazy.
- [ ] Nie zapisywać numerów kart ani danych uwierzytelniających płatność.
- [ ] Zaimplementować podpisany webhook z weryfikacją podpisu, kwoty, waluty i identyfikatora zamówienia.
- [ ] Webhook ma być idempotentny i odporny na zmianę kolejności zdarzeń.
- [ ] Strona sukcesu sprawdza status w backendzie; sam powrót od operatora nie oznacza opłacenia.
- [ ] Obsłużyć: sukces, odrzucenie, anulowanie, wygaśnięcie, ponowienie płatności, webhook opóźniony i zwrot.
- [ ] Po potwierdzeniu wysłać wiadomość transakcyjną i przekazać zamówienie do obsługi/ERP.

### 3.6. Bezpieczeństwo i prywatność

- [ ] Szyfrować ruch HTTPS i oznaczyć cookies sesyjne jako `Secure`, `HttpOnly`, `SameSite` zgodnie z przepływem.
- [ ] Zastosować ochronę CSRF, jeżeli autoryzacja korzysta z cookies.
- [ ] Walidować i kodować dane wyjściowe; nie ufać opisom ani danym klienta.
- [ ] Ograniczyć dane osobowe w logach i ustalić okresy retencji.
- [ ] Dodać backup bazy, test odtworzenia i kontrolę dostępu do danych zamówień.
- [ ] Dodać alerty dla błędów płatności, importu i seryjnych nieudanych prób checkoutu.

### Kryteria odbioru fazy 3

- [ ] Zmiana `localStorage` nie zmienia ceny, dostawy ani stanu zamówienia.
- [ ] Dwa kliknięcia lub powtórzony request tworzą jedno zamówienie.
- [ ] Niepoprawny podpis webhooka nie zmienia statusu płatności.
- [ ] Powrót z płatności bez potwierdzonego webhooka pokazuje stan oczekiwania, nie sukces.
- [ ] Zmiana ceny lub brak stanu przed płatnością powoduje ponowną, czytelną wycenę.
- [ ] Wszystkie metody dostawy i płatności przechodzą scenariusze sandboxowe.
- [ ] E-mail i panel pokazują te same wartości co zapisane zamówienie.

## Faza 4 — wydajność katalogu i mediów

### Cel

Usunąć pełny katalog z początkowego ładowania oraz dostarczać obrazy i kod adekwatne do urządzenia.

### 4.1. Usunięcie monolitycznego katalogu z frontendu

- [ ] Usunąć `js/products-data.js` ze stron: o nas, kontakt, blog, checkout i innych tras, które nie potrzebują listy produktów.
- [ ] Zastąpić globalne `products` warstwą klienta API.
- [ ] Na stronie sklepu pobierać np. 24 pozycje i facety dla bieżącego zapytania.
- [ ] Na karcie produktu pobierać jeden rekord oraz osobno ograniczoną listę relacji.
- [ ] W koszyku wysyłać identyfikatory do serwerowej wyceny zamiast ładować katalog.
- [ ] Przenieść skrypty na moduły ES, aby Vite mógł je analizować, dzielić i hashować.
- [ ] Ładować kod checkoutu, galerii 360°, modelu 3D i konfiguratora tylko na trasach, które go używają.

### 4.2. Obrazy

- [ ] Utworzyć manifest wszystkich używanych obrazów i ich miejsc wykorzystania.
- [ ] Dopiero po potwierdzeniu odwołań usunąć duplikaty między `images/` i `public/images/`.
- [ ] Wygenerować AVIF i WebP oraz kontrolowany fallback dla wymaganych przeglądarek.
- [ ] Przygotować kilka szerokości i użyć `srcset`/`sizes`.
- [ ] Ustawić `width` i `height` albo `aspect-ratio`, aby uniknąć przesunięć układu.
- [ ] Główny obraz LCP ładować priorytetowo i bez `loading="lazy"`.
- [ ] Obrazy poniżej pierwszego ekranu ładować leniwie.
- [ ] Karty produktów nie mogą pobierać zdjęć w rozdzielczości galerii.
- [ ] Dodać sensowne `alt`; obrazy dekoracyjne oznaczyć pustym `alt`.
- [ ] Zewnętrzne obrazy produktowe pobierać i optymalizować tylko przy potwierdzonym prawie do ich użycia, albo korzystać z zatwierdzonego CDN źródła.

### 4.3. Filmy, modele i widoki 360°

- [ ] Filmom nadać poster i `preload="metadata"` lub `none`, zależnie od miejsca.
- [ ] Nie uruchamiać wielu filmów jednocześnie i respektować `prefers-reduced-motion`.
- [ ] Galerię 360° ładować dopiero po zamiarze użytkownika lub wejściu sekcji w pobliże viewportu.
- [ ] Model 3D ładować na żądanie z wyraźnym stanem postępu i fallbackiem.
- [ ] Zweryfikować format, rozmiar oraz licencję każdego ciężkiego materiału.

### 4.4. CSS, fonty i cache

- [ ] Zidentyfikować duplikujące się style inline i przenieść współdzielone reguły do wersjonowanych arkuszy.
- [ ] Usunąć nieużywany CSS dopiero po testach wizualnych wszystkich tras.
- [ ] Ustawić `font-display: swap` i ograniczyć liczbę wariantów fontów.
- [ ] Dla plików z hashem ustawić długi cache; dla HTML krótki cache z rewalidacją.
- [ ] Włączyć Brotli/Gzip dla HTML, CSS, JS, JSON i SVG.

### Budżety wydajności

| Metryka | Cel odbioru |
|---|---|
| Pełny katalog przy wejściu | 0 pobrań `products-data.js` / pełnego JSON |
| Wyniki listy | maks. 24 produkty w jednym żądaniu domyślnym |
| JavaScript danej trasy | docelowo do 200 KB gzip, z osobnymi chunkami funkcji ciężkich |
| Odpowiedź listy produktów | docelowo do 200 KB po kompresji dla strony wyników |
| Obraz karty produktu | właściwy rozmiar urządzenia; orientacyjnie do 100 KB, gdy jakość na to pozwala |
| Główny obraz mobilny | orientacyjnie do 300 KB, bez widocznej degradacji |
| LCP | do 2,5 s w 75. percentylu ruchu |
| INP | do 200 ms w 75. percentylu ruchu |
| CLS | do 0,1 w 75. percentylu ruchu |
| Lighthouse mobile | co najmniej 90 jako bramka laboratoryjna dla reprezentatywnych tras |

Budżety rozmiaru są celami technicznymi, nie powodem do degradacji informacji produktowej. Po publikacji ważniejsze są pomiary realnych użytkowników niż sam wynik laboratoryjny.

### Kryteria odbioru fazy 4

- [ ] Żadna publiczna trasa nie pobiera pełnego katalogu przy starcie.
- [ ] Nie ma lokalnego obrazu 6–14,5 MB pobieranego przez zwykły widok strony.
- [ ] Wszystkie obrazy mają określone wymiary i właściwą strategię ładowania.
- [ ] Funkcje 3D/360°/wideo nie obciążają użytkownika, który ich nie otwiera.
- [ ] Build nie zgłasza ostrzeżeń wynikających z klasycznych, nieprzetwarzanych skryptów aplikacji.
- [ ] Budżety są sprawdzane w CI lub skrypcie audytowym.

## Faza 5 — techniczna wyszukiwarka i filtry

### Cel

Umożliwić znalezienie właściwego produktu bez znajomości struktury katalogu.

### 5.1. Normalizacja danych do wyszukiwania

- [ ] Zdefiniować słownik kanonicznych atrybutów i jednostek.
- [ ] Połączyć warianty nazw, wielkości liter, odstępów i symboli.
- [ ] Rozdzielić wartość liczbową od jednostki, np. `24 V`, `9,6 W/m`, `10 mm`, `1000 lm/m`.
- [ ] Ujednolicić barwy: ciepła/3000 K, neutralna/4000 K, zimna/6000–6500 K oraz systemy CCT/RGB/RGBW/RGBCCT.
- [ ] Rozdzielić parametry zależnie od kategorii. Sterownik nie powinien być filtrowany jak taśma.
- [ ] Zbudować raport pokrycia atrybutów i nie pokazywać pustego filtra dla kategorii, w której nie ma danych.

### 5.2. Zakres wyszukiwarki

- [ ] Wyszukiwanie pełnotekstowe po nazwie, kategorii, kodzie produktu, kodzie katalogowym i producencie.
- [ ] Dokładne oraz prefiksowe dopasowanie SKU i EAN z wyższym priorytetem niż dopasowanie opisowe.
- [ ] Normalizacja wielkości liter, polskich znaków, łączników i popularnych zapisów jednostek.
- [ ] Kontrolowana tolerancja literówek dla nazw; nie stosować fuzzy matching do ceny ani parametrów bezpieczeństwa.
- [ ] Podpowiedzi podczas pisania po krótkim debounce, maksymalnie kilka użytecznych wyników i kategorii.
- [ ] Historia ostatnich wyszukiwań tylko lokalnie i bez danych wrażliwych.

### 5.3. Filtry

Filtry wspólne:

- kategoria i podkategoria;
- dostępność;
- cena;
- producent;
- gwarancja, jeśli dane są kompletne.

Filtry taśm LED:

- napięcie;
- moc W/m;
- jasność lm/m;
- barwa światła/K;
- CRI;
- klasa IP;
- szerokość taśmy;
- typ diody;
- liczba diod/m;
- moduł cięcia;
- długość rolki i sprzedaż na metry;
- typ sterowania: MONO, CCT, RGB, RGBW, RGBCCT, cyfrowe.

Filtry sterowników:

- system/typ światła;
- napięcie wejściowe;
- maksymalny prąd lub moc na kanał;
- liczba kanałów i stref;
- protokół/sposób sterowania;
- zasięg i klasa IP, jeżeli dotyczy.

Filtry zasilaczy:

- napięcie wyjściowe;
- moc;
- maksymalny prąd;
- klasa IP;
- wykonanie i wymiary;
- funkcja ściemniania, jeśli występuje.

Filtry profili i akcesoriów należy opracować po rozdzieleniu obecnej dużej kategorii akcesoriów na sensowne podkategorie.

### 5.4. UX i adres URL

- [ ] Stan przechowywać w URL, np. `?q=cob&category=tasmy&voltage=24V&cct=4000K&ip=IP65&page=2`.
- [ ] Wstecz/dalej w przeglądarce ma odtwarzać wyniki bez utraty stanu.
- [ ] Każdy aktywny filtr pokazać jako możliwy do usunięcia chip.
- [ ] Dodać „Wyczyść wszystkie” oraz licznik wyników przed zatwierdzeniem filtrów na mobile.
- [ ] Na telefonie użyć dostępnego draweru/modalu z blokadą focusu i zachowaniem pozycji listy.
- [ ] Pokazywać liczbę produktów przy wartościach filtra; blokować wartości dające zero, jeżeli nie pomagają w eksploracji.
- [ ] Sortowanie: trafność, popularność jeśli mierzona, cena rosnąco/malejąco, nowość tylko z prawdziwą datą.
- [ ] Stan „brak wyników” ma proponować usunięcie najbardziej ograniczającego filtra, podobne zapytania i kontakt z doradcą.
- [ ] Podpowiedzi wyszukiwarki wdrożyć jako dostępny wzorzec combobox z obsługą klawiatury i czytnika ekranu.
- [ ] Podczas ładowania pokazać skeleton, a poprzednie wyniki zachować do chwili odpowiedzi, jeśli nie wprowadzają użytkownika w błąd.

### 5.5. Telemetria jakości wyszukiwarki

- [ ] Zliczać anonimowo zapytanie, liczbę wyników, użyte filtry i kliknięty produkt dopiero po wdrożeniu właściwej informacji/cookies, jeżeli jest wymagana.
- [ ] Raportować zapytania bez wyników, częste literówki i filtry powodujące ślepe uliczki.
- [ ] Nie przesyłać do analityki EAN/SKU lub treści mogących zawierać dane osobowe bez oceny zasadności.

### Kryteria odbioru fazy 5

- [ ] SKU i EAN prowadzą do właściwego produktu.
- [ ] Każdy filtr ma poprawne wyniki i liczniki dla danej kategorii.
- [ ] Odświeżenie oraz udostępnienie URL odtwarza zapytanie, sortowanie, stronę i filtry.
- [ ] Wyszukiwarka jest w pełni obsługiwana klawiaturą.
- [ ] Brak wyników nie kończy ścieżki pustym ekranem.
- [ ] Przeglądarka nie filtruje lokalnie całych 1323 rekordów.
- [ ] Docelowy czas odpowiedzi API w produkcji: p95 do 400 ms dla listy i do 250 ms dla podpowiedzi, z osobnym pomiarem czasu sieciowego frontendu.

## Faza 6 — model kompatybilności produktów

### Cel

Zbudować kontrolowaną bazę zgodności, z której skorzystają karta produktu, konfigurator i gotowe zestawy.

### 6.1. Typy relacji

| Relacja | Znaczenie | Przykład zastosowania |
|---|---|---|
| `requires` | element konieczny do działania | taśma wymaga zasilacza |
| `compatible_with` | potwierdzona zgodność | taśma 24 V i sterownik 24 V danego typu |
| `recommended_with` | zalecane uzupełnienie | profil, klosz, uchwyt |
| `alternative_to` | zamiennik o podobnej funkcji | inny zasilacz o odpowiednich parametrach |
| `accessory_for` | opcjonalne akcesorium | złączka, przewód, pilot |
| `incompatible_with` | jawnie zabronione połączenie | różne napięcia lub niewłaściwa liczba kanałów |

### 6.2. Reguły techniczne

- [ ] Zdefiniować zgodność napięcia taśmy, sterownika i zasilacza.
- [ ] Zdefiniować zgodność typu sygnału/kanałów: MONO, CCT, RGB, RGBW, RGBCCT, cyfrowe.
- [ ] Uwzględnić maksymalny prąd/moc sterownika na kanał i łącznie.
- [ ] Uwzględnić moc zasilacza, zatwierdzony zapas oraz ewentualne ograniczenia obciążenia.
- [ ] Uwzględnić szerokość taśmy, światło i wymiary użytkowe profilu.
- [ ] Uwzględnić środowisko/IP całego zestawu, a nie tylko jednego elementu.
- [ ] Uwzględnić moduł cięcia, długość rolki, maksymalny odcinek zasilania i sposób prowadzenia przewodów zgodnie z wiedzą techniczną Prescot.
- [ ] Dla złączek uwzględnić szerokość PCB, liczbę żył i typ powłoki.
- [ ] Każdej regule nadać wersję, autora, datę akceptacji i krótkie uzasadnienie.
- [ ] Brak danych traktować jako „niepotwierdzone”, a nie jako zgodność.

### 6.3. Workflow zatwierdzania

- [ ] Automatycznie wygenerować kandydatów relacji z parametrów.
- [ ] Pokazać kandydatów technikowi do zatwierdzenia lub odrzucenia.
- [ ] Nie publikować automatycznie relacji o krytycznym znaczeniu.
- [ ] Po zmianie parametrów produktu oznaczyć zależne relacje do ponownej weryfikacji.
- [ ] Raportować produkty bez wystarczających danych do dobrania kompletu.

### Kryteria odbioru fazy 6

- [ ] Nie da się zatwierdzić zestawu z różnym napięciem elementów.
- [ ] Sterownik nie jest proponowany poza swoim limitem prądu/mocy i typem kanałów.
- [ ] Profil mieści daną taśmę według zatwierdzonych wymiarów.
- [ ] Produkty z brakami danych są oznaczone, a system nie zgaduje zgodności.
- [ ] Każda opublikowana relacja ma pochodzenie i historię zmian.

## Faza 7 — konfigurator „Dobierz system LED”

### Cel

Przeprowadzić klienta od zastosowania do kompletnego, technicznie zweryfikowanego koszyka.

### 7.1. Zakres pierwszej wersji

Pierwsza wersja powinna obejmować najczęstszy, dobrze opisany przypadek: taśma LED, zasilacz, profil/klosz, sterownik lub ściemniacz oraz podstawowe akcesoria. Nietypowe instalacje należy skierować do konsultacji.

### 7.2. Proponowany przebieg

1. Miejsce zastosowania: kuchnia, salon, łazienka, schody, meble, witryna, zewnętrzne lub „inne”.
2. Funkcja światła: dekoracyjne, robocze, główne/wysoka jasność.
3. Łączna długość i liczba odcinków.
4. Środowisko: suche, wilgotne, narażone na wodę/warunki zewnętrzne.
5. Barwa/system: stała biel, CCT, RGB, RGBW, RGBCCT lub efekt cyfrowy.
6. Sterowanie: włącznik, ściemnianie, pilot, aplikacja lub system wskazany w ofercie.
7. Preferencje montażowe: profil nawierzchniowy, wpuszczany, narożny albo pomoc w doborze.
8. Wynik: jeden zestaw rekomendowany oraz maksymalnie dwie sensowne alternatywy.

Na każdym kroku konfigurator ma pokazywać postęp, krótkie wyjaśnienie parametru i możliwość powrotu bez utraty danych.

### 7.3. Obliczenia

Podstawowe wzory do implementacji po zatwierdzeniu przez technika:

```text
moc_obciążenia = długość_taśmy_m × moc_taśmy_W_na_m
moc_minimalna_zasilacza = moc_obciążenia × zatwierdzony_współczynnik_zapasu
prąd_obciążenia = moc_obciążenia / napięcie_systemu
```

- [ ] Współczynnik zapasu ma pochodzić z reguły Prescot, nie być zakodowaną na stałe uniwersalną wartością.
- [ ] Obliczenia uwzględniają liczbę odcinków, maksymalną długość zasilania i zatwierdzone reguły spadku napięcia.
- [ ] Ilości uwzględniają moduł cięcia, jednostkę sprzedaży i długość rolki.
- [ ] Wynik wskazuje przyjęte założenia i powód doboru każdego elementu.
- [ ] Jeśli zestaw wymaga wiedzy o przewodach, zabezpieczeniach lub warunkach, których klient nie podał, konfigurator zatrzymuje automatyczny dobór i proponuje konsultację.

### 7.4. UX wyniku

- [ ] Pokazać komplet elementów, ilości, aktualną dostępność, cenę i przewidywaną dostawę z backendu.
- [ ] Rozróżnić: wymagane, zalecane i opcjonalne.
- [ ] Umożliwić zmianę elementu wyłącznie na potwierdzoną alternatywę.
- [ ] Po zmianie automatycznie przeliczyć cały zestaw i ponownie sprawdzić zgodność.
- [ ] Dodać „Dodaj cały zestaw do koszyka” oraz możliwość zapisania/udostępnienia konfiguracji bez danych osobowych.
- [ ] Zestaw w koszyku zachowuje identyfikator konfiguracji, wersję reguł i skład.
- [ ] Przed dodaniem i ponownie w checkout backend sprawdza ceny, stany oraz zgodność.
- [ ] Dodać wydruk/podsumowanie techniczne do konsultacji; nie przedstawiać go jako projektu elektrycznego.

### 7.5. Obsługa błędów i dostępność

- [ ] Utrata połączenia nie może skasować odpowiedzi użytkownika.
- [ ] Brak wyniku ma podać konkretny powód i możliwy następny krok.
- [ ] Każdy krok jest dostępny klawiaturą, ma widoczne etykiety i komunikaty błędów.
- [ ] Nie opierać wyboru wyłącznie na kolorze lub animacji.
- [ ] Respektować `prefers-reduced-motion`.
- [ ] Na mobile stały CTA nie może zasłaniać pytań ani błędów.

### Kryteria odbioru fazy 7

- [ ] Zestawy referencyjne przygotowane przez technika dają taki sam wynik w konfiguratorze.
- [ ] Nie można uzyskać kombinacji z błędnym napięciem, typem sterowania, przekroczoną mocą lub niedopasowanym profilem.
- [ ] Brak kluczowego parametru prowadzi do konsultacji, nie do zgadywania.
- [ ] Każdy wynik wyjaśnia dobór i rozdziela elementy wymagane od opcjonalnych.
- [ ] Cały przepływ działa na 375 px i bez myszy.
- [ ] Zestaw jest ponownie walidowany przy dodaniu do koszyka i przed utworzeniem zamówienia.

## Faza 8 — kompletne zestawy i rekomendacje na karcie produktu

### Cel

Wykorzystać zatwierdzony model kompatybilności poza konfiguratorem.

### 8.1. Karta produktu

- [ ] Dodać sekcję „Do działania potrzebujesz” dla elementów wymaganych.
- [ ] Dodać „Pasuje do” dla potwierdzonych relacji.
- [ ] Dodać „Możesz również potrzebować” dla akcesoriów opcjonalnych.
- [ ] Pokazać najważniejszy warunek zgodności obok każdego produktu, np. `24 V`, `CCT`, `PCB 10 mm`.
- [ ] Nie wyświetlać niedostępnego elementu bez dostępnego zamiennika lub jasnej informacji.
- [ ] Umożliwić dodanie kilku elementów jednym działaniem, ale pokazać ich osobne ceny i ilości.

### 8.2. Kontrola kompletności koszyka

- [ ] Rozpoznawać, że klient dodał taśmę bez wymaganego źródła zasilania lub sterowania.
- [ ] Pokazać neutralne ostrzeżenie i zgodne propozycje; nie blokować zakupu, jeśli zakup pojedynczego komponentu jest legalny i biznesowo dopuszczony.
- [ ] Rozpoznawać jawną niezgodność elementów i wymagać poprawienia zestawu przed zakupem, jeżeli mogłaby prowadzić do błędnego lub niebezpiecznego użycia.
- [ ] Ponownie przeliczać wymagane ilości po zmianie długości taśmy.

### 8.3. Gotowe zestawy zastosowań

- [ ] Przygotować pilotażowo niewielką liczbę zestawów o wysokim pokryciu danych, np. blat kuchenny, schody, witryna i wilgotne pomieszczenie.
- [ ] Każdy zestaw ma mieć właściciela merytorycznego, opis zastosowania, ograniczenia, skład, wersję i datę weryfikacji.
- [ ] Zestaw nie może przechowywać stałej sumy; backend wycenia aktualne składniki.
- [ ] Brak jednego składnika uruchamia tylko zatwierdzoną alternatywę albo oznacza zestaw jako czasowo niedostępny.
- [ ] Umożliwić dopasowanie długości, ale tylko w granicach zatwierdzonych reguł.

### Kryteria odbioru fazy 8

- [ ] Żadna rekomendacja nie pochodzi wyłącznie z podobieństwa nazwy lub wspólnej kategorii.
- [ ] Każda pozycja zestawu ma rolę: wymagana, zalecana albo opcjonalna.
- [ ] Zmiana ilości aktualizuje zależne elementy i serwerową wycenę.
- [ ] Niedostępne zamienniki są proponowane tylko po potwierdzeniu pełnej zgodności.
- [ ] Koszyk i zamówienie zachowują informację, że pozycje pochodzą z jednego zestawu.

## Faza 9 — testy końcowe, staging i publikacja

### 9.1. Testy automatyczne

- [ ] Jednostkowe: parser XML, normalizacja jednostek, ceny, stany, historia cen, reguły dostawy i kompatybilności.
- [ ] Integracyjne: import do bazy, API katalogu, serwerowa wycena, utworzenie zamówienia, webhook i rezerwacja stanu.
- [ ] E2E: wyszukanie produktu, filtrowanie, konfigurator, zestaw, koszyk, checkout, sukces i błąd płatności.
- [ ] Test powtórzeń: podwójne kliknięcie, retry sieciowe, ponowiony webhook i odświeżenie strony sukcesu.
- [ ] Test zmiany ceny/stanu między koszykiem, wyceną, zamówieniem i płatnością.
- [ ] Testy uprawnień panelu dla każdej roli.
- [ ] Skan zależności i sekretów w repozytorium.

### 9.2. Testy ręczne

- [ ] Widoki 375, 390, 768, 1024 i 1440 px oraz telefon w orientacji poziomej.
- [ ] Chrome, Edge, Firefox i Safari w aktualnych wspieranych wersjach.
- [ ] Klawiatura, czytnik ekranu, zoom 200%, zwiększony rozmiar tekstu i reduced motion.
- [ ] Wolne połączenie, zerwane połączenie i ponowienie żądania.
- [ ] Bardzo długie nazwy produktów, brak obrazu, brak atrybutu, stan zerowy i duża ilość.
- [ ] Adres polski, firma, paczkomat/punkt, przesyłka dłużycowa i odbiór osobisty.
- [ ] Sandbox każdej metody płatności i dostawy.

### 9.3. Staging i migracja

- [ ] Staging ma osobną bazę, klucze sandbox, adres e-mail testowy i blokadę indeksowania.
- [ ] Wykonać pełny próbny import oraz porównać ceny i stany z systemem źródłowym.
- [ ] Wykonać próbne zamówienia end-to-end i potwierdzić ich obsługę operacyjną.
- [ ] Właściciel zatwierdza formalności, katalog, checkout, konfigurator i zestawy osobnymi checkpointami.
- [ ] Przygotować instrukcję cofnięcia każdego feature flag oraz backup przed migracją.
- [ ] Nie uruchamiać produkcyjnej płatności przed poprawnym odbiorem webhooków i zamówień na stagingu.

### 9.4. Monitoring po publikacji

- [ ] Błędy frontendu i backendu z identyfikatorem żądania.
- [ ] Dostępność API, opóźnienia, błędy 4xx/5xx i czas zapytań bazy.
- [ ] Nieudane importy i różnice cen/stanów.
- [ ] Porzucone lub wielokrotnie odrzucane płatności bez zapisywania wrażliwych danych.
- [ ] Core Web Vitals z realnego ruchu.
- [ ] Zapytania wyszukiwarki bez wyników i reguły konfiguratora kończące się konsultacją.
- [ ] Alert, jeżeli brakuje aktualizacji stanów albo cen dłużej niż ustalony limit.

### Kryteria publikacji

- [ ] Zero błędów blokujących i brak otwartych ryzyk bezpieczeństwa wysokiej wagi.
- [ ] Podpisany odbiór treści prawnych i danych firmy.
- [ ] Testowe zamówienie, płatność, webhook, e-mail i obsługa zamówienia zakończone sukcesem.
- [ ] Wyniki wydajności mieszczą się w budżecie albo każde odstępstwo ma zaakceptowany plan naprawczy.
- [ ] Jest procedura obsługi awarii płatności, błędnego stanu i nieudanego importu.
- [ ] Backup i procedura odtworzenia zostały praktycznie sprawdzone.

## 8. Kolejność i zależności

| Kamień milowy | Zawartość | Zależność | Złożoność |
|---|---|---|---|
| M0 | decyzje właściciela, baseline, feature flags | brak | mała |
| M1 | dane firmy, dokumenty, audyt deklaracji | dane właściciela i akceptacja prawna | średnia |
| M2 | backend, baza, importer, bezpieczny panel | hosting i źródło katalogu | duża |
| M3 | serwerowa wycena, zamówienie, dostawa, płatność | M1, M2, operatorzy | duża |
| M4 | API katalogu i optymalizacja zasobów | M2 | średnia/duża |
| M5 | wyszukiwarka i filtry | M2, normalizacja danych | średnia |
| M6 | model kompatybilności | M2, wiedza techniczna Prescot | duża merytorycznie |
| M7 | konfigurator | M3, M5, M6 | duża |
| M8 | zestawy i rekomendacje | M3, M6 | średnia |
| M9 | pełne QA, staging i publikacja | M1–M8 | duża |

Rekomendowana kolejność wdrożenia: `M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 → M9`.

M4 i część M1 mogą być prowadzone równolegle z backendem po ustaleniu kontraktów API, ale produkcyjny checkout nie może zostać uruchomiony bez M1–M3. Zestawy oraz konfigurator nie powinny powstać przed zatwierdzeniem modelu kompatybilności.

## 9. Checkpointy akceptacyjne

Po każdym punkcie wymagane jest krótkie potwierdzenie przed przejściem dalej:

1. **Checkpoint A — dane i zasady firmy:** prawdziwe dane, sprzedaż B2C/B2B, zwroty, dostawy i płatności.
2. **Checkpoint B — architektura:** hosting, backend, baza, źródło katalogu i sposób integracji z obecnym systemem.
3. **Checkpoint C — formalności:** zatwierdzone dokumenty, deklaracje handlowe i GPSR.
4. **Checkpoint D — transakcje:** zgodność wyceny, zamówienia, płatności i stanów na sandboxie.
5. **Checkpoint E — dane katalogowe:** zaakceptowane mapowanie kategorii, atrybutów i jednostek.
6. **Checkpoint F — kompatybilność:** technik zatwierdza reguły i zestawy referencyjne.
7. **Checkpoint G — konfigurator:** odbiór scenariuszy i sposobu wyjaśniania wyniku.
8. **Checkpoint H — release:** odbiór stagingu, formalności, wydajności, dostępności i procedur operacyjnych.

## 10. Główne ryzyka i sposoby ograniczenia

| Ryzyko | Skutek | Ograniczenie |
|---|---|---|
| Nieznane źródło prawdy dla ceny i stanu | sprzedaż po błędnej cenie lub produktu bez stanu | serwerowa wycena, timestamp synchronizacji, blokada przy nieaktualnych danych |
| Import nadpisuje pracę ręczną | utrata opisów i relacji | oddzielna warstwa `product_overrides` i test idempotencji |
| Niejednolite atrybuty | złe filtry i dobór | słownik kanoniczny, raport pokrycia, ręczna akceptacja mapowania |
| Zgadywana kompatybilność | błędny lub niebezpieczny zestaw | status „niepotwierdzone”, wersjonowane reguły, odbiór technika |
| Deklaracje 24h/30 dni/500 zł niezgodne z operacją | utrata zaufania i ryzyko prawne | centralne reguły backendu i audyt wszystkich komunikatów |
| `compareAtPrice` użyte jako cena referencyjna promocji | błędna informacja o obniżce | historia cen i jawna reguła najniższej ceny |
| Puste dane GPSR | niepełna oferta produktu | walidacja importu i blokada publikacji brakujących rekordów |
| Lokalny panel admina | nieautoryzowane zmiany i brak audytu | wyłączenie z produkcji do czasu logowania, ról i logów |
| Duże media i pełny JSON | słaba wydajność mobile | API stronicowane, warianty obrazów, lazy loading, budżety CI |
| Podwójne zamówienie lub webhook | duplikaty i błędne płatności | idempotency keys, unikalne ograniczenia i obsługa powtórzeń |
| Brak decyzji operatora/hostingu | przestój prac backendowych | checkpoint B przed implementacją zależną od dostawcy |
| Treści prawne tworzone bez weryfikacji | niezgodność z realną działalnością | prawnik i właściciel akceptują finalne wersje |

## 11. Pierwszy pakiet wdrożeniowy po zatwierdzeniu planu

Pierwszy pakiet powinien być mały, odwracalny i przygotować podstawę pod resztę:

1. Utworzyć raport bazowy i test wykrywający dane demonstracyjne.
2. Wydzielić konfigurację danych firmy oraz współdzieloną stopkę.
3. Dodać docelowe trasy dokumentów z oznaczeniem treści oczekujących na dane/akceptację; nie publikować pustych tekstów jako finalnych.
4. Sporządzić rejestr wszystkich deklaracji 24h, 30 dni, darmowej dostawy, gwarancji i promocji.
5. Zaprojektować kontrakt API oraz schemat bazy bez jeszcze uruchamiania płatności.
6. Zbudować nowy importer XML z raportem jakości i warstwą nadpisań.
7. Wystawić na stagingu pierwsze stronicowane `GET /api/products`.
8. Usunąć pełny katalog z jednej mało ryzykownej trasy i porównać wynik wydajności.

Po odbiorze tego pakietu można bezpiecznie rozpocząć checkout oraz migrację całej listy produktów.

## 12. Źródła referencyjne

Wymagania prawne muszą zostać odniesione do konkretnego modelu działalności i zweryfikowane przez prawnika. Poniższe materiały są podstawą checklisty technicznej:

- [UOKiK — sprzedaż poza lokalem i na odległość](https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/sprzedaz-poza-lokalem-i-na-odleglosc/)
- [UOKiK — prawo do informacji i przycisk z obowiązkiem zapłaty](https://prawakonsumenta.uokik.gov.pl/pytania-i-odpowiedzi/prawo-do-informacji/)
- [UOKiK — informacje o obniżkach cen](https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/informacje-o-obnizkach-cen/)
- [UOKiK — terminy odstąpienia od umowy](https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/terminy-odstapienie/)
- [EUR-Lex — rozporządzenie 2023/988 GPSR, w szczególności art. 19](https://eur-lex.europa.eu/eli/reg/2023/988/oj)
- [Gov.pl — Polski Akt o Dostępności i handel elektroniczny](https://www.gov.pl/web/dostepnosc-cyfrowa/polski-akt-o-dostepnosci--uslugi-handlu-elektronicznego)
- [UODO — materiały o cookies i zarządzaniu zgodą](https://uodo.gov.pl/pl/file/5869)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [web.dev — natywny lazy loading obrazów](https://web.dev/articles/browser-level-image-lazy-loading)
- [web.dev — optymalizacja długich zadań JavaScript](https://web.dev/articles/optimize-long-tasks)

## 13. Rejestr decyzji

| Data | Decyzja | Uzasadnienie | Osoba zatwierdzająca |
|---|---|---|---|
| 2026-07-22 | Zachować istniejący frontend podczas pierwszych faz i modernizować go przyrostowo | ograniczenie ryzyka oraz ochrona wykonanej pracy wizualnej | do potwierdzenia |
| 2026-07-22 | Rozdzielić dane importowane i ręczne nadpisania | kolejne importy XML nie mogą kasować treści ani kompatybilności | do potwierdzenia |
| 2026-07-22 | Nie budować konfiguratora przed modelem kompatybilności | wynik musi być technicznie uzasadniony | do potwierdzenia |
| 2026-07-22 | Backend jest źródłem ceny, stanu, dostawy i statusu płatności | przeglądarka nie może zatwierdzać danych transakcyjnych | do potwierdzenia |

