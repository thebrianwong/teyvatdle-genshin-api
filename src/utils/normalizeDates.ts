const normalizeYear: () => string = () => {
  const year = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  )
    .getFullYear()
    .toString();
  return year;
};

const normalizeMonth: () => string = () => {
  const rawMonth =
    new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    ).getMonth() + 1;
  if (rawMonth < 10) {
    const formattedMonth = "0".concat(String(rawMonth));
    return formattedMonth;
  } else {
    return rawMonth.toString();
  }
};

const normalizeDay: () => string = () => {
  const rawDay = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  ).getDate();
  if (rawDay < 10) {
    const formattedDay = "0".concat(String(rawDay));
    return formattedDay;
  } else {
    return rawDay.toString();
  }
};

export { normalizeYear, normalizeMonth, normalizeDay };
