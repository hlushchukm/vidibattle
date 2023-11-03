import BackBtn from "../../../components/BackBtn";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SinglePostHeader() {
  return (
    <TopNavBarWrapper>
      <div className="left-content">
        <BackBtn to="/setting" />
        <h4 className="title mb-0">Post</h4>
      </div>
      <div className="mid-content"></div>
      <div className="right-content"></div>
    </TopNavBarWrapper>
  );
}
