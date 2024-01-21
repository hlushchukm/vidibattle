import BackBtn from "../../../components/BackBtn";
import HeaderLogo from "../../../components/HeaderLogo";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SettingHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <HeaderLogo />
        <BackBtn to="/profile" />
        <h4 className="title mb-0">Setting</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
