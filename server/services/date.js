module.exports.dateToUTC = (date) => {
  if (!date) {
    return false;
  }

  date = new Date(date);
  const utcDate = date.getTime();
  return utcDate;
};

module.exports.stringDateToUTC = (date) => {
  if (!date) {
    return false;
  }
  const splittedDate = date.split("/");
  const utcDate = Date.UTC(splittedDate[2], splittedDate[1], splittedDate[0]);
  return utcDate;
};

module.exports.UTCtoDate = (utcDate) => {
  const date = new Date(utcDate);
  return date;
};

module.exports.getDateStrFromDate = (date) => {
  // month is 0 indexed
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};
