import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";

export default function ProfileHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <BackBtn />
        <h4 className="title mb-0">User Profile</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
