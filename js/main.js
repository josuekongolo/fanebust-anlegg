/**
 * Fanebust Anleggstjenester - Main JavaScript
 * Handles navigation, FAQ accordion, form validation, and interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================

    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav') && navList.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navList.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        navList.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // FAQ Accordion
    // ==========================================================================

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-item__question');

        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                // Close all other items
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-item__question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isExpanded);
            });
        }
    });

    // ==========================================================================
    // Contact Form
    // ==========================================================================

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Get form elements
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Validate form
            if (!validateForm(contactForm)) {
                showMessage('Vennligst fyll ut alle obligatoriske felt.', 'error');
                return;
            }

            // Show loading state
            if (btnText && btnLoading) {
                btnText.classList.add('hidden');
                btnLoading.classList.remove('hidden');
            }
            submitBtn.disabled = true;

            // Collect form data
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                address: contactForm.address?.value.trim() || '',
                projectType: contactForm.projectType?.value || '',
                description: contactForm.description.value.trim(),
                siteVisit: contactForm.siteVisit?.checked || false,
                timestamp: new Date().toISOString()
            };

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);

                // Show success message
                showMessage(
                    'Takk for din henvendelse! Vi har mottatt meldingen din og vil kontakte deg så snart som mulig, vanligvis innen én arbeidsdag.',
                    'success'
                );

                // Reset form
                contactForm.reset();

            } catch (error) {
                console.error('Form submission error:', error);
                showMessage(
                    'Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte på telefon.',
                    'error'
                );
            } finally {
                // Reset button state
                if (btnText && btnLoading) {
                    btnText.classList.remove('hidden');
                    btnLoading.classList.add('hidden');
                }
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * Validate form fields
     */
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(function(field) {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }

            // Email validation
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    field.classList.add('error');
                }
            }
        });

        return isValid;
    }

    /**
     * Show form message
     */
    function showMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message form-message--' + type;
            formMessage.style.display = 'block';

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide message after 10 seconds for success
            if (type === 'success') {
                setTimeout(function() {
                    formMessage.style.display = 'none';
                }, 10000);
            }
        }
    }

    /**
     * Simulate form submission (replace with actual Resend API call)
     */
    function simulateFormSubmission(formData) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data to console for development
                console.log('Form submitted:', formData);

                // For production, implement actual API call here:
                // Example with Resend API:
                /*
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_API_KEY',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'nettside@fanebust-anlegg.no',
                        to: 'post@fanebust-anlegg.no',
                        subject: `Ny henvendelse fra ${formData.name}`,
                        html: `
                            <h2>Ny henvendelse fra nettsiden</h2>
                            <p><strong>Navn:</strong> ${formData.name}</p>
                            <p><strong>E-post:</strong> ${formData.email}</p>
                            <p><strong>Telefon:</strong> ${formData.phone}</p>
                            <p><strong>Adresse:</strong> ${formData.address || 'Ikke oppgitt'}</p>
                            <p><strong>Type prosjekt:</strong> ${formData.projectType || 'Ikke valgt'}</p>
                            <p><strong>Beskrivelse:</strong></p>
                            <p>${formData.description}</p>
                            <p><strong>Ønsker befaring:</strong> ${formData.siteVisit ? 'Ja' : 'Nei'}</p>
                        `
                    })
                });
                */

                // Simulate success
                resolve({ success: true });

                // To simulate error, uncomment:
                // reject(new Error('Simulated error'));
            }, 1500);
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================

    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // ==========================================================================
    // Lazy Loading Images (Native fallback)
    // ==========================================================================

    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        if (image.dataset.src) {
                            image.src = image.dataset.src;
                        }
                        image.classList.add('loaded');
                        observer.unobserve(image);
                    }
                });
            });

            lazyImages.forEach(function(image) {
                imageObserver.observe(image);
            });
        }
    }

    // ==========================================================================
    // Form Input Animation
    // ==========================================================================

    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

    formInputs.forEach(function(input) {
        // Add focus class to parent
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');

            // Validate on blur
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        // Remove error class on input
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });

    // ==========================================================================
    // Gallery Image Hover (Touch devices)
    // ==========================================================================

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(function(item) {
        item.addEventListener('touchstart', function() {
            this.classList.add('touched');
        });

        item.addEventListener('touchend', function() {
            const self = this;
            setTimeout(function() {
                self.classList.remove('touched');
            }, 300);
        });
    });

    // ==========================================================================
    // Print Styles Helper
    // ==========================================================================

    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });

    // ==========================================================================
    // Accessibility: Skip to main content
    // ==========================================================================

    const skipLink = document.querySelector('.skip-link');

    if (skipLink) {
        skipLink.addEventListener('click', function(event) {
            event.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });
    }

    // ==========================================================================
    // Service Worker Registration (Optional - for PWA)
    // ==========================================================================

    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
    */

    // ==========================================================================
    // Console Welcome Message
    // ==========================================================================

    console.log('%c Fanebust Anleggstjenester ', 'background: #4A3728; color: #fff; font-size: 14px; padding: 5px 10px;');
    console.log('%c Din lokale maskinentreprenør i Arna og Bergen ', 'color: #E07B39; font-size: 12px;');

})();
