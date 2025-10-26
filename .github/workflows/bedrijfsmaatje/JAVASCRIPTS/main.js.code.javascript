/**
 * Bedrijfsmaatje - Main JavaScript
 * Ontwikkeld voor Nederlandse MKB AI Assistent Platform
 */

document.addEventListener('DOMContentLoaded', function() {
  initPricingToggle();
  initUseCaseTabs();
  initSmoothScrolling();
  initSignupButtons();
  initNewsletterForm();
  initMobileMenu();
  initAnimations();
  initTestimonialSlider();
});

/**
 * Initialiseert de prijzen toggle tussen maandelijks en jaarlijks
 */
function initPricingToggle() {
  const toggleSwitch = document.querySelector('.toggle-switch');
  const monthlyLabel = document.querySelector('.toggle-label:first-child');
  const yearlyLabel = document.querySelector('.toggle-label:last-child');
  const prices = document.querySelectorAll('.price');
  const originalPrices = {
    monthly: ['€29', '€79', '€199'],
    yearly: ['€278', '€758', '€1910']
  };
  
  if (!toggleSwitch) return;
  
  toggleSwitch.addEventListener('click', function() {
    this.classList.toggle('yearly');
    monthlyLabel.classList.toggle('active');
    yearlyLabel.classList.toggle('active');
    
    const isYearly = this.classList.contains('yearly');
    const priceSet = isYearly ? originalPrices.yearly : originalPrices.monthly;
    const suffix = isYearly ? '<span>/jaar</span>' : '<span>/maand</span>';
    
    prices.forEach((price, index) => {
      price.innerHTML = priceSet[index] + suffix;
    });
    
    // Update CTA tekst
    const ctaButtons = document.querySelectorAll('.pricing-card .cta-button');
    ctaButtons.forEach(button => {
      button.textContent = isYearly ? 'Start Jaarabonnement' : 'Start Gratis Proefperiode';
    });
  });
}

/**
 * Initialiseert de use case tabs voor verschillende sectoren
 */
function initUseCaseTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const useCaseContent = document.querySelector('.use-case-content');
  
  if (!tabButtons.length || !useCaseContent) return;
  
  const useCases = {
    'Horeca': {
      image: 'images/use-case-horeca.jpg',
      title: 'Horeca-ondernemers besparen 10+ uur per week',
      description: 'Restauranteigenaren en caféhouders gebruiken Bedrijfsmaatje om hun dagelijkse administratie te automatiseren, personeelsroosters te optimaliseren en voorraad bij te houden.',
      features: [
        'Automatische verwerking van kassabonnen en facturen',
        'Slimme personeelsplanning op basis van drukte',
        'Voorraadoptimalisatie en automatische bestellingen',
        'Klantcommunicatie en reserveringsbeheer'
      ],
      demoLink: '#demo-horeca'
    },
    'Retail': {
      image: 'images/use-case-retail.jpg',
      title: 'Retailers verhogen omzet met 15%',
      description: 'Winkeliers gebruiken Bedrijfsmaatje om voorraad te beheren, klantcommunicatie te automatiseren en marketing te optimaliseren.',
      features: [
        'Automatische voorraadaanvulling en besteladvies',
        'Gepersonaliseerde klantcommunicatie',
        'Verkoop- en trendanalyses',
        'Geautomatiseerde social media marketing'
      ],
      demoLink: '#demo-retail'
    },
    'ZZP\'ers': {
      image: 'images/use-case-zzp.jpg',
      title: 'ZZP\'ers winnen 8 uur per week terug',
      description: 'Freelancers en zelfstandigen gebruiken Bedrijfsmaatje om administratie te automatiseren, facturen te beheren en klanten te onderhouden.',
      features: [
        'Automatische urenregistratie en facturatie',
        'Belastingoptimalisatie en BTW-berekening',
        'Slimme e-mail en agenda beheer',
        'Geautomatiseerde follow-ups met klanten'
      ],
      demoLink: '#demo-zzp'
    },
    'Dienstverlening': {
      image: 'images/use-case-dienstverlening.jpg',
      title: 'Dienstverleners verbeteren klanttevredenheid met 30%',
      description: 'Consultants, coaches en andere dienstverleners gebruiken Bedrijfsmaatje om klantcommunicatie te stroomlijnen en administratie te automatiseren.',
      features: [
        'Geautomatiseerde afspraakherinneringen',
        'Slimme follow-ups na gesprekken',
        'Automatische documentgeneratie',
        'Klantinzichten en tevredenheidsanalyses'
      ],
      demoLink: '#demo-dienstverlening'
    }
  };
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      // Update content based on selected tab
      const category = this.textContent;
      const useCase = useCases[category];
      
      if (useCase) {
        useCaseContent.innerHTML = `
          <div class="use-case-image">
            <img src="${useCase.image}" alt="${category} gebruikt Bedrijfsmaatje">
          </div>
          
          <div class="use-case-text">
            <h3>${useCase.title}</h3>
            <p>${useCase.description}</p>
            
            <ul>
              ${useCase.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <a href="${useCase.demoLink}" class="cta-button">Bekijk ${category} Demo</a>
          </div>
        `;
      }
    });
  });
}

