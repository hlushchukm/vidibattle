import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function CreatePostHeader() {
  const navigate = useNavigate();

  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <button onClick={() => navigate(-1)} className="back-btn btn">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h4 className="title mb-0">Create Post</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content">
          <a href="index.html" className="post-btn">
            POST
          </a>
        </div>
      </TopNavBarWrapper>
    </>
  );
}
