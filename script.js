// #13 Page Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    const overlay = document.getElementById('navOverlay');
    if (overlay) overlay.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        const overlay = document.getElementById('navOverlay');
        if (overlay) overlay.classList.remove('active');
    });
});

// Close mobile menu when tapping outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        const overlay = document.getElementById('navOverlay');
        if (overlay) overlay.classList.remove('active');
    }
});

// Nav overlay click to close
const navOverlay = document.getElementById('navOverlay');
if (navOverlay) {
    navOverlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        navOverlay.classList.remove('active');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll + #14 Back to Top visibility
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        navbar.classList.remove('scrolled');
    }

    // #14 Back to Top button
    if (backToTop) {
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}, { passive: true });

// #14 Back to Top click handler
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// #6 Staggered Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards with staggered delays
document.querySelectorAll('.section, .vmg-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// #6 Stagger cards within grids
const cardSelectors = [
    '.service-card',
    '.team-card',
    '.feature-card',
    '.vmg-card',
    '.stat-card',
    '.contact-item'
];

cardSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Apply animation when intersected
const style = document.createElement('style');
style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Slideshow
const slideshow = document.getElementById('slideshow');
if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slideDots');
    const progressBar = document.getElementById('slideProgressBar');
    const prevBtn = slideshow.querySelector('.slide-prev');
    const nextBtn = slideshow.querySelector('.slide-next');
    let currentSlide = 0;
    let slideInterval;
    let progressInterval;
    const SLIDE_DURATION = 5000;
    const PROGRESS_STEP = 50;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slide-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slide-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetProgress();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function resetProgress() {
        clearInterval(progressInterval);
        let elapsed = 0;
        progressBar.style.width = '0%';
        progressInterval = setInterval(() => {
            elapsed += PROGRESS_STEP;
            progressBar.style.width = (elapsed / SLIDE_DURATION * 100) + '%';
            if (elapsed >= SLIDE_DURATION) {
                clearInterval(progressInterval);
            }
        }, PROGRESS_STEP);
    }

    function startAutoPlay() {
        resetProgress();
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
        clearInterval(progressInterval);
    }

    // Controls
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });

    // Pause on hover
    slideshow.addEventListener('mouseenter', stopAutoPlay);
    slideshow.addEventListener('mouseleave', startAutoPlay);

    // Keyboard navigation
    slideshow.setAttribute('tabindex', '0');
    slideshow.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { stopAutoPlay(); prevSlide(); startAutoPlay(); }
        if (e.key === 'ArrowRight') { stopAutoPlay(); nextSlide(); startAutoPlay(); }
    });

    // Touch swipe support
    let touchStartX = 0;
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            stopAutoPlay();
            if (diff > 0) nextSlide();
            else prevSlide();
            startAutoPlay();
        }
    }, { passive: true });

    // Start
    startAutoPlay();
}

// Form submission handler with #9 loading state
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;

        // Simulate submission delay
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();

            // Reset button
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }, 1000);
    });
}

// Counter animation for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-card h3');

    counters.forEach(counter => {
        const target = counter.innerText;
        const isNumber = !isNaN(parseInt(target));

        if (isNumber) {
            const count = parseInt(target);
            let current = 0;
            const increment = count / 50;

            const updateCounter = () => {
                if (current < count) {
                    current += increment;
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        }
    });
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Hero Particles Animation
const heroCanvas = document.getElementById('heroParticles');
if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 120;

    function resizeCanvas() {
        const hero = heroCanvas.parentElement;
        heroCanvas.width = hero.offsetWidth;
        heroCanvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * heroCanvas.width,
                y: Math.random() * heroCanvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r: Math.random() * 2 + 1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / CONNECTION_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }

    // Respect reduced motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        resizeCanvas();
        createParticles();
        drawParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }
}

// Observe new sections (projects, testimonials)
document.querySelectorAll('.projects-grid .project-card, .testimonials-grid .testimonial-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});
