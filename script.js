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

// Service Detail Modal
const serviceData = {
    network: {
        title: 'Network Infrastructure',
        subtitle: 'Design & Management',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 8h2m2 0h2"/><path d="M7 11h6"/></svg>',
        description: 'We design, deploy and manage end-to-end network infrastructure for offices, mines and industrial sites. Our solutions cover structured cabling (Cat6/Cat6A), fiber optic backbone, switches, routers, wireless access points and full network commissioning.',
        features: [
            'Structured cabling (Cat6/Cat6A/Fiber)',
            'LAN & WAN design and deployment',
            'Network switches & router configuration',
            'Wireless network & site surveys',
            'Fiber optic splicing & termination',
            'Network monitoring & management'
        ],
        projects: [
            { client: 'Reliant Mining', desc: 'Full site LAN and fiber backbone across underground and surface operations', badge: 'Mining' },
            { client: 'ZSIC - Ndola', desc: 'Office network redesign with structured cabling and managed switches', badge: 'Insurance' },
            { client: 'Kembe Estates Ltd', desc: 'Campus-wide network infrastructure with wireless coverage', badge: 'Property' },
            { client: 'LWF (Lutheran World Federation)', desc: 'Multi-building network deployment with centralized management', badge: 'NGO' },
            { client: 'Pharmanova Pharmaceuticals', desc: 'Secure network setup for warehouse and office operations', badge: 'Pharma' }
        ]
    },
    cybersecurity: {
        title: 'Cybersecurity',
        subtitle: 'Risk Management',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg>',
        description: 'We protect your business with comprehensive cybersecurity solutions including firewall deployment, endpoint protection, vulnerability assessments and security awareness training tailored for your team.',
        features: [
            'Firewall setup & management',
            'Endpoint protection & antivirus',
            'Vulnerability assessments',
            'Security awareness training',
            'Data encryption solutions',
            'Incident response planning'
        ],
        projects: [
            { client: 'ZSIC - Ndola', desc: 'Firewall deployment and endpoint security rollout across office network', badge: 'Insurance' },
            { client: 'ZAMBOU Financial Services', desc: 'Comprehensive security audit and firewall hardening', badge: 'Finance' },
            { client: 'Prosoft Human Resource', desc: 'Data protection and access control policy implementation', badge: 'HR' }
        ]
    },
    webapps: {
        title: 'Website & Mobile Apps',
        subtitle: 'Development',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/><path d="M9 6h6"/><path d="M9 9h6"/></svg>',
        description: 'We build custom websites, web applications and mobile apps tailored to your business needs. From company profiles and e-commerce platforms to internal tools and business dashboards.',
        features: [
            'Company websites & landing pages',
            'Web application development',
            'Mobile app development',
            'E-commerce platforms',
            'Business dashboards & portals',
            'Hosting & domain management'
        ],
        projects: [
            { client: 'Southend Travel and Tours', desc: 'Travel booking website with online enquiry system', badge: 'Tourism' },
            { client: 'Vision Care Opticians', desc: 'Business website with service catalogue and appointment booking', badge: 'Healthcare' },
            { client: 'Planet Home Innovations Ltd', desc: 'Product showcase website with client inquiry form', badge: 'Property' }
        ]
    },
    cloud: {
        title: 'Cloud Solutions',
        subtitle: 'Data Backup & Storage',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>',
        description: 'We help businesses migrate to the cloud, set up automated backups and implement disaster recovery plans. Our solutions ensure business continuity with secure, scalable cloud infrastructure.',
        features: [
            'Cloud migration & setup',
            'Automated backup solutions',
            'Disaster recovery planning',
            'Server virtualization',
            'Cloud email & collaboration',
            'Data storage optimization'
        ],
        projects: [
            { client: 'Reliant Mining', desc: 'Server virtualization and automated cloud backup for critical operations data', badge: 'Mining' },
            { client: 'ZSIC - Ndola', desc: 'Cloud email migration and document management system', badge: 'Insurance' },
            { client: 'Musamba Investments', desc: 'Cloud backup and disaster recovery setup for business data', badge: 'Finance' }
        ]
    },
    cctv: {
        title: 'CCTV & Access Control',
        subtitle: 'Biometric Systems',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
        description: 'We design and install IP camera surveillance systems, biometric access control and integrated security solutions. Full coverage with remote monitoring capabilities for complete peace of mind.',
        features: [
            'IP camera systems (indoor & outdoor)',
            'Biometric access control',
            'Centralized monitoring stations',
            'Remote viewing & mobile access',
            'Electric fence integration',
            'Alarm & intrusion detection'
        ],
        projects: [
            { client: 'Royal Chundu River Lodge', desc: '32-camera IP surveillance system with remote monitoring for the lodge grounds', badge: 'Hospitality' },
            { client: 'Aninas Lodge', desc: 'CCTV and biometric access control for guest and staff areas', badge: 'Hospitality' },
            { client: 'Kembe Estates Ltd', desc: 'Perimeter surveillance with IP cameras and access control gates', badge: 'Property' },
            { client: 'The Consulate of Cyprus', desc: 'High-security CCTV and access control installation', badge: 'Government' }
        ]
    },
    hardware: {
        title: 'Hardware & Software',
        subtitle: 'Supply & Installation',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
        description: 'We supply, install and support enterprise hardware including desktops, laptops, printers, servers, UPS systems and licensed software. We partner with leading brands to deliver reliable equipment.',
        features: [
            'Desktop & laptop supply',
            'Printer & peripheral setup',
            'Server hardware deployment',
            'UPS & power protection',
            'Software licensing & installation',
            'IT equipment maintenance'
        ],
        projects: [
            { client: 'Reliant Mining', desc: 'Bulk workstation deployment with enterprise software licensing', badge: 'Mining' },
            { client: 'WASAZA', desc: 'Office IT equipment supply including desktops, printers and UPS units', badge: 'Association' },
            { client: 'SES Zambia', desc: 'Hardware refresh project with new workstations and server upgrade', badge: 'Engineering' },
            { client: 'Zega Ltd', desc: 'Complete IT hardware supply and setup for new office', badge: 'Business' }
        ]
    },
    aircon: {
        title: 'Air Conditioning',
        subtitle: 'Installation & Maintenance',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 7l-5 5-5-5"/><path d="M2 12h4m12 0h4"/><path d="M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8"/><path d="M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
        description: 'Professional air conditioning installation, servicing and repair for residential, commercial and industrial spaces. We work with all major brands and provide energy-efficient cooling solutions.',
        features: [
            'Split system installation',
            'Ducted AC systems',
            'Server room cooling',
            'AC servicing & re-gassing',
            'Energy efficiency consulting',
            'Emergency breakdown repairs'
        ],
        projects: [
            { client: 'Royal Chundu River Lodge', desc: 'Multi-unit split system installation across guest rooms and common areas', badge: 'Hospitality' },
            { client: 'ZSIC - Ndola', desc: 'Office air conditioning overhaul with energy-efficient units', badge: 'Insurance' },
            { client: 'Reliant Mining', desc: 'Server room precision cooling installation', badge: 'Mining' },
            { client: 'The Consulate of Cyprus', desc: 'Commercial AC installation and annual maintenance contract', badge: 'Government' }
        ]
    },
    heating: {
        title: 'Heating Systems',
        subtitle: 'Installation & Repairs',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c-4.97 0-9-2.24-9-5v-4c0 2.76 4.03 5 9 5s9-2.24 9-5v4c0 2.76-4.03 5-9 5z"/><path d="M12 17c-4.97 0-9-2.24-9-5v-4c0 2.76 4.03 5 9 5s9-2.24 9-5v4c0 2.76-4.03 5-9 5z"/><ellipse cx="12" cy="8" rx="9" ry="5"/></svg>',
        description: 'We install and repair heating systems for commercial and industrial environments. From underfloor heating to industrial boilers, we ensure reliable warmth and efficiency.',
        features: [
            'Underfloor heating systems',
            'Boiler installation & repair',
            'Radiator systems',
            'Heat pump solutions',
            'Industrial heating',
            'System diagnostics & repair'
        ],
        projects: [
            { client: 'Kembe Estates Ltd', desc: 'Underfloor heating installation for residential development', badge: 'Property' },
            { client: 'Aninas Lodge', desc: 'Heating system installation for guest accommodation', badge: 'Hospitality' }
        ]
    },
    ventilation: {
        title: 'Ventilation Systems',
        subtitle: 'Design & Installation',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>',
        description: 'Proper ventilation is critical for air quality and safety. We design and install ventilation systems for offices, kitchens, factories and mining environments with compliant ducting solutions.',
        features: [
            'Exhaust fan systems',
            'Ductwork design & installation',
            'Kitchen extraction systems',
            'Industrial ventilation',
            'Air quality monitoring',
            'Mine ventilation solutions'
        ],
        projects: [
            { client: 'Reliant Mining', desc: 'Mine ventilation system upgrades for underground operations', badge: 'Mining' },
            { client: 'Planet Home Innovations Ltd', desc: 'Kitchen and bathroom extraction systems for residential development', badge: 'Property' }
        ]
    },
    'hvac-design': {
        title: 'HVAC Design',
        subtitle: 'Custom System Planning',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',
        description: 'We provide complete HVAC system design services including load calculations, duct layout, equipment selection and project specifications. Our designs optimize comfort, efficiency and cost.',
        features: [
            'Thermal load calculations',
            'Duct layout & sizing',
            'Equipment selection & specs',
            'Energy modelling',
            'Compliance documentation',
            'As-built drawings'
        ],
        projects: [
            { client: 'Kembe Estates Ltd', desc: 'Full HVAC design for multi-building residential estate', badge: 'Property' },
            { client: 'Royal Chundu River Lodge', desc: 'HVAC system redesign for lodge expansion project', badge: 'Hospitality' }
        ]
    },
    'smart-hvac': {
        title: 'Smart HVAC',
        subtitle: 'IoT-enabled Systems',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/><path d="M2 20h20"/></svg>',
        description: 'We integrate smart controls into HVAC systems for automated scheduling, remote monitoring, energy usage tracking and predictive maintenance. Reduce energy costs while improving comfort.',
        features: [
            'Smart thermostat integration',
            'Remote monitoring & control',
            'Energy usage analytics',
            'Automated scheduling',
            'Predictive maintenance alerts',
            'Building management integration'
        ],
        projects: [
            { client: 'Reliant Mining', desc: 'IoT-enabled server room cooling with automated alerts and monitoring', badge: 'Mining' },
            { client: 'ZSIC - Ndola', desc: 'Smart thermostat deployment with centralized office climate control', badge: 'Insurance' }
        ]
    },
    maintenance: {
        title: 'Preventive Maintenance',
        subtitle: 'Scheduled Inspections',
        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
        description: 'Regular preventive maintenance extends equipment life and prevents costly breakdowns. We offer scheduled inspection programs for HVAC, IT infrastructure and electrical systems.',
        features: [
            'HVAC filter & coil cleaning',
            'Refrigerant level checks',
            'Electrical system inspections',
            'IT equipment health checks',
            'Maintenance reports & logs',
            'Annual service contracts'
        ],
        projects: [
            { client: 'Royal Chundu River Lodge', desc: 'Annual HVAC maintenance contract covering 40+ AC units', badge: 'Hospitality' },
            { client: 'Reliant Mining', desc: 'Quarterly preventive maintenance for server room cooling and IT equipment', badge: 'Mining' },
            { client: 'Aninas Lodge', desc: 'Monthly AC servicing and annual electrical inspection program', badge: 'Hospitality' }
        ]
    }
};

// Modal logic
const modalOverlay = document.getElementById('serviceModal');
const modalClose = document.getElementById('modalClose');

function openServiceModal(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

    document.getElementById('modalIcon').innerHTML = data.icon;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDescription').textContent = data.description;

    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

    const projectsList = document.getElementById('modalProjects');
    projectsList.innerHTML = data.projects.map(p => `
        <div class="modal-project-item">
            <span class="modal-project-badge">${p.badge}</span>
            <div class="modal-project-detail">
                <strong>${p.client}</strong>
                <span>${p.desc}</span>
            </div>
        </div>
    `).join('');

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Attach click handlers to all service cards
document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', () => {
        openServiceModal(card.dataset.service);
    });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openServiceModal(card.dataset.service);
        }
    });
});

// Close modal handlers
modalClose.addEventListener('click', closeServiceModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeServiceModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeServiceModal();
    }
});

// Close modal when clicking the CTA link inside it
document.getElementById('modalCta').addEventListener('click', () => {
    closeServiceModal();
});
