const bcrypt = require("bcryptjs");

module.exports.hash = async (text) => {
  const saltRounds = 10;

  const hash = await bcrypt.hash(text, saltRounds);

  return hash;
};
