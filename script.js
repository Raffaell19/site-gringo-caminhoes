/**
 * GRINGO CAMINHÕES - High Performance Interactive Script
 * Features:
 * - Dynamic catalog filtering (All, Scania, Volvo, MB, Carretas, Outros)
 * - Real-time live search across models, brands, tags
 * - Interactive Heavy Truck Financing Calculator with WhatsApp dispatch
 * - Mobile Drawer Menu
 * - Animated Metrics Counter
 * - Smooth Header Scroll Effects
 */

document.addEventListener("DOMContentLoaded", () => {
  initBrandLogoScroll();
  initMobileMenu();
  initHeaderScroll();
  initMetricsCounter();
  initCatalogFilters();
  initSimulator();
  initScrollReveal();
  setCurrentYear();
});

/* ==========================================================================
   LOGO CLICK SCROLL TO FIRST SECTION
   ========================================================================== */
function initBrandLogoScroll() {
  const brandLinks = document.querySelectorAll(".brand-link");
  const heroSection = document.getElementById("inicio") || document.querySelector(".hero-section");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  brandLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Fechar menu mobile se estiver aberto
      if (navMenu && navMenu.classList.contains("open")) {
        hamburgerBtn?.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      }

      // Rolagem suave até a primeira seção (Hero)
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (window.history.pushState) {
        window.history.pushState(null, "", "#inicio");
      }
    });
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");
  const navLinks = document.querySelectorAll(".nav-item, .nav-cta");

  if (!hamburgerBtn || !navMenu) return;

  function closeMenu() {
    hamburgerBtn.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("open");
    menuBackdrop?.classList.remove("active");
    document.body.style.overflow = "";
  }

  function toggleMenu() {
    const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
    const willOpen = !isExpanded;
    hamburgerBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    navMenu.classList.toggle("open", willOpen);
    menuBackdrop?.classList.toggle("active", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  }

  hamburgerBtn.addEventListener("click", toggleMenu);
  menuBackdrop?.addEventListener("click", closeMenu);

  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/* ==========================================================================
   HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".main-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ==========================================================================
   METRICS COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
  const metricNums = document.querySelectorAll(".metric-num");
  if (!metricNums.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        let start = 0;
        const duration = 1600;
        const stepTime = Math.max(15, Math.floor(duration / target));

        const timer = setInterval(() => {
          start += Math.ceil(target / (duration / stepTime));
          if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = start;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricNums.forEach(num => observer.observe(num));
}

/* ==========================================================================
   CATALOG FILTERS & LIVE SEARCH
   ========================================================================== */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const cards = document.querySelectorAll(".truck-card");
  const visibleCountEl = document.getElementById("visibleCount");
  const emptyState = document.getElementById("emptyState");

  let currentFilter = "all";
  let searchQuery = "";

  function applyFilters() {
    let visible = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach(card => {
      const category = card.getAttribute("data-category") || "";
      const text = card.innerText.toLowerCase();

      const matchesCategory = (currentFilter === "all") || (category === currentFilter);
      const matchesSearch = !query || text.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
        visible++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibleCountEl) {
      visibleCountEl.textContent = visible;
    }

    if (emptyState) {
      emptyState.style.display = (visible === 0) ? "block" : "none";
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
      }
      applyFilters();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.style.display = "none";
      applyFilters();
      searchInput.focus();
    });
  }

  // Global helper for footer links
  window.triggerFilter = function(filterCategory) {
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterCategory}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  };

  window.resetFilters = function() {
    if (searchInput) {
      searchInput.value = "";
      searchQuery = "";
      if (clearSearchBtn) clearSearchBtn.style.display = "none";
    }
    const allBtn = document.querySelector(`.filter-btn[data-filter="all"]`);
    if (allBtn) allBtn.click();
  };
}

/* ==========================================================================
   HEAVY TRUCK FINANCING SIMULATOR
   ========================================================================== */
let selectedMonths = 48;

