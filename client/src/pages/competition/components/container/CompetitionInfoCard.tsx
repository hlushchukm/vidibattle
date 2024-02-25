import { Link } from "react-router-dom";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../../../services/asset-paths";
import { getDateWithTime } from "../../../../services/timeAndDate";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { get } from "../../../../services/crud";
import { getUserId } from "../../../../services/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaymentModal from "../ui/PaymentModal";
import TruncatedText from "../../../../components/TurncatedText";

export default function CompetitionInfoCard({
  competition,
  joinLoading,
  leaveLoading,
  joinCompetition,
  leaveCompetition,
  getRoundName,
}: {
  competition: any;
  joinLoading?: boolean;
  leaveLoading?: boolean;
  joinCompetition: () => void;
  leaveCompetition: () => void;
  getRoundName: (round_no: number) => string;
}) {
  useEffect(() => {
    if (!joinLoading && !leaveLoading) {
      closeAllModals();
    }
  }, [joinLoading, leaveLoading]);

  const [wallet, setWallet] = useState<any>({});
  const [agreementsRead, setAgreementsRead] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="badge badge-primary">{status}</span>;
      case "started":
        return <span className="badge badge-success">{status}</span>;
      case "ended":
        return <span className="badge badge-danger">{status}</span>;
      case "cancelled":
        return <span className="badge badge-dark">{status}</span>;
    }
  };

  const getMinimumLikesNeeded = (competition: any) => {
    const current_round = competition?.current_round ?? 1;
    const rounds = competition?.rounds ?? [];

    for (let i = 0; i < rounds.length; i++) {
      if (rounds[i]?.number === current_round) {
        return rounds[i]?.min_likes ?? 0;
      }
    }

    return 0;
  };

  const joinIntentConfirmed = () => {
    if (!competition.is_paid) {
      closePayConfirmModal();
      joinCompetition();
      return;
    }

    openWalletModal();
    get("wallet/" + getUserId() + "/info")
      .then((res) => {
        setWallet(res.data);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load wallet info"
        );
      });
  };

  const openWalletModal = () => {
    const btn = document.createElement("button");
    btn.setAttribute("data-bs-toggle", "offcanvas");
    btn.setAttribute("data-bs-target", "#walletInfoModal");
    btn.setAttribute("aria-controls", "offcanvasBottom");
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(btn);
    btn.click();
    body.removeChild(btn);
  };

  const closeWalletModal = () => {
    const btn = document.getElementById("paymentModalClose");
    if (btn) btn.click();
    setAgreementsRead(false);
  };

  const closeLeaveConfirmModal = () => {
    const modal = document.getElementById("leaveCompetitionConfirmationModal");
    if (!modal) return;
    const btn = modal.getElementsByTagName("button")[0];
    if (btn) btn.click();
  };

  const closePayConfirmModal = () => {
    const modal = document.getElementById("joinCompetitionConfirmationModal");
    if (!modal) return;
    const btn = modal.getElementsByTagName("button")[0];
    if (btn) btn.click();
    setAgreementsRead(false);
  };

  const closeAllModals = () => {
    closeWalletModal();
    closeLeaveConfirmModal();
    closePayConfirmModal();
  };

  return (
    <>
      <div className="card mb-3">
        <img
          src={formatResourceURL(competition?.image_long)}
          className="card-img-top"
          style={{ aspectRatio: "3/1" }}
          onError={handleCompetitionImageError}
        />
        <div className="card-body">
          <h5 className="card-title d-flex">
            <span className="flex-grow-1">{competition?.name}</span>
            <span>{getStatusBadge(competition.status)}</span>
          </h5>
          <div className="card-text">
            <TruncatedText text={competition?.description} />
          </div>
          <div className="divider"></div>
          <p className="card-text d-flex flex-column flex-md-row gap-2">
            <small className="">
              Total Rounds:&nbsp;
              <span className="fw-bolder">{competition.rounds_count},</span>
            </small>
            {competition.status === "started" && (
              <>
                <small className="">
                  Current Round:&nbsp;
                  <span className="fw-bolder">
                    Round {competition.current_round},
                  </span>
                </small>
                <small className="">
                  minimum Likes Needed to Advance:&nbsp;
                  <span className="fw-bolder">
                    {getMinimumLikesNeeded(competition)}
                  </span>
                </small>
              </>
            )}
          </p>
          <p className="card-text d-flex gap-2">
            <small className="">
              Post Types Allowed:&nbsp;
              <span className="fw-bolder">{competition?.type}</span>
            </small>
          </p>
          <p className="card-text d-flex gap-2">
            <small className="">
              Result Date:&nbsp;
              <span className="fw-bolder">
                {getDateWithTime(competition?.result_date)}
              </span>
            </small>
          </p>

          {/* TODO: determine if current user has already paid */}
          {competition?.is_paid ? (
            <p className="card-text d-flex gap-2">
              <small className="badge badge-warning">
                Payment Amount:&nbsp;
                <span className="fw-bolder">
                  <i className="fa fa-inr"></i>
                  <span>{competition?.amount}</span>
                </span>
              </small>
            </p>
          ) : (
            <p className="card-text d-flex gap-2">
              <small className="badge badge-success">Free</small>
            </p>
          )}

          <div className="divider"></div>
          <div className="d-flex flex-wrap gap-2">
            <div className="flex-grow-1 d-flex gap-2 flex-wrap">
              {/* Join Button */}
              {competition.status === "scheduled" &&
                (!competition.competingUser ||
                  competition.competingUser?.status === "left") && (
                  <>
                    {competition.is_paid ? (
                      <>
                        <button
                          disabled={joinLoading}
                          className="btn btn-secondary"
                          style={{ fontSize: "12px" }}
                          data-bs-toggle="offcanvas"
                          data-bs-target="#joinCompetitionConfirmationModal"
                          aria-controls="offcanvasBottom"
                        >
                          Pay and Join
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={joinLoading}
                          className="btn btn-secondary"
                          style={{ fontSize: "12px" }}
                          data-bs-toggle="offcanvas"
                          data-bs-target="#joinCompetitionConfirmationModal"
                          aria-controls="offcanvasBottom"
                        >
                          Join
                        </button>
                      </>
                    )}
                  </>
                )}

              {competition.status !== "scheduled" && (
                <>
                  <Link
                    to={
                      "/competition/post/" +
                      competition.name +
                      "?start_date=" +
                      competition.start_date +
                      "&end_date=" +
                      competition.end_date
                    }
                    className="btn btn-secondary"
                    style={{ fontSize: "12px" }}
                  >
                    All Posts
                  </Link>

                  {competition.status !== "cancelled" && (
                    <Link
                      to={
                        "/competition/post/round/" +
                        competition.current_round +
                        "/" +
                        competition.name +
                        "?start_date=" +
                        competition.start_date +
                        "&end_date=" +
                        competition.end_date
                      }
                      className="btn btn-secondary"
                      style={{ fontSize: "12px" }}
                    >
                      {competition.status === "started"
                        ? "Current Round"
                        : "Last Round"}
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Leave Button */}
            {(competition.status === "started" ||
              competition.status === "scheduled") &&
              competition.competingUser &&
              competition.competingUser.status === "playing" && (
                <>
                  <button
                    disabled={leaveLoading}
                    className="btn btn-danger"
                    style={{ fontSize: "12px" }}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#leaveCompetitionConfirmationModal"
                    aria-controls="offcanvasBottom"
                  >
                    Leave
                  </button>
                </>
              )}
          </div>

          <div className="divider"></div>

          {competition.competingUser &&
            competition.competingUser.status === "lost" && (
              <>
                {competition.competingUser.rank ? (
                  <div className="fw-bold text-light">
                    Your rank on this competition was:&nbsp;
                    <span className="text-info">
                      {competition.competingUser.rank}
                    </span>
                  </div>
                ) : (
                  <div className="fw-bold text-light">
                    You have lost this competition on&nbsp;
                    <span className="text-info">
                      {getRoundName(competition.competingUser.current_round)}
                    </span>
                  </div>
                )}
              </>
            )}

          {competition.competingUser &&
            competition.competingUser.status === "left" && (
              <>
                <div className="fw-bold text-light">
                  You have left this competition on&nbsp;
                  <span className="text-info">
                    Round {competition.competingUser.current_round}
                  </span>
                </div>
              </>
            )}

          {competition.competingUser &&
            competition.competingUser.status === "removed" && (
              <div>
                <div className="fw-bold text-danger">
                  You have been removed from this competition
                </div>
                <p className="fw-bold ">
                  <span className="text-danger">Reason:&nbsp;</span>
                  <span className="text-light">
                    {competition.competingUser?.removed_reason}
                  </span>
                </p>
              </div>
            )}

          {competition.competingUser &&
            competition.competingUser.status === "won" && (
              <div>
                <div className="fw-bold text-warning">
                  You have won this competition
                </div>
              </div>
            )}
        </div>
      </div>

      <ConfirmationModal
        modalId="joinCompetitionConfirmationModal"
        confirmed={joinIntentConfirmed}
        disableYesBtn={!agreementsRead}
      >
        <h5 className="text-center mb-3">
          Would you like to join this competition?
        </h5>
        <div className="mb-3 d-flex form-check align-items-center justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="agreementsRead"
            checked={agreementsRead}
            onChange={(e) => {
              setAgreementsRead(e.target.checked);
            }}
          />
          <label
            className="form-check-label"
            style={{ lineHeight: "0" }}
            htmlFor="agreementsRead"
          >
            I have read the&nbsp;
            <Link
              to="/terms-and-conditions"
              style={{ textDecoration: "underline" }}
            >
              Terms and Conditions
            </Link>
            .
          </label>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        modalId="leaveCompetitionConfirmationModal"
        message="Would you like to leave this competition?"
        confirmed={leaveCompetition}
      />
      <PaymentModal
        modalId="walletInfoModal"
        wallet={wallet}
        paymentAmount={competition.amount ?? 0}
        payClicked={joinCompetition}
      />
    </>
  );
}
