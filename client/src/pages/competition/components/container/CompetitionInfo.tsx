import { handleCompetitionImageError } from "../../../../services/asset-paths";

export default function CompetitionInfo({ competition }: { competition: any }) {
  return (
    <>
      <div className="card mb-3">
        <img
          src={competition?.image}
          className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }}
          onError={handleCompetitionImageError}
        />
        <div className="card-body">
          <h5 className="card-title">{competition?.name}</h5>
          <p className="card-text">{competition?.description}</p>
          <p className="card-text d-flex gap-2">
            <small className="text-muted">
              Start Date: {competition?.start_date},
            </small>
            <small className="text-muted">
              End Date: {competition?.end_date}
            </small>
          </p>
          {competition?.is_paid ? (
            <>
              <p className="card-text d-flex gap-2">
                <small className="text-muted">
                  Payment Amount: {competition?.amout}
                </small>
              </p>
              <button className="btn btn-secondary">Pay and Join</button>
            </>
          ) : (
            <button className="btn btn-secondary">Create Post</button>
          )}
        </div>
      </div>
    </>
  );
}
