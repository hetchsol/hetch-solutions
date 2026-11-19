// Hetch Solutions Limited: site behaviour
(function () {
    'use strict';

    var WHATSAPP_NUMBER = '260966938945';
    var EMAIL = 'hetchsolutions@outlook.com';
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Mobile menu ----------
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('siteNav');
    function setMenu(open) {
        if (!toggle || !nav) return;
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    // ---------- Scroll progress bar ----------
    var progress = document.querySelector('.scroll-progress');
    var ticking = false;
    function updateProgress() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { window.requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();

    // ---------- Reveal on scroll ----------
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                // small stagger for siblings in the same grid
                var siblings = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }) : [];
                var index = siblings.indexOf(el);
                el.style.transitionDelay = (index > 0 ? Math.min(index, 5) * 0.08 : 0) + 's';
                el.classList.add('is-visible');
                io.unobserve(el);
                // once revealed, hand the element back to its normal hover transitions
                setTimeout(function () {
                    el.classList.remove('reveal', 'is-visible');
                    el.style.transitionDelay = '';
                    if (el.classList.contains('step')) el.classList.add('is-visible');
                }, 1400);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // ---------- Projects counter ----------
    var counter = document.querySelector('.count[data-target]');
    if (counter && !reduceMotion) {
        var target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        counter.textContent = '0';
        var start = null;
        var delay = 700, duration = 1600;
        var stepCount = function (ts) {
            if (start === null) start = ts;
            var t = Math.min(1, Math.max(0, (ts - start - delay) / duration));
            var eased = 1 - Math.pow(1 - t, 3);
            counter.textContent = String(Math.round(target * eased));
            if (t < 1) window.requestAnimationFrame(stepCount);
        };
        window.requestAnimationFrame(stepCount);
    }

    // ---------- Quote form: WhatsApp / email ----------
    var form = document.getElementById('quoteForm');
    if (form) {
        var nameInput = document.getElementById('qName');
        var phoneInput = document.getElementById('qPhone');
        var messageInput = document.getElementById('qMessage');
        var okMsg = document.getElementById('formOk');
        var errMsg = document.getElementById('formErr');
        var mailLink = document.getElementById('mailLink');

        var selectedService = function () {
            var checked = form.querySelector('input[name="service"]:checked');
            return checked ? checked.value : 'Not sure yet';
        };
        var buildEnquiry = function () {
            return 'Hello Hetch Solutions, I would like a quote.\n\n' +
                'Name: ' + (nameInput.value.trim() || '-') + '\n' +
                'Phone: ' + (phoneInput.value.trim() || '-') + '\n' +
                'Service: ' + selectedService() + '\n' +
                'Site details: ' + (messageInput.value.trim() || '-');
        };
        var updateMailLink = function () {
            mailLink.href = 'mailto:' + EMAIL +
                '?subject=' + encodeURIComponent('Quote request: ' + selectedService()) +
                '&body=' + encodeURIComponent(buildEnquiry());
        };
        var showError = function () {
            errMsg.hidden = false;
            okMsg.hidden = true;
            nameInput.setAttribute('aria-invalid', 'true');
            nameInput.focus();
        };
        var clearError = function () {
            errMsg.hidden = true;
            nameInput.removeAttribute('aria-invalid');
        };

        form.addEventListener('input', function (e) {
            if (e.target === nameInput && nameInput.value.trim()) clearError();
            updateMailLink();
        });
        form.addEventListener('change', updateMailLink);
        updateMailLink();

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!nameInput.value.trim()) { showError(); return; }
            clearError();
            var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildEnquiry());
            var win = window.open(url, '_blank');
            if (win) { try { win.opener = null; } catch (err) { /* ignore */ } }
            else { window.location.href = url; } // pop-up blocked: open in the same tab
            okMsg.hidden = false;
        });

        mailLink.addEventListener('click', function (e) {
            if (!nameInput.value.trim()) { e.preventDefault(); showError(); }
        });

        // "Get an ICT / civil works / HVAC quote" links pre-select the service
        document.querySelectorAll('[data-service]').forEach(function (link) {
            link.addEventListener('click', function () {
                var value = link.getAttribute('data-service');
                var radio = Array.prototype.find.call(form.querySelectorAll('input[name="service"]'), function (r) { return r.value === value; });
                if (radio) { radio.checked = true; updateMailLink(); }
            });
        });
    }

    // ---------- Footer year ----------
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
