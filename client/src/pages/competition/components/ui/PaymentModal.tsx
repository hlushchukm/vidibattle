import { useState, useEffect } from "react";
import { getName } from "../../../../services/utils";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";
import { useNavigate } from "react-router-dom";

export default function PaymentModal({
  wallet,
  modalId,
  paymentAmount,
  payClicked,
}: {
  wallet: any;
  modalId: string;
  paymentAmount: number;
  payClicked: () => void;
}) {
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (wallet.balance >= paymentAmount) {
      setInsufficientBalance(false);
    } else {
      setInsufficientBalance(true);
    }
  }, [wallet, paymentAmount]);

  return (
    <div className="offcanvas offcanvas-bottom" tabIndex={-1} id={modalId}>
      <button
        id="paymentModalClose"
        type="button"
        className="btn-close drage-close btn-primary"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        title="Close"
      ></button>

      <div className="offcanvas-body container p-3 pb-4 d-flex justify-content-center align-items-center flex-column gap-2">
        <div className="d-flex flex-column gap-1">
          <div>
            <li>
              <div className="left-content d-flex gap-4 align-items-center">
                <a data-bs-toggle="offcanvas">
                  <img
                    src={formatResourceURL(wallet.user?.profile_img)}
                    onError={handleProfileImageError}
                    alt="/"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "18px",
                    }}
                  />
                </a>
                <a data-bs-toggle="offcanvas">
                  <span className="username">@{wallet.user?.username}</span>
                  <h6 className="name">{getName(wallet.user)}</h6>
                  <h6 className="name text-primary font-w400">
                    <span>Balance:</span>
                    &nbsp;&nbsp;
                    <span className="">
                      <i className="fa fa-inr" aria-hidden="true"></i>
                      <span>{wallet.balance}</span>
                    </span>
                  </h6>
                </a>
              </div>
            </li>
          </div>
          <div className="py-2">
            <h6
              className={`text-center font-w600 ${
                insufficientBalance ? "text-danger" : "text-success"
              }`}
            >
              <span>Amount to be paid:</span>&nbsp;&nbsp;
              <i className="fa fa-inr" aria-hidden="true"></i>
              <span>{paymentAmount}</span>
            </h6>
            {insufficientBalance && (
              <div className="text-danger text-center font-w600 text-sm">
                Insufficient Balance!
              </div>
            )}
          </div>
        </div>
        <div className="text-center">
          {insufficientBalance ? (
            <button
              onClick={() => {
                navigate("/wallet");
              }}
              className="btn btn-secondary btn-sm px-5"
            >
              Recharge Wallet
            </button>
          ) : (
            <button
              onClick={payClicked}
              className="btn btn-primary btn-sm px-5"
            >
              Pay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
