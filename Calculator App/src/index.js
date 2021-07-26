import "./styles.scss";

let expression = "";
const caculatedResult = document.getElementById("caculatedResult");
const kaypadBtns = [
  ...document.querySelectorAll(".keypad button:not(.func-btn)")
];
const themeSlider = document.getElementById("themeSlider");
const delBtn = document.getElementById("delBtn");
const resetBtn = document.getElementById("resetBtn");
const calcBtn = document.getElementById("calcBtn");

themeSlider.addEventListener("change", (e) => {
  const themeIndex = e.target.value;
  switch (themeIndex) {
    case "2":
      document.body.setAttribute("data-theme", "light");
      break;
    case "3":
      document.body.setAttribute("data-theme", "violet");
      break;
    default:
      document.body.removeAttribute("data-theme");
      break;
  }
});

kaypadBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let character = e.target.innerHTML;
    caculatedResult.innerHTML += character;

    if (character === "x") character = "*";
    expression += character;
  });
});

calcBtn.addEventListener("click", () => {
  try {
    const result = eval(expression).toString();
    caculatedResult.innerHTML = result;
    expression = result;
  } catch (e) {
    caculatedResult.innerHTML = "Can't calculate";
    expression = "";
  }
});

delBtn.addEventListener("click", () => {
  const curVal = caculatedResult.innerHTML;
  caculatedResult.innerHTML = curVal.substr(0, curVal.length - 1);
  expression = expression.substr(0, expression.length - 1);
});

resetBtn.addEventListener("click", () => {
  caculatedResult.innerHTML = expression = "";
});
