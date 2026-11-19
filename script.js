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

    // ---------- Quote form ----------
    // Paste the Formspree form ID here (the part after formspree.io/f/).
    // While it is empty, the form falls back to opening WhatsApp.
    var FORMSPREE_ID = 'mjywrdqp';

    var form = document.getElementById('quoteForm');
    if (form) {
        var useEmail = /^[A-Za-z0-9]+$/.test(FORMSPREE_ID);
        var nameInput = document.getElementById('qName');
        var phoneInput = document.getElementById('qPhone');
        var emailInput = document.getElementById('qEmail');
        var messageInput = document.getElementById('qMessage');
        var okMsg = document.getElementById('formOk');
        var errMsg = document.getElementById('formErr');
        var mailLink = document.getElementById('mailLink');
        var waLink = document.getElementById('waLink');
        var submitBtn = form.querySelector('button[type="submit"]');
        var submitLabel = document.getElementById('submitLabel');
        var waIcon = document.getElementById('waIcon');
        var sending = false;

        if (useEmail) {
            submitLabel.textContent = 'Send my quote request';
            if (waIcon) waIcon.style.display = 'none';
            document.getElementById('altWhatsApp').hidden = false;
            document.getElementById('altEmail').hidden = true;
        }

        var selectedService = function () {
            var checked = form.querySelector('input[name="service"]:checked');
            return checked ? checked.value : 'Not sure yet';
        };
        var val = function (input) { return input ? input.value.trim() : ''; };
        var buildEnquiry = function () {
            return 'Hello Hetch Solutions, I would like a quote.\n\n' +
                'Name: ' + (val(nameInput) || '-') + '\n' +
                'Phone: ' + (val(phoneInput) || '-') + '\n' +
                (val(emailInput) ? 'Email: ' + val(emailInput) + '\n' : '') +
                'Service: ' + selectedService() + '\n' +
                'Site details: ' + (val(messageInput) || '-');
        };
        var updateLinks = function () {
            mailLink.href = 'mailto:' + EMAIL +
                '?subject=' + encodeURIComponent('Quote request: ' + selectedService()) +
                '&body=' + encodeURIComponent(buildEnquiry());
            if (waLink) waLink.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildEnquiry());
        };
        var showError = function (text, field) {
            errMsg.textContent = text;
            errMsg.hidden = false;
            okMsg.hidden = true;
            if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
        };
        var showOk = function (text) {
            okMsg.textContent = text;
            okMsg.hidden = false;
            errMsg.hidden = true;
        };
        var clearError = function () {
            errMsg.hidden = true;
            [nameInput, phoneInput, emailInput].forEach(function (f) { if (f) f.removeAttribute('aria-invalid'); });
        };
        // Returns true when the form is fine to send
        var validate = function () {
            if (!val(nameInput)) { showError('Please add your name so we know who to call back.', nameInput); return false; }
            if (useEmail) {
                if (!val(phoneInput) && !val(emailInput)) { showError('Please add a phone number or email so we can reach you.', phoneInput); return false; }
                if (val(emailInput) && !emailInput.checkValidity()) { showError('That email address doesn’t look right. Please check it.', emailInput); return false; }
            }
            clearError();
            return true;
        };
        var openWhatsApp = function () {
            var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildEnquiry());
            var win = window.open(url, '_blank');
            if (win) { try { win.opener = null; } catch (err) { /* ignore */ } }
            else { window.location.href = url; } // pop-up blocked: open in the same tab
            showOk('Thanks! Your request has opened in WhatsApp. Press send there and we’ll get back to you within one working day.');
        };
        var setSending = function (on) {
            sending = on;
            submitBtn.disabled = on;
            submitLabel.textContent = on ? 'Sending…' : 'Send my quote request';
        };
        var sendEmail = function () {
            var data = new FormData(form);
            data.set('service', selectedService());
            data.append('_subject', 'Quote request: ' + selectedService() + ' (' + val(nameInput) + ')');
            if (!val(emailInput)) data.delete('email');
            setSending(true);
            fetch('https://formspree.io/f/' + FORMSPREE_ID, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                form.reset();
                updateLinks();
                showOk('Thanks! Your quote request has been sent. We’ll get back to you within one working day.');
                okMsg.focus();
            }).catch(function () {
                showError('Sorry, your request didn’t send. Please try again, or use WhatsApp or call us.', null);
            }).then(function () { setSending(false); });
        };

        form.addEventListener('input', function (e) {
            if (e.target.getAttribute('aria-invalid') && e.target.value.trim()) clearError();
            updateLinks();
        });
        form.addEventListener('change', updateLinks);
        updateLinks();

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (sending || !validate()) return;
            if (useEmail) sendEmail(); else openWhatsApp();
        });

        [mailLink, waLink].forEach(function (link) {
            if (!link) return;
            link.addEventListener('click', function (e) {
                if (!val(nameInput)) { e.preventDefault(); showError('Please add your name so we know who to call back.', nameInput); }
            });
        });

        // "Get an ICT / civil works / HVAC quote" links pre-select the service
        document.querySelectorAll('[data-service]').forEach(function (link) {
            link.addEventListener('click', function () {
                var value = link.getAttribute('data-service');
                var radio = Array.prototype.find.call(form.querySelectorAll('input[name="service"]'), function (r) { return r.value === value; });
                if (radio) { radio.checked = true; updateLinks(); }
            });
        });
    }

    // ---------- Footer year ----------
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
