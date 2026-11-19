// Career Compass SA — shared behaviour
document.addEventListener("DOMContentLoaded", function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Mobile menu
  var toggle = $(".nav-toggle"), links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header shadow + scroll progress
  var header = $(".site-header"), bar = $(".progress");
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Reveal on scroll
  var items = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("in"); }); }

  // Card spotlight follows the pointer
  $$(".card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // Programmes sub-nav scrollspy
  var sub = $$(".subnav a");
  if (sub.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) sub.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sub.forEach(function (a) { var t = $(a.getAttribute("href")); if (t) spy.observe(t); });
  }

  // Pricing explorer (subject tabs + grade pills)
  var ex = $("[data-explorer]");
  if (ex) {
    var subj = $$("[data-subject-tab]", ex), pills = $$("[data-grade-tab]", ex), sets = $$(".price-set", ex);
    var state = { s: subj[0].dataset.subjectTab, g: null };
    var render = function () {
      subj.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.subjectTab === state.s); });
      var mine = pills.filter(function (p) { return p.dataset.subject === state.s; });
      if (!mine.some(function (p) { return p.dataset.gradeTab === state.g; })) state.g = mine[0].dataset.gradeTab;
      pills.forEach(function (p) {
        p.hidden = p.dataset.subject !== state.s;
        p.setAttribute("aria-selected", p.dataset.subject === state.s && p.dataset.gradeTab === state.g);
      });
      sets.forEach(function (s) { s.hidden = !(s.dataset.subject === state.s && s.dataset.grade === state.g); });
    };
    subj.forEach(function (b) { b.addEventListener("click", function () { state.s = b.dataset.subjectTab; state.g = null; render(); }); });
    pills.forEach(function (p) { p.addEventListener("click", function () { state.g = p.dataset.gradeTab; render(); }); });
    render();
  }

  // Contact form -> pre-filled WhatsApp message
  var form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = "Hi Career Compass SA! I'm " + (d.get("name") || "someone") + " (" + d.get("role") + "). " + (d.get("message") || "");
      window.open("https://wa.me/27649180737?text=" + encodeURIComponent(msg.trim()), "_blank", "noopener");
    });
  }
});
