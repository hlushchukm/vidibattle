import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";
import HeaderLogo from "../../../components/HeaderLogo";

export default function CompetitionListHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <HeaderLogo />
          <BackBtn />
          <h4 className="title mb-0">Competitions</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>
    </>
  );
}
