document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  if (isDarkMode) {
    body.classList.add('dark');
    modeText.innerText = "Light mode";
  } else {
    body.classList.remove('dark');
    modeText.innerText = "Dark mode";
  }

  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      modeText.innerText = "Light mode";
    } else {
      modeText.innerText = "Dark mode";
    }

    localStorage.setItem('darkMode', body.classList.contains("dark"));
  });
});