import TopNavBarWrapper from "../../components/TopNavBarWrapper";
import BackBtn from "../../components/BackBtn";

export default function StaticPageHeader({ pageTitle }: { pageTitle: string }) {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <BackBtn />
        <h5 className="mb-0">{pageTitle}</h5>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