/**
 * Initialiseert smooth scrolling voor anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if it's a modal trigger
      if (targetId === '#signup' || targetId.startsWith('#demo-')) {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialiseert de signup buttons voor proefperiode
 */
function initSignupButtons() {
  document.querySelectorAll('a[href="#signup"]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openSignupModal();
    });
  });
}

/**
 * Opent de signup modal
 */
function openSignupModal() {
  // Creëer een eenvoudige modal voor registratie
  const modal = document.createElement('div');
  modal.className = 'signup-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h2>Start je gratis proefperiode</h2>
      <p>Vul je gegevens in om direct te beginnen met Bedrijfsmaatje.</p>
      <form id="signup-form">
        <div class="form-group">
          <label for="name">Naam</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">E-mailadres</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="company">Bedrijfsnaam</label>
          <input type="text" id="company" name="company" required>
        </div>
        <div class="form-group">
          <label for="phone">Telefoonnummer</label>
          <input type="tel" id="phone" name="phone">
        </div>
        <div class="form-group">
          <label for="package">Gewenst pakket</label>
          <select id="package" name="package">
            <option value="starter">Starter</option>
            <option value="groei" selected>Groei</option>
            <option value="zakelijk">Zakelijk</option>
          </select>
        </div>
        <button type="submit" class="cta-button">Start Gratis Proefperiode</button>
        <p class="form-disclaimer">Door je aan te melden ga je akkoord met onze <a href="#privacy">privacyvoorwaarden</a>.</p>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Sluit modal wanneer op X wordt geklikt
  modal.querySelector('.close-button').addEventListener('click', function() {
    document.body.removeChild(modal);
  });
  
  // Sluit modal wanneer buiten de content wordt geklikt
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Handle form submission
  modal.querySelector('#signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      phone: document.getElementById('phone').value,
      package: document.getElementById('package').value
    };
    
    // Hier zou je normaal een API call maken
    // Voor nu simuleren we een succesvolle registratie
    console.log('Form submitted with data:', formData);
    
    // Toon bevestigingsbericht
    modal.querySelector('.modal-content').innerHTML = `
      <div class="signup-success">
        <div class="success-icon">✓</div>
        <h2>Bedankt voor je aanmelding!</h2>
        <p>We hebben een bevestigingsmail gestuurd naar <strong>${formData.email}</strong>.</p>
        <p>Je kunt direct aan de slag met je gratis proefperiode.</p>
        <button class="cta-button close-modal-btn">Naar dashboard</button>
      </div>
    `;
    
    // Sluit modal wanneer op knop wordt geklikt
    modal.querySelector('.close-modal-btn').addEventListener('click', function() {
      document.body.removeChild(modal);
      window.location.href = '/dashboard.html';
    });
  });
}

/**
 * Initialiseert het nieuwsbrief formulier
 */
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[name="email"]').value;
    
    // Hier zou je normaal een API-call doen naar je backend
    console.log('Newsletter signup:', email);
    
    // Toon bevestigingsbericht
    const formContainer = this.parentElement;
    const originalContent = formContainer.innerHTML;
    
    formContainer.innerHTML = `
      <div class="newsletter-success">
        <div class="success-icon">✓</div>
        <h3>Bedankt voor je inschrijving!</h3>
        <p>Je ontvangt binnenkort onze nieuwste updates en tips.</p>
      </div>
    `;
    
    // Reset form na 5 seconden
    setTimeout(() => {
      formContainer.innerHTML = originalContent;
      initNewsletterForm(); // Re-initialize the form
    }, 5000);
  });
}

/**
 * Initialiseert het mobiele menu
 */
function initMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navMenu = document.querySelector('nav ul');
  
  if (!mobileMenuButton || !navMenu) return;
  
  mobileMenuButton.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.classList.toggle('active');
  });
}

/**
 * Initialiseert animaties bij scrollen
 */
function initAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialiseert de testimonial slider
 */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  
  if (!slider) return;
  
  let currentSlide = 0;
  const slides = slider.querySelectorAll('.testimonial-card');
  const totalSlides = slides.length;
  const dotsContainer = document.querySelector('.slider-dots');
  
  // Create dots
  if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.dataset.slide = i;
      dotsContainer.appendChild(dot);
      
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.dataset.slide));
      });
    }
  }
  
  // Next/prev buttons
  const prevButton = document.querySelector('.slider-prev');
  const nextButton = document.querySelector('.slider-next');
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      goToSlide(currentSlide - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      goToSlide(currentSlide + 1);
    });
  }
  
  function goToSlide(slideIndex) {
    // Handle wrapping
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Update slider position
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
  }
  
  // Auto-advance slides
  if (totalSlides > 1) {
    setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }
}

/**
 * Demo modals voor verschillende sectoren
 */
document.querySelectorAll('a[href^="#demo-"]').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    const sector = this.getAttribute('href').replace('#demo-', '');
    openDemoModal(sector);
  });
});

function openDemoModal(sector) {
  const sectorData = {
    'horeca': {
      title: 'Bedrijfsmaatje voor Horeca',
      features: [
        'Automatische verwerking van kassabonnen',
        'Personeelsplanning op basis van historische drukte',
        'Voorraadoptimalisatie en verspillingsreductie',
        'Klantcommunicatie en reserveringsbeheer',
        'Menukaart optimalisatie op basis van populariteit'
      ],
      videoId: 'demo-horeca-video'
    },
    'retail': {
      title: 'Bedrijfsmaatje voor Retail',
      features: [
        'Voorraadoptimalisatie en automatische bestellingen',
        'Klantanalyse en gepersonaliseerde aanbiedingen',
        'Kassasysteem integratie en rapportage',
        'Social media marketing en contentplanning',
        'Personeelsplanning op basis van drukte'
      ],
      videoId: 'demo-retail-video'
    },
    'zzp': {
      title: 'Bedrijfsmaatje voor ZZP\'ers',
      features: [
        'Automatische urenregistratie en facturatie',
        'Belastingoptimalisatie en BTW-berekening',
        'E-mail en agenda beheer',
        'Geautomatiseerde follow-ups met klanten',
        'Project- en taakbeheer'
      ],
      videoId: 'demo-zzp-video'
    },
    'dienstverlening': {
      title: 'Bedrijfsmaatje voor Dienstverleners',
      features: [
        'Geautomatiseerde afspraakherinneringen',
        'Slimme follow-ups na gesprekken',
        'Automatische documentgeneratie',
        'Klantinzichten en tevredenheidsanalyses',
        'Projectplanning en -beheer'
      ],
      videoId: 'demo-dienstverlening-video'
    }
  };
  
  const data = sectorData[sector] || sectorData['horeca'];
  
  // Creëer demo modal
  const modal = document.createElement('div');
  modal.className = 'demo-modal';
  modal.innerHTML = `
    <div class="modal-content demo-modal-content">
      <span class="close-button">&times;</span>
      <h2>${data.title}</h2>
      
      <div class="demo-video">
        <div class="video-placeholder" id="${data.videoId}">
          <div class="play-button">▶</div>
          <p>Klik om demo te bekijken</p>
        </div>
      </div>
      
      <div class="demo-features">
        <h3>Belangrijkste functies</h3>
        <ul>
          ${data.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <div class="demo-cta">
        <p>Wil je zien hoe Bedrijfsmaatje jouw bedrijf kan helpen?</p>
        <a href="#signup" class="cta-button">Start Gratis Proefperiode</a>
        <a href="#contact" class="secondary-button">Plan een Gesprek</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Sluit modal wanneer op X wordt geklikt
  modal.querySelector('.close-button').addEventListener('click', function() {
    document.body.removeChild(modal);
  });
  
  // Sluit modal wanneer buiten de content wordt geklikt
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Signup button in demo modal
  modal.querySelector('a[href="#signup"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.removeChild(modal);
    openSignupModal();
  });
  
  // Video placeholder click
  modal.querySelector('.video-placeholder').addEventListener('click', function() {
    this.innerHTML = `
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
      title="Demo Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  });
}