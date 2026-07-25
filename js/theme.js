document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = localStorage.getItem('prescot_theme') || 'dark';
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Find all theme toggle switches on the page
  const themeToggles = document.querySelectorAll('.led-switch');
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('prescot_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('prescot_theme', 'light');
      }
    });
  });
});

// Run this immediately to prevent Flash of Unstyled Content (FOUC)
(function() {
  const currentTheme = localStorage.getItem('prescot_theme');
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
