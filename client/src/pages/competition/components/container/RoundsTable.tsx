import { useEffect, useState } from "react";
import { getDate } from "../../../../services/timeAndDate";
import { Link } from "react-router-dom";

export default function RoundsTable({
  rounds,
  currentRound,
  competitionInfo,
}: {
  rounds: any[];
  currentRound: any;
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

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-light" style={{ textDecoration: "underline" }}>
          Rounds
        </h1>

        <table>
          <tr className="bg-primary text-white">
            <th className="px-2 py-2"></th>
            <th className="px-4 py-2">Round Name</th>
            <th className="px-4 py-2">Minimum Likes</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Action</th>
          </tr>
          {sortedRounds.map((round) => (
            <tr key={round._id} className="bg-white">
              <th className="px-2 py-2 border text-primary">
                {round._id === currentRound._id && (
                  <i className="fa fa-certificate"></i>
                )}
              </th>
              <th className="px-4 py-2 border">{round.name}</th>
              <th className="px-4 py-2 border">{round.min_likes}</th>
              <th className="px-4 py-2 border">{getDate(round.start_date)}</th>
              <th className="px-4 py-2 border">{getDate(round.end_date)}</th>
              <th className="px-4 py-2 border">
                {round.number <= currentRound.number && (
                  <Link
                    to={
                      "/competition/post/round/" +
                      round.number +
                      "/" +
                      competitionInfo.name +
                      "?start_date=" +
                      new Date(
                        competitionInfo.start_date
                      ).toLocaleDateString() +
                      "&end_date=" +
                      new Date(competitionInfo.end_date).toLocaleDateString()
                    }
                    className="btn btn-secondary btn-sm"
                  >
                    Posts
                  </Link>
                )}
              </th>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
