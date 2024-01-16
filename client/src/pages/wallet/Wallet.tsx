import { useEffect, useState } from "react";
import WalletHeader from "./components/WalletHeader";
import PageLoading from "../../components/PageLoading";
import { create, get } from "../../services/crud";
import { getUserId } from "../../services/auth";
import { toast } from "react-toastify";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { getName } from "../../services/utils";
import { useNavigate } from "react-router-dom";
import { env } from "../../env";

export default function Wallet() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
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

  const loadToWallet = () => {
    if (!rechargeAmount) {
      return;
    }

    setRechargeLoading(true);
    create("wallet/create-order", {
      amount: rechargeAmount,
    })
      .then((res) => {
        showRazorPay(res.data);
      })
      .catch((e) => {
        console.error(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update balance"
        );
        setRechargeLoading(false);
      });
  };

  const showRazorPay = (order: any) => {
    const userInfo: any = { name: getName(walletInfo.user) };
    if (walletInfo.user?.email) userInfo.email = walletInfo.user?.email;
    if (walletInfo.user?.contact_no)
      userInfo.contact = walletInfo.user?.contact_no;

    const options: any = {
      key: env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: env.VITE_APP_NAME,
      description: "Load to your VidiBattle wallet",
      image: "./assets/images/icon.png",
      order_id: order.id,
      handler: (response: any) => {
        verifyPayment(response, order.amount / 100);
      },
      prefill: userInfo,
      theme: {
        color: "#FE9063",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);

    rzp1.on("payment.failed", function (response: any) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
      toast.error("Error! payment failed.");
    });
    rzp1.open();
  };

  const verifyPayment = (paymentInfo: any, amount: number) => {
    create("wallet/verify", { ...paymentInfo, amount, userId })
      .then((res) => {
        toast.success("Balance updated successfully");
        setWalletInfo(res.data);
        setRechargeLoading(false);
        setRechargeAmount(0);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update balance"
        );
        setRechargeLoading(false);
      });
  };

  const navigateToUserProfile = () => {
    navigate("/profile/" + walletInfo?.user?.username);
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <WalletHeader />

      <div className="page-content bg-gradient-2 min-vh-100">
        <div className="container profile-area">
          <div className="edit-profile">
            <div className="profile-image">
              <div className="media media-100 rounded-circle position-relative">
                <img
                  src={formatResourceURL(walletInfo?.user?.profile_img)}
                  onError={handleProfileImageError}
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="d-flex flex-column align-items-center">
                <span
                  className="fw-bold"
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                >
                  {getName(
                    walletInfo?.user ?? {
                      first_name: "trest",
                      last_name: "asd",
                    }
                  )}
                </span>
                <span
                  className=""
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                >
                  @{walletInfo?.username ?? "asdasd"}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="m-3 align-center">Wallet Balance</h3>
              <h4 className="text-secondary">
                <i className="fa fa-inr me-1"></i>
                <span>{walletInfo.balance}</span>
              </h4>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (rechargeAmount && !rechargeLoading) {
                  loadToWallet();
                }
              }}
              className="d-flex align-items-center flex-column"
            >
              <div className="mb-3 px-1">
                {walletInfo.user?.contact_no && (
                  <label className="w-100 mb-2">
                    <span>Contact number:</span>
                    &nbsp;
                    <span className="fw-bold">
                      {walletInfo.user.contact_no}
                    </span>
                  </label>
                )}
                {walletInfo.user?.email && (
                  <label className="w-100 mb-2">
                    <span>Email:</span>
                    &nbsp;
                    <span className="fw-bold">{walletInfo.user.email}</span>
                  </label>
                )}
                <label className="w-100 mb-2" htmlFor="amount">
                  Amount:
                </label>
                <input
                  id="amount"
                  type="number"
                  className="form-control numberInput"
                  placeholder=""
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(parseInt(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <button
                  disabled={!rechargeAmount || rechargeLoading}
                  className="btn btn-secondary"
                  type="submit"
                >
                  {rechargeLoading ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <span>Load to Wallet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
