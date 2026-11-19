(() => {
  document.querySelectorAll(".tabs").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll('[role="tab"]')];
    const panels = buttons.map((button) => document.getElementById(button.getAttribute("aria-controls")));
    const show = (index) => {
      buttons.forEach((button, i) => {
        button.setAttribute("aria-selected", String(i === index));
        button.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
    };
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => show(index));
      button.addEventListener("keydown", (event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        const next = (index + step + buttons.length) % buttons.length;
        show(next);
        buttons[next].focus();
      });
    });
    tabs.classList.add("with-tabs");
    show(0);
  });
})();
