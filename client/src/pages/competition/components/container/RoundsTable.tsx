import { useEffect, useState } from "react";
import { getDateWithTime } from "../../../../services/timeAndDate";
import { Link } from "react-router-dom";

export default function RoundsTable({
  rounds,
  competitionInfo,
}: {
  rounds: any[];
  competitionInfo: any;
}) {
  const [sortedRounds, setSortedRounds] = useState<any[]>([]);

  useEffect(() => {
    const sortedList = [...rounds];

    for (let i = 1; i < sortedList.length; i++) {
      let round = sortedList[i];
      let j = i - 1;

      while (j >= 0 && sortedList[j].number > round.number) {
        sortedList[j + 1] = sortedList[j];
        j--;
      }

      sortedList[j + 1] = round;
    }

    setSortedRounds(sortedList);
  }, [rounds]);

  const shouldRenderUploadButton = (competition: any, round: any) => {
    const isStartedOrScheduled =
      competition.status === "started" || competition.status === "scheduled";

    const isUserPlaying =
      competition.competingUser &&
      competition.competingUser.status === "playing";

    const isUserOnCurrentRound =
      isUserPlaying &&
      competition.competingUser.current_round === competition.current_round;

    const canUploadForCurrentRound =
      (!competition.post && competition.current_round === round.number) ||
      (competition.status === "scheduled" && competition.current_round === 1) ||
      competition.current_round < round.number;

    const res =
      isStartedOrScheduled &&
      isUserPlaying &&
      isUserOnCurrentRound &&
      canUploadForCurrentRound;

    return res;
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-light" style={{ textDecoration: "underline" }}>
          Rounds
        </h1>

        <div
          className="d-flex justify-content-md-center"
          style={{ width: "100%", overflowX: "auto" }}
        >
          <table>
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-2 py-2"></th>
                <th className="px-4 py-2">Round Name</th>
                <th className="px-4 py-2">Minimum Likes</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedRounds.map((round) => (
                <tr key={round._id} className="bg-white">
                  <th className="px-2 py-2 border text-primary">
                    {round.number === competitionInfo.current_round && (
                      <i className="fa fa-certificate"></i>
                    )}
                  </th>
                  <th className="px-4 py-2 border">{round.name}</th>
                  <th className="px-4 py-2 border">{round.min_likes}</th>
                  <th className="px-4 py-2 border">
                    {getDateWithTime(round.start_date)}
                  </th>
                  <th className="px-4 py-2 border">
                    {getDateWithTime(round.end_date)}
                  </th>
                  <th
                    className="px-4 py-2 border text-center"
                    style={{ minWidth: "160px" }}
                  >
                    {
                      <Link
                        to={
                          "/competition/post/round/" +
                          round.number +
                          "/" +
                          competitionInfo.name +
                          "?start_date=" +
                          competitionInfo.start_date +
                          "&end_date=" +
                          competitionInfo.end_date
                        }
                        className="btn btn-secondary btn-sm my-1"
                      >
                        View Posts
                      </Link>
                    }

                    {shouldRenderUploadButton(competitionInfo, round) && (
                      <>
                        <Link
                          to={`/competition/${competitionInfo.name}/${round.number}/create-post?start_date=${competitionInfo.start_date}&end_date=${competitionInfo.end_date}`}
                          className="btn btn-secondary btn-sm ms-2 my-1"
                          style={{ fontSize: "12px" }}
                        >
                          Upload Post
                        </Link>
                      </>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
