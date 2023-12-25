module.exports.dateToUTC = (date) => {
  if (!date) {
    return false;
  }

  date = new Date(date);
  const utcDate = date.getTime();
  return utcDate;
};

module.exports.UTCtoDate = (utcDate) => {
  const date = new Date(utcDate);
  return date;
};
