import { useEffect, useState } from "react";
import WalletHeader from "./components/WalletHeader";
import PageLoading from "../../components/PageLoading";
import { create, get } from "../../services/crud";
import { getUserId } from "../../services/auth";
import { toast } from "react-toastify";
import GooglePayButton from "@google-pay/button-react";
import { env } from "../../env";

export default function Wallet() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = () => {
    setPageLoading(true);
    get("wallet/" + userId + "/info")
      .then((res) => {
        setWalletInfo(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load wallet info"
        );
        setPageLoading(false);
      });
  };

  const rechargeWallet = () => {
    setRechargeLoading(true);
    create("wallet/recharge", {
      userId,
      amount: "12.34", // TODO:Replace with actual amount
    })
      .then((res) => {
        toast.success(res.message ?? "Balance updated successfully");
        setRechargeLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update balance"
        );
        setRechargeLoading(false);
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  // TODO: remove these later
  rechargeLoading;
  walletInfo;

  return (
    <>
      <WalletHeader />

      <div className="text-center mt-5">
        <GooglePayButton
          environment={env.VITE_GOOGLE_PAY_ENV}
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "example",
                    gatewayMerchantId: "exampleGatewayMerchantId",
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: "12345678901234567890",
              merchantName: "Demo Merchant",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPriceLabel: "Total",
              totalPrice: "100.00",
              currencyCode: "USD",
              countryCode: "US",
            },
          }}
          onLoadPaymentData={(paymentRequest: any) => {
            console.log("load payment data", paymentRequest);
            rechargeWallet();
          }}
        />
      </div>
    </>
  );
}
