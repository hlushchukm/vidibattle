import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function MessageHeader({ user }: { user: any }) {
  const navigate = useNavigate();

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
          <button onClick={() => navigate("/chat")} className="back-btn btn">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="media me-3 media-35 rounded-circle">
            <img src={user?.profile_img} alt="/" />
          </div>
          <h5 className="mb-0">{getName()}</h5>
        </div>
        <div className="mid-content"></div>
        <div className="right-content">
          {/* <a
            href="javascript:void(0);"
            className="text-dark font-20"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal1"
          >
            <i className="fa-solid fa-video"></i>
          </a> */}
        </div>
      </TopNavBarWrapper>
    </>
  );
}
