const THEME_KEY = "taskflow_theme";

/* ---------- APPLY THEME ---------- */
function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

/* ---------- LOAD THEME ON START ---------- */
function loadTheme() {

    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme("light");
    }
}

/* ---------- TOGGLE THEME ---------- */
function toggleTheme() {

    const isDark = document.body.classList.contains("dark");

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    localStorage.setItem(THEME_KEY, newTheme);
}

/* ---------- INIT BUTTON ---------- */
document.addEventListener("DOMContentLoaded", () => {

    const darkModeBtn = document.getElementById("darkModeBtn");

    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", toggleTheme);
    }

    loadTheme();
});