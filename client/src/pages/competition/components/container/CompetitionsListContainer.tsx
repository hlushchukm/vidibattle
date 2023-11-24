import { useState, useEffect } from "react";
import { get } from "../../../../services/crud";
import Competition from "../ui/Competition";
import { toast } from "react-toastify";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";

export default function CompetitionsListContainer({
  status,
}: {
  status: "scheduled" | "started" | "ended";
}) {
  const [competitions, setCompetitions] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreCompetitions, setNoMoreCompetitions] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = () => {
    setLoading(true);
    get("competition/list", {
      status,
      page: page + 1,
      limit,
    })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMoreCompetitions(true);
        }

        setCompetitions((c: any) => [...c, ...res.data]);
        setPage(res.page);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load competitions"
        );
        setLoading(false);
      });
  };

  const getStatusLabel = (status: "scheduled" | "started" | "ended") => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "started":
        return "Started";
      case "ended":
        return "Ended";
    }
  };

  return (
    <>
      <h3>{getStatusLabel(status)}</h3>
      <div className="divider"></div>

      {competitions.length === 0 && !loading ? (
        <>
          <h4 className="text-muted py-4 text-center">
            No {getStatusLabel(status)} Competitions
          </h4>
        </>
      ) : (
        <div className="row">
          {competitions.map((competition: any) => (
            <>
              <Competition key={competition._id} competition={competition} />
            </>
          ))}
          {loading && <BlinkingLoadingCircles />}

          {!loading && !noMoreCompetitions && (
            <button
              className={`btn light btn-primary ${loading && "disabled"}`}
              onClick={fetchCompetitions}
            >
              <span>show more</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
