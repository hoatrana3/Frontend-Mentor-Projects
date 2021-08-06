import "./styles.scss";

const menuToggler = document.getElementById("menuToggler");
const header = document.querySelector("header");
menuToggler.addEventListener("click", () => {
  header.classList.toggle("is-open");
  document.body.classList.toggle("no-scroll");
});

const previousSlide = document.getElementById("previousSlide");
const nextSlide = document.getElementById("nextSlide");
const topCarousel = document.getElementById("topCarousel");

let currentSlide = 0;

const changeSlide = (next) => {
  if (next < 0) next = 2;
  if (next > 2) next = 0;

  currentSlide = next;
  topCarousel.style = `--current-slide: ${next};`;
};

previousSlide.addEventListener("click", () => {
  changeSlide(currentSlide - 1);
});

nextSlide.addEventListener("click", () => {
  changeSlide(currentSlide + 1);
});
