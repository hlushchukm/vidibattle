import HeaderLogo from "../../../components/HeaderLogo";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SuggestedUsersHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <HeaderLogo />
        <h4 className="title mb-0">Suggested Users</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content">
        <button
          className="btn post-btn"
          onClick={() => window.location.replace("/home")}
        >
          Finish
        </button>
      </div>
    </TopNavBarWrapper>
  );
}
