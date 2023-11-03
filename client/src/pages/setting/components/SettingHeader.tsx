import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SettingHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <a href="javascript:void(0);" className="back-btn">
          <i className="fa-solid fa-arrow-left"></i>
        </a>
        <h4 className="title mb-0">Setting</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
