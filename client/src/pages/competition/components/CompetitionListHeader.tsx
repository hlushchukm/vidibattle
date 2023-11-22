import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";

export default function CompetitionListHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <BackBtn to="/competition" />
          <h4 className="title mb-0">Competitions</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>
    </>
  );
}
