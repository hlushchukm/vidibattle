import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import HeaderLogo from "../../../components/HeaderLogo";

export default function CreatePostHeader({
  disabled,
  uploadPost,
}: {
  disabled: boolean;
  uploadPost: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <HeaderLogo />
          <button onClick={() => navigate(-1)} className="back-btn btn">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h4 className="title mb-0">Create Post</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content">
          <a
            onClick={uploadPost}
            className={`btn post-btn cursor-pointer ${
              disabled ? "disabled" : ""
            }`}
          >
            POST
          </a>
        </div>
      </TopNavBarWrapper>
    </>
  );
}
