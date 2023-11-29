import { useNavigate } from "react-router-dom";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../../../services/asset-paths";

export default function CompetitionInfo({
  competition,
  payLoading,
  joinLoading,
  leaveLoading,
  joinCompetition,
  payForCompetition,
  leaveCompetition,
}: {
  competition: any;
  payLoading?: boolean;
  joinLoading?: boolean;
  leaveLoading?: boolean;
  joinCompetition: () => void;
  payForCompetition: () => void;
  leaveCompetition: () => void;
}) {
  const navigate = useNavigate();

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
  return (
    <>
      <div className="card mb-3">
        <img
          src={formatResourceURL(competition?.image)}
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
          onError={handleCompetitionImageError}
        />
        <div className="card-body">
          <h5 className="card-title d-flex">
            <span className="flex-grow-1">{competition?.name}</span>
            <span>{getStatusBadge(competition.status)}</span>
          </h5>
          <div className="card-text">
            <div
              dangerouslySetInnerHTML={{ __html: competition?.description }}
            />
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

          {/* TODO: determine if current user has already paid */}
          {competition?.is_paid ? (
            <p className="card-text d-flex gap-2">
              <small className="badge badge-warning">
                Payment Amount:&nbsp;
                <span className="fw-bolder">
                  <i className="fa fa-inr"></i>
                  <span>

                  {competition?.amount}
                  </span>
                  </span>
              </small>
            </p>
          ) : (
            <p className="card-text d-flex gap-2">
              <small className="badge badge-success">Free</small>
            </p>
          )}

          <div className="divider"></div>
          <div className="d-flex">
            <div className="flex-grow-1 d-flex gap-2">
              {/* Join Button */}
              {competition.status === "scheduled" &&
                (!competition.competingUser ||
                  competition.competingUser?.status === "left") && (
                  <>
                    {competition.is_paid ? (
                      <>
                        <button
                          disabled={payLoading}
                          onClick={payForCompetition}
                          className="btn btn-secondary"
                        >
                          Pay and Join
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={joinLoading}
                          onClick={joinCompetition}
                          className="btn btn-secondary"
                        >
                          Join
                        </button>
                      </>
                    )}
                  </>
                )}

              {/* Post Putton */}
              {competition.status === "started" &&
                !competition.post &&
                competition.competingUser &&
                competition.competingUser.status === "playing" &&
                competition.competingUser.current_round ===
                  competition.current_round && (
                  <>
                    <button
                      onClick={() =>
                        navigate(
                          `/competition/${competition._id}/${competition.current_round}/create-post`
                        )
                      }
                      className="btn btn-secondary"
                    >
                      Post
                    </button>
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
                    onClick={leaveCompetition}
                    className="btn btn-danger"
                  >
                    Leave
                  </button>
                </>
              )}
          </div>

          {competition.competingUser &&
            competition.competingUser === "lost" && (
              <>
                <div className="fw-bold text-light">
                  You have lost this competition on&nbsp;
                  <span className="text-info">
                    Round {competition.competingUser.current_round}
                  </span>
                </div>
              </>
            )}

          {competition.competingUser &&
            competition.competingUser === "left" && (
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
            competition.competingUser === "removed" && (
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
        </div>
      </div>
    </>
  );
}
