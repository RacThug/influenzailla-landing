document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  initSlider();
  initMobileMenu();
  initTracking();
});

/* =========================================================
   Tabs - Branding / Design / Marketing
   The active title carries the full gradient; the other two
   drop to --opacity-inactive.
   ========================================================= */
function initTabs() {
  var list = document.querySelector('.tab-list');
  if (!list) {
    return;
  }

  var tabs = Array.prototype.slice.call(list.querySelectorAll('.tab'));

  function select(index) {
    tabs.forEach(function (tab, i) {
      var isActive = i === index;
      var panel = document.getElementById(tab.getAttribute('aria-controls'));

      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;

      if (panel) {
        panel.hidden = !isActive;
        panel.classList.toggle('is-hidden', !isActive);
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      select(i);
    });

    tab.addEventListener('keydown', function (event) {
      var next = null;

      if (event.key === 'ArrowRight') {
        next = (i + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        next = (i - 1 + tabs.length) % tabs.length;
      }

      if (next !== null) {
        event.preventDefault();
        select(next);
        tabs[next].focus();
      }
    });
  });

  select(0);
}

/* =========================================================
   Projects slider
   Three slides of two cards. Prev/next step by one slide and
   wrap; the dots mark the current position.
   ========================================================= */
function initSlider() {
  var slider = document.querySelector('[data-slider]');
  if (!slider) {
    return;
  }

  var track = slider.querySelector('[data-slider-track]');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
  var dotList = slider.querySelector('[data-slider-dots]');
  var prev = slider.querySelector('[data-slider-prev]');
  var next = slider.querySelector('[data-slider-next]');
  var current = 0;
  var dots = [];

  slides.forEach(function (slide, i) {
    var item = document.createElement('li');
    var dot = document.createElement('button');

    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () {
      go(i);
    });

    item.appendChild(dot);
    dotList.appendChild(item);
    dots.push(dot);
  });

  function go(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * current) + '%)';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });

    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      go(current - 1);
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      go(current + 1);
    });
  }

  go(0);
}

/* =========================================================
   Mobile menu overlay
   ========================================================= */
function initMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) {
    return;
  }

  var close = menu.querySelector('.menu-close');

  function setOpen(isOpen) {
    menu.hidden = !isOpen;
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(true);
  });

  if (close) {
    close.addEventListener('click', function () {
      setOpen(false);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
    }
  });
}

/* =========================================================
   Analytics
   Only the four section links are marked for tracking on the
   Figma Analytics page. Events go to the GTM data layer.
   ========================================================= */
function initTracking() {
  window.dataLayer = window.dataLayer || [];

  var tracked = document.querySelectorAll('[data-track]');

  Array.prototype.forEach.call(tracked, function (element) {
    element.addEventListener('click', function () {
      window.dataLayer.push({
        event: 'link_click',
        link_id: element.getAttribute('data-track'),
        link_text: element.textContent.trim()
      });
    });
  });
}
