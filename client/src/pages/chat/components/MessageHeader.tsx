import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function MessageHeader() {
  const navigate = useNavigate();

  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <button onClick={() => navigate(-1)} className="back-btn btn">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="media me-3 media-35 rounded-circle">
            <img src="/assets/images/stories/small/pic1.jpg" alt="/" />
          </div>
          <h5 className="mb-0">Claudia Surr</h5>
        </div>
        <div className="mid-content"></div>
        <div className="right-content">
          <a
            href="javascript:void(0);"
            className="text-dark font-20"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal1"
          >
            <i className="fa-solid fa-video"></i>
          </a>
        </div>
      </TopNavBarWrapper>
    </>
  );
}
