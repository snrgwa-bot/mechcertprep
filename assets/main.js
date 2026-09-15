(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Gallery arrows
  var gallery = document.getElementById("gallery");
  document.querySelectorAll(".gallery-nav button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!gallery) return;
      var dir = Number(btn.getAttribute("data-dir")) || 1;
      gallery.scrollBy({ left: dir * 260, behavior: reduce ? "auto" : "smooth" });
    });
  });

  // Readiness ring
  var ring = document.getElementById("ringFg");
  var pct = document.getElementById("ringPct");
  if (!ring || !pct) return;
  var TARGET = 82, C = 527.8;
  function show(value) {
    ring.style.strokeDashoffset = String(C * (1 - value / 100));
    pct.textContent = Math.round(value) + "%";
  }
  if (reduce || !("IntersectionObserver" in window)) { show(TARGET); return; }

  var start = null;
  function tick(ts) {
    if (start === null) start = ts;
    var t = Math.min((ts - start) / 2200, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    pct.textContent = Math.round(TARGET * eased) + "%";
    if (t < 1) requestAnimationFrame(tick);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      ring.style.strokeDashoffset = String(C * (1 - TARGET / 100));
      requestAnimationFrame(tick);
      io.disconnect();
    });
  }, { threshold: 0.4 });
  io.observe(ring);
})();
