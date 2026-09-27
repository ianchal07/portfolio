(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Theme toggle ---- */
  var toggle = document.getElementById("theme-toggle");
  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function labelToggle() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
  }
  if (toggle) {
    labelToggle();
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      labelToggle();
    });
  }

  /* ---- Mobile menu ---- */
  var menuBtn = document.getElementById("menu-btn");
  var links = document.getElementById("nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---- Visitor stats: GoatCounter, only when a code is set ---- */
  var gcMeta = document.querySelector('meta[name="goatcounter"]');
  var gcCode = gcMeta ? (gcMeta.getAttribute("content") || "").trim() : "";
  if (gcCode) {
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://" + gcCode + ".goatcounter.com/count");
    document.head.appendChild(gc);

    function track(name) {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: name, title: name, event: true });
      }
    }
    document.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest("a[data-track]") : null;
      if (el) track(el.getAttribute("data-track"));
    });
    Array.prototype.forEach.call(document.querySelectorAll("form[data-track]"), function (f) {
      f.addEventListener("submit", function () { track(f.getAttribute("data-track")); });
    });
  }

  /* ---- Availability: hide rows that have no value ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".avail-row"), function (row) {
    var dd = row.querySelector("dd");
    if (!dd || !dd.textContent.trim()) row.hidden = true;
  });

  /* ---- Certifications and awards: show only what has entries ---- */
  var recog = document.getElementById("recognition");
  if (recog) {
    var total = 0;
    ["certifications", "awards"].forEach(function (id) {
      var col = document.getElementById(id);
      if (!col) return;
      var n = col.querySelectorAll(".recog-item").length;
      total += n;
      col.hidden = n === 0;
    });
    if (total > 0) {
      recog.hidden = false;
      var navItem = document.getElementById("nav-recognition");
      if (navItem) navItem.hidden = false;
      var cols = recog.querySelector(".recog");
      var visible = recog.querySelectorAll(".recog-col:not([hidden])").length;
      if (cols && visible === 1) cols.classList.add("recog-single");
    }
  }

  /* ---- Scroll-driven reveals, counters and charts ---- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var to = parseInt(el.getAttribute("data-to"), 10);
    if (isNaN(to) || el.dataset.done) return;
    el.dataset.done = "1";
    if (reduceMotion) { el.textContent = to.toLocaleString("en-US"); return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * eased).toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(tick);
    }
    el.textContent = "0";
    requestAnimationFrame(tick);
  }

  function light(stack) {
    var layers = stack.querySelectorAll(".layer");
    Array.prototype.forEach.call(layers, function (l, i) {
      setTimeout(function () { l.classList.add("lit"); }, reduceMotion ? 0 : 180 * i);
    });
  }

  function onEnter(el) {
    el.classList.add("in");
    Array.prototype.forEach.call(el.querySelectorAll(".count"), countUp);
    if (el.id === "process") el.classList.add("drawn");
    if (el.id === "stack") light(el);
  }

  var watched = document.querySelectorAll(".reveal, #process, #stack");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { onEnter(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(watched, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(watched, onEnter);
  }

  /* ---- Rotating portrait (as on the original site) ---- */
  var portrait = document.getElementById("portrait");
  if (portrait && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
    var pics = portrait.querySelectorAll("img");
    var idx = 0;
    if (pics.length > 1) {
      setInterval(function () {
        pics[idx].classList.remove("on");
        idx = (idx + 1) % pics.length;
        pics[idx].classList.add("on");
      }, 3500);
    }
  }

  /* ---- On narrow screens, open the journey chart at the latest step ---- */
  var journey = document.getElementById("journey");
  if (journey && journey.scrollWidth > journey.clientWidth) {
    journey.scrollLeft = journey.scrollWidth;
  }

  /* ---- Hero trace: one orchestrated reveal, replayable ---- */
  var trace = document.getElementById("trace");
  var replay = document.getElementById("replay");
  if (!trace) return;
  var steps = Array.prototype.slice.call(trace.querySelectorAll(".step"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timers = [];

  function showAll() { steps.forEach(function (s) { s.classList.add("is-done"); }); }

  function run() {
    timers.forEach(clearTimeout); timers = [];
    if (reduce) { showAll(); return; }
    trace.classList.add("js-anim");
    steps.forEach(function (s) { s.classList.remove("is-done"); });
    steps.forEach(function (s, i) {
      timers.push(setTimeout(function () { s.classList.add("is-done"); }, 450 + i * 650));
    });
  }

  run();
  if (replay) {
    if (reduce) replay.hidden = true;
    replay.addEventListener("click", run);
  }
})();
