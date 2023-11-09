import { formatNumber } from "../../../../services/number-formatting";

export default function NavLinks({
  currentTab,
  followersCount,
  followingCount,
  onNavBarClick,
}: {
  currentTab: "followers" | "following";
  followersCount: number;
  followingCount: number;
  onNavBarClick: (e: "followers" | "following") => void;
}) {
  return (
    <ul className="links-container">
      <li
        onClick={() => onNavBarClick("following")}
        className="nav-link position-relative"
      >
        <span>{formatNumber(followingCount ?? 0)} Following</span>
        <div
          className={`tab-indicator bg-primary position-absolute w-100 bottom-0 ${
            currentTab !== "following" ? "width-none" : "slide-bar-left"
          }`}
          style={{ height: "3px" }}
        ></div>
      </li>
      <li
        onClick={() => onNavBarClick("followers")}
        className="nav-link position-relative"
      >
        <span>{formatNumber(followersCount ?? 0)} Followers</span>
        <div
          className={`tab-indicator bg-primary position-absolute w-100 bottom-0  ${
            currentTab !== "followers" ? "width-none" : "slide-bar-right"
          }`}
          style={{ height: "3px" }}
        ></div>
      </li>
    </ul>
  );
}