function initSimulator() {
  const termBtns = document.querySelectorAll(".term-btn");
  termBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      termBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMonths = parseInt(btn.getAttribute("data-months"), 10);
      recalculateSimulation();
    });
  });

  recalculateSimulation();
}

function handleVehicleChange() {
  recalculateSimulation();
}

function handleRangeChange() {
  recalculateSimulation();
}

function formatBRL(val) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function recalculateSimulation() {
  const vehicleSelect = document.getElementById("simVehicle");
  const downPaymentRange = document.getElementById("simDownPaymentRange");
  const downPaymentDisplay = document.getElementById("downPaymentDisplay");
  const installmentValueEl = document.getElementById("installmentValue");
  const resDownVal = document.getElementById("resDownVal");
  const resLoanVal = document.getElementById("resLoanVal");

  if (!vehicleSelect || !downPaymentRange) return;

  const vehiclePrice = parseFloat(vehicleSelect.value) || 0;
  const downPercent = parseInt(downPaymentRange.value, 10);
  const downValue = vehiclePrice * (downPercent / 100);
  const loanValue = vehiclePrice - downValue;

  // Monthly interest rate estimated for commercial heavy vehicles (~1.39% a.m.)
  const monthlyRate = 0.0139;
  const n = selectedMonths;

  // Price Amortization Formula: PMT = PV * (i * (1+i)^n) / ((1+i)^n - 1)
  const factor = Math.pow(1 + monthlyRate, n);
  const installment = loanValue * (monthlyRate * factor) / (factor - 1);

  if (downPaymentDisplay) {
    downPaymentDisplay.textContent = `${formatBRL(downValue)} (${downPercent}%)`;
  }
  if (installmentValueEl) {
    installmentValueEl.innerHTML = `${formatBRL(installment)}<small>/mês</small>`;
  }
  if (resDownVal) resDownVal.textContent = formatBRL(downValue);
  if (resLoanVal) resLoanVal.textContent = formatBRL(loanValue);
}

function openSimulatorWith(vehicleName, price) {
  const vehicleSelect = document.getElementById("simVehicle");
  const simSection = document.getElementById("simulador");

  if (vehicleSelect) {
    // Check if option exists
    let matchFound = false;
    for (let opt of vehicleSelect.options) {
      if (opt.text.toLowerCase().includes(vehicleName.toLowerCase().substring(0, 10))) {
        opt.selected = true;
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      vehicleSelect.value = String(price);
    }
    recalculateSimulation();
  }

  if (simSection) {
    simSection.scrollIntoView({ behavior: "smooth" });
  }
}

function handleSimulatorSubmit(e) {
  e.preventDefault();
  const vehicleSelect = document.getElementById("simVehicle");
  const downPaymentRange = document.getElementById("simDownPaymentRange");
  const installmentValueEl = document.getElementById("installmentValue");

  const vehicleText = vehicleSelect.options[vehicleSelect.selectedIndex].text;
  const vehiclePrice = parseFloat(vehicleSelect.value);
  const downPercent = downPaymentRange.value;
  const downValue = vehiclePrice * (downPercent / 100);
  const loanValue = vehiclePrice - downValue;
  const installmentClean = installmentValueEl.innerText.replace("/mês", "").trim();

  const msg = 
`Olá, equipe Gringo Caminhões!
Gostaria de solicitar uma análise de financiamento pré-aprovado:

🚛 *Veículo:* ${vehicleText}
💰 *Entrada Pretendida:* ${formatBRL(downValue)} (${downPercent}%)
📊 *Saldo Financiado:* ${formatBRL(loanValue)}
📅 *Prazo:* ${selectedMonths}x
💳 *Estimativa da Parcela:* ${installmentClean}/mês

Aguardo retorno para enviar meus dados cadastrais. Obrigado!`;

  const phone = "555198913039";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

/* ==========================================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   CURRENT YEAR
   ========================================================================== */
function setCurrentYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

