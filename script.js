/* Hayat Clinic. Ванильный JS: плиты и «уровень раствора», меню, якоря, язык, лента врачей, лицензия, форма-квиз. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, W = window;
  root.classList.add("js");
  var ASSET_V = ((doc.currentScript && doc.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clamp = function (v, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, v)); };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };
  var smooth = function (x) { x = clamp(x); return x * x * (3 - 2 * x); };
  var LANG = "ru";
  var MOBILE = W.matchMedia("(max-width:760px)").matches;
  var TOUCH = W.matchMedia("(pointer:coarse)").matches;
  var VW = W.innerWidth, VH = W.innerHeight;

  /* ---------- Телефон и WhatsApp - одна константа ---------- */
  var PHONE = "77760433987";
  var WA = {
    ru: {
      "default": "Здравствуйте! Пишу с сайта Hayat Clinic. Нужна консультация нарколога.",
      hero: "Здравствуйте! Пишу с сайта Hayat Clinic. Нужна бесплатная консультация нарколога. Город: ",
      stacionar: "Здравствуйте! Интересует стационарное лечение в Hayat Clinic. Подскажите условия и стоимость. Город: ",
      vyezd: "Здравствуйте! Нужен выезд нарколога на дом. Подскажите стоимость и когда сможет приехать врач. Город: ",
      zapoy: "Здравствуйте! Нужен вывод из запоя. Подскажите стоимость и как действовать. Город: ",
      detox: "Здравствуйте! Интересует детоксикация после наркотических веществ. Подскажите условия и стоимость. Город: ",
      dnevnoy: "Здравствуйте! Интересует дневной стационар (капельница). Подскажите стоимость. Город: ",
      kapelnica: "Здравствуйте! Нужна капельница от похмелья / алкоголя. Подскажите стоимость. Город: ",
      kodirovanie: "Здравствуйте! Интересует кодирование от алкоголизма. Подскажите условия и стоимость. Город: ",
      reabilitaciya: "Здравствуйте! Вопрос про реабилитацию и поддержку после лечения. ",
      rodnym: "Здравствуйте! Пишу о близком человеке. Нужна консультация, как помочь. Город: ",
      kontakty: "Здравствуйте! Пишу с сайта Hayat Clinic. Нужна консультация нарколога. Город: ",
      sticky: "Здравствуйте! Пишу с сайта Hayat Clinic. Нужна консультация нарколога. Город: "
    },
    en: {
      "default": "Hello! I am writing from the Hayat Clinic website. I need a consultation with an addiction doctor.",
      hero: "Hello! I am writing from the Hayat Clinic website. I need a free consultation with an addiction doctor. City: ",
      stacionar: "Hello! I am interested in inpatient treatment at Hayat Clinic. Please tell me the conditions and cost. City: ",
      vyezd: "Hello! I need a doctor's home visit. Please tell me the cost and how soon the doctor can come. City: ",
      zapoy: "Hello! I need help with binge drinking withdrawal. Please tell me the cost and what to do. City: ",
      detox: "Hello! I am interested in drug detox. Please tell me the conditions and cost. City: ",
      dnevnoy: "Hello! I am interested in the day clinic (IV drip). Please tell me the cost. City: ",
      kapelnica: "Hello! I need a hangover / alcohol IV drip. Please tell me the cost. City: ",
      kodirovanie: "Hello! I am interested in alcohol aversion therapy. Please tell me the conditions and cost. City: ",
      reabilitaciya: "Hello! I have a question about rehabilitation and support after treatment. ",
      rodnym: "Hello! I am writing about a family member. I need advice on how to help. City: ",
      kontakty: "Hello! I am writing from the Hayat Clinic website. I need a consultation. City: ",
      sticky: "Hello! I am writing from the Hayat Clinic website. I need a consultation. City: "
    }
  };
  var FORM_LABELS = {
    ru: { head: "Заявка на бесплатную консультацию (сайт Hayat Clinic)", who: "Кому нужна помощь", dep: "Зависимость", need: "Что нужно сейчас", city: "Город", name: "Имя", phone: "Телефон" },
    en: { head: "Free consultation request (Hayat Clinic website)", who: "Who needs help", dep: "Addiction", need: "What is needed now", city: "City", name: "Name", phone: "Phone" }
  };
  W.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var key = a.getAttribute("data-wa") || "default";
    var dict = WA[LANG] || WA.ru;
    var text = dict[key] || WA.ru[key] || WA.ru["default"];
    a.setAttribute("href", "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text));
  }, true);

  /* ---------- fitText для первой строки героя (только десктоп, на мобиле строка переносится) ---------- */
  var h1 = doc.getElementById("h1");
  function fitText() {
    if (!h1) return;
    var l1 = h1.querySelector(".l1");
    h1.style.removeProperty("--fs");
    if (!l1 || W.innerWidth <= 760) return;
    var avail = h1.clientWidth;
    if (!avail) return;
    var fs = parseFloat(getComputedStyle(l1).fontSize);
    var guard = 0;
    while (guard++ < 30 && l1.scrollWidth > avail + 1 && fs > 24) {
      fs *= 0.95; h1.style.setProperty("--fs", fs + "px");
    }
  }

  /* ---------- Меню ---------- */
  var burger = doc.querySelector(".burger"), menu = doc.getElementById("menu");
  var behind = [doc.getElementById("main"), doc.querySelector(".foot"), doc.getElementById("sticky")];
  function setMenu(open, returnFocus) {
    if (!menu || !burger) return;
    var was = doc.body.classList.contains("menu-open");
    if (open === was) return;
    doc.body.classList.toggle("menu-open", open);
    behind.forEach(function (el) { if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } });
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add("open"); });
      setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }, 60);
    } else {
      menu.classList.remove("open");
      setTimeout(function () { if (!doc.body.classList.contains("menu-open")) menu.hidden = true; }, 320);
      if (returnFocus) burger.focus({ preventScroll: true });
    }
  }
  if (burger) burger.addEventListener("click", function () { var o = doc.body.classList.contains("menu-open"); setMenu(!o, o); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.body.classList.contains("menu-open")) setMenu(false, true); });

  /* ---------- Якоря ---------- */
  var HDR = function () { return parseFloat(getComputedStyle(root).getPropertyValue("--hdr")) || 68; };
  function targetTop(el) {
    var r = el.getBoundingClientRect().top + W.pageYOffset;
    if (el.classList.contains("pw")) return MOBILE ? r - HDR() : r;
    if (el.classList.contains("sec")) return r - HDR();
    return r - HDR() - 14;
  }
  function goTo(id, instant) {
    var el = doc.getElementById(id);
    if (!el) return false;
    setMenu(false);
    var top = Math.max(0, targetTop(el));
    if (instant || REDUCED) { root.style.scrollBehavior = "auto"; W.scrollTo(0, top); root.style.scrollBehavior = ""; }
    else W.scrollTo({ top: top, behavior: "smooth" });
    return true;
  }
  doc.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (goTo(id)) {
      e.preventDefault();
      try { history.pushState(null, "", "#" + id); } catch (err) {}
      var t = doc.getElementById(id);
      if (t) { if (!t.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) t.setAttribute("tabindex", "-1"); try { t.focus({ preventScroll: true }); } catch (err2) {} }
    }
  });

  /* ---------- Плиты: enter / stay / exit и уровень раствора --open ---------- */
  var pws = [].slice.call(doc.querySelectorAll(".pw"));
  var sticky = doc.getElementById("sticky"), kont = doc.getElementById("kontakty");
  var hdr = doc.getElementById("hdr");
  var INTRO = (location.hash.length > 1 || W.pageYOffset > 80 || REDUCED) ? 1 : 0;
  var introStart = 0, ticking = false;
  var st = pws.map(function () { return { open: -1, out: {} }; });
  var lastTs = 0;
  function put(pw, s, k, v) { if (s.out[k] !== v) { s.out[k] = v; pw.style.setProperty(k, v); } }
  function update(ts) {
    ticking = false;
    var now = typeof ts === "number" ? ts : performance.now();
    var dt = lastTs ? Math.min(64, now - lastTs) : 16.7; lastTs = now;
    var k = 1 - Math.pow(1 - 0.2, dt / 16.7);
    var H = VH;
    var pageY = W.pageYOffset;
    var kontTop = kont ? kont.getBoundingClientRect().top : null;
    var rects = [], nxtTops = [], i;
    for (i = 0; i < pws.length; i++) {
      rects.push(pws[i].getBoundingClientRect());
      var nx = pws[i].nextElementSibling;
      nxtTops.push(nx ? nx.getBoundingClientRect().top : null);
    }
    var moving = false;
    for (i = 0; i < pws.length; i++) {
      var pw = pws[i], r = rects[i], s = st[i];
      var near = r.bottom > -H * 0.5 && r.top < H * 1.5;
      if (!near && s.out["--enter"] !== undefined && !s.reset) { s.reset = true; } else if (near) s.reset = false;
      if (!near && s.reset) continue;
      var enter = clamp(1 - r.top / H);
      var stay = r.height > H ? clamp(-r.top / (r.height - H)) : 0;
      var exit = (nxtTops[i] !== null && !MOBILE) ? clamp(1 - nxtTops[i] / H) : 0;
      var isHero = pw.classList.contains("pw-hero");
      var open;
      /* уровень: герой - по интро; плиты - по въезду (на телефоне раньше, кадр у верха экрана) */
      if (isHero) open = REDUCED ? 1 : smooth(INTRO);
      else open = REDUCED ? 1 : (MOBILE ? smooth((enter - 0.18) / 0.5) : smooth((enter - 0.3) / 0.55));
      if (s.open < 0 || REDUCED || isHero) s.open = open;
      else {
        s.open += (open - s.open) * k;
        if (Math.abs(open - s.open) > 0.002) moving = true; else s.open = open;
      }
      put(pw, s, "--enter", enter.toFixed(4));
      put(pw, s, "--stay", (isHero ? easeOut(stay) : stay).toFixed(4));
      put(pw, s, "--exit", exit.toFixed(4));
      put(pw, s, "--open", s.open.toFixed(4));
      var plate = pw.firstElementChild;
      if (plate) plate.classList.toggle("gone", exit >= 1 && !MOBILE);
      if (!s.txts) s.txts = pw.querySelectorAll(".txt");
      var on = isHero ? INTRO > 0.2 : (MOBILE ? enter > 0.35 : enter > 0.62);
      if (s.on !== on) { s.on = on; for (var t = 0; t < s.txts.length; t++) s.txts[t].classList.toggle("on", on); }
    }
    if (sticky) {
      var show = pageY > H * 0.55;
      if (kontTop !== null && kontTop < H * 0.5) show = false;
      sticky.classList.toggle("show", show);
    }
    if (hdr) hdr.classList.toggle("scrolled", pageY > 12);
    if (moving) onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  W.addEventListener("scroll", onScroll, { passive: true });
  W.addEventListener("resize", function () {
    /* на телефоне смена только высоты - это адресная строка: раскладку не пересчитываем */
    if (W.innerWidth !== VW) { VW = W.innerWidth; VH = W.innerHeight; MOBILE = W.matchMedia("(max-width:760px)").matches; fitText(); updateRails(); }
    else if (!TOUCH) VH = W.innerHeight;
    onScroll();
  });
  function runIntro(ts) {
    if (!introStart) introStart = ts;
    INTRO = clamp((ts - introStart) / 1400);
    update(ts);
    if (INTRO < 1) requestAnimationFrame(runIntro);
  }

  /* ---------- Лента врачей со стрелками ---------- */
  var rails = [].slice.call(doc.querySelectorAll(".rail"));
  function railStep(rail) {
    var card = rail.firstElementChild; if (!card) return 300;
    var cs = getComputedStyle(rail);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }
  function updateRail(rail) {
    var btns = doc.querySelectorAll('.arr[data-for="' + rail.id + '"]');
    var max = rail.scrollWidth - rail.clientWidth;
    var none = max <= 1;
    [].forEach.call(btns, function (b) {
      b.hidden = none;
      var dir = +b.getAttribute("data-dir");
      b.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
    });
  }
  function updateRails() { rails.forEach(updateRail); }
  rails.forEach(function (rail) {
    rail.addEventListener("scroll", function () { updateRail(rail); }, { passive: true });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); rail.scrollBy({ left: railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); rail.scrollBy({ left: -railStep(rail), behavior: REDUCED ? "auto" : "smooth" }); }
    });
  });
  [].forEach.call(doc.querySelectorAll(".arr[data-for]"), function (b) {
    b.addEventListener("click", function () {
      var rail = doc.getElementById(b.getAttribute("data-for")); if (!rail) return;
      rail.scrollBy({ left: railStep(rail) * (+b.getAttribute("data-dir")), behavior: REDUCED ? "auto" : "smooth" });
    });
  });

  /* ---------- Лицензия крупно (3 страницы) ---------- */
  var vm = doc.getElementById("vmodal"), vmI = doc.getElementById("vm-img");
  var vmBack = null;
  var GAL = { lic: { p: [1, 2, 3], path: "assets/img/license-" } };
  var gal = GAL.lic, vmPage = 0;
  var vmPrev = vm ? vm.querySelector(".vm-prev") : null, vmNext = vm ? vm.querySelector(".vm-next") : null, vmCount = vm ? vm.querySelector(".vm-count") : null;
  function vmShowPage(i) {
    var n = gal.p.length;
    vmPage = clamp(i, 0, n - 1);
    vmI.src = gal.path + gal.p[vmPage] + ".webp";
    vmCount.textContent = (vmPage + 1) + " / " + n;
    vmPrev.disabled = vmPage === 0; vmNext.disabled = vmPage === n - 1;
    var nx = new Image(); if (vmPage + 1 < n) nx.src = gal.path + gal.p[vmPage + 1] + ".webp";
  }
  function vmOpen(label, start) {
    if (!vm) return;
    vmBack = doc.activeElement;
    vmI.alt = label || "";
    vmShowPage(start || 0);
    vm.hidden = false;
    doc.body.classList.add("vm-open");
    requestAnimationFrame(function () { vm.classList.add("show"); });
    vm.querySelector(".vm-close").focus({ preventScroll: true });
  }
  function vmClose() {
    if (!vm || vm.hidden) return;
    vm.classList.remove("show");
    setTimeout(function () { vm.hidden = true; }, 220);
    doc.body.classList.remove("vm-open");
    if (vmBack) try { vmBack.focus({ preventScroll: true }); } catch (e) {}
  }
  if (vm) {
    vm.querySelector(".vm-close").addEventListener("click", vmClose);
    vm.addEventListener("click", function (e) { if (e.target === vm) vmClose(); });
    doc.addEventListener("keydown", function (e) {
      if (vm.hidden) return;
      if (e.key === "Escape") vmClose();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") vmShowPage(vmPage + (e.key === "ArrowRight" ? 1 : -1));
    });
    vmPrev.addEventListener("click", function () { vmShowPage(vmPage - 1); });
    vmNext.addEventListener("click", function () { vmShowPage(vmPage + 1); });
  }
  [].forEach.call(doc.querySelectorAll("[data-gal]"), function (b) {
    b.addEventListener("click", function () {
      gal = GAL[b.getAttribute("data-gal")] || GAL.lic;
      var im = b.querySelector("img");
      vmOpen((im && im.alt) || b.getAttribute("aria-label") || "", 0);
    });
  });

  /* ---------- Язык: RU в разметке, EN здесь, KZ подгружается отдельным файлом ---------- */
  var I18N = { ru: {} };
  var RU = I18N.ru;
  I18N.en = {
    "meta.title": "Binge drinking withdrawal, doctor home visits and inpatient care in Astana and Almaty - Hayat Clinic",
    "meta.desc": "Hayat Clinic, addiction treatment: binge withdrawal, doctor home visits, inpatient ward, day clinic, drug detox, alcohol aversion therapy. Astana and Almaty, 24/7, confidential, licensed. Free online consultation.",
    "skip": "To services", "brand.aria": "Hayat Clinic - home", "nav.aria": "Site sections",
    "nav.uslugi": "Services", "nav.vyezd": "Home visits", "nav.stacionar": "Inpatient", "nav.vrachi": "Doctors", "nav.rodnym": "For family", "nav.kontakty": "Contacts",
    "tel.aria": "Call +7 776 043 39 87", "hdr.cta": "Free consultation", "lang.aria": "Site language", "menu.aria": "Menu", "menu.nav": "Mobile menu",
    "m.stacionar": "Inpatient treatment", "m.vyezd": "Doctor home visit", "m.zapoy": "Binge withdrawal", "m.detox": "Detox", "m.dnevnoy": "Day clinic", "m.uslugi": "All services", "m.klinika": "Wards and clinic", "m.vrachi": "Doctors and licence", "m.otzyvy": "2GIS reviews", "m.rodnym": "Help for family", "m.zayavka": "Free consultation", "m.kontakty": "Contacts",
    "cta.wa": "Message on WhatsApp", "cta.price": "Ask the price", "cta.free": "Free consultation", "cta.ask": "Ask a question",
    "hero.kick": "Astana · Almaty · around the clock", "hero.h1a": "Binge withdrawal,", "hero.h1b": "doctor home visits and inpatient care",
    "hero.lead": "Licensed addiction clinic: 15 years in Almaty, a branch in Astana. Doctor home visits, inpatient ward, detox. Confidential, 24/7.",
    "hero.b1": "Free consultation", "hero.b2": "Call 24/7",
    "band.1": "Binge withdrawal", "band.2": "Doctor home visit", "band.3": "Inpatient ward", "band.4": "Day clinic", "band.5": "Detox", "band.6": "Aversion therapy", "band.7": "Hangover IV drip",
    "note.price": "The cost is quoted after a free consultation with the doctor.",
    "st.kick": "Inpatient", "st.h2": "Inpatient treatment", "st.lead": "VIP, single, double and four-bed rooms. Three meals a day, round-the-clock medical supervision.",
    "st.l1": "Detox and recovery", "st.l2": "Work with a psychologist", "st.l3": "Confidential admission", "st.alt": "Inpatient ward at Hayat Clinic",
    "vy.kick": "Home visits", "vy.h2": "Doctor home visit", "vy.lead": "A doctor comes to your home with an IV drip in Astana and Almaty. Examination, drip, prescriptions - no trip to the clinic.",
    "vy.l1": "24/7, no days off", "vy.l2": "Psychiatrist-narcologist", "vy.l3": "Confidential", "vy.alt": "Morning at home after an IV drip",
    "za.kick": "Binge withdrawal", "za.h2": "Binge drinking withdrawal", "za.lead": "At home or in the ward: the IV drip relieves intoxication, the doctor monitors your condition and sleep.",
    "za.l1": "Examination and therapy chosen by condition", "za.l2": "IV drip and recovery", "za.l3": "Advice on what to do next", "za.alt": "IV drip: a patient's hand on the bed",
    "de.kick": "Detox", "de.h2": "Detox after drug use", "de.lead": "Removal of substances under medical supervision, stabilisation, help through the hard first days.",
    "de.l1": "Ward with 24/7 supervision", "de.l2": "Programme by age, health and substance", "de.l3": "Then rehabilitation and support", "de.alt": "IV drip chamber against the sky",
    "dn.kick": "Day clinic", "dn.h2": "IV drip after a party", "dn.lead": "Day clinic: come in the morning, IV drip and rest under supervision, home by the evening.",
    "dn.l1": "Hangover and intoxication drip", "dn.l2": "A few hours at the clinic", "dn.l3": "No hospitalisation", "dn.alt": "IV infusion set",
    "us.kick": "Services", "us.h2": "Help with alcohol and drug addiction", "us.lead": "Psychiatrist-narcologists, medical licence. The cost of any service is quoted after a free consultation.",
    "c1.h": "Hangover and alcohol IV drip", "c1.t": "At the clinic or at home. Relieves intoxication, brings back sleep and appetite.",
    "c2.h": "Alcohol aversion therapy", "c2.t": "After detox and examination. The doctor chooses the method by condition and history.",
    "c3.h": "Free online consultation", "c3.t": "The doctor discusses the condition and tells you what to do right now. No obligations.", "c3.b": "Send a request",
    "c4.h": "Rehabilitation and support", "c4.t": "Psychologist, a programme after detox, help for the family. So the result holds.",
    "also.aria": "Other services",
    "kak.kick": "How it works", "kak.h2": "From the call to support after treatment",
    "kak.s1": "Call or request", "kak.s1t": "Around the clock. Anonymously or on behalf of the family.",
    "kak.s2": "Free consultation", "kak.s2t": "The doctor assesses the condition and suggests a format: home, day clinic or inpatient ward.",
    "kak.s3": "Home visit or admission", "kak.s3t": "IV drip at home or a room in the ward. The cost is quoted in advance.",
    "kak.s4": "Treatment and support", "kak.s4t": "Detox, psychologist, rehabilitation, help for the family.",
    "kak.honest": "No clinic can guarantee results in addiction treatment, and we do not promise them. We provide treatment, medical supervision, support and an honest conversation. The result depends on the patient.",
    "vr.kick": "Doctors", "vr.h2": "Psychiatrist-narcologists", "vr.lead": "Addiction psychiatrists and a neurologist with 17-18 years of experience. A free consultation before treatment - with a doctor, not a manager.",
    "arr.prev": "Previous", "arr.next": "Next", "vr.rail": "Clinic doctors", "vr.n1": "Ruzana Osmanova", "vr.n2": "Daulet Isanov", "vr.n3": "Sabit Srymov", "vr.n4": "Taimas Srymov", "vr.r1": "Neurologist, psychiatrist", "vr.r2": "Addiction psychiatrist", "vr.e18": "18 years of experience", "vr.e17": "17 years of experience",
    "kl.kick": "Inside the clinic", "kl.h2": "Clean, quiet, homelike", "kl.lead": "Real photos of the clinic, no stock: the hall, a doctor's office, the shower room. The ward is shown above, in the inpatient block.", "kl.c1": "Hall", "kl.c2": "Doctor's office", "kl.c3": "Shower room", "kl.a1": "Hayat Clinic hall", "kl.a2": "Doctor's office at Hayat Clinic", "kl.a3": "Shower room at Hayat Clinic",
    "ot.kick": "Reviews", "ot.h2": "What people write about us on 2GIS", "ot.n57": "57 reviews", "ot.n23": "23 reviews", "ot.rail": "Patient and family reviews from 2GIS", "ot.5": "5 out of 5", "ot.note": "Reviews are quoted from 2GIS in Russian, shortened; surnames are reduced to the first letter.",
    "li.kick": "Licence and confidentiality", "li.h2": "Licensed clinic. Full confidentiality.",
    "li.f1": "Licence No. 19022285", "li.f1t": "for medical practice, issued 12.11.2019", "li.f2": "HAYAT Med LLP", "li.f2t": "BIN 190740013152",
    "li.f3": "15 years in Almaty, 3 years in Astana", "li.f3t": "two branches, doctors on duty 24/7", "li.f4": "Complete anonymity", "li.f4t": "patient data is not shared with third parties",
    "li.open": "Open the licence", "li.alt": "Medical licence No. 19022285", "li.zoom": "Open the licence", "li.dialog": "Licence", "vm.close": "Close",
    "ro.kick": "For family", "ro.h2": "If a loved one drinks", "ro.lead": "Most calls come from relatives. We explain how to talk about treatment and come when it is needed.",
    "ro.l1": "Consultation for relatives", "ro.l2": "Motivational talk with the patient", "ro.l3": "Help with the decision", "ro.alt": "A doctor's hands hold a patient's hand", "ro.b1": "Write about a loved one",
    "fq.kick": "Questions", "fq.h2": "What people ask before calling",
    "fq.q1": "Is it confidential?", "fq.a1": "Yes. Treatment is anonymous, patient data is not shared with third parties. A relative can call on your behalf.",
    "fq.q2": "How much does it cost?", "fq.a2": "The cost depends on the condition, the format (home, day clinic or inpatient) and the room. We quote it after a free consultation, before treatment starts.",
    "fq.q3": "How soon will the doctor arrive?", "fq.a3": "The home-visit service works around the clock in Astana and Almaty. We give the time on the call: it depends on the address and the doctors' workload.",
    "fq.q4": "The patient refuses treatment. What to do?", "fq.a4": "Treatment requires the person's consent. We help you talk to them: the doctor holds a motivational conversation and explains to the family how to act.",
    "fq.q5": "What happens after the IV drip?", "fq.a5": "The doctor gives recommendations and suggests the next step: supervision, aversion therapy, rehabilitation or work with a psychologist. The decision stays with the patient.",
    "fo.kick": "Free consultation", "fo.h2": "Tell us what is happening. The doctor will call back", "fo.lead": "Five answers and a phone number. The consultation is free and does not oblige you to anything. Only the doctor sees the data.",
    "fo.q1": "Who needs help", "fo.q1a": "Me", "fo.q1b": "A loved one", "fo.q2": "Addiction", "fo.q2a": "Alcohol", "fo.q2b": "Drugs", "fo.q2c": "Other",
    "fo.q3": "What is needed now", "fo.q3a": "Home visit", "fo.q3b": "Inpatient", "fo.q3c": "Consultation", "fo.q4": "City", "fo.q4a": "Astana", "fo.q4b": "Almaty",
    "fo.name": "How to address you", "fo.name.ph": "Name", "fo.phone": "Phone", "fo.err": "Enter a phone number: without it the doctor cannot call you back.",
    "fo.submit": "Send to the doctor", "fo.note": "The request opens in WhatsApp. Tap Send in the chat.", "fo.thanks": "Thank you. The request is open in WhatsApp: send the message and the doctor will contact you.",
    "ko.kick": "Contacts", "ko.h2": "Two branches. Around the clock", "ko.c1": "Astana", "ko.a1": "Aksu-Ayuly, 13", "ko.h": "24/7, no days off", "ko.gis": "Open in 2GIS", "ko.c2": "Almaty", "ko.a2": "Kabanbay Batyr, 172",
    "ft.1": "Hayat Clinic, addiction treatment. Astana and Almaty, around the clock.", "ft.2": "HAYAT Med LLP, BIN 190740013152. Medical licence No. 19022285 dated 12.11.2019.", "ft.3": "There are contraindications. A doctor's consultation is required.",
    "sticky.aria": "Quick contact", "sticky.tel": "Call"
  };
  var iEls = [].slice.call(doc.querySelectorAll("[data-i]"));
  var phEls = [].slice.call(doc.querySelectorAll("[data-i-ph]"));
  var ariaEls = [].slice.call(doc.querySelectorAll("[data-i-aria]"));
  var altEls = [].slice.call(doc.querySelectorAll("[data-i-alt]"));
  var metaDesc = doc.querySelector('meta[name="description"]');
  iEls.forEach(function (el) { var k = el.getAttribute("data-i"); if (RU[k] == null) RU[k] = el.innerHTML; });
  phEls.forEach(function (el) { RU[el.getAttribute("data-i-ph")] = el.getAttribute("placeholder"); });
  ariaEls.forEach(function (el) { RU[el.getAttribute("data-i-aria")] = el.getAttribute("aria-label"); });
  altEls.forEach(function (el) { RU[el.getAttribute("data-i-alt")] = el.getAttribute("alt"); });
  RU["meta.title"] = doc.title;
  RU["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";
  function t(key) { var d = I18N[LANG] || RU; return d[key] != null ? d[key] : RU[key]; }
  function applyLang(lang) {
    if (!I18N[lang]) lang = "ru";
    LANG = lang;
    iEls.forEach(function (el) { var v = t(el.getAttribute("data-i")); if (v != null) { if (lang === "ru") el.innerHTML = v; else el.textContent = v; } });
    phEls.forEach(function (el) { var v = t(el.getAttribute("data-i-ph")); if (v != null) el.setAttribute("placeholder", v); });
    ariaEls.forEach(function (el) { var v = t(el.getAttribute("data-i-aria")); if (v != null) el.setAttribute("aria-label", v); });
    altEls.forEach(function (el) { var v = t(el.getAttribute("data-i-alt")); if (v != null) el.setAttribute("alt", v); });
    doc.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    root.setAttribute("lang", lang);
    [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    try { localStorage.setItem("hayat-lang", lang); } catch (e) {}
    fitText();
    updateRails();
  }
  function loadLang(lang, done) {
    if (I18N[lang] || lang !== "kk") return done();
    var s = doc.createElement("script");
    s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
    s.onload = function () {
      if (W.SITE_KK) {
        I18N.kk = W.SITE_KK;
        if (W.SITE_KK_WA) WA.kk = W.SITE_KK_WA;
        if (W.SITE_KK_FORM) FORM_LABELS.kk = W.SITE_KK_FORM;
      }
      done();
    };
    s.onerror = function () { done(); };
    doc.head.appendChild(s);
  }
  function setLang(lang) { loadLang(lang, function () { applyLang(lang); }); }
  [].forEach.call(doc.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });
  (function initLang() {
    var forced = (location.search.match(/[?&]lang=(ru|kk|en)/) || [])[1];
    var saved = null; try { saved = localStorage.getItem("hayat-lang"); } catch (e) {}
    var lang = forced || saved || "ru";
    if (lang !== "ru") setLang(lang);
  })();

  /* ---------- Проявление секций ---------- */
  var rv = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in W && !REDUCED) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(function () { rv.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < W.innerHeight) el.classList.add("in"); }); }, 1500);
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* ---------- Форма-квиз -> WhatsApp ---------- */
  var form = doc.getElementById("form"), thanks = doc.getElementById("thanks"), ferr = doc.getElementById("ferr");
  function picked(name) {
    var inp = form.querySelector('input[name="' + name + '"]:checked');
    if (!inp) return "";
    var sp = inp.parentNode.querySelector("span");
    return sp ? sp.textContent.trim() : inp.value;
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f.website && f.website.value) { form.hidden = true; if (thanks) thanks.hidden = false; return; }
      var name = f.name.value.trim(), phone = f.phone.value.trim();
      var badPhone = phone.replace(/\D/g, "").length < 10;
      f.phone.classList.toggle("bad", badPhone);
      f.phone.setAttribute("aria-invalid", badPhone ? "true" : "false");
      if (badPhone) { if (ferr) ferr.hidden = false; f.phone.focus(); return; }
      if (ferr) ferr.hidden = true;
      var L = FORM_LABELS[LANG] || FORM_LABELS.ru;
      var lines = [L.head, L.who + ": " + picked("who"), L.dep + ": " + picked("dep"), L.need + ": " + picked("need"), L.city + ": " + picked("city")];
      if (name) lines.push(L.name + ": " + name);
      lines.push(L.phone + ": " + phone);
      var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
      W.open(url, "_blank", "noopener");
      if (thanks) { thanks.hidden = false; try { thanks.focus({ preventScroll: true }); } catch (err) {} }
      form.reset();
    });
  }

  var year = doc.getElementById("year"); if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Старт ---------- */
  function start() {
    fitText();
    if (location.hash.length > 1) {
      var id = location.hash.slice(1);
      goTo(id, true);
      setTimeout(function () { goTo(id, true); update(); }, 60);
      setTimeout(function () { goTo(id, true); update(); }, 500);
    }
    update();
    if (INTRO < 1) requestAnimationFrame(runIntro);
    updateRails();
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fitText(); update(); });
  if (doc.readyState === "complete") start(); else W.addEventListener("load", start);
  update();
})();
