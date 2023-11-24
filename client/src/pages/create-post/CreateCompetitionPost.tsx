import { useState, useEffect } from "react";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CreatePost from "./CreatePost";

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

  return (
    <>
      <CreatePost
        competitionId={competitionInfo._id}
        allowedTypes={competitionInfo.type}
      />
    </>
  );
}
