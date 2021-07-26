import "./styles.scss";

const menuToggler = document.getElementById("menuToggler");
const topNavMenu = document.getElementById("topNavMenu");
menuToggler.addEventListener("click", () => {
  topNavMenu.classList.toggle("is-open");
});
