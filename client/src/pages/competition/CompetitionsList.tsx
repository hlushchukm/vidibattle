import CompetitionListHeader from "./components/CompetitionListHeader";
import CompetitionsListContainer from "./components/container/CompetitionsListContainer";

export default function CompetitionsList() {
  return (
    <>
      <CompetitionListHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <div className="">
              <CompetitionsListContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
