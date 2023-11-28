import { useState, useEffect } from "react";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CreatePost from "./CreatePost";
import TopNavBarWrapper from "../../components/TopNavBarWrapper";
import BackBtn from "../../components/BackBtn";

export default function CreateCompetitionPost() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const params = useParams();

  useEffect(() => {
    if (params.id) getBasicInfo(params.id);
  }, []);

  const getBasicInfo = (id: string) => {
    get("competition/info/" + id)
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
    competitionInfo.current_round?.toString() !== params.round?.toString() ||
    !competitionInfo.competingUser ||
    competitionInfo.post ||
    competitionInfo.status !== "started"
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
                Can't Post for Current Round
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
        competitionId={competitionInfo._id}
        allowedTypes={competitionInfo.type}
        round={competitionInfo.current_round}
      />
    </>
  );
}
