const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".wllb-links");

toggle.addEventListener("click", () => {
    links.classList.toggle("active");
});