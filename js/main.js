/**
 * BeautiPhi Medispa — Main JavaScript
 * Global functionality for the luxury clinic website
 */

(function() {
  'use strict';

  // ============================================
  // DOM READY
  // ============================================

  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initAccordions();
    initFadeInAnimations();
    initSmoothScroll();
    initFormValidation();
  });

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================

  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      // Add shadow on scroll
      if (currentScroll > 10) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // MOBILE MENU
  // ============================================

  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const submenuToggles = document.querySelectorAll('.mobile-submenu-toggle');

    if (!toggle || !mobileNav) return;

    // Toggle main menu
    toggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Toggle submenus
    submenuToggles.forEach(function(toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        if (submenu && submenu.classList.contains('mobile-nav-submenu')) {
          submenu.classList.toggle('active');
          
          // Rotate arrow
          const arrow = this.querySelector('.mobile-arrow');
          if (arrow) {
            arrow.style.transform = submenu.classList.contains('active') ? 'rotate(180deg)' : '';
          }
        }
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('active') && 
          !mobileNav.contains(e.target) && 
          !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // ACCORDION FUNCTIONALITY
  // ============================================

  function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        const item = this.closest('.accordion-item');
        const wasActive = item.classList.contains('active');

        // Close all siblings (optional - remove for multi-open)
        const parent = this.closest('.accordion');
        if (parent) {
          const activeItems = parent.querySelectorAll('.accordion-item.active');
          activeItems.forEach(function(activeItem) {
            if (activeItem !== item) {
              activeItem.classList.remove('active');
            }
          });
        }

        // Toggle current
        item.classList.toggle('active');

        // Accessibility
        const expanded = item.classList.contains('active');
        this.setAttribute('aria-expanded', expanded);
      });
    });
  }

  // ============================================
  // FADE IN ON SCROLL ANIMATION
  // ============================================

  function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      fadeElements.forEach(function(element) {
        observer.observe(element);
      });
    } else {
      // Fallback for older browsers
      fadeElements.forEach(function(element) {
        element.classList.add('visible');
      });
    }
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ============================================
  // FORM VALIDATION
  // ============================================

  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(function(form) {
      const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');

      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          validateField(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('form-error')) {
            validateField(this);
          }
        });
      });

      form.addEventListener('submit', function(e) {
        let isValid = true;

        inputs.forEach(function(input) {
          if (!validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Scroll to first error
          const firstError = form.querySelector('.form-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.hasAttribute('required');
    const errorMessage = field.parentElement.querySelector('.form-error-message');

    // Remove previous error state
    field.classList.remove('form-error');
    if (errorMessage) errorMessage.remove();

    // Check required
    if (isRequired && !value) {
      showError(field, 'This field is required');
      return false;
    }

    // Check email
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Check phone
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(value)) {
        showError(field, 'Please enter a valid phone number');
        return false;
      }
    }

    return true;
  }

  function showError(field, message) {
    field.classList.add('form-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================

  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Fallback
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Initialize lazy loading on load
  window.addEventListener('load', initLazyLoading);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Debounce function for performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Expose utilities globally if needed
  window.BeautiPhi = {
    debounce: debounce,
    throttle: throttle
  };

})();
