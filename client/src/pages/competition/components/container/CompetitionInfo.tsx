import { formatResourceURL, handleCompetitionImageError } from "../../../../services/asset-paths";
import { getDate } from "../../../../services/timeAndDate";

export default function CompetitionInfo({ competition }: { competition: any }) {
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
          <h5 className="card-title">
            <span>{competition?.name}</span>
          </h5>
          <p className="card-text">
            <span>{competition?.description}</span>
          </p>
          <div className="divider"></div>
          <p className="card-text d-flex gap-2">
            <small className="">
              Start Date:{" "}
              <span className="fw-bolder">
                {getDate(competition?.start_date)},
              </span>
            </small>
            <small className="">
              End Date:{" "}
              <span className="fw-bolder">
                {getDate(competition?.end_date)}
              </span>
            </small>
          </p>
          <p className="card-text d-flex gap-2">
            <small className="">
              Post Types Allowed:{" "}
              <span className="fw-bolder">{competition?.type}</span>
            </small>
          </p>

          {competition?.is_paid ? (
            <>
              <p className="card-text d-flex gap-2">
                <small className="">
                  Payment Amount:{" "}
                  <span className="fw-bolder">{competition?.amount}</span>
                </small>
              </p>
              <div className="divider"></div>
              <button className="btn btn-secondary">Pay and Join</button>
            </>
          ) : (
            <>
              <div className="divider"></div>
              <button className="btn btn-secondary">Create Post</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
