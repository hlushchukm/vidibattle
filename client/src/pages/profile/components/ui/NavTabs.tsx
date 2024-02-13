import { formatNumber } from "../../../../services/number-formatting";

export default function NavTabs({
  activeIndex,
  posts,
  followers,
  following,
  changeSlide,
}: {
  activeIndex: number;
  posts: string;
  followers: string;
  following: string;
  changeSlide: (index: number) => void;
}) {
  return (
    <div className="social-bar">
      <ul>
        <li
          className={activeIndex === 0 ? "active" : ""}
          onClick={() => changeSlide(0)}
        >
          <a>
            <h4 style={{ fontSize: "16px", visibility: "hidden" }}>
              {formatNumber(parseInt(posts))}
            </h4>
            <span>Post</span>
          </a>
        </li>
        <li
          className={activeIndex === 1 ? "active" : ""}
          onClick={() => changeSlide(1)}
        >
          <a>
            <h4 style={{ fontSize: "16px" }}>
              {formatNumber(parseInt(following))}
            </h4>
            <span>Following</span>
          </a>
        </li>
        <li
          className={activeIndex === 2 ? "active" : ""}
          onClick={() => changeSlide(2)}
        >
          <a>
            <h4 style={{ fontSize: "16px" }}>
              {formatNumber(parseInt(followers))}
            </h4>
            <span>Followers</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
