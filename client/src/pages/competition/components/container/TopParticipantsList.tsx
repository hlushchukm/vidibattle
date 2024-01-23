import { useEffect, useState } from "react";
import WinnersList from "../ui/WinnersList";
import Top10ParticipantsTable from "../ui/Top10ParticipantsTable";
import { get } from "../../../../services/crud";
import { toast } from "react-toastify";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";

export default function TopParticipantsList({
  competitionId,
  round,
}: {
  competitionId: any[];
  round: any;
}) {
  const [loading, setLoading] = useState(true);
  const [top3, setTop3] = useState<any[]>([]);
  const [top10, setTop10] = useState<any[]>([]);

  useEffect(() => {
    getTopParticipants();
  }, []);

  const getTopParticipants = () => {
    setLoading(true);
    get(`competition/winners/${competitionId}/${round}`)
      .then((res) => {
        setTop3([...res.top3]);
        setTop10([...res.top10]);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! Couldn't load winners list"
        );
        setLoading(false);
      });
  };

  if (loading) {
    return <BlinkingLoadingCircles />;
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center py-4">
        {top3.length === 0 ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-4">
            <h1 className="text-light" style={{ textDecoration: "underline" }}>
              Winners
            </h1>
            <h3 className="text-primary">No Winners</h3>
          </div>
        ) : (
          <WinnersList winners={top3} />
        )}

        {top10.length > 0 && <Top10ParticipantsTable topParticipants={top10} />}
      </div>
    </>
  );
}
