import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";
import { Link } from "react-router-dom";

export default function MessageHeader({ user }: { user: any }) {
  const getName = () => {
    if (!user) {
      return "loading ... ";
    }

    let res = "";
    if (user.first_name) {
      res += user.first_name;
    }

    if (user.last_name) {
      res += " " + user.last_name;
    }

    return res;
  };

  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <BackBtn />
          <div className="media me-3 media-35 rounded-circle">
            <img src={user?.profile_img} alt="/" />
          </div>
          <h5 className="mb-0">{getName()}</h5>
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
