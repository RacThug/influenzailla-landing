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

  var viewport = slider.querySelector('.slider-viewport');
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

  function syncHeight() {
    viewport.style.height = slides[current].getBoundingClientRect().height + 'px';
  }

  function go(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * current) + '%)';
    syncHeight();

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

  /* Swipe. The design hides the arrows below 768px, which leaves the dots
     as the only way through the slides - so on a phone the slider has to
     answer to the finger as well.

     The drag is followed in pixels rather than the percentage go() rests
     on, because the offset has to track the finger exactly. The direction
     is settled once, on the first few pixels of movement: a finger heading
     down the page keeps scrolling it and the slider lets go. */
  var startX = 0;
  var startY = 0;
  var deltaX = 0;
  var tracking = false;
  var swiping = false;

  viewport.addEventListener('touchstart', function (event) {
    if (event.touches.length !== 1) {
      return;
    }

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    deltaX = 0;
    tracking = true;
    swiping = false;
  }, { passive: true });

  viewport.addEventListener('touchmove', function (event) {
    if (!tracking) {
      return;
    }

    var dx = event.touches[0].clientX - startX;
    var dy = event.touches[0].clientY - startY;

    if (!swiping) {
      if (Math.abs(dy) > Math.abs(dx)) {
        tracking = false;
        return;
      }

      if (Math.abs(dx) < 8) {
        return;
      }

      swiping = true;
      track.style.transition = 'none';
    }

    /* Now that this is a swipe, the page must not scroll sideways with it. */
    event.preventDefault();
    deltaX = dx;
    track.style.transform =
      'translateX(' + (dx - current * viewport.clientWidth) + 'px)';
  }, { passive: false });

  function endSwipe() {
    if (!tracking) {
      return;
    }

    tracking = false;
    track.style.transition = '';

    if (!swiping) {
      return;
    }

    swiping = false;

    /* A fifth of the way across counts as a swipe; anything less snaps back. */
    if (Math.abs(deltaX) > viewport.clientWidth / 5) {
      go(deltaX < 0 ? current + 1 : current - 1);
    } else {
      go(current);
    }
  }

  viewport.addEventListener('touchend', endSwipe);
  viewport.addEventListener('touchcancel', endSwipe);

  /* The first measurement runs before the card artwork has loaded, so
     the height has to be re-taken whenever a slide actually resizes. */
  window.addEventListener('resize', syncHeight);
  window.addEventListener('load', syncHeight);

  if (window.ResizeObserver) {
    var observer = new ResizeObserver(syncHeight);
    slides.forEach(function (slide) {
      observer.observe(slide);
    });
  }
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
