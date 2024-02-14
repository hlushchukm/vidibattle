import { Link, useNavigate } from "react-router-dom";
import { getName } from "../../../../services/utils";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";

export default function BasicInfo({
  profile,
  isLoggedIn,
  isOwnProfile,
  toggleBlock,
  toggleFollow,
}: {
  profile: any;
  isLoggedIn: boolean;
  isOwnProfile: boolean;
  toggleBlock: () => void;
  toggleFollow: () => void;
}) {
  const navigate = useNavigate();

  const getAddress = () => {
    const address = profile?.address;
    let res = "";

    if (address?.country) {
      res += address.country;
    }

    if (address?.state) {
      res += ", " + address.state;
    }

    if (address?.city) {
      res += ", " + address.city;
    }

    if (address?.address_line) {
      res += ", " + address.address_line;
    }

    return res.trim();
  };

  return (
    <>
      <div className="profile">
        {/* Profile icon for small screens */}
        <div className="d-xs-block d-sm-none mb-4">
          <div
            className="upload-box"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "20px",
              background: "linear-gradient(180deg, #FE9063 0%, #704FFE 100%)",
              padding: "2px",
              position: "relative",
            }}
          >
            <img
              style={{
                width: "80px",
                minWidth: "80px",
                height: "80px",
                boxSizing: "content-box",
                borderRadius: "18px",
                border: "6px solid #FEF3ED",
              }}
              src={formatResourceURL(profile?.profile_img)}
              onError={handleProfileImageError}
            />
            {isLoggedIn && isOwnProfile && (
              <Link
                to={"/edit-profile"}
                className="upload-btn"
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: "-5px",
                  width: "35px",
                  height: "35px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "var(--border-radius-base)",
                  textAlign: "center",
                  lineHeight: "35px",
                  boxShadow: "0px 9px 10px 0px rgba(254, 144, 99, 0.35)",
                  color: "#fff",
                }}
              >
                <i className="fa-solid fa-pencil"></i>
              </Link>
            )}
          </div>
        </div>

        <div className="main-profile">
          <div className="left-content">
            <span>@{profile?.username}</span>
            <h5 className="mt-1">{getName(profile)}</h5>
            <div className="info pe-sm-5 text-justify">
              <p className="mb-0">{profile?.bio} </p>
            </div>
            <div className="info pe-sm-5 text-justify">
              <p>{getAddress()} </p>
            </div>
          </div>
          {/* Profile icon for large screens */}
          <div className="right-content d-none d-sm-block">
            <div className="upload-box">
              <img
                src={formatResourceURL(profile?.profile_img)}
                onError={handleProfileImageError}
              />
              {isLoggedIn && isOwnProfile && (
                <Link to={"/edit-profile"} className="upload-btn">
                  <i className="fa-solid fa-pencil"></i>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Following and message button */}
        {isLoggedIn && !isOwnProfile && (
          <ul className="list-button">
            {!profile?.is_blocked && (
              <>
                <li>
                  <a
                    onClick={toggleFollow}
                    className=""
                    style={{ cursor: "pointer" }}
                  >
                    {profile?.is_followed ? "Unfollow" : "Follow"}
                  </a>
                </li>

                <li>
                  <a
                    className=""
                    onClick={() => navigate("/chat/" + profile?.username)}
                    style={{ cursor: "pointer" }}
                  >
                    Message
                  </a>
                </li>
              </>
            )}
            <li className={`${profile?.is_blocked ? "w-100" : ""}`}>
              <a
                className={`${profile?.is_blocked ? "text-white bg-dark" : ""}`}
                onClick={toggleBlock}
                style={{ cursor: "pointer" }}
              >
                {profile?.is_blocked ? "Unblock" : "Block"}
              </a>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}
