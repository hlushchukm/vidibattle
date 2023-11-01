import SearchBar from "../../../components/SearchBar";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function TimelineHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="mt-3 w-100">
          <SearchBar placeholder="Search posts, users etc..." />
        </div>
      </TopNavBarWrapper>
    </>
  );
}
