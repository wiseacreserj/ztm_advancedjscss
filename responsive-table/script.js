//Dark Mode Functionality

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

//Check if dark mode is prefered or already choosen
const isDarkMode = localStorage.getItem("dark-mode") === "true";

//Set initial mode
if (isDarkMode) {
    body.classList.add("dark-mode");
    themeToggle.innerText = "Light Mode";
}

//Toggle dark mode and update text
themeToggle.addEventListener("click", () => {
    body.style.transition = "background-color 0.3s, color 0.3s";
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        themeToggle.innerText = "Dark Mode";
        localStorage.setItem("dark-mode", false);
    } else {
        body.classList.add("dark-mode");
        themeToggle.innerText = "Light Mode";
        localStorage.setItem("dark-mode", true);
    }
});
