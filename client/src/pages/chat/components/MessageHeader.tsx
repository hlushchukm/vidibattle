import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";
import { useNavigate } from "react-router-dom";
import { getName } from "../../../services/utils";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../services/asset-paths";
import HeaderLogo from "../../../components/HeaderLogo";

export default function MessageHeader({ user }: { user: any }) {
  const navigate = useNavigate();

  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <HeaderLogo />
          <BackBtn />
          <div
            onClick={() => navigate("/profile/" + user.username)}
            className="d-flex align-items-center"
            style={{ cursor: "pointer" }}
          >
            <div className="media me-3 media-35 rounded-circle">
              <img
                src={formatResourceURL(user?.profile_img)}
                onError={handleProfileImageError}
                alt="/"
              />
            </div>
            <h5 className="mb-0">{getName(user)}</h5>
          </div>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>
    </>
  );
}
