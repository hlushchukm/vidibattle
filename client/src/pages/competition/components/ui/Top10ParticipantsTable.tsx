import { getName } from "../../../../services/utils";
import { Link } from "react-router-dom";

export default function Top10ParticipantsTable({
  topParticipants,
}: {
  topParticipants: any[];
}) {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center pt-4">
        <h1 className="text-light" style={{ textDecoration: "underline" }}>
          Top 10 Participants
        </h1>

        <table>
          <thead>
            <tr className="bg-info text-white">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Likes</th>
            </tr>
          </thead>
          <tbody>
            {topParticipants.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-light fw-bold py-2 bg-white"
                >
                  No users found
                </td>
              </tr>
            )}
            {topParticipants.map((participant) => (
              <tr key={participant._id} className="bg-white">
                <td className="px-4 py-2 border">{participant.rank}</td>
                <td className="px-4 py-2 border">
                  <Link to={"/user" + participant.user.username}>
                    {getName(participant.user)}
                  </Link>
                </td>
                <td className="px-4 py-2 border">
                  <Link to={"/user" + participant.user.username}>
                    @{participant.user.username}
                  </Link>
                </td>
                <td className="px-4 py-2 border">
                  {participant.likes !== undefined ? participant.likes : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
