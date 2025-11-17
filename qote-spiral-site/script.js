/**
 * QOTE Reads SpiralState - Interactive Script
 * Handles smooth scrolling and glyph notation toggle
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initGlyphToggle();
});

/**
 * Initialize smooth scrolling for internal navigation links
 * Enhances UX by providing smooth transitions between sections
 */
function initSmoothScroll() {
    // Select all anchor links that start with #
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Smooth scroll to target with offset for fixed headers if any
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Initialize the glyph notation toggle
 * Switches between plain English and QOTE operator notation
 */
function initGlyphToggle() {
    const toggleBtn = document.getElementById('toggleMode');

    if (!toggleBtn) {
        console.warn('Toggle button not found');
        return;
    }

    // Track current mode: 'plain' or 'operator'
    let currentMode = 'plain';

    toggleBtn.addEventListener('click', () => {
        // Toggle the mode
        currentMode = currentMode === 'plain' ? 'operator' : 'plain';

        // Get all glyph labels
        const plainLabels = document.querySelectorAll('.glyph-label.plain');
        const operatorLabels = document.querySelectorAll('.glyph-label.operator');

        if (currentMode === 'operator') {
            // Show operator notation, hide plain text
            plainLabels.forEach(label => {
                label.style.display = 'none';
            });
            operatorLabels.forEach(label => {
                label.style.display = 'block';
            });

            // Update button text
            toggleBtn.textContent = 'Switch to Plain Language';

            // Add visual feedback with animation
            animateGlyphCards();
        } else {
            // Show plain text, hide operator notation
            plainLabels.forEach(label => {
                label.style.display = 'block';
            });
            operatorLabels.forEach(label => {
                label.style.display = 'none';
            });

            // Update button text
            toggleBtn.textContent = 'Switch to Operator Notation';

            // Add visual feedback with animation
            animateGlyphCards();
        }
    });
}

/**
 * Animate glyph cards when toggling modes
 * Provides visual feedback to the user
 */
function animateGlyphCards() {
    const cards = document.querySelectorAll('.glyph-card');

    cards.forEach((card, index) => {
        // Add a subtle pulse animation with staggered timing
        card.style.animation = 'none';

        // Trigger reflow to restart animation
        setTimeout(() => {
            card.style.animation = `pulse 0.4s ease-out ${index * 0.05}s`;
        }, 10);
    });

    // Remove animation after it completes
    setTimeout(() => {
        cards.forEach(card => {
            card.style.animation = '';
        });
    }, 1000);
}

/**
 * Add pulse animation to CSS dynamically if not present
 * This creates a subtle visual feedback effect
 */
if (!document.querySelector('#pulse-animation-style')) {
    const style = document.createElement('style');
    style.id = 'pulse-animation-style';
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Optional: Add scroll-based fade-in effects for sections
 * Uncomment to enable progressive disclosure as user scrolls
 */
/*
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Uncomment to enable scroll animations
// initScrollAnimations();
*/

// Log initialization for debugging
console.log('QOTE Reads SpiralState: Scripts initialized');
