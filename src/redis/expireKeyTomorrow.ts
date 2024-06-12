const expireKeyTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0);
  date.setMilliseconds(0);
  return date.getTime() / 1000;
};

export { expireKeyTomorrow };
