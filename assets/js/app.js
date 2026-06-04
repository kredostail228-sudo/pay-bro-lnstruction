
(() => {
  const searchInput = document.querySelector("[data-search]");
  const noResults = document.querySelector("[data-no-results]");
  const backTop = document.querySelector("[data-back-top]");
  const sections = [...document.querySelectorAll("[data-guide-section]")];
  const searchBlocks = [...document.querySelectorAll("[data-search-block]")];

  function showAll() {
    searchBlocks.forEach(block => block.classList.remove("hidden"));
    sections.forEach(section => section.classList.remove("hidden"));
    if (noResults) noResults.classList.remove("is-visible");
  }

  function clearSearch() {
    if (searchInput && searchInput.value) {
      searchInput.value = "";
      showAll();
    }
  }

  function closeAllDetails(except = null) {
    sections.forEach(section => {
      if (section !== except) section.open = false;
    });
  }

  function getTarget(hash) {
    if (!hash || hash === "#") return null;
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return document.querySelector(hash);
    }
  }

  function scrollToTarget(target) {
    const offset = 14;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function openTarget(hash, scroll = true) {
    const target = getTarget(hash);
    if (!target) return false;

    clearSearch();

    const detail = target.matches("details") ? target : target.closest("details");
    const scrollTarget = detail || target;

    if (detail) {
      detail.classList.remove("hidden");
      closeAllDetails(detail);
      detail.open = true;
    }

    if (scroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToTarget(scrollTarget));
      });
    }

    return true;
  }

  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!getTarget(hash)) return;

    event.preventDefault();
    openTarget(hash, true);

    if (history.pushState) {
      history.pushState(null, "", hash);
    } else {
      location.hash = hash;
    }
  });

  window.addEventListener("load", () => {
    if (location.hash) openTarget(location.hash, true);
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      if (!query) {
        showAll();
        return;
      }

      closeAllDetails();

      let found = 0;

      searchBlocks.forEach(block => {
        const ok = block.innerText.toLowerCase().includes(query);
        block.classList.toggle("hidden", !ok);
        if (ok) found += 1;
      });

      sections.forEach(section => {
        const ok = section.innerText.toLowerCase().includes(query);
        section.classList.toggle("hidden", !ok);
        if (ok && !section.open) section.open = true;
      });

      if (noResults) noResults.classList.toggle("is-visible", found === 0 && !sections.some(s => !s.classList.contains("hidden")));
    });
  }

  window.addEventListener("scroll", () => {
    if (!backTop) return;
    backTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });
})();
