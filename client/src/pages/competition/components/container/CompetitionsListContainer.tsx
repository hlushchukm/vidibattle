import { useState, useEffect } from "react";
import { get } from "../../../../services/crud";
import Competition from "../ui/Competition";

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
    }).then((res) => {
      if (res.data.length < limit) {
        setNoMoreCompetitions(true);
      }

      setCompetitions(res.data);
      setPage(res.page);
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

      {competitions.length === 0 ? (
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
        </div>
      )}
    </>
  );
}
