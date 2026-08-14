(function(){
  document.documentElement.classList.add('js');

  // Theme toggle (early theme is already set by the inline head script,
  // this just wires the button and keeps it in sync).
  var THEME_KEY = 'theme';
  var toggleBtn = document.getElementById('theme-toggle');
  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-pressed', currentTheme() === 'dark' ? 'true' : 'false');
    toggleBtn.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }
  // If the user hasn't chosen manually, keep following system preference live.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var mqHandler = function (e) {
      var stored = null;
      try { stored = localStorage.getItem(THEME_KEY); } catch (err) {}
      if (!stored) setTheme(e.matches ? 'dark' : 'light');
    };
    if (mq.addEventListener) mq.addEventListener('change', mqHandler);
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal (no-op if reduced motion is preferred; CSS handles that)
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Case-study table of contents: highlight active section
  var tocLinks = document.querySelectorAll('.cs-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var sections = Array.prototype.map.call(tocLinks, function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = '#' + entry.target.id;
        var link = document.querySelector('.cs-toc a[href="' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(function (s) { tocObserver.observe(s); });
  }

  // Testimonial carousel: 2-up pages on a sliding track, prev/next + tablist
  // dots, no auto-advance, roving-tabindex keyboard support (ARIA tablist).
  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var track = carousel.querySelector('.t-track');
    var pages = Array.prototype.slice.call(carousel.querySelectorAll('.t-page'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.t-dot'));
    var prevBtn = carousel.querySelector('.t-prev');
    var nextBtn = carousel.querySelector('.t-next');
    var countEl = carousel.querySelector('.t-count-current');
    var index = 0;

    function show(i, opts) {
      opts = opts || {};
      index = (i + pages.length) % pages.length;
      if (track) track.style.transform = 'translateX(-' + (index * 100) + '%)';
      pages.forEach(function (page, n) {
        page.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
      dots.forEach(function (dot, n) {
        var active = n === index;
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
        dot.tabIndex = active ? 0 : -1;
      });
      if (countEl) countEl.textContent = String(index + 1);
      if (opts.focusDot && dots[index]) dots[index].focus();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(n + 1, { focusDot: true }); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(n - 1, { focusDot: true }); }
        else if (e.key === 'Home') { e.preventDefault(); show(0, { focusDot: true }); }
        else if (e.key === 'End') { e.preventDefault(); show(pages.length - 1, { focusDot: true }); }
      });
    });

    show(0);
  }
})();
