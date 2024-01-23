import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { create, get } from "../../services/crud";
import { toast } from "react-toastify";
import CompetitionInfoHeader from "./components/CompetitionInfoHeader";
import CompetitionInfoCard from "./components/container/CompetitionInfoCard";
import PageLoading from "../../components/PageLoading";
import RoundsTable from "./components/container/RoundsTable";
import TopParticipantsList from "./components/container/TopParticipantsList";

export default function CompetitionInfo() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [competitionName, setCompetitionName] = useState<string>();
  const [joinLoading, setJoinLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [rounds, setRounds] = useState<any>([]);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const params = useParams();

  useEffect(() => {
    setCompetitionName(params.name);
  }, []);

  useEffect(() => {
    if (competitionName) {
      getBasicInfo(competitionName);
    }
  }, [competitionName]);

  const getBasicInfo = (nameInfo: string) => {
    setPageLoading(true);
    const query: any = {};
    if (queryParams.get("start_date"))
      query.start_date = queryParams.get("start_date");

    if (queryParams.get("end_date"))
      query.end_date = queryParams.get("end_date");

    get("competition/info/" + nameInfo, query)
      .then((res) => {
        setCompetitionInfo(res.data);
        setRounds(res.data?.rounds ?? []);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! Couldn't load competition info"
        );
        setPageLoading(false);
      });
  };

  const leaveCompetition = () => {
    setLeaveLoading(true);
    create("competition/" + competitionInfo._id + "/leave", {})
      .then((res) => {
        toast.success(res.message ?? "Competition Left");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setLeaveLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't leave competition"
        );
        setLeaveLoading(false);
      });
  };

  const joinCompetition = () => {
    setJoinLoading(true);
    create("competition/" + competitionInfo._id + "/join", {})
      .then((res) => {
        toast.success(res.message ?? "Competition joined");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setJoinLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't join competition"
        );
        setJoinLoading(false);
      });
  };

  const showResults = (result_date_str: string) => {
    const result_date = new Date(result_date_str);
    result_date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= result_date;
  };

  const getRoundName = (round_no: number) => {
    const match = rounds.find((r: any) => r.number === round_no);
    return match.name ?? "Round " + round_no;
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <CompetitionInfoHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <CompetitionInfoCard
              competition={competitionInfo}
              joinCompetition={joinCompetition}
              leaveCompetition={leaveCompetition}
              joinLoading={joinLoading}
              leaveLoading={leaveLoading}
              getRoundName={getRoundName}
            />
            <RoundsTable rounds={rounds} competitionInfo={competitionInfo} />

            {competitionInfo.status === "ended" &&
              showResults(competitionInfo.result_date) && (
                <div className="py-2">
                  <TopParticipantsList
                    competitionId={competitionInfo._id}
                    round={competitionInfo.current_round}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
