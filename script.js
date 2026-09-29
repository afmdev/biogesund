document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle logic ---
  const themeBtn = document.getElementById('theme-toggle');
  const themeIconContainer = themeBtn.querySelector('span');
  
  // Set theme from localStorage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIconContainer.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.999z" />
        </svg>
      `; // Moon icon for light theme (switching to dark)
      themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIconContainer.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 12h2m16 0h2M12 2v2m0 16v2m-6.364-16.364l1.414 1.414m10.828 10.828l1.414 1.414M6.636 17.364l-1.414 1.414m10.828-10.828l-1.414 1.414"/>
        </svg>
      `; // Sun icon for dark theme (switching to light)
      themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      const isActive = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      hamburger.setAttribute('aria-label', isActive ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      
      // Animate hamburger spans
      const spans = hamburger.querySelectorAll('span');
      if (isActive) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
        hamburger.querySelectorAll('span').forEach(s => s.style.transform = 'none');
        hamburger.querySelectorAll('span')[1].style.opacity = '1';
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealOnScroll.observe(el));

  // --- Interactive Bio-Configurator / Calculator ---
  const optionCardsGoal = document.querySelectorAll('#group-goal .option-card');
  const optionCardsFocus = document.querySelectorAll('#group-focus .option-card');
  const stressSlider = document.getElementById('stress-slider');
  const stressValueDisplay = document.getElementById('stress-value');
  
  const bioValueDisplay = document.getElementById('bio-value');
  const resultGoalText = document.getElementById('res-goal');
  const resultFocusText = document.getElementById('res-focus');
  const resultRegimenText = document.getElementById('res-regimen');

  let selectedGoal = 'longevity';
  let selectedFocus = 'cellular';
  let stressLevel = 5;

  // Goal Selection
  optionCardsGoal.forEach(card => {
    card.addEventListener('click', () => {
      optionCardsGoal.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      selectedGoal = card.dataset.value;
      calculateWellness();
    });
  });

  // Focus Selection
  optionCardsFocus.forEach(card => {
    card.addEventListener('click', () => {
      optionCardsFocus.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      selectedFocus = card.dataset.value;
      calculateWellness();
    });
  });

  // Stress Slider
  if (stressSlider) {
    stressSlider.addEventListener('input', (e) => {
      stressLevel = parseInt(e.target.value);
      stressValueDisplay.textContent = stressLevel;
      stressSlider.setAttribute('aria-valuenow', stressLevel);
      calculateWellness();
    });
  }

  function calculateWellness() {
    // Generate an illustrative premium wellness calculation score
    let baseScore = 65;
    
    // Impact of stress
    baseScore -= (stressLevel * 2.5);

    // Goal adjustments
    if (selectedGoal === 'longevity') baseScore += 18;
    if (selectedGoal === 'regeneration') baseScore += 12;
    if (selectedGoal === 'performance') baseScore += 8;

    // Focus adjustments
    if (selectedFocus === 'cellular') baseScore += 10;
    if (selectedFocus === 'neurological') baseScore += 5;
    if (selectedFocus === 'metabolic') baseScore += 7;

    // Constrain score
    const finalScore = Math.max(10, Math.min(100, Math.round(baseScore)));
    
    // Animate score counter
    animateCounter(bioValueDisplay, parseInt(bioValueDisplay.textContent) || 0, finalScore, 600);

    // Dynamic advice mapping
    const goalsLabels = {
      longevity: 'Longevidad & Telómeros',
      regeneration: 'Regeneración Celular',
      performance: 'Rendimiento Biofísico'
    };

    const focusLabels = {
      cellular: 'Celular Mitocondrial',
      neurological: 'Neuro-Cognitivo',
      metabolic: 'Metabólico Integral'
    };

    const regimenAdvice = {
      'longevity-cellular': 'Protocolo de Resveratrol + Activación AMPK. Dosis de NAD+ dirigida.',
      'longevity-neurological': 'Protección neuronal y autofagia selectiva. Dieta cetogénica clínica cíclica.',
      'longevity-metabolic': 'Restricción calórica mimética + Berberina biodisponible. Regulación insulínica.',
      'regeneration-cellular': 'Péptidos de colágeno hidrolizado + Células madre pre-oxigenadas. Crioterapia.',
      'regeneration-neurological': 'Optimización de sueño profundo con L-Teanina y Magnesio L-Treonato.',
      'regeneration-metabolic': 'Ayuno intermitente regenerativo de 16h + Complejo vitamínico B liposomal.',
      'performance-cellular': 'Coenzima Q10 microactiva + Creatina pura y Terapia de Luz Roja (LLLT).',
      'performance-neurological': 'Nootrópicos premium de Melena de León + Bacopa Monnieri. Terapia de respiración.',
      'performance-metabolic': 'Electrolitos biodisponibles + Triglicéridos de cadena media (MCT) e hidratos complejos.'
    };

    resultGoalText.textContent = goalsLabels[selectedGoal] || selectedGoal;
    resultFocusText.textContent = focusLabels[selectedFocus] || selectedFocus;
    
    const key = `${selectedGoal}-${selectedFocus}`;
    resultRegimenText.textContent = regimenAdvice[key] || 'Protocolo Personalizado Biogesund Adaptativo.';
  }

  function animateCounter(element, start, end, duration) {
    let startTime = null;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = currentValue;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end;
      }
    }
    
    window.requestAnimationFrame(step);
  }

  // Initial calculation trigger
  calculateWellness();

  // --- Form submission simulation ---
  const contactForm = document.getElementById('wellness-contact');
  const feedbackMessage = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate API request
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide form fields smoothly (optional, here we just show success)
        contactForm.reset();
        
        feedbackMessage.textContent = '¡Mensaje enviado con éxito! Tu consultor de Biogesund te contactará en las próximas 24 horas.';
        feedbackMessage.className = 'form-feedback success';
        
        // Smooth scroll to feedback message
        feedbackMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide after 5 seconds
        setTimeout(() => {
          feedbackMessage.style.opacity = '0';
          setTimeout(() => {
            feedbackMessage.style.display = 'none';
            feedbackMessage.style.opacity = '1';
          }, 400);
        }, 6000);
      }, 1500);
    });
  }
});
