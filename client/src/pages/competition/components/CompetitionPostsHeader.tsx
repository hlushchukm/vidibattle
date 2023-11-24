import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";

export default function CompetitionPostsHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <BackBtn />
          <h4 className="title mb-0">Posts</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>
    </>
  );
}
