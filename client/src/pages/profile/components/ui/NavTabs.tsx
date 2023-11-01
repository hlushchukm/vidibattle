import { Link } from "react-router-dom";

export default function NavTabs({ userId }: { userId?: string | null }) {
  console.log(userId);
  return (
    <div className="social-bar">
      <ul>
        <li className="active">
          <a>
            <h4>52</h4>
            <span>Post</span>
          </a>
        </li>
        <li>
          <Link to={`/followers${userId ? "/" + userId : ""}?following=true`}>
            <h4>250</h4>
            <span>Following</span>
          </Link>
        </li>
        <li>
          <Link to={`/followers${userId ? "/" + userId : ""}?followers=true`}>
            <h4>4.5k</h4>
            <span>Followers</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
