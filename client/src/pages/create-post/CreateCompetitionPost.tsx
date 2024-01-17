import { useState, useEffect } from "react";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import CreatePost from "./CreatePost";
import TopNavBarWrapper from "../../components/TopNavBarWrapper";
import BackBtn from "../../components/BackBtn";

export default function CreateCompetitionPost() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>(null);
  const params = useParams();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    if (params.name) getBasicInfo(params.name);
  }, []);

  const getBasicInfo = (name: string) => {
    const query: any = {};
    if (queryParams.get("start_date"))
      query.start_date = queryParams.get("start_date");

    if (queryParams.get("end_date"))
      query.end_date = queryParams.get("end_date");
    get("competition/info/" + name, query)
      .then((res) => {
        setCompetitionInfo(res.data);
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

  if (pageLoading) {
    return <PageLoading />;
  }

  if (
    !competitionInfo ||
    competitionInfo?.current_round > parseInt(params.round ?? "1") ||
    !competitionInfo?.competingUser ||
    (competitionInfo.current_round === parseInt(params.round ?? "1") &&
      competitionInfo?.post &&
      competitionInfo.status !== "scheduled") ||
    competitionInfo?.status === "cancelled" ||
    competitionInfo?.status === "ended"
  ) {
    return (
      <>
        <TopNavBarWrapper>
          <BackBtn />
        </TopNavBarWrapper>

        <div className="container">
          <div className="d-flex justify-content-center align-items-center flex-column">
            <div className="icon-bx">
              <img
                src="/assets/images/icons/camera_icon.png"
                alt="No Posts Yet"
              />
            </div>
            <div className="clearfix d-flex flex-column justify-content-center">
              <h2 className="title text-primary">
                {!competitionInfo
                  ? "Competition Not Found"
                  : "Can't Post for Current Round"}
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CreatePost
        competitionId={competitionInfo?._id}
        allowedTypes={competitionInfo?.type}
        round={parseInt(params.round ?? "1")}
      />
    </>
  );
}
