import { useNavigate } from "react-router-dom";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SuggestedUsersHeader() {
  const navigate = useNavigate();
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <h4 className="title mb-0">Suggested Users</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content">
        <button className="btn post-btn" onClick={() => navigate("/home")}>
          Skip
        </button>
      </div>
    </TopNavBarWrapper>
  );
}
