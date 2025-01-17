const screen = document.querySelector(".screen");
const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
  screen.classList.toggle("active");
});
