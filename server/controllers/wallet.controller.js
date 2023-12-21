const createHttpError = require("http-errors");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");
const https = require("https");
const qs = require("querystring");
const { PaytmConfig } = require("../config/config");
const PaytmChecksum = require("../config/checksum");
const { default: axios } = require("axios");

module.exports.createWallet = async (userId, balance = 0) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  const wallet = new Wallet({
    user: userId,
    balance,
  });

  return wallet.save();
};

module.exports.getWalletInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ user: userId }).populate(
      "user",
      "first_name last_name username profile_img"
    );

    if (!wallet) {
      return res.status(404).json({ message: "wallet not found" });
    }

    res.status(200).json({ data: wallet });
  } catch (e) {
    next(e);
  }
};

// module.exports.rechargeWallet = async (walletId, amount) => {
//   const wallet = await Wallet.findById(walletId);

//   if (!wallet) {
//     throw createHttpError(404, "wallet not found");
//   }

//   wallet.balance = wallet.balance + amount;
//   return wallet.save();
// };

module.exports.loadToWallet = async (req, res, next) => {
  try {
    const orderId = "TEST_" + new Date().getTime();
    const data = req.body;

    const paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: PaytmConfig.mid,
      websiteName: PaytmConfig.website,
      orderId: orderId,
      callbackUrl: PaytmConfig.callbackURL,
      // callbackUrl: `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${orderId}`,
      txnAmount: {
        value: "1.00",
        currency: "INR",
      },
      userInfo: {
        custId: "CUST_001",
      },
    };

    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      PaytmConfig.key
    ).then(function (checksum) {
      paytmParams.head = {
        signature: checksum,
      };

      console.log("checksum is ", checksum);

      var post_data = JSON.stringify(paytmParams);

      var options = {
        hostname: "securegw-stage.paytm.in", // for Staging
        // hostname: 'securegw.paytm.in', // for Production
        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${PaytmConfig.mid}&orderId=${orderId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log("Response is ", response);
          try {
            response = JSON.parse(response);
          } catch (e) {
            return next(createHttpError(500, "error parsing response"));
          }
          console.log("txnToken: ", response);

          if (!response.body?.txnToken) {
            return next(createHttpError(500, "couldn't get transaction token"));
          }

          return res.status(200).json({
            mid: PaytmConfig.mid,
            orderId,
            txnToken: response.body.txnToken,
          });

          // res.writeHead(200, { "Content-Type": "text/html" });
          // res.write(`
          //     <html>
          //       <head>
          //         <title>Show Payment Page</title>
          //       </head>
          //       <body>
          //         <center>
          //           <h1>Please do not refresh this page...</h1>
          //         </center>
          //         <form method="post" action="https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${PaytmConfig.mid}&orderId=${orderId}" name="paytm">
          //           <table border="1">
          //             <tbody>
          //               <input type="hidden" name="mid" value="${PaytmConfig.mid}">
          //               <input type="hidden" name="orderId" value="${orderId}">
          //               <input type="hidden" name="txnToken" value="${response.body.txnToken}">
          //             </tbody>
          //           </table>
          //           <script type="text/javascript"> document.paytm.submit(); </script>
          //         </form>
          //       </body>
          //     </html>`);
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
  } catch (e) {
    next(e);
  }
};

module.exports.loadToWalletCallback = async (req, res, next) => {
  try {
    let callbackResponse = "";

    req
      .on("error", (err) => {
        console.error(err.stack);
      })
      .on("data", (chunk) => {
        callbackResponse += chunk;
      })
      .on("end", () => {
        let data = qs.parse(callbackResponse);
        console.log("data is ", data);

        data = JSON.parse(JSON.stringify(data));

        const paytmChecksum = data.CHECKSUMHASH;

        var isVerifySignature = PaytmChecksum.verifySignature(
          data,
          PaytmConfig.key,
          paytmChecksum
        );
        if (isVerifySignature) {
          console.log("Checksum Matched");

          var paytmParams = {};

          paytmParams.body = {
            mid: PaytmConfig.mid,
            orderId: data.ORDERID,
          };

          PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            PaytmConfig.key
          ).then(function (checksum) {
            paytmParams.head = {
              signature: checksum,
            };

            var post_data = JSON.stringify(paytmParams);

            var options = {
              /* for Staging */
              hostname: "securegw-stage.paytm.in",

              /* for Production */
              // hostname: 'securegw.paytm.in',

              port: 443,
              path: "/v3/order/status",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": post_data.length,
              },
            };

            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
              post_res.on("data", function (chunk) {
                response += chunk;
              });

              post_res.on("end", function () {
                console.log("Response: ", response);
                res.write(response);
                res.end();
              });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
          });
        } else {
          console.log("Checksum Mismatched");
        }
      });
  } catch (e) {
    next(e);
  }
};

module.exports.loadToWallet1 = async (req, res, next) => {
  try {
    const {
      orderId = "TEST_" + new Date().getTime(),
      amount = 100,
      email = "test@gmail.com",
      mobileNumber = "917428730894",
    } = req.body;
    // Generate a unique transaction token
    const transactionToken = await generateTransactionToken(orderId, amount);

    // Create a payment request
    const paymentRequest = {
      orderId,
      transactionToken,
      amount,
      customerId: email,
      mobileNumber,
      email,
      website: PaytmConfig.website,
      callbackUrl: PaytmConfig.callbackURL,
    };

    // Make a request to initiate the payment
    const response = await axios.post(
      "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=" +
        PaytmConfig.mid +
        "&orderId=" +
        orderId,
      paymentRequest,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + transactionToken,
        },
      }
    );

    // Return the payment URL to the client
    res.json({ paymentUrl: response.data.body.txnToken });
  } catch (e) {
    next(e);
  }
};

// Generate the transaction token using Paytm API
async function generateTransactionToken(orderId, amount) {
  // return new Promise((resolve, reject) => {
  //   request.post(
  //     "https://securegw-stage.paytm.in/theia/api/v1/token?mid=" +
  //       PaytmConfig.mid +
  //       "&orderId=" +
  //       orderId,
  //     {
  //       amount,
  //       customerId: "your_customer_id", // Replace with your customer ID
  //     },
  //     function callback(err, response, body) {
  //       if (err) {
  //         reject(
  //           createHttpError(
  //             response.statusCode,
  //             "Failed to generate transaction token"
  //           )
  //         );
  //       }

  //       resolve(body);
  //     }
  //   );
  // });
  try {
    // console.log(
    //   "https://securegw-stage.paytm.in/theia/api/v1/token?mid=" +
    //     PaytmConfig.mid +
    //     "&orderId=" +
    //     orderId
    // );
    const response = await axios.post(
      "https://securegw-stage.paytm.in/theia/api/v1/token?mid=" +
        PaytmConfig.mid +
        "&orderId=" +
        orderId,
      {
        amount,
        customerId: "CUSTOMER_" + new Date().getTime(),
      }
    );

    console.log("transaction token generated is ", body);

    return response.data.body.txnToken;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate transaction token");
  }
}
