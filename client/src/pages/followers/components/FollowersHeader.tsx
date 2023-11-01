import BackBtn from "../../../components/BackBtn";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function FollowersHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <BackBtn />
        <h4 className="title mb-0">Jovi Daniel Jr.</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
