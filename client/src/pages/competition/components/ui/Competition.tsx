import { Link } from "react-router-dom";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../../../services/asset-paths";

export default function Competition({
  competition,
  isSearchResult,
}: {
  competition: any;
  isSearchResult: boolean;
}) {
  // const descriptionTextLength = 210;

  const getCompetitionStatusBadge = (status: string) => {
    switch (status) {
      case "playing":
        if (competition.status === "scheduled") {
          return <span className="badge badge-warning me-1 mb-1">Joined</span>;
        } else {
          return (
            <span className="badge badge-secondary me-1 mb-1">Playing</span>
          );
        }
      case "won":
        return <span className="badge badge-success me-1 mb-1">Won</span>;
      case "lost":
        return <span className="badge badge-light me-1 mb-1">Lost</span>;
      case "removed":
        return <span className="badge badge-danger me-1 mb-1">Removed</span>;
      case "left":
        return <span className="badge badge-dark me-1 mb-1">Left</span>;
    }
  };

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

  return (
    <>
      <div className="col-md-4">
        <div className="card">
          <img
            src={formatResourceURL(competition.image)}
            onError={handleCompetitionImageError}
            className="card-img-top"
            style={{ height: "250px", objectFit: "cover" }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{competition.name}</h5>
            <p className="card-text text-justify flex-grow-1">
              {/* {competition.description?.length > descriptionTextLength
                ? competition.description?.slice(0, descriptionTextLength) +
                "..."
              : competition.description} */}
              {isSearchResult && (
                <span className="me-2">
                  {getStatusBadge(competition.status)}
                </span>
              )}
              <span>
                {competition.competingUser &&
                  getCompetitionStatusBadge(competition.competingUser.status)}
              </span>
            </p>

            <div className="d-flex gap-2" style={{ flexWrap: "wrap" }}>
              <Link
                to={
                  "/competition/info/" +
                  competition.name +
                  "?start_date=" +
                  competition.start_date +
                  "&end_date=" +
                  competition.end_date
                }
                className="btn btn-primary px-3"
                style={{ fontSize: "11px" }}
              >
                Details
              </Link>
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
                    className="btn btn-secondary px-3"
                    style={{ fontSize: "11px" }}
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
                      className="btn btn-secondary px-3"
                      style={{ fontSize: "11px" }}
                    >
                      {competition.status === "started"
                        ? "Current Round"
                        : "Last Round"}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
