// Bookkeeping and Tax Services — site interactions
(function () {
  // Mobile menu
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.querySelector("[data-icon-open]").classList.toggle("hidden", open);
      toggle.querySelector("[data-icon-close]").classList.toggle("hidden", !open);
    });
  }

  // Services dropdown (hover + click)
  document.querySelectorAll("[data-dropdown]").forEach(function (dd) {
    var btn = dd.querySelector("[data-dropdown-toggle]");
    var set = function (v) { dd.classList.toggle("is-open", v); btn.setAttribute("aria-expanded", v); };
    dd.addEventListener("mouseenter", function () { set(true); });
    dd.addEventListener("mouseleave", function () { set(false); });
    btn.addEventListener("click", function () { set(!dd.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  });

  // Header shadow + back-to-top
  var header = document.getElementById("site-header");
  var top = document.getElementById("back-to-top");
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (top) top.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  // Scroll reveal
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Animated stat counters (e.g. "120+")
  document.querySelectorAll("p.font-display").forEach(function (el) {
    var m = el.textContent.trim().match(/^(\d+)(\D*)$/);
    if (!m || el.closest("form")) return;
    var target = parseInt(m[1], 10), suffix = m[2];
    if (target < 10) return;
    var started = false;
    new IntersectionObserver(function (en, obs) {
      if (!en[0].isIntersecting || started) return;
      started = true; obs.disconnect();
      var t0 = performance.now();
      (function step(t) {
        var p = Math.min((t - t0) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }).observe(el);
  });

  // Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var box = form.parentElement;
      box.innerHTML =
        '<div class="animate-fade-up py-12 text-center">' +
        '<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl text-primary">✓</div>' +
        '<h2 class="h-display mt-4 text-2xl font-bold">Thank you — request received</h2>' +
        '<p class="mx-auto mt-3 max-w-md text-muted-foreground">We\'ll get back to you within one business day to confirm your consultation time.</p></div>';
    });
  }
})();
