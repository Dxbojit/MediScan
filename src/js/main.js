document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeTestimonials();
  generatePlaceholderLogo();
  setupSmoothScrolling();
  setupPageTransitions();
});

function initializeNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Transform menu toggle to X
      const bars = menuToggle.querySelectorAll('.bar');
      bars.forEach(bar => bar.classList.toggle('active'));
      
      if (navLinks.classList.contains('active')) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
    
    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          const bars = menuToggle.querySelectorAll('.bar');
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
          bars.forEach(bar => bar.classList.remove('active'));
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const bars = menuToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
        bars.forEach(bar => bar.classList.remove('active'));
      }
    });
  }
  
  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.backgroundColor = 'white';
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
      }
    });
  }
}

function initializeTestimonials() {
  const testimonialSlider = document.getElementById('testimonialSlider');
  const testimonialDots = document.getElementById('testimonialDots');
  
  if (testimonialSlider && testimonialDots) {
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      testimonialDots.appendChild(dot);
    });
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Functions to control slides
    function nextSlide() {
      goToSlide((currentIndex + 1) % testimonials.length);
    }
    
    function goToSlide(index) {
      testimonials.forEach((testimonial, i) => {
        testimonial.style.transform = `translateX(${(i - index) * 100}%)`;
      });
      
      // Update dots
      const dots = testimonialDots.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      currentIndex = index;
      
      // Reset interval
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Initialize first slide
    goToSlide(0);
    
    // Pause slider on hover
    testimonialSlider.addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }
}

function generatePlaceholderLogo() {
  // This function creates a simple SVG logo to use as placeholder
  // In a real app, you would replace this with your actual logo
  const logoPlaceholders = document.querySelectorAll('#logo-placeholder, #footer-logo-placeholder, #footer-logo-placeholder-detection');
  
  logoPlaceholders.forEach(placeholder => {
    if (placeholder) {
      placeholder.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#20B2AA"/>
          <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28" stroke="white" stroke-width="3" stroke-linecap="round"/>
          <circle cx="20" cy="20" r="4" fill="white"/>
        </svg>
      `;
    }
  });
  
  const uploadIconPlaceholder = document.getElementById('upload-icon-placeholder');
  if (uploadIconPlaceholder) {
    uploadIconPlaceholder.innerHTML = `
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 42V22M32 22L24 30M32 22L40 30" stroke="#20B2AA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M54 42V50C54 51.0609 53.5786 52.0783 52.8284 52.8284C52.0783 53.5786 51.0609 54 50 54H14C12.9391 54 11.9217 53.5786 11.1716 52.8284C10.4214 52.0783 10 51.0609 10 50V42" stroke="#20B2AA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}

function setupSmoothScrolling() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          const menuToggle = document.getElementById('menuToggle');
          const bars = menuToggle.querySelectorAll('.bar');
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
          bars.forEach(bar => bar.classList.remove('active'));
        }
        
        // Scroll to the target element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page reload
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });
}

function setupPageTransitions() {
  // Create transition overlay element
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);
  
  // Smooth page transitions for navigation links
  document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])').forEach(link => {
    if (link.href && link.hostname === window.location.hostname) {
      link.addEventListener('click', function(e) {
        // Skip if it's a download link or has special attributes
        if (this.hasAttribute('download') || this.getAttribute('href').startsWith('mailto:')) {
          return;
        }
        
        e.preventDefault();
        const href = this.href;
        
        // Activate transition
        transitionOverlay.classList.add('active');
        
        // Wait for transition to complete
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });
}