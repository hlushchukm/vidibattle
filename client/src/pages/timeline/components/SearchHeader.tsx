import SearchBar from "../../../components/SearchBar";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function SearchHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="mt-3 w-100">
          <SearchBar />
        </div>
      </TopNavBarWrapper>
    </>
  );
}
