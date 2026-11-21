(() => {
  const KEY = "rc-theme";
  const root = document.documentElement;
  const read = () => {
    try {
      const value = localStorage.getItem(KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };
  const write = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* The choice only lasts for this page when storage is blocked. */
    }
  };
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme || (system.matches ? "dark" : "light");

  const LEVEL_KEY = { dark: "rc-dark-level", light: "rc-light-level" };
  const LEVEL_DEFAULT = 40;
  const readLevel = (theme) => {
    try {
      const raw = localStorage.getItem(LEVEL_KEY[theme]);
      const n = Number(raw);
      return raw !== null && n >= 0 && n <= 100 ? n : null;
    } catch {
      return null;
    }
  };
  for (const theme of ["dark", "light"]) {
    const saved = readLevel(theme);
    if (saved !== null) root.style.setProperty(`--${theme}-level`, String(saved));
  }

  // Set before the page paints, so a reader who chose a theme never sees the other one flash.
  const saved = read();
  if (saved) root.dataset.theme = saved;

  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelector(".top-links");
    if (!links) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.innerHTML =
      '<svg class="nav-icon icon-moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="nav-icon icon-sun" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<span class="theme-toggle-label"></span>';
    const label = button.querySelector(".theme-toggle-label");
    const update = () => {
      const dark = current() === "dark";
      button.setAttribute("aria-label", dark ? "Switch to the light theme" : "Switch to the dark theme");
      button.dataset.tip = dark ? "Switch to the light theme" : "Switch to the dark theme";
      label.textContent = dark ? "Light" : "Dark";
      syncSlider();
    };
    button.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      write(next);
      update();
    });
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.className = "theme-level";
    const syncSlider = () => {
      const theme = current();
      slider.value = String(readLevel(theme) ?? LEVEL_DEFAULT);
      const text = theme === "dark" ? "Dark theme brightness" : "Light theme softness";
      slider.title = text;
      slider.setAttribute("aria-label", text);
    };
    slider.addEventListener("input", () => {
      const theme = current();
      root.style.setProperty(`--${theme}-level`, slider.value);
      try {
        localStorage.setItem(LEVEL_KEY[theme], slider.value);
      } catch {
        /* The setting only lasts for this page when storage is blocked. */
      }
    });
    system.addEventListener("change", update);
    links.appendChild(slider);
    links.appendChild(button);
    update();
  });
})();
