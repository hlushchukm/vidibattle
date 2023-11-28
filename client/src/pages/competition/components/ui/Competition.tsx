import { Link } from "react-router-dom";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../../../services/asset-paths";

export default function Competition({ competition }: { competition: any }) {
  const descriptionTextLength = 210;

  const getCompetitionStatusBadge = (status: string) => {
    switch (status) {
      case "playing":
        if (competition.status === "scheduled") {
          return <span className="badge badge-warning me-1 mb-1">Joined</span>;
        } else {
          return <span className="badge badge-primary me-1 mb-1">Playing</span>;
        }
      case "won":
        return <span className="badge badge-success me-1 mb-1">Won</span>;
      case "lost":
        return <span className="badge badge-info me-1 mb-1">Lost</span>;
      case "removed":
        return <span className="badge badge-danger me-1 mb-1">Removed</span>;
      case "left":
        return <span className="badge badge-dark me-1 mb-1">Left</span>;
    }
  };

  return (
    <>
      <div className="col-sm-6">
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
              {competition.description?.length > descriptionTextLength
                ? competition.description?.slice(0, descriptionTextLength) +
                  "..."
                : competition.description}
            </p>
            {competition.competingUser && (
              <p>
                {getCompetitionStatusBadge(competition.competingUser.status)}
              </p>
            )}

            <div>
              <Link
                to={"/competition/" + competition._id}
                className="btn btn-primary"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
