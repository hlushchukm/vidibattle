var PaytmConfig = {
  mid: process.env.MERCHANT_ID,
  key: process.env.MERCHANT_KEY,
  website: process.env.MERCHANT_WEBSITE,
  callbackURL: process.env.API_URL + "/api/wallet/load/callback",
};

module.exports.PaytmConfig = PaytmConfig;
