// Smart Search Placeholder Animation
document.addEventListener('DOMContentLoaded', () => {
    const searchInputs = document.querySelectorAll('.header-search input[type="search"]');
    if (searchInputs.length === 0) return;

    const phrases = [
        "Czego szukasz?",
        "Wpisz SKU, barwę lub moc...",
        "Szukaj inspiracji świetlnych...",
        "Inteligentne wyszukiwanie AI...",
        "Znajdź idealną taśmę LED..."
    ];

    searchInputs.forEach(input => {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let erasingDelay = 50;
        let newPhraseDelay = 2000;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                input.setAttribute('placeholder', currentPhrase.substring(0, charIndex - 1));
                charIndex--;
            } else {
                input.setAttribute('placeholder', currentPhrase.substring(0, charIndex + 1));
                charIndex++;
            }

            let speed = isDeleting ? erasingDelay : typingDelay;

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = newPhraseDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 500;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, newPhraseDelay);
    });
});
