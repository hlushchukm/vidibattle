import { useNavigate } from "react-router-dom";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";
import { getName } from "../../../../services/utils";

export default function WinnersList({ winners }: { winners: any[] }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-light" style={{ textDecoration: "underline" }}>
        Winners
      </h1>

      <div className="d-flex flex-column mt-2">
        <div className="d-flex flex-column align-items-start gap-2">
          {winners.map((winner) => (
            <div
              key={winner._id}
              className="d-flex gap-3 justify-content-center align-items-center"
            >
              <div
                style={{
                  borderRadius: "20px",
                  marginBottom: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px",
                  background:
                    "linear-gradient(180deg, #FE9063 0%, #704FFE 100%)",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile/" + winner?.user?.username)}
              >
                <img
                  src={formatResourceURL(winner?.user?.profile_img)}
                  onError={handleProfileImageError}
                  style={{
                    width: "100px",
                    minWidth: "100px",
                    height: "100px",
                    boxSizing: "content-box",
                    borderRadius: "18px",
                    border: "6px solid #FEF3ED",
                  }}
                />
              </div>
              <div className="">
                <div
                  onClick={() => navigate("/profile/" + winner?.user?.username)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-secondary fw-bold pb-0 lh-sm">
                    {getName(winner?.user)}
                  </div>
                  <div className="small text-info pb-1">
                    @{winner?.user?.username}
                  </div>
                </div>
                <div className="small text-dark">Rank:&nbsp;{winner?.rank}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
