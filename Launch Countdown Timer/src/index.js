import "./styles.scss";
import UnitTimer from "./UnitTimer";
import { getDiffUnitsBeetweenDates } from "./helpers";

const diffUnitsToNewYear = getDiffUnitsBeetweenDates(new Date(), "01/01/2022");
const countdownContainer = document.querySelector(".countdown-container");
const dayUnitTimer = new UnitTimer(
  "Days",
  diffUnitsToNewYear[0],
  0,
  diffUnitsToNewYear[0]
);
const hourUnitTimer = new UnitTimer(
  "Hours",
  diffUnitsToNewYear[1],
  0,
  24,
  null,
  dayUnitTimer
);
const minuteUnitTimer = new UnitTimer(
  "Minutes",
  diffUnitsToNewYear[2],
  0,
  59,
  null,
  hourUnitTimer
);
const secondUnitTimer = new UnitTimer(
  "Seconds",
  diffUnitsToNewYear[3],
  0,
  59,
  1000,
  minuteUnitTimer
);

dayUnitTimer.render(countdownContainer);
hourUnitTimer.render(countdownContainer);
minuteUnitTimer.render(countdownContainer);
secondUnitTimer.render(countdownContainer);

secondUnitTimer.startInterval();
