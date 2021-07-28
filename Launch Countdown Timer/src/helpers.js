import moment from "moment";
import "moment-duration-format";
import "moment-timezone";

export const formatNum = (val) => {
  if (val <= 0) return "'00'";
  return val < 10 ? `'0${val}'` : `'${val}'`;
};

export const getDiffUnitsBeetweenDates = (date1, date2) => {
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date1Moment = moment.tz(date1, clientTimeZone);
  const date2Moment = moment.tz(date2, clientTimeZone);
  const duration = moment.duration(date2Moment.diff(date1Moment));
  const diffUnits = duration.format("D,H,m,s").split(",");
  return diffUnits;
};
