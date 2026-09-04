(function () {
  "use strict";

  var root = document.documentElement;
  var gauge = document.getElementById("scrollGauge");
  var readout = document.getElementById("scrollReadout");
  var heroTrace = document.getElementById("heroTrace");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ticking = false;

  function updatePlot() {
    var scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    var progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    if (readout) readout.textContent = String(Math.round(progress * 100)).padStart(3, "0");

    if (heroTrace && !reducedMotion) {
      var heroProgress = Math.min(Math.max((window.scrollY + window.innerHeight * 0.34) / window.innerHeight, 0), 1);
      heroTrace.style.setProperty("--trace-offset", (1 - heroProgress).toFixed(3));
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updatePlot);
      ticking = true;
    }
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-header nav a[href^="#"]'));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  updatePlot();

  if (gauge) gauge.setAttribute("aria-hidden", "true");
}());
