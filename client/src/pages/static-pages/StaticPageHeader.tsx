import TopNavBarWrapper from "../../components/TopNavBarWrapper";
import BackBtn from "../../components/BackBtn";
import HeaderLogo from "../../components/HeaderLogo";

export default function StaticPageHeader({ pageTitle }: { pageTitle: string }) {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <HeaderLogo />
        <BackBtn />
        <h5 className="mb-0">{pageTitle}</h5>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
