import { Link } from "react-router-dom";
import { handleCompetitionImageError } from "../../../../services/asset-paths";

export default function Competition({ competition }: { competition: any }) {
  const descriptionTextLength = 210;

  return (
    <>
      <div className="col-sm-6">
        <div className="card">
          <img
            src={competition.image}
            onError={handleCompetitionImageError}
            className="card-img-top"
          />
          <div className="card-body">
            <h5 className="card-title">{competition.name}</h5>
            <p className="card-text text-justify">
              {competition.description?.length > descriptionTextLength
                ? competition.description?.slice(0, descriptionTextLength) +
                  "..."
                : competition.description}
            </p>

            <Link
              to={"/competition/" + competition._id}
              className="btn btn-primary"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
