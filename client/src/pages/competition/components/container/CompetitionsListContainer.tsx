import { useState, useEffect, useRef } from "react";
import { get } from "../../../../services/crud";
import Competition from "../ui/Competition";
import { toast } from "react-toastify";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import SearchBar from "../../../../components/SearchBar";
import StatusTabs from "../ui/StatusTabs";

export default function CompetitionsListContainer({}: {}) {
  const [competitions, setCompetitions] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noMoreCompetitions, setNoMoreCompetitions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<"scheduled" | "started" | "ended">(
    "started"
  );
  const [showingSearchResult, setShowingSearchResult] = useState(false);
  const limit = 9;

  useEffect(() => {
    fetchCompetitions(0);
  }, [status]);

  const fetchCompetitions = (page: number) => {
    setLoading(true);
    setShowingSearchResult(false);
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

  const handleStatusChange = (newStatus: "scheduled" | "started" | "ended") => {
    if (newStatus === status) {
      return;
    }

    setPage(0);
    setNoMoreCompetitions(false);
    setCompetitions([]);
    setStatus(newStatus);
  };

  const searchCompetition = (text: string, page: number) => {
    setLoading(true);
    setShowingSearchResult(true);
    get("competition/search", {
      text,
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
          e?.response?.data?.message ?? "Error! couldn't search competitions"
        );
        setLoading(false);
      });
  };

  const getStatusLabel = (
    status: "scheduled" | "started" | "ended" | "cancelled"
  ) => {
    switch (status) {
      case "scheduled":
        return "Upcoming";
      case "started":
        return "Active";
      case "ended":
        return "Ended";
      case "cancelled":
        return "Cancelled";
    }
  };

  const delayTimer = useRef<any>();
  const searchInputChanged = (text: string) => {
    setSearchText(text);
    if (loading) {
      return;
    }
    if (text.trim().length > 0) {
      clearTimeout(delayTimer.current);

      delayTimer.current = setTimeout(() => {
        setCompetitions([]);
        setPage(0);
        setNoMoreCompetitions(false);
        searchCompetition(text, 0);
      }, 700);
    } else {
      setPage(0);
      fetchCompetitions(0);
      setCompetitions([]);
      setNoMoreCompetitions(false);
      setSearchText("");
    }
  };

  return (
    <>
      <div className="mb-2">
        <div>
          <SearchBar
            value={searchText}
            placeholder="Search Competitions..."
            onChange={(e) => searchInputChanged(e.target.value)}
          />
        </div>

        <div
          style={{
            margin: "50px -15px",
            padding: "20px 15px 0",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <StatusTabs
            onStatusChange={handleStatusChange}
            currentStatus={status}
          />
        </div>

        {competitions.length === 0 && !loading ? (
          <>
            <h4 className="text-muted py-4 text-center">
              No {getStatusLabel(status)} Competitions
            </h4>
          </>
        ) : (
          <div className="row">
            {competitions.map((competition: any) => (
              <Competition
                key={competition._id}
                competition={competition}
                isSearchResult={showingSearchResult}
              />
            ))}
            {loading && <BlinkingLoadingCircles />}

            {!loading && !noMoreCompetitions && (
              <button
                className={`btn light btn-primary ${loading && "disabled"}`}
                onClick={() =>
                  searchText.trim().length > 0
                    ? searchCompetition(searchText, page)
                    : fetchCompetitions(page)
                }
              >
                <span>show more</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
