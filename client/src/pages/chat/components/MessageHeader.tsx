import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";
import { Link } from "react-router-dom";
import { getName } from "../../../services/utils";
import { handleProfileImageError } from "../../../services/asset-paths";

export default function MessageHeader({ user }: { user: any }) {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <BackBtn />
          <div className="media me-3 media-35 rounded-circle">
            <img
              src={user?.profile_img}
              onError={handleProfileImageError}
              alt="/"
            />
          </div>
          <h5 className="mb-0">{getName(user)}</h5>
        </div>
        <div className="mid-content"></div>
        <div className="right-content">
          {user && (
            <Link
              to={"/profile/" + user._id}
              className="nav-link text-secondary"
              title="view profile"
            >
              <i className="fa fa-user-circle fa-2x " aria-hidden="true"></i>
            </Link>
          )}
        </div>
      </TopNavBarWrapper>
    </>
  );
}
