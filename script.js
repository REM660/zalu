(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  var top = document.getElementById("top");
  var progress = document.getElementById("progress");
  var links = menu ? menu.querySelectorAll("a") : [];
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle("stuck", y > 24);
    if (top) top.classList.toggle("show", y > 600);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }

    var sections = document.querySelectorAll("main section[id]");
    var cur = "";
    for (var i = 0; i < sections.length; i++) {
      if (y >= sections[i].offsetTop - 140) cur = sections[i].id;
    }
    for (var j = 0; j < links.length; j++) {
      links[j].classList.toggle("on", links[j].getAttribute("href") === "#" + cur);
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    });

    for (var k = 0; k < links.length; k++) {
      links[k].addEventListener("click", function () {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    }
  }

  if (top) {
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* reveal on scroll */
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    for (var r = 0; r < revealItems.length; r++) ro.observe(revealItems[r]);
  } else {
    for (var f = 0; f < revealItems.length; f++) revealItems[f].classList.add("in");
  }

  /* counters */
  var counters = document.querySelectorAll("[data-count]");

  function fmtCount(el, v) {
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var s;
    if (dec > 0) {
      s = v.toFixed(dec).replace(".", ",");
    } else {
      s = String(Math.round(v));
    }
    return s + suffix;
  }

  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var dur = 1300;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtCount(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmtCount(el, target);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          runCount(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    for (var c = 0; c < counters.length; c++) co.observe(counters[c]);
  } else {
    for (var d = 0; d < counters.length; d++) {
      counters[d].textContent = fmtCount(counters[d], parseFloat(counters[d].getAttribute("data-count")) || 0);
    }
  }

  /* faq */
  var faqItems = document.querySelectorAll(".faq-i");
  for (var q = 0; q < faqItems.length; q++) {
    (function (item) {
      var btn = item.querySelector(".faq-q");
      var panel = item.querySelector(".faq-a");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");

        for (var o = 0; o < faqItems.length; o++) {
          faqItems[o].classList.remove("open");
          faqItems[o].querySelector(".faq-a").style.maxHeight = null;
          faqItems[o].querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }

        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    })(faqItems[q]);
  }

  /* form */
  var form = document.getElementById("form");
  var msg = document.getElementById("formMsg");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var required = form.querySelectorAll("[required]");

      for (var i = 0; i < required.length; i++) {
        var field = required[i].closest(".field");
        var value = required[i].value.trim();
        var valid = value.length > 0;

        if (required[i].type === "email") {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        }
        field.classList.toggle("err", !valid);
        if (!valid) ok = false;
      }

      if (!ok) {
        msg.textContent = "Lütfen zorunlu alanları kontrol edin.";
        msg.classList.add("bad");
        return;
      }

      msg.classList.remove("bad");
      msg.textContent = "Teşekkürler, mesajınız alındı. 24 saat içinde dönüş yapacağız.";
      form.reset();
    });

    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("err");
    });
  }

  /* year */
  var yil = document.getElementById("yil");
  if (yil) yil.textContent = new Date().getFullYear();

  onScroll();
})();
