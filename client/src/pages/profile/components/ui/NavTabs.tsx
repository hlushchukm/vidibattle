import { Link } from "react-router-dom";
import { formatNumber } from "../../../../services/number-formatting";

export default function NavTabs({
  userId,
  posts,
  followers,
  following,
}: {
  userId?: string | null;
  posts: string;
  followers: string;
  following: string;
}) {
  return (
    <div className="social-bar">
      <ul>
        <li className="active">
          <a>
            <h4 style={{ fontSize: "16px" }}>
              {formatNumber(parseInt(posts))}
            </h4>
            <span>Post</span>
          </a>
        </li>
        <li>
          <Link to={`/followers${userId ? "/" + userId : ""}?following=true`}>
            <h4 style={{ fontSize: "16px" }}>
              {formatNumber(parseInt(following))}
            </h4>
            <span>Following</span>
          </Link>
        </li>
        <li>
          <Link to={`/followers${userId ? "/" + userId : ""}?followers=true`}>
            <h4 style={{ fontSize: "16px" }}>
              {formatNumber(parseInt(followers))}
            </h4>
            <span>Followers</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
