 // Add to your existing JS file (e.g., home.js)
// Make sure to include the lang.js file in your HTML like this: <script src="lang.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Other functions and event listeners...

    const langButtons = document.querySelectorAll('.lang-btn');
    const storedLang = localStorage.getItem('lang') || 'en'; // Default to English if no preference is stored

    // Set initial language based on stored preference
    setLanguage(storedLang);

    // Add event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.id.split('-')[1]; // Extracts 'en', 'pa', or 'hi'
            setLanguage(lang);
            localStorage.setItem('lang', lang); // Store preference
        });
    });

    function setLanguage(lang) {
        // Update button styles
        langButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');

        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Handle placeholders for input fields
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }
});