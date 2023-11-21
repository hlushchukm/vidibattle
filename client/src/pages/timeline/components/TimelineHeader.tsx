import SearchBar from "../../../components/SearchBar";
import TopNavBarWrapper from "../../../components/TopNavBarWrapper";

export default function TimelineHeader({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: { target: { value: any } }) => void;
}) {
  return (
    <>
      <TopNavBarWrapper>
        <div className="mt-3 w-100">
          <SearchBar
            value={value}
            onChange={onChange}
            placeholder="Search users..."
          />
        </div>
      </TopNavBarWrapper>
    </>
  );
}
