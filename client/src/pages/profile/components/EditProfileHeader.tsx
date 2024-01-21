import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import HeaderLogo from "../../../components/HeaderLogo";

export default function EditProfileHeader({
  loading,
  disableCancel,
  saveClicked,
}: {
  loading: boolean;
  disableCancel: boolean;
  saveClicked: () => void;
}) {
  const navigate = useNavigate();

  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <HeaderLogo />
        {!disableCancel && (
          <a
            onClick={() => navigate(-1)}
            className="back-btn"
            style={{ cursor: "pointer" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-x"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </a>
        )}
        <h4 className="title mb-0">Edit profile</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content">
        <a
          onClick={saveClicked}
          className="text-dark font-20"
          style={{ cursor: "pointer" }}
        >
          {!loading ? (
            <i className="fa-solid fa-check"></i>
          ) : (
            <i className="fa-solid fa-spinner fa-spin"></i>
          )}
        </a>
      </div>
    </TopNavBarWrapper>
  );
}
