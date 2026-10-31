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


  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress bar
  var bar = document.createElement("div");
  bar.id = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  // Stagger index for mobile menu items
  document.querySelectorAll("#mobile-menu nav > a, #mobile-menu nav > p").forEach(function (el, i) {
    el.style.setProperty("--i", i);
  });

  // Shine + lift on pill buttons; pulse on the first hero CTA
  document.querySelectorAll("a.rounded-full, button.rounded-full").forEach(function (el) {
    el.classList.add("btn-shine");
  });
  var heroCta = document.querySelector("main > section:first-of-type a.rounded-full.bg-primary");
  if (heroCta && !reduce) heroCta.classList.add("btn-pulse");

  // Hero headline: animate word by word
  var h1 = document.querySelector("main h1");
  if (h1 && !reduce && h1.children.length === 0) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute("aria-label", h1.textContent.trim());
    h1.classList.remove("animate-fade-up");
    h1.style.removeProperty("animation-delay");
    h1.style.opacity = "1";
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="word" aria-hidden="true" style="--w:' + i + '">' + w + "</span>";
    }).join(" ");
  }

  // Auto-tag content for scroll reveal (inner pages have none by default)
  (function autoReveal() {
    var sections = document.querySelectorAll("main > section");
    sections.forEach(function (sec, si) {
      if (si === 0) return; // hero already animates on load
      var cands = [];
      var push = function (el, d) { if (el) cands.push([el, d || 0]); };
      sec.querySelectorAll(".container-site").forEach(function (c) {
        Array.prototype.forEach.call(c.children, function (child) {
          if (/(^|\s)(grid|space-y-\S+)(\s|$)/.test(child.className) || /(^|\s)sm:grid-cols|md:grid-cols|lg:grid-cols/.test(child.className)) {
            Array.prototype.forEach.call(child.children, function (g, i) { push(g, Math.min(i, 8) * 70); });
          } else if (child.tagName === "H2" || child.tagName === "P" || child.tagName === "H3") {
            push(child, 0);
          } else {
            // wrapper block: reveal its heading/intro, then any grids/lists inside
            Array.prototype.forEach.call(child.children, function (g, i) {
              if (/(^|\s)grid(\s|$)|grid-cols/.test(g.className)) {
                Array.prototype.forEach.call(g.children, function (gg, j) { push(gg, Math.min(j, 8) * 70); });
              } else if (g.tagName === "UL" || g.tagName === "OL") {
                Array.prototype.forEach.call(g.children, function (li, j) { push(li, Math.min(j, 8) * 60); });
              } else { push(g, Math.min(i, 4) * 60); }
            });
            if (!child.children.length) push(child, 0);
          }
        });
      });
      cands.forEach(function (c) {
        var el = c[0];
        if (el.hasAttribute("data-reveal") || el.classList.contains("animate-fade-up")) return;
        if (el.closest("[data-reveal]") || el.closest("form")) return;
        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", /^IMG$|overflow-hidden/.test(el.tagName + " " + el.className) ? "zoom" : "");
          el.style.setProperty("--d", c[1] + "ms");
          if (!/card-hover/.test(el.className) && el.matches("div, li") && /border/.test(el.className)) el.classList.add("card-hover");
        }
      });
    });
    // Forms: stagger fields
    document.querySelectorAll("form").forEach(function (f) {
      f.querySelectorAll("label, button[type=submit]").forEach(function (el, i) {
        var host = el.tagName === "LABEL" ? (el.closest("div") || el) : el;
        if (host.hasAttribute("data-reveal")) return;
        host.setAttribute("data-reveal", "");
        host.style.setProperty("--d", Math.min(i, 8) * 60 + "ms");
      });
    });
  })();

  // Gentle parallax on image blocks
  var pimgs = [];
  if (!reduce) {
    document.querySelectorAll("main .overflow-hidden > img").forEach(function (img) {
      if (img.closest("#mobile-menu")) return;
      img.setAttribute("data-parallax", "");
      pimgs.push(img);
    });
  }
  var ticking = false;
  var parallax = function () {
    ticking = false;
    var vh = window.innerHeight;
    pimgs.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var off = (r.top + r.height / 2 - vh / 2) * -0.04;
      var max = r.height * 0.05;
      img.style.translate = "0 " + Math.max(-max, Math.min(max, off)).toFixed(1) + "px";
    });
  };
  var onFrame = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    if (pimgs.length && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  };
  window.addEventListener("scroll", onFrame, { passive: true });
  window.addEventListener("resize", onFrame);
  onFrame();


  // "What we do": category box (All / Bookkeeping / Tax & Payroll / ...)
  (function serviceTabs() {
    var sec = null;
    document.querySelectorAll("p.eyebrow").forEach(function (h) {
      if (h.textContent.trim().toLowerCase() === "what we do") sec = h.closest("section");
    });
    if (!sec) return;
    var wrap = sec.querySelector(".space-y-12");
    if (!wrap) return;
    wrap.classList.add("svc-groups");
    var groups = Array.prototype.slice.call(wrap.children);
    groups.forEach(function (g) { g.classList.add("svc-group"); });

    var box = document.createElement("div");
    box.className = "svc-box";
    box.setAttribute("role", "tablist");
    box.setAttribute("aria-label", "Service categories");

    var hint = document.createElement("p");
    hint.className = "svc-hint";
    hint.textContent = "Choose a category above to see what is included.";

    var total = 0;
    var tabs = [];
    var mk = function (label, count, key) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "svc-tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", "false");
      b.dataset.key = key;
      b.innerHTML = "<span></span><span class=\"svc-count\">" + count + "</span>";
      b.firstChild.textContent = label;
      box.appendChild(b);
      tabs.push(b);
      return b;
    };
    var counts = groups.map(function (g) { var n = g.querySelectorAll(".card-hover").length; total += n; return n; });
    mk("All", total, "all");
    groups.forEach(function (g, i) {
      var h = g.querySelector("h3");
      mk(h ? h.textContent.trim() : "Category " + (i + 1), counts[i], String(i));
    });

    wrap.parentNode.insertBefore(box, wrap);
    wrap.parentNode.insertBefore(hint, wrap);
    groups.forEach(function (g) { g.hidden = true; });
    wrap.hidden = true;

    var select = function (key) {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", t.dataset.key === key ? "true" : "false"); });
      hint.hidden = true;
      wrap.hidden = false;
      var n = 0;
      groups.forEach(function (g, i) {
        var show = key === "all" || key === String(i);
        g.hidden = !show;
        if (!show) return;
        var h3 = g.querySelector("h3");
        if (h3) { h3.classList.add("is-visible"); h3.style.setProperty("--d", (Math.min(n++, 7) * 50) + "ms"); }
        g.querySelectorAll("[data-reveal]").forEach(function (el) {
          if (el === h3) return;
          el.classList.add("is-visible");
          el.style.setProperty("--d", (Math.min(n++, 7) * 55) + "ms");
        });
      });
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { select(t.dataset.key); });
      t.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(t), j = -1;
        if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        if (j > -1) { e.preventDefault(); tabs[j].focus(); select(tabs[j].dataset.key); }
      });
    });
  })();

  // Scroll reveal
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
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
        '<div class="animate-pop mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-2xl text-primary">✓</div>' +
        '<h2 class="h-display mt-4 text-2xl font-bold">Thank you — request received</h2>' +
        '<p class="mx-auto mt-3 max-w-md text-muted-foreground">We\'ll get back to you within one business day to confirm your consultation time.</p></div>';
    });
  }
})();
