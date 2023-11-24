import { Link } from "react-router-dom";
import { formatResourceURL, handleCompetitionImageError } from "../../../../services/asset-paths";

export default function Competition({ competition }: { competition: any }) {
  const descriptionTextLength = 210;

  return (
    <>
      <div className="col-sm-6">
        <div className="card">
          <img
            src={formatResourceURL(competition.image)}
            onError={handleCompetitionImageError}
            className="card-img-top"
            style={{height: "250px", objectFit: "cover"}}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{competition.name}</h5>
            <p className="card-text text-justify flex-grow-1">
              {competition.description?.length > descriptionTextLength
                ? competition.description?.slice(0, descriptionTextLength) +
                  "..."
                : competition.description}
            </p>

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
