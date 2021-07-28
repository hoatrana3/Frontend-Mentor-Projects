import { formatNum } from "./helpers";

export default class UnitTimer {
  constructor(text, curVal, min, max, interval, linkedTimer) {
    this.text = text;
    this.curVal = curVal || max;
    this.minVal = min;
    this.maxVal = max;
    this.interval = interval;
    this.linkedTimer = linkedTimer;

    this.createEl();
    this.setElValue();
  }

  createEl() {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="time-unit">
        <div
          class="time-unit__card"
          style="--data-current: '00'; --data-next: '00';"
        >
          <div class="flipper"><span></span></div>
          <div class="splitter"></div>
        </div>
        <span class="time-unit__text">${this.text}</span>
      </div>
    `;

    this.el = div.firstElementChild;
  }

  boundValue(val) {
    return val < 0 ? this.maxVal : val;
  }

  setElValue() {
    const current = this.curVal;
    const next = this.boundValue(current - 1);

    this.el
      .querySelector(".time-unit__card")
      .setAttribute(
        "style",
        `--data-current: ${formatNum(current)}; --data-next: ${formatNum(
          next
        )};`
      );
  }

  update() {
    this.el.classList.add("is-flipped");
    this.curVal = this.boundValue(this.curVal - 1);

    if (this.curVal === this.maxVal && this.linkedTimer)
      this.linkedTimer.update();

    setTimeout(() => {
      this.el.classList.remove("is-flipped");
      this.setElValue(this.curVal);
    }, 500);
  }

  render(target) {
    target.appendChild(this.el);
  }

  startInterval() {
    if (this.interval)
      setInterval(() => {
        this.update();
      }, this.interval);
  }
}
